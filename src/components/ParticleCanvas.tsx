/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState, MouseEvent, TouchEvent } from 'react';
import { ATOM_PRESETS, MOLECULE_PRESETS, getAtomPresetById } from '../data/elements';
import { Vector3D, SimulationParams, ElectronState, ProtonState } from '../types';

interface ParticleCanvasProps {
  viewType: 'atom' | 'molecule';
  selectedId: string;
  params: SimulationParams;
  isExcited: boolean;
  onExcitedEnd: () => void;
  onSelectSubatomic: (info: { name: string; details: string; color: string } | null) => void;
  theme?: 'light' | 'dark';
  collisionMode?: boolean;
  collisionElementA?: string;
  collisionElementB?: string;
  collisionSpeed?: number;
  collisionTriggerId?: number;
  onCollisionMessage?: (msg: string) => void;
}

export default function ParticleCanvas({
  viewType,
  selectedId,
  params,
  isExcited,
  onExcitedEnd,
  onSelectSubatomic,
  theme = 'light',
  collisionMode = false,
  collisionElementA = 'H',
  collisionElementB = 'He',
  collisionSpeed = 1.0,
  collisionTriggerId = 0,
  onCollisionMessage,
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Interaction angles (in radians)
  const [camAngleX, setCamAngleX] = useState<number>(-0.3); // Pitch
  const [camAngleY, setCamAngleY] = useState<number>(0.5);   // Yaw
  const isDragging = useRef<boolean>(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragAngleStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Physics states
  const electronsRef = useRef<ElectronState[]>([]);
  const nucleusRef = useRef<ProtonState[]>([]);
  const prevIdRef = useRef<string>('');
  const excitationPulseRef = useRef<number>(0);

  // Collision refs
  const collisionProgressRef = useRef<number>(0);
  const collisionStageRef = useRef<'idle' | 'approaching' | 'impact' | 'fused' | 'complete'>('idle');
  const sparksRef = useRef<{ pos: Vector3D; vel: Vector3D; color: string; size: number; alpha: number }[]>([]);
  const starsRef = useRef<{ x: number; y: number; size: number; alpha: number }[]>([]);
  const localPositionsRef = useRef<Vector3D[]>([]);
  const collisionCallbackTriggeredRef = useRef<boolean>(false);

  // Orbit radius interpolation (smooth transition during parameter changes)
  const currentMassRef = useRef<number>(params.electronMass);

  // Initialize particles when selectedId, viewType, or collision parameters change
  useEffect(() => {
    // Generate nucleus
    const newNucleus: ProtonState[] = [];
    const id = selectedId;
    localPositionsRef.current = [];

    if (collisionMode) {
      // RESET COLLISION STATES
      collisionProgressRef.current = 0;
      collisionStageRef.current = 'approaching';
      sparksRef.current = [];
      collisionCallbackTriggeredRef.current = false;

      const elementA = collisionElementA || 'H';
      const elementB = collisionElementB || 'He';

      const atomA = getAtomPresetById(elementA);
      const atomB = getAtomPresetById(elementB);

      // ELEMENT A: Starts on the left (-140, 0, 0)
      const totalNucleonsA = atomA.protons + atomA.neutrons;
      for (let i = 0; i < totalNucleonsA; i++) {
        const isProton = i < atomA.protons;
        const phi = Math.acos(1 - 2 * (i + 0.5) / totalNucleonsA);
        const theta = Math.PI * (1 + 5 ** 0.5) * (i + 0.5);
        const r = 4 + Math.random() * 5 + (totalNucleonsA > 10 ? Math.random() * 3 : 0);
        
        const lx = r * Math.sin(phi) * Math.cos(theta);
        const ly = r * Math.sin(phi) * Math.sin(theta);
        const lz = r * Math.cos(phi);

        localPositionsRef.current.push({ x: lx, y: ly, z: lz });

        newNucleus.push({
          id: `col-A-nucleon-${i}`,
          pos: { x: lx - 140, y: ly, z: lz }, // starting offset -140
          isProton,
          color: isProton ? '#3B82F6' : '#94A3B8', // Blue protons, Slate neutrons
          size: isProton ? 4.5 : 4.8,
        });
      }

      // ELEMENT B: Starts on the right (140, 0, 0)
      const totalNucleonsB = atomB.protons + atomB.neutrons;
      for (let i = 0; i < totalNucleonsB; i++) {
        const isProton = i < atomB.protons;
        const phi = Math.acos(1 - 2 * (i + 0.5) / totalNucleonsB);
        const theta = Math.PI * (1 + 5 ** 0.5) * (i + 0.5);
        const r = 4 + Math.random() * 5 + (totalNucleonsB > 10 ? Math.random() * 3 : 0);
        
        const lx = r * Math.sin(phi) * Math.cos(theta);
        const ly = r * Math.sin(phi) * Math.sin(theta);
        const lz = r * Math.cos(phi);

        localPositionsRef.current.push({ x: lx, y: ly, z: lz });

        newNucleus.push({
          id: `col-B-nucleon-${i}`,
          pos: { x: lx + 140, y: ly, z: lz }, // starting offset 140
          isProton,
          color: isProton ? '#10B981' : '#FBBF24', // Green protons, Gold neutrons
          size: isProton ? 4.5 : 4.8,
        });
      }

      nucleusRef.current = newNucleus;

      // ELECTRONS
      const newElectrons: ElectronState[] = [];
      let electronIdCounter = 0;

      // Electrons for A
      atomA.protonsByShell.forEach((electronCount, shellIndex) => {
        const shellRadius = 30 + (shellIndex * 20);
        for (let j = 0; j < electronCount; j++) {
          const angle = (j / electronCount) * Math.PI * 2 + Math.random() * 0.5;
          const planeAngleX = (shellIndex * 0.4) + (j * (Math.PI / 4));
          const planeAngleY = (shellIndex * -0.25) + (j * (Math.PI / 3));

          newElectrons.push({
            id: `col-A-electron-${electronIdCounter++}`,
            shellIndex,
            angle,
            planeAngleX,
            planeAngleY,
            speed: 0.035 + (0.015 / (shellIndex + 1)),
            radius: shellRadius,
            trail: [],
          });
        }
      });

      // Electrons for B
      atomB.protonsByShell.forEach((electronCount, shellIndex) => {
        const shellRadius = 30 + (shellIndex * 20);
        for (let j = 0; j < electronCount; j++) {
          const angle = (j / electronCount) * Math.PI * 2 + Math.random() * 0.5;
          const planeAngleX = (shellIndex * 0.4) + (j * (Math.PI / 4));
          const planeAngleY = (shellIndex * -0.25) + (j * (Math.PI / 3));

          newElectrons.push({
            id: `col-B-electron-${electronIdCounter++}`,
            shellIndex,
            angle,
            planeAngleX,
            planeAngleY,
            speed: 0.035 + (0.015 / (shellIndex + 1)),
            radius: shellRadius,
            trail: [],
          });
        }
      });

      electronsRef.current = newElectrons;

    } else {
      if (viewType === 'atom') {
        const atom = getAtomPresetById(id);
        const totalProtons = atom.protons;
        const totalNeutrons = atom.neutrons;
        const totalNucleons = totalProtons + totalNeutrons;

        // Arrange nucleons in a tight spherical cluster using Golden Spiral coordinates
        for (let i = 0; i < totalNucleons; i++) {
          const isProton = i < totalProtons;
          const phi = Math.acos(1 - 2 * (i + 0.5) / totalNucleons);
          const theta = Math.PI * (1 + 5 ** 0.5) * (i + 0.5);
          
          // Base distance from center
          const r = 5 + Math.random() * 8 + (totalNucleons > 10 ? Math.random() * 6 : 0);
          
          const x = r * Math.sin(phi) * Math.cos(theta);
          const y = r * Math.sin(phi) * Math.sin(theta);
          const z = r * Math.cos(phi);

          newNucleus.push({
            id: `nucleon-${i}`,
            pos: { x, y, z },
            isProton,
            color: isProton ? '#3B82F6' : '#94A3B8', // Blue protons, Slate neutrons
            size: isProton ? 5.5 : 5.8,
          });
        }

        nucleusRef.current = newNucleus;

        // Generate electrons
        const newElectrons: ElectronState[] = [];
        let electronIdCounter = 0;

        atom.protonsByShell.forEach((electronCount, shellIndex) => {
          const shellRadius = 40 + (shellIndex * 35); // base orbital radius
          for (let j = 0; j < electronCount; j++) {
            // Angle of electron in this shell
            const angle = (j / electronCount) * Math.PI * 2 + Math.random() * 0.5;
            
            // Generate tilted 3D orbit planes for visual complexity
            const planeAngleX = (shellIndex * 0.4) + (j * (Math.PI / 4));
            const planeAngleY = (shellIndex * -0.25) + (j * (Math.PI / 3));

            newElectrons.push({
              id: `electron-${electronIdCounter++}`,
              shellIndex,
              angle,
              planeAngleX,
              planeAngleY,
              speed: 0.02 + (0.0125 / (shellIndex + 1)), // Inner electrons orbit faster
              radius: shellRadius,
              trail: [],
            });
          }
        });
        electronsRef.current = newElectrons;

      } else {
        // Molecule View
        const molecule = MOLECULE_PRESETS.find((m) => m.id === id) || MOLECULE_PRESETS[0];
        
        // For each atom in the molecule, create its nucleons clustered around its offset
        molecule.atoms.forEach((atom, atomIndex) => {
          const totalProtons = atom.protons;
          const totalNeutrons = atom.neutrons;
          const totalNucleons = totalProtons + totalNeutrons;

          for (let i = 0; i < totalNucleons; i++) {
            const isProton = i < totalProtons;
            const phi = Math.acos(1 - 2 * (i + 0.5) / totalNucleons);
            const theta = Math.PI * (1 + 5 ** 0.5) * (i + 0.5);
            
            const r = 4 + Math.random() * 5 + (totalNucleons > 10 ? Math.random() * 3 : 0);
            
            const lx = r * Math.sin(phi) * Math.cos(theta);
            const ly = r * Math.sin(phi) * Math.sin(theta);
            const lz = r * Math.cos(phi);

            newNucleus.push({
              id: `mol-nucleon-${atomIndex}-${i}`,
              pos: {
                x: atom.offset.x + lx,
                y: atom.offset.y + ly,
                z: atom.offset.z + lz,
              },
              isProton,
              color: atom.color,
              size: isProton ? 4.5 : 4.8,
            });
          }
        });
        nucleusRef.current = newNucleus;

        // Multi-nucleus molecular electrons
        // In molecules, electrons form shared bonding orbitals moving around multiple atoms
        const newElectrons: ElectronState[] = [];
        let electronId = 0;

        // Create localized electrons for the inner shells + shared covalent valence electrons
        molecule.atoms.forEach((atom, atomIndex) => {
          // Core (non-bonding) electrons
          const coreCount = atom.shells[0] || 0;
          if (coreCount > 0) {
            for (let j = 0; j < coreCount; j++) {
              const angle = (j / coreCount) * Math.PI * 2;
              newElectrons.push({
                id: `mol-elect-core-${atomIndex}-${electronId++}`,
                shellIndex: 0,
                angle,
                planeAngleX: Math.random() * 0.5,
                planeAngleY: Math.random() * 0.5,
                speed: 0.045,
                radius: 18, // Tight localized orbit
                // Store center offset reference
                trail: [],
              });
            }
          }
        });

        // Add shared covalent valence electrons orbiting between atoms
        const sharedCount = molecule.id === 'H2O' ? 4 : molecule.id === 'CO2' ? 8 : molecule.id === 'CH4' ? 8 : 4;
        for (let i = 0; i < sharedCount; i++) {
          // Covalent shared electrons usually follow wider 3D paths (lemniscates/ellipsoids crossing multiple systems)
          const angle = (i / sharedCount) * Math.PI * 2;
          newElectrons.push({
            id: `mol-elect-shared-${electronId++}`,
            shellIndex: 1, // Valence
            angle,
            planeAngleX: (i * 0.5) - 0.5,
            planeAngleY: (i * 0.2),
            speed: 0.02,
            radius: 45, // Wide orbital tracing bonded paths
            trail: [],
          });
        }

        electronsRef.current = newElectrons;
      }
    }

    prevIdRef.current = id;
  }, [selectedId, viewType, collisionMode, collisionElementA, collisionElementB, collisionTriggerId]);

  // Handle Excitation Pulse animation
  useEffect(() => {
    if (isExcited) {
      excitationPulseRef.current = 1.0;
      const interval = setInterval(() => {
        excitationPulseRef.current -= 0.04;
        if (excitationPulseRef.current <= 0) {
          excitationPulseRef.current = 0;
          onExcitedEnd();
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isExcited, onExcitedEnd]);

  // Main canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      // Handle canvas resizing
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
      }

      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height / 2;

      const isDark = theme === 'dark';

      // Smoothly interpolate parameters for natural physics reactions
      currentMassRef.current += (params.electronMass - currentMassRef.current) * 0.1;

      // Kinetic calculations
      const radiusFactor = 1 / Math.sqrt(currentMassRef.current);
      const speedFactor = (params.speedMultiplier * (0.5 + params.nucleusCharge * 0.5)) / Math.sqrt(currentMassRef.current);

      // Determine system bounds
      let systemRadius = 40;
      if (!collisionMode) {
        if (viewType === 'atom') {
          const atom = getAtomPresetById(selectedId);
          if (atom) {
            const numShells = atom.protonsByShell.length;
            const baseOuterShellRadius = 40 + (numShells - 1) * 35;
            const outerRadius = baseOuterShellRadius * radiusFactor;
            const exciteBonus = excitationPulseRef.current * 25 * numShells;
            systemRadius = outerRadius + exciteBonus;
          }
        } else {
          const activeMolecule = MOLECULE_PRESETS.find(m => m.id === selectedId);
          if (activeMolecule) {
            let maxOffsetDist = 0;
            activeMolecule.atoms.forEach(a => {
              const dist = Math.hypot(a.offset.x, a.offset.y, a.offset.z);
              if (dist > maxOffsetDist) maxOffsetDist = dist;
            });
            const maxOuterRadius = Math.max(45 * radiusFactor, 45);
            systemRadius = maxOffsetDist + maxOuterRadius;
          }
        }
      } else {
        systemRadius = 140; // Collision starts wide
      }

      const halfDim = Math.min(width, height) / 2;
      const maxScreenRadius = halfDim * 0.85;
      const fitFactor = systemRadius > 0 ? (maxScreenRadius / systemRadius) : 1.5;
      const clampedFitFactor = Math.max(0.1, Math.min(6.0, fitFactor));

      // COLLISION COLLBACKS AND STATE CALCULATIONS
      let colProgress = 0;
      let collisionStage: 'idle' | 'approaching' | 'impact' | 'fused' | 'complete' = 'idle';
      if (collisionMode) {
        collisionProgressRef.current += 0.0055 * collisionSpeed;
        colProgress = collisionProgressRef.current;
        if (colProgress < 1.0) {
          collisionStage = 'approaching';
        } else if (colProgress < 1.25) {
          collisionStage = 'impact';
        } else if (colProgress < 2.5) {
          collisionStage = 'fused';
        } else {
          collisionStage = 'complete';
        }
        collisionStageRef.current = collisionStage;
      }

      // BACKGROUND CLEARING
      if (isDark) {
        ctx.fillStyle = '#020617'; // Deep dark cosmic midnight
        ctx.fillRect(0, 0, width, height);

        // Render celestial stars if empty
        if (starsRef.current.length === 0) {
          const stars = [];
          for (let i = 0; i < 70; i++) {
            stars.push({
              x: Math.random(),
              y: Math.random(),
              size: 0.6 + Math.random() * 1.6,
              alpha: 0.15 + Math.random() * 0.75,
            });
          }
          starsRef.current = stars;
        }

        // Draw deep galactic stars
        starsRef.current.forEach(star => {
          ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (0.8 + Math.sin(colProgress + star.x * 10) * 0.2)})`;
          ctx.fillRect(star.x * width, star.y * height, star.size, star.size);
        });

        // Draw faint cosmic nebula backing
        const nebulaGrd = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, Math.max(width, height) * 0.7);
        nebulaGrd.addColorStop(0, 'rgba(79, 70, 229, 0.04)'); // Faint glowing indigo core
        nebulaGrd.addColorStop(0.5, 'rgba(16, 185, 129, 0.01)'); // Emerald breeze
        nebulaGrd.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = nebulaGrd;
        ctx.fillRect(0, 0, width, height);

      } else {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }

      // FINE SCIENTIFIC MATRIX GRID Lines
      if (params.gridLines) {
        ctx.strokeStyle = isDark ? 'rgba(99, 102, 241, 0.05)' : 'rgba(239, 246, 255, 0.7)';
        ctx.lineWidth = 1;
        
        const gridSize = 40;
        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Draw radial neural safety scope bounds
        ctx.strokeStyle = isDark ? 'rgba(99, 102, 241, 0.09)' : '#EFF6FF';
        ctx.lineWidth = 1.5;
        [80, 160, 240].forEach((r) => {
          ctx.beginPath();
          ctx.arc(centerX, centerY, r * params.scale * (clampedFitFactor / 1.5), 0, Math.PI * 2);
          ctx.stroke();
        });
      }

      // 3D Projection coordinates function
      const projectType3D = (v: Vector3D): { px: number; py: number; depth: number } => {
        // Rotate Y (Yaw)
        const x1 = v.x * Math.cos(camAngleY) - v.z * Math.sin(camAngleY);
        const z1 = v.x * Math.sin(camAngleY) + v.z * Math.cos(camAngleY);

        // Rotate X (Pitch)
        const y2 = v.y * Math.cos(camAngleX) - z1 * Math.sin(camAngleX);
        const z2 = v.y * Math.sin(camAngleX) + z1 * Math.cos(camAngleX);

        const dist = 380;
        const perspectiveMult = dist / (dist + z2);
        const zoom = params.scale * clampedFitFactor;

        return {
          px: centerX + x1 * zoom * perspectiveMult,
          py: centerY + y2 * zoom * perspectiveMult,
          depth: z2,
        };
      };

      // RENDER MOLECULAR BONDS
      if (!collisionMode && viewType === 'molecule') {
        const activeMolecule = MOLECULE_PRESETS.find(m => m.id === selectedId);
        if (activeMolecule) {
          ctx.strokeStyle = isDark ? 'rgba(99, 102, 241, 0.4)' : 'rgba(59, 130, 246, 0.45)';
          ctx.lineWidth = 2.5;
          ctx.setLineDash([4, 4]);

          const centralAtom = activeMolecule.atoms[0];
          const centerProj = projectType3D(centralAtom.offset);

          for (let i = 1; i < activeMolecule.atoms.length; i++) {
            const bondedProj = projectType3D(activeMolecule.atoms[i].offset);
            ctx.beginPath();
            ctx.moveTo(centerProj.px, centerProj.py);
            ctx.lineTo(bondedProj.px, bondedProj.py);
            ctx.stroke();

            // Covalent label text
            ctx.fillStyle = isDark ? '#6366F1' : '#3B82F6';
            ctx.font = '9px monospace';
            const midX = (centerProj.px + bondedProj.px) / 2;
            const midY = (centerProj.py + bondedProj.py) / 2;
            ctx.fillText("Covalent Shared", midX - 42, midY - 6);
          }
          ctx.setLineDash([]);
        }
      }

      // RENDER Bohr orbital circles inside standard mode
      if (!collisionMode && params.orbitalStyle === 'bohr' && viewType === 'atom') {
        const atom = getAtomPresetById(selectedId);
        if (atom) {
          atom.protonsByShell.forEach((_, shellIdx) => {
            const shellBaseRadius = 40 + (shellIdx * 35);
            const currentShellRadius = shellBaseRadius * radiusFactor;

            ctx.strokeStyle = isDark ? 'rgba(99, 102, 241, 0.16)' : 'rgba(59, 130, 246, 0.15)';
            ctx.lineWidth = 1.3;
            ctx.beginPath();

            const segments = 90;
            for (let s = 0; s <= segments; s++) {
              const angle = (s / segments) * Math.PI * 2;
              const planeAngleX = shellIdx * 0.4;
              const planeAngleY = shellIdx * -0.25;

              const lx = currentShellRadius * Math.cos(angle);
              const ly = currentShellRadius * Math.sin(angle) * Math.cos(planeAngleX);
              const lz = currentShellRadius * Math.sin(angle) * Math.sin(planeAngleX);

              const finalP = {
                x: lx * Math.cos(planeAngleY) - lz * Math.sin(planeAngleY),
                y: ly,
                z: lx * Math.sin(planeAngleY) + lz * Math.cos(planeAngleY),
              };

              const screenP = projectType3D(finalP);
              if (s === 0) ctx.moveTo(screenP.px, screenP.py);
              else ctx.lineTo(screenP.px, screenP.py);
            }
            ctx.stroke();
          });
        }
      } else if (!collisionMode && params.orbitalStyle === 'wave' && viewType === 'atom') {
        const atom = getAtomPresetById(selectedId);
        if (atom) {
          atom.protonsByShell.forEach((_, shellIdx) => {
            const shellRadius = (40 + (shellIdx * 35)) * radiusFactor;
            ctx.fillStyle = isDark ? 'rgba(99, 102, 241, 0.05)' : 'rgba(59, 130, 246, 0.04)';
            
            const dotCount = 100;
            for (let d = 0; d < dotCount; d++) {
              const phi = Math.random() * Math.PI * 2;
              const deviation = (Math.random() - 0.5) * 11 * (shellIdx + 1) * (1 + params.quantumFluctuation);
              const devRadius = shellRadius + deviation;

              const planeAngleX = shellIdx * 0.4;
              const planeAngleY = shellIdx * -0.25;

              const lx = devRadius * Math.cos(phi);
              const ly = devRadius * Math.sin(phi) * Math.cos(planeAngleX);
              const lz = devRadius * Math.sin(phi) * Math.sin(planeAngleX);

              const finalP = {
                x: lx * Math.cos(planeAngleY) - lz * Math.sin(planeAngleY),
                y: ly,
                z: lx * Math.sin(planeAngleY) + lz * Math.cos(planeAngleY),
              };

              const screenP = projectType3D(finalP);
              ctx.beginPath();
              ctx.arc(screenP.px, screenP.py, 1.1, 0, Math.PI * 2);
              ctx.fill();
            }
          });
        }
      } else if (!collisionMode && params.orbitalStyle === 'shell' && viewType === 'atom') {
        const atom = getAtomPresetById(selectedId);
        if (atom) {
          atom.protonsByShell.forEach((_, shellIdx) => {
            const shellRadius = (40 + (shellIdx * 35)) * radiusFactor;
            ctx.strokeStyle = isDark ? 'rgba(129, 140, 248, 0.04)' : 'rgba(59, 130, 246, 0.03)';
            ctx.lineWidth = 14;
            ctx.beginPath();
            
            const segments = 45;
            for (let s = 0; s <= segments; s++) {
              const angle = (s / segments) * Math.PI * 2;
              const planeAngleX = shellIdx * 0.4;
              const planeAngleY = shellIdx * -0.25;

              const lx = shellRadius * Math.cos(angle);
              const ly = shellRadius * Math.sin(angle) * Math.cos(planeAngleX);
              const lz = shellRadius * Math.sin(angle) * Math.sin(planeAngleX);

              const finalP = {
                x: lx * Math.cos(planeAngleY) - lz * Math.sin(planeAngleY),
                y: ly,
                z: lx * Math.sin(planeAngleY) + lz * Math.cos(planeAngleY),
              };

              const screenP = projectType3D(finalP);
              if (s === 0) ctx.moveTo(screenP.px, screenP.py);
              else ctx.lineTo(screenP.px, screenP.py);
            }
            ctx.stroke();
          });
        }
      }

      // PHYSICS EXCITATION Pulse effect
      if (excitationPulseRef.current > 0) {
        ctx.strokeStyle = isDark ? `rgba(129, 140, 248, ${excitationPulseRef.current * 0.35})` : `rgba(59, 130, 246, ${excitationPulseRef.current * 0.35})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, excitationPulseRef.current * 180, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = isDark ? `rgba(129, 140, 248, ${excitationPulseRef.current * 0.06})` : `rgba(59, 130, 246, ${excitationPulseRef.current * 0.05})`;
        ctx.beginPath();
        ctx.arc(centerX, centerY, excitationPulseRef.current * 180, 0, Math.PI * 2);
        ctx.fill();
      }

      // POSITIONS UPDATES FOR NUCLEONS (Adapt for Collision standard shifts)
      if (collisionMode) {
        let approachShift_A = -140;
        let approachShift_B = 140;

        if (colProgress < 1.0) {
          approachShift_A = -140 * (1 - colProgress);
          approachShift_B = 140 * (1 - colProgress);
        } else {
          // Fusion / Recoil tremor oscillations
          approachShift_A = (Math.sin(colProgress * 44) * 2.2) / (1 + (colProgress - 1.0) * 8.0);
          approachShift_B = (Math.cos(colProgress * 44) * 2.2) / (1 + (colProgress - 1.0) * 8.0);
        }

        nucleusRef.current.forEach((nucleon, idx) => {
          const local = localPositionsRef.current[idx];
          if (local) {
            const isA = nucleon.id.startsWith('col-A-');
            nucleon.pos.x = local.x + (isA ? approachShift_A : approachShift_B);
            nucleon.pos.y = local.y;
            nucleon.pos.z = local.z;
          }
        });
      }

      // Draw Nucleus Particles (Protons & Neutrons)
      const projectedNucleons = nucleusRef.current.map((nucleon) => {
        const vibeAmp = 0.5 + (excitationPulseRef.current * 5) + (collisionStageRef.current === 'impact' ? 8 : 0);
        const randOffset = {
          x: (Math.random() - 0.5) * vibeAmp,
          y: (Math.random() - 0.5) * vibeAmp,
          z: (Math.random() - 0.5) * vibeAmp,
        };

        const currentPos = {
          x: nucleon.pos.x + randOffset.x,
          y: nucleon.pos.y + randOffset.y,
          z: nucleon.pos.z + randOffset.z,
        };

        const screenP = projectType3D(currentPos);
        return {
          original: nucleon,
          screenP,
        };
      });

      // Depth order
      projectedNucleons.sort((a, b) => b.screenP.depth - a.screenP.depth);

      projectedNucleons.forEach(({ original, screenP }) => {
        const perspectiveScale = 360 / (360 + screenP.depth);
        const radius = original.size * params.scale * perspectiveScale;

        const gradient = ctx.createRadialGradient(
          screenP.px - radius * 0.3,
          screenP.py - radius * 0.3,
          radius * 0.1,
          screenP.px,
          screenP.py,
          radius
        );

        if (collisionMode) {
          const isA = original.id.startsWith('col-A-');
          if (isA) {
            gradient.addColorStop(0, original.isProton ? '#93C5FD' : '#E2E8F0');
            gradient.addColorStop(0.35, original.isProton ? '#3B82F6' : '#94A3B8');
            gradient.addColorStop(1, original.isProton ? '#1D4ED8' : '#475569');
          } else {
            gradient.addColorStop(0, original.isProton ? '#A7F3D0' : '#FDE68A');
            gradient.addColorStop(0.35, original.isProton ? '#10B981' : '#F59E0B');
            gradient.addColorStop(1, original.isProton ? '#064E3B' : '#B45309');
          }
        } else {
          if (viewType === 'atom') {
            if (original.isProton) {
              gradient.addColorStop(0, '#93C5FD');
              gradient.addColorStop(0.3, '#3B82F6');
              gradient.addColorStop(1, '#1D4ED8');
            } else {
              gradient.addColorStop(0, '#E2E8F0');
              gradient.addColorStop(0.3, '#CBD5E1');
              gradient.addColorStop(1, '#64748B');
            }
          } else {
            const colBase = original.color;
            gradient.addColorStop(0, '#FFFFFF');
            gradient.addColorStop(0.2, colBase);
            gradient.addColorStop(1, '#050510');
          }
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(screenP.px, screenP.py, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // ELECTRONS POSITION UPDATES (Manage orbits for dual components)
      const projectedElectrons = electronsRef.current.map((electron) => {
        const orbitalFrequency = electron.speed * speedFactor;
        const qFluct = (Math.random() - 0.5) * 0.05 * params.quantumFluctuation;

        electron.angle += orbitalFrequency + qFluct;

        const currentRadius = electron.radius * radiusFactor;
        const exciteBonus = excitationPulseRef.current * 25 * (electron.shellIndex + 1);
        const finalRadius = currentRadius + exciteBonus;

        const lx = finalRadius * Math.cos(electron.angle);
        const ly = finalRadius * Math.sin(electron.angle) * Math.cos(electron.planeAngleX);
        const lz = finalRadius * Math.sin(electron.angle) * Math.sin(electron.planeAngleX);

        let systemOffset = { x: 0, y: 0, z: 0 };

        if (collisionMode) {
          const isA = electron.id.startsWith('col-A-');
          if (colProgress < 1.0) {
            systemOffset.x = isA ? -140 * (1 - colProgress) : 140 * (1 - colProgress);
          } else {
            // Undergone high-energy plasma bonding, shared core orbits
            const shareFactor = Math.sin(electron.angle + idxOf(electron.id)) * 10;
            systemOffset.x = shareFactor;
          }
        } else if (viewType === 'molecule') {
          const activeMolecule = MOLECULE_PRESETS.find(m => m.id === selectedId);
          if (activeMolecule) {
            if (electron.id.includes('core')) {
              const atomIndexStr = electron.id.split('-')[3];
              const idx = parseInt(atomIndexStr, 10);
              if (!isNaN(idx) && activeMolecule.atoms[idx]) {
                systemOffset = activeMolecule.atoms[idx].offset;
              }
            } else {
              const totalAtomsCount = activeMolecule.atoms.length;
              const targetAtomIndex = 1 + (Math.floor(electron.angle / (Math.PI * 2)) % (totalAtomsCount - 1));
              const targetAtom = activeMolecule.atoms[targetAtomIndex] || activeMolecule.atoms[1];
              const shareRatio = (Math.sin(electron.angle * 2) + 1) / 2;
              systemOffset = {
                x: activeMolecule.atoms[0].offset.x * (1 - shareRatio) + targetAtom.offset.x * shareRatio,
                y: activeMolecule.atoms[0].offset.y * (1 - shareRatio) + targetAtom.offset.y * shareRatio,
                z: activeMolecule.atoms[0].offset.z * (1 - shareRatio) + targetAtom.offset.z * shareRatio,
              };
            }
          }
        }

        const worldPos: Vector3D = {
          x: lx * Math.cos(electron.planeAngleY) - lz * Math.sin(electron.planeAngleY) + systemOffset.x,
          y: ly + systemOffset.y,
          z: lx * Math.sin(electron.planeAngleY) + lz * Math.cos(electron.planeAngleY) + systemOffset.z,
        };

        if (params.showTrails) {
          electron.trail.push({ ...worldPos });
          const maxTrailPoints = Math.max(4, Math.min(25, Math.floor(18 / Math.sqrt(currentMassRef.current))));
          if (electron.trail.length > maxTrailPoints) {
            electron.trail.shift();
          }
        } else {
          electron.trail = [];
        }

        const screenP = projectType3D(worldPos);
        return {
          electron,
          screenP,
          worldPos,
        };
      });

      // Sort electrons
      projectedElectrons.sort((a, b) => b.screenP.depth - a.screenP.depth);

      // Render Trails
      if (params.showTrails) {
        projectedElectrons.forEach(({ electron }) => {
          if (electron.trail.length < 2) return;
          
          ctx.beginPath();
          electron.trail.forEach((trailPoint, idx) => {
            const screenP = projectType3D(trailPoint);
            if (idx === 0) ctx.moveTo(screenP.px, screenP.py);
            else ctx.lineTo(screenP.px, screenP.py);
          });

          const isColA = electron.id.startsWith('col-A-');
          const isColB = electron.id.startsWith('col-B-');
          const strokeColorStr = isColA ? 'rgba(59, 130, 246, 0.45)' : isColB ? 'rgba(16, 185, 129, 0.45)' : isDark ? 'rgba(129, 140, 248, 0.5)' : 'rgba(59, 130, 246, 0.45)';

          ctx.strokeStyle = strokeColorStr;
          ctx.lineWidth = 1.6;
          ctx.stroke();
        });
      }

      // Render Electrons Core
      projectedElectrons.forEach(({ electron, screenP }) => {
        const perspectiveScale = 360 / (360 + screenP.depth);
        const baseElectRadius = 4.0;
        const physicalVisRadius = baseElectRadius * (1.1 / Math.sqrt(currentMassRef.current)) * params.scale * perspectiveScale;
        const finalVisRadius = Math.max(1.8, Math.min(11, physicalVisRadius));

        const aurGrd = ctx.createRadialGradient(screenP.px, screenP.py, 0, screenP.px, screenP.py, finalVisRadius * 1.8);
        const isA = electron.id.startsWith('col-A-');
        const isB = electron.id.startsWith('col-B-');

        const mainColor = isA ? '#3B82F6' : isB ? '#10B981' : '#2563EB';
        const auraColor = isA ? 'rgba(59, 130, 246, 0.45)' : isB ? 'rgba(16, 185, 129, 0.45)' : 'rgba(37, 99, 235, 0.4)';

        aurGrd.addColorStop(0, auraColor);
        aurGrd.addColorStop(0.5, 'rgba(255, 255, 255, 0.08)');
        aurGrd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = aurGrd;
        ctx.beginPath();
        ctx.arc(screenP.px, screenP.py, finalVisRadius * 1.9, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = mainColor;
        ctx.beginPath();
        ctx.arc(screenP.px, screenP.py, finalVisRadius * 0.7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(screenP.px - finalVisRadius * 0.15, screenP.py - finalVisRadius * 0.15, finalVisRadius * 0.25, 0, Math.PI * 2);
        ctx.fill();
      });

      // TRIGGER HIGH ENERGY COLLISION PHYSICS AND DEBRIS SPARKS
      if (collisionMode && colProgress >= 1.0) {
        // Generate sparks on impact point once
        if (sparksRef.current.length === 0) {
          const generated = [];
          const count = 45;
          for (let s = 0; s < count; s++) {
            const angle = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            // High escape speed coefficients
            const speedCoeff = 3.5 + Math.random() * 5.5 + collisionSpeed * 1.8;
            generated.push({
              pos: { x: (Math.random() - 0.5) * 6, y: (Math.random() - 0.5) * 6, z: (Math.random() - 0.5) * 6 },
              vel: {
                x: speedCoeff * Math.sin(phi) * Math.cos(angle),
                y: speedCoeff * Math.sin(phi) * Math.sin(angle),
                z: speedCoeff * Math.cos(phi),
              },
              color: s % 3 === 0 ? '#FBBF24' : s % 3 === 1 ? '#F43F5E' : '#38BDF8', // Amber, rose, sky-blue sparks
              size: 1.5 + Math.random() * 2.5,
              alpha: 1.0,
            });
          }
          sparksRef.current = generated;

          // Dispatch reaction details back to the parent React context
          if (onCollisionMessage && !collisionCallbackTriggeredRef.current) {
            collisionCallbackTriggeredRef.current = true;
            const elementA = collisionElementA || 'H';
            const elementB = collisionElementB || 'He';
            let reactionMsg = '';
            if (elementA === 'H' && elementB === 'H') {
              reactionMsg = "Deuterium Core Synthesis (H¹ + H¹ → H² + e⁺ + ν_e). Triggered solar active fusion with 1.442 MeV energy release, ejecting positrons and neutrinos!";
            } else if (elementA === 'He' && elementB === 'He') {
              reactionMsg = "Triple-Alpha Simulation Channel (He⁴ + He⁴ ⇌ Be⁸). Generated unstable Beryllium-8 resonance with instantaneous nuclear recoil decay.";
            } else if ((elementA === 'H' && elementB === 'He') || (elementA === 'He' && elementB === 'H')) {
              reactionMsg = "Proton-Alpha Elastic Deflection (H¹ + He⁴). Electrostatic Coulomb barrier deflection occurred. Rebounded under thermal kinetic dispersion of 6.3 MeV.";
            } else if ((elementA === 'C' && elementB === 'O') || (elementA === 'O' && elementB === 'C')) {
              reactionMsg = "Stellar Core Carbon Burning Loop (C¹² + O¹⁶ → Si²⁸). Full nucleosynthesis fusion of 16.54 MeV. Mimicking high-energy stellar matrix expansion stages.";
            } else if (elementA === 'C' && elementB === 'C') {
              reactionMsg = "Carbon-Carbon Fusion Burner (C¹² + C¹² → Ne²⁰ + α). Sparked core carbon-shell fusion releasing 4.617 MeV with high-energy Alpha particle emission.";
            } else if (elementA === 'O' && elementB === 'O') {
              reactionMsg = "Advanced Oxygen Fusion (O¹⁶ + O¹⁶ → S³²). Massive sulfur-32 synthesization releasing 16.54 MeV energy, representing carbon star final-stage core processes.";
            } else {
              reactionMsg = `High-Energy Thermal Collision (${elementA} + ${elementB}). Deep electrostatic cloud ionization occurred, dispersing subatomic friction fields with ${(8.2 + Math.random() * 3).toFixed(2)} MeV.`;
            }
            onCollisionMessage(reactionMsg);
          }
        }

        // Update and Render sparks
        sparksRef.current.forEach((spark) => {
          spark.pos.x += spark.vel.x;
          spark.pos.y += spark.vel.y;
          spark.pos.z += spark.vel.z;
          spark.alpha -= 0.013; // Gradual fade-out speed

          if (spark.alpha > 0) {
            const spProj = projectType3D(spark.pos);
            ctx.fillStyle = spark.color;
            ctx.globalAlpha = spark.alpha;
            ctx.beginPath();
            ctx.arc(spProj.px, spProj.py, spark.size * params.scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
          }
        });

        // DRAW IMPACT FLASH OVERLAY
        const flashProgress = colProgress - 1.0;
        const flashAlpha = Math.max(0, 1.25 - flashProgress * 7.5); // Fast flash decay
        if (flashAlpha > 0) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha * 0.95})`;
          ctx.fillRect(0, 0, width, height);
        }

        // EXPANDING DEBRIS THERMAL SHOCKWAVE LINE
        const shockRadius = flashProgress * 230;
        const shockAlpha = Math.max(0, 0.7 - flashProgress * 0.45);
        if (shockAlpha > 0 && shockRadius < 260) {
          ctx.strokeStyle = `rgba(244, 63, 94, ${shockAlpha})`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(centerX, centerY, shockRadius * params.scale, 0, Math.PI * 2);
          ctx.stroke();

          // Outer secondary echo wave
          ctx.strokeStyle = `rgba(99, 102, 241, ${shockAlpha * 0.45})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(centerX, centerY, shockRadius * 1.3 * params.scale, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // HELPER UTILITY STRING SLICE
      const idxOf = (s: string): number => {
        let sum = 0;
        for (let i = 0; i < s.length; i++) sum += s.charCodeAt(i);
        return sum;
      };

      // STATUS TEXT LABELS on the canvas matrix
      ctx.fillStyle = isDark ? '#94A3B8' : '#475569';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';

      if (collisionMode) {
        ctx.fillText(`Target Elements: A(${collisionElementA}) + B(${collisionElementB || 'He'})`, 12, height - 26);
        ctx.fillText(`Beam Chamber: ${collisionStageRef.current?.toUpperCase()} STATS`, 12, height - 12);
      } else {
        ctx.fillText(`Effective Bohr Radius: ${currentMassRef.current.toFixed(2)}mₑ`, 12, height - 26);
        ctx.fillText(`Excitation: ${isExcited ? 'Excited Pulse Wave State' : 'Ground State'}`, 12, height - 12);
      }
      
      const speedKms = (speedFactor * 2187).toFixed(0);
      ctx.textAlign = 'right';
      ctx.fillText(`Quantum Loop: ~${speedKms} km/s`, width - 12, height - 12);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [selectedId, viewType, camAngleX, camAngleY, params, theme, collisionMode, collisionElementA, collisionElementB, collisionSpeed, collisionTriggerId]);

  // Touch and mouse hand drag events
  const handleMouseDown = (e: MouseEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    dragAngleStart.current = { x: camAngleX, y: camAngleY };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) {
      // Handle simple hovered subatomic items
      return;
    }
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    // Scale orbital rotation
    const sensitivity = 0.007;
    setCamAngleY(dragAngleStart.current.y + dx * sensitivity);
    setCamAngleX(Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, dragAngleStart.current.x + dy * sensitivity)));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      dragAngleStart.current = { x: camAngleX, y: camAngleY };
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStart.current.x;
    const dy = e.touches[0].clientY - dragStart.current.y;

    const sensitivity = 0.01;
    setCamAngleY(dragAngleStart.current.y + dx * sensitivity);
    setCamAngleX(Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, dragAngleStart.current.x + dy * sensitivity)));
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  // Click on Canvas to select items
  const handleCanvasClick = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked near centerpiece/nucleus
    const distToCenter = Math.hypot(x - rect.width / 2, y - rect.height / 2);
    if (distToCenter < 40) {
      if (viewType === 'atom') {
        const atom = getAtomPresetById(selectedId);
        onSelectSubatomic({
          name: 'Atomic Nucleus',
          details: `Contains ${atom.protons} Proton(s) and ${atom.neutrons} Neutron(s). Held together securely by the nuclear strong force to overcome electrostatic repulsion. Mass number = ${atom.massNumber}.`,
          color: 'bg-blue-600',
        });
      } else {
        const mol = MOLECULE_PRESETS.find((m) => m.id === selectedId) || MOLECULE_PRESETS[0];
        onSelectSubatomic({
          name: 'Molecular Core System',
          details: `Consists of ${mol.atoms.length} chemical nuclei bonded via shared electron paths forming ${mol.bondingType} bonds.`,
          color: 'bg-teal-600',
        });
      }
    } else {
      // Clicked general background or outer orbit
      onSelectSubatomic({
        name: 'Electron Charge Layer',
        details: `Orbiting quantum cloud layer. Currently configured with individual electrostatic charge mass at ${params.electronMass.toFixed(2)}x standard mass, orbiting in the electric pull field.`,
        color: 'bg-blue-500',
      });
    }
  };

  return (
    <div
      ref={containerRef}
      id="3d-particles-stage"
      className={`relative w-full h-full min-h-[300px] md:min-h-[460px] cursor-grab active:cursor-grabbing overflow-hidden rounded-2xl select-none transition-colors duration-205 ${
        theme === 'dark' ? 'bg-slate-950 border border-slate-800' : 'bg-white border border-slate-100 shadow-sm'
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleCanvasClick}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />

      {/* Guide text Overlay on the canvas */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium font-mono rounded-full border ${
          theme === 'dark' ? 'text-indigo-300 bg-indigo-950/40 border-indigo-900/30' : 'text-blue-600 bg-blue-50/70 border-blue-100'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full animate-ping ${theme === 'dark' ? 'bg-indigo-400' : 'bg-blue-500'}`} />
          {collisionMode ? 'Collision Fusion Lab' : 'Interactive 3D Engine'}
        </span>
      </div>

      <div className="absolute top-4 right-4 pointer-events-none text-right">
        <span className={`text-[10px] font-mono block ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
          Drag coordinates to rotate
        </span>
        <span className={`text-[10px] font-mono block ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
          Click elements inside to view properties
        </span>
      </div>
    </div>
  );
}
