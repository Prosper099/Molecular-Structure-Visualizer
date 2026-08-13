/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface ElectronState {
  id: string;
  shellIndex: number;
  angle: number;
  planeAngleX: number; // orbital orientation angle
  planeAngleY: number;
  speed: number;
  radius: number;
  trail: Vector3D[];
}

export interface ProtonState {
  id: string;
  pos: Vector3D;
  isProton: boolean; // true = proton, false = neutron
  color: string;
  size: number;
}

export interface AtomPreset {
  symbol: string;
  name: string;
  protonsByShell: number[]; // e.g. [2, 4] for Carbon
  protons: number;
  neutrons: number;
  massNumber: number;
  description: string;
  category: string;
  funFact: string;
  formulaDescription: string;
}

export interface MoleculeAtom {
  symbol: string;
  elementName: string;
  offset: Vector3D; // Offset from molecule center
  protons: number;
  neutrons: number;
  shells: number[];
  color: string;
}

export interface MoleculePreset {
  id: string;
  name: string;
  formula: string;
  atoms: MoleculeAtom[];
  description: string;
  bondingType: string;
  funFact: string;
}

export interface SimulationParams {
  electronMass: number; // 0.1 to 5.0
  speedMultiplier: number; // 0.0 to 3.0
  nucleusCharge: number; // 0.5 to 2.5
  orbitalStyle: 'bohr' | 'wave' | 'shell';
  showTrails: boolean;
  gridLines: boolean;
  quantumFluctuation: number; // 0.0 to 1.0
  scale: number; // zoom level
}
