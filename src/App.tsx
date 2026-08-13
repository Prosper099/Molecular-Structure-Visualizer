/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ATOM_PRESETS, MOLECULE_PRESETS, getAtomPresetById } from './data/elements';
import { SimulationParams } from './types';
import ParticleCanvas from './components/ParticleCanvas';
import ControlPanel from './components/ControlPanel';
import InfoCard from './components/InfoCard';
import ElementDatabase from './components/ElementDatabase';
import ElementPeriodicMenu from './components/ElementPeriodicMenu';
import LaunchScreen from './components/LaunchScreen';
import { Atom, Compass, RefreshCw, Layers, Check, Sparkles, LayoutGrid, Cpu, Home } from 'lucide-react';

const DEFAULT_PARAMS: SimulationParams = {
  electronMass: 1.0,
  speedMultiplier: 1.0,
  nucleusCharge: 1.0,
  orbitalStyle: 'bohr',
  showTrails: true,
  gridLines: true,
  quantumFluctuation: 0.2,
  scale: 1.0,
};

export default function App() {
  const [hasOpenedApp, setHasOpenedApp] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'atoms' | 'molecules' | 'periodic' | 'collision'>('atoms');
  const [selectedAtomId, setSelectedAtomId] = useState<string>('C');
  const [selectedMoleculeId, setSelectedMoleculeId] = useState<string>('H2O');
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);
  const [isExcited, setIsExcited] = useState<boolean>(false);
  const [selectedSubatomic, setSelectedSubatomic] = useState<{
    name: string;
    details: string;
    color: string;
  } | null>(null);

  // New Dark/Light Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // New Particle Collision Mode States & Controls
  const [collisionElementA, setCollisionElementA] = useState<string>('H');
  const [collisionElementB, setCollisionElementB] = useState<string>('He');
  const [collisionSpeed, setCollisionSpeed] = useState<number>(1.0);
  const [collisionTriggerId, setCollisionTriggerId] = useState<number>(0);
  const [collisionMessage, setCollisionMessage] = useState<string | null>(null);

  // Derive views
  const viewType = activeTab === 'molecules' ? 'molecule' : 'atom';
  const selectedId = activeTab === 'molecules' ? selectedMoleculeId : selectedAtomId;

  const setSelectedId = (id: string) => {
    if (activeTab === 'molecules') {
      setSelectedMoleculeId(id);
    } else {
      setSelectedAtomId(id);
    }
  };

  const atom = viewType === 'atom' ? getAtomPresetById(selectedId) : null;
  const molecule = viewType === 'molecule' ? MOLECULE_PRESETS.find((m) => m.id === selectedId) : null;

  const handleExcitate = () => {
    setIsExcited(true);
    // Momentarily augment fluctuation and speed
    setParams((prev) => ({
      ...prev,
      quantumFluctuation: 0.8,
    }));
  };

  const handleExcitedEnd = () => {
    setIsExcited(false);
    // Revert quantum parameters
    setParams((prev) => ({
      ...prev,
      quantumFluctuation: 0.2,
    }));
  };

  const handleReset = () => {
    setParams(DEFAULT_PARAMS);
    setSelectedSubatomic(null);
  };

  const stability = Math.max(4.2, Math.round(100 - Math.abs(1 - params.electronMass) * 40 - Math.abs(1 - params.speedMultiplier) * 15));
  const decayRate = stability > 80 
    ? "None (Stable)" 
    : stability > 50 
      ? "Resonant Beta Flux" 
      : "Entropy Ejection";
  const chargeState = params.nucleusCharge === 1.0 
    ? "Stable Neutral" 
    : params.nucleusCharge > 1.0 
      ? "Positive Core Ion" 
      : "Electron Shielded";

  if (!hasOpenedApp) {
    return <LaunchScreen onLaunch={() => setHasOpenedApp(true)} />;
  }

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col antialiased transition-colors duration-200 font-sans ${
      isDark 
        ? 'bg-slate-950 text-slate-100 selection:bg-indigo-650 selection:bg-indigo-600 selection:text-white' 
        : 'bg-white text-slate-800 selection:bg-blue-100 selection:text-blue-800'
    }`}>
      
      {/* Top Navigation in Cosmic Dark vs Scientific Light */}
      <header className={`w-full px-6 md:px-8 py-5 flex flex-col md:flex-row justify-between items-center md:items-end sticky top-0 z-40 backdrop-blur-md transition-all border-b ${
        isDark ? 'bg-slate-950/90 border-slate-900 shadow-sm' : 'bg-white/95 border-slate-100 shadow-3xs'
      }`}>
        <div className="flex flex-col text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
            <button 
              id="back-to-menu-btn"
              onClick={() => setHasOpenedApp(false)}
              className={`group text-[10px] uppercase font-bold flex items-center gap-1 cursor-pointer transition-colors py-0.5 px-2 rounded-md border ${
                isDark 
                  ? 'text-slate-400 bg-slate-900 border-slate-800 hover:bg-slate-800 hover:text-indigo-400' 
                  : 'text-slate-500 bg-slate-150 bg-slate-50 border-slate-200 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <Home className="w-3 h-3 group-hover:scale-110 transition-transform" /> Back to Welcome Menu
            </button>
            <span className={`text-[10px] uppercase tracking-widest hidden sm:inline ${isDark ? 'text-slate-800' : 'text-slate-300'}`}>|</span>
            <span className={`text-[10px] uppercase tracking-widest font-bold ${isDark ? 'text-indigo-400' : 'text-blue-500'}`}>
              Molecular Expression & Physics Simulator v1.2
            </span>
          </div>
          <h1 className={`text-3xl font-light tracking-tight transition-colors ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            {activeTab === 'periodic' ? (
              <>
                Periodic <span className={`${isDark ? 'text-indigo-400' : 'text-blue-505 text-blue-550'} font-serif italic`}>Table Registry</span>
              </>
            ) : activeTab === 'collision' ? (
              <>
                Nuclear <span className="text-rose-500 font-bold font-serif italic">Collision Sandbox</span>
              </>
            ) : viewType === 'atom' ? (
              <>
                {atom?.name || 'Atomic'} <span className={`${isDark ? 'text-indigo-400 font-bold' : 'text-blue-400 font-serif italic'}`}>Structure Lab</span>
              </>
            ) : (
              <>
                {molecule?.name || 'Molecular'} <span className={`${isDark ? 'text-indigo-400 font-bold' : 'text-blue-400 font-serif italic'}`}>Bonds Lab</span>
              </>
            )}
          </h1>
        </div>
        
        {/* Tab Selection Navigation Bar */}
        <nav 
          role="tablist" 
          aria-label="App Navigation Modules"
          className="flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm font-semibold tracking-wide mt-4 md:mt-0 pb-1"
        >
          <button
            id="nav-atoms-tab"
            role="tab"
            aria-selected={activeTab === 'atoms'}
            onClick={() => setActiveTab('atoms')}
            className={`cursor-pointer pb-2 transition-all focus:outline-hidden focus:ring-2 rounded px-1 flex items-center gap-1.5 ${
              activeTab === 'atoms'
                ? isDark
                  ? 'text-indigo-400 border-b-2 border-indigo-400 font-bold'
                  : 'text-blue-600 border-b-2 border-blue-600 font-bold'
                : 'text-slate-450 text-slate-400 hover:text-blue-500'
            }`}
          >
            <Atom className="w-4 h-4" />
            1. Elemental Atoms
          </button>

          <button
            id="nav-molecules-tab"
            role="tab"
            aria-selected={activeTab === 'molecules'}
            onClick={() => setActiveTab('molecules')}
            className={`cursor-pointer pb-2 transition-all focus:outline-hidden focus:ring-2 rounded px-1 flex items-center gap-1.5 ${
              activeTab === 'molecules'
                ? isDark
                  ? 'text-indigo-400 border-b-2 border-indigo-400 font-bold'
                  : 'text-blue-600 border-b-2 border-blue-600 font-bold'
                : 'text-slate-450 text-slate-400 hover:text-blue-500'
            }`}
          >
            <Layers className="w-4 h-4" />
            2. Complex Molecules
          </button>
          
          <button
            id="nav-periodic-tab"
            role="tab"
            aria-selected={activeTab === 'periodic'}
            onClick={() => setActiveTab('periodic')}
            className={`cursor-pointer pb-2 transition-all focus:outline-hidden focus:ring-2 rounded px-1 flex items-center gap-1.5 ${
              activeTab === 'periodic'
                ? isDark
                  ? 'text-indigo-400 border-b-2 border-indigo-400 font-bold'
                  : 'text-blue-600 border-b-2 border-blue-600 font-bold'
                : 'text-slate-450 text-slate-400 hover:text-blue-500'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            3. Periodic Registry
          </button>

          <button
            id="nav-collision-tab"
            role="tab"
            aria-selected={activeTab === 'collision'}
            onClick={() => {
              setActiveTab('collision');
              setCollisionMessage(null);
            }}
            className={`cursor-pointer pb-2 transition-all focus:outline-hidden focus:ring-2 rounded px-1 flex items-center gap-1.5 ${
              activeTab === 'collision'
                ? 'text-rose-500 border-b-2 border-rose-500 font-bold'
                : 'text-slate-450 text-slate-400 hover:text-red-400 font-medium'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            4. Collision Sandbox
          </button>

          <button
            id="nav-reset"
            onClick={handleReset}
            aria-label="Reset simulation values"
            className="cursor-pointer text-slate-40s text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 focus:outline-hidden focus:ring-2 rounded px-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>

          {/* Dynamic Light/Dark switch buttons */}
          <div className={`p-0.5 rounded-lg border flex items-center gap-0.5 transition-colors ${
            isDark ? 'border-slate-800 bg-slate-900/65' : 'border-slate-205 bg-slate-100'
          }`}>
            <button
              id="theme-light-btn"
              onClick={() => setTheme('light')}
              title="Light Mode (Scientific)"
              className={`px-2 py-1 rounded-md text-[11px] uppercase tracking-wider font-mono cursor-pointer transition-all ${
                theme === 'light'
                  ? 'bg-white text-blue-650 text-blue-600 shadow-3xs font-bold font-mono'
                  : 'text-slate-400 hover:text-slate-600 font-mono'
              }`}
            >
              ☀️ Light
            </button>
            <button
              id="theme-dark-btn"
              onClick={() => setTheme('dark')}
              title="Dark Mode (Simulation)"
              className={`px-2 py-1 rounded-md text-[11px] uppercase tracking-wider font-mono cursor-pointer transition-all ${
                theme === 'dark'
                  ? 'bg-slate-800 text-indigo-400 shadow-3xs font-bold font-mono'
                  : 'text-slate-450 text-slate-400 hover:text-slate-350 font-mono'
              }`}
            >
              🌌 Dark
            </button>
          </div>
        </nav>
      </header>

      {/* Main Sandbox Interactive Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:py-8 flex flex-col gap-6 md:gap-8">
        
        {activeTab === 'periodic' ? (
          <ElementPeriodicMenu
            onLoadIntoSandbox={(symbol) => {
              setSelectedAtomId(symbol);
              setActiveTab('atoms');
            }}
            activeSandboxSymbol={selectedId}
          />
        ) : activeTab === 'collision' ? (
          <>
            {/* COLLISION MODE DUAL LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
              
              {/* Column 1: Joint Control Panel */}
              <section className="lg:col-span-4 flex flex-col gap-6 order-2 lg:order-1">
                <div className={`p-5 md:p-6 rounded-2xl border transition-all ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
                }`}>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-red-500 animate-pulse" />
                    <div>
                      <h2 className={`text-sm font-bold font-mono uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        Quantum Collision Beam Controls
                      </h2>
                      <p className="text-[10px] text-slate-400 font-mono">NUCLEAR FUSION sandbox</p>
                    </div>
                  </div>

                  {/* Element A Selector */}
                  <div className="mb-4">
                    <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-slate-400 block mb-2">
                      ⚛️ Bullet Isotope (Element A)
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { symbol: 'H', name: 'Hydrogen' },
                        { symbol: 'He', name: 'Helium' },
                        { symbol: 'Li', name: 'Lithium' },
                        { symbol: 'Be', name: 'Beryllium' },
                        { symbol: 'B', name: 'Boron' },
                        { symbol: 'C', name: 'Carbon' },
                        { symbol: 'N', name: 'Nitrogen' },
                        { symbol: 'O', name: 'Oxygen' },
                      ].map((item) => (
                        <button
                          key={item.symbol}
                          id={`col-A-sel-${item.symbol}`}
                          onClick={() => {
                            setCollisionElementA(item.symbol);
                            setCollisionMessage(null);
                          }}
                          className={`p-2 rounded-xl text-xs font-bold font-mono border text-center transition-all cursor-pointer ${
                            collisionElementA === item.symbol
                              ? isDark
                                ? 'bg-indigo-950/40 border-indigo-505 border-indigo-500 text-indigo-300 ring-2 ring-indigo-900/45'
                                : 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-50'
                              : isDark ? 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-705 text-slate-400 hover:text-slate-200' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {item.symbol}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Element B Selector */}
                  <div className="mb-4">
                    <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-slate-400 block mb-2">
                      🎯 Target Isotope (Element B)
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { symbol: 'H', name: 'Hydrogen' },
                        { symbol: 'He', name: 'Helium' },
                        { symbol: 'Li', name: 'Lithium' },
                        { symbol: 'Be', name: 'Beryllium' },
                        { symbol: 'B', name: 'Boron' },
                        { symbol: 'C', name: 'Carbon' },
                        { symbol: 'N', name: 'Nitrogen' },
                        { symbol: 'O', name: 'Oxygen' },
                      ].map((item) => (
                        <button
                          key={item.symbol}
                          id={`col-B-sel-${item.symbol}`}
                          onClick={() => {
                            setCollisionElementB(item.symbol);
                            setCollisionMessage(null);
                          }}
                          className={`p-2 rounded-xl text-xs font-bold font-mono border text-center transition-all cursor-pointer ${
                            collisionElementB === item.symbol
                              ? isDark
                                ? 'bg-emerald-950/40 border-emerald-505 border-emerald-500 text-emerald-300 ring-2 ring-emerald-900/45'
                                : 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-50'
                              : isDark ? 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-705 text-slate-400 hover:text-slate-200' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {item.symbol}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Collision Speed Multiplier */}
                  <div className="mb-6">
                    <div className="flex justify-between text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                      <span>Beam Velocity / Kinetic Energy</span>
                      <span className={isDark ? 'text-indigo-400 font-bold font-mono' : 'text-blue-600 font-bold font-mono'}>{collisionSpeed.toFixed(1)}x Speed</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="3.0"
                      step="0.1"
                      value={collisionSpeed}
                      onChange={(e) => setCollisionSpeed(parseFloat(e.target.value))}
                      className="w-full accent-indigo-550 accent-indigo-500 h-1.5 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
                      <span>0.5x (Sub-Barrier)</span>
                      <span>1.5x (Resonant)</span>
                      <span>3.0x (Hyperthermal)</span>
                    </div>
                  </div>

                  {/* Trigger Collision Button */}
                  <button
                    onClick={() => {
                      setCollisionTriggerId(p => p + 1);
                      setCollisionMessage(null);
                    }}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white text-xs font-mono uppercase font-bold tracking-widest rounded-xl transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                  >
                    💥 Fire Collision Particle Beams
                  </button>
                </div>

                {/* Nuclear chemistry guide */}
                <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                  <h4 className={`text-xs font-bold uppercase font-mono tracking-wider mb-2 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Nuclear Chemistry Guide</h4>
                  <ul className="text-[11px] text-slate-400 leading-relaxed font-sans list-disc list-inside flex flex-col gap-2">
                    <li>Collisions fuse nuclei to evaluate resulting nuclear weights and core states.</li>
                    <li>Sufficient kinetic threshold velocity overrides central electrostatic Coulomb barrier forces.</li>
                    <li>Low thermal orbits lead to deflection particle dispersion states.</li>
                  </ul>
                </div>
              </section>

              {/* Column 2: 3D Canvas */}
              <section className="lg:col-span-5 flex flex-col gap-4 order-1 lg:order-2">
                <div className={`rounded-2xl p-3 border shadow-xs flex flex-col gap-2 relative ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
                }`}>
                  <div className={`px-2 pt-1 pb-1.5 flex items-center justify-between border-b ${
                    isDark ? 'border-slate-800' : 'border-slate-50'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                        High-Energy Fusion Stage
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      Beams: ON // ACTIVE
                    </span>
                  </div>

                  {/* High Fidelity Interactive Canvas */}
                  <div className="h-[340px] md:h-[480px] w-full relative">
                    <ParticleCanvas
                      viewType="atom"
                      selectedId="H"
                      params={params}
                      isExcited={false}
                      onExcitedEnd={() => {}}
                      onSelectSubatomic={setSelectedSubatomic}
                      theme={theme}
                      collisionMode={true}
                      collisionElementA={collisionElementA}
                      collisionElementB={collisionElementB}
                      collisionSpeed={collisionSpeed}
                      collisionTriggerId={collisionTriggerId}
                      onCollisionMessage={(msg) => setCollisionMessage(msg)}
                    />
                  </div>

                  {/* Legend Indicators */}
                  <div className="px-2 py-1 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500" /> Sym A Protons
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> Sym B Protons
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-400" /> Neutrons
                      </span>
                    </div>
                    <span>*High Energy Reactor</span>
                  </div>
                </div>
              </section>

              {/* Column 3: Collision Quantum Log Diagnostics */}
              <section className="lg:col-span-3 flex flex-col gap-6 order-3">
                <div className={`rounded-2xl p-5 md:p-6 border flex flex-col gap-4 ${
                  isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-100 text-slate-800 shadow-sm'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold font-mono rounded-full border mb-2 ${
                        isDark ? 'text-rose-400 bg-rose-950/20 border-rose-900/40' : 'text-rose-600 bg-rose-50 border-rose-100'
                      }`}>
                        Collision Metrics
                      </span>
                      <h3 className="text-lg font-bold font-mono uppercase tracking-tight">Quantum Logs</h3>
                    </div>
                  </div>

                  {/* Terminal Screen details */}
                  <div className={`rounded-xl p-3.5 border font-mono text-[10.5px] leading-relaxed select-all ${
                    isDark ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <p className="text-slate-400 mb-2">// DETECTOR TELEMETRY STREAM</p>
                    <p className="mb-1"><span className="text-slate-400">STATE:</span> <span className="text-blue-400 tracking-widest font-bold">READY</span></p>
                    <p className="mb-1"><span className="text-slate-400">ISOTOPE A:</span> <span className="text-indigo-400 font-bold">{collisionElementA} Core</span></p>
                    <p className="mb-1"><span className="text-slate-400">ISOTOPE B:</span> <span className="text-emerald-400 font-bold">{collisionElementB} Core</span></p>
                    <p><span className="text-slate-400">ENERGY BARRIER:</span> <span className="text-amber-400 font-bold">{(collisionSpeed * 13.6).toFixed(2)} MeV</span></p>
                  </div>

                  {/* Live Reaction Status Result Panel */}
                  <div className={`rounded-xl p-4 border flex flex-col gap-2 relative transition-all ${
                    isDark ? 'bg-indigo-950/20 border-indigo-900/40 text-indigo-200' : 'bg-rose-50/50 border-rose-100 text-slate-800'
                  }`}>
                    <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-500">// Fusion Evaluator Output</p>
                    {collisionMessage ? (
                      <p className="text-xs leading-relaxed font-sans font-medium">{collisionMessage}</p>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-5 text-center text-slate-400 select-none">
                        <Sparkles className="w-7 h-7 animate-bounce text-slate-400 mb-2 opacity-60" />
                        <span className="text-[10.5px] font-mono leading-relaxed">Particle beams pre-aligned. Trigger the fusion shockwave on the left control panel to visualize!</span>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </>
        ) : (
          <>
            {/* Animated Banner detailing physical reaction effect */}
            {params.electronMass !== 1.0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                id="reaction-alert"
                className={`p-3.5 border rounded-xl flex items-center gap-2.5 text-xs font-medium shadow-3xs ${
                  isDark ? 'bg-indigo-950/30 border-indigo-900/40 text-indigo-300' : 'bg-blue-50/60 border-blue-105 text-blue-700'
                }`}
              >
                <Compass className={`w-4 h-4 shrink-0 ${isDark ? 'text-indigo-400' : 'text-blue-505 text-blue-500'}`} />
                <span>
                  <strong>Relativity Shift Detected:</strong> You have adjusted the Electron Mass to <span className="underline">{params.electronMass.toFixed(2)}x</span>. The Bohr radius and angular momentum are dynamically adapting. Orbits have {params.electronMass > 1.0 ? 'compressed' : 'expanded'} in real-time.
                </span>
              </motion.div>
            )}

            {/* Triple Grid Panel Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Column 1: Control Panel (35% width equivalent) */}
              <section className="lg:col-span-4 flex flex-col gap-6 order-2 lg:order-1">
                <ControlPanel
                  viewType={viewType}
                  setViewType={(type) => {
                    if (type === 'atom') {
                      setActiveTab('atoms');
                    } else {
                      setActiveTab('molecules');
                    }
                  }}
                  selectedId={selectedId}
                  setSelectedId={setSelectedId}
                  params={params}
                  setParams={setParams}
                  onExcitate={handleExcitate}
                  onReset={handleReset}
                />
              </section>

              {/* Column 2: 3D Canvas Visualizer (45% width equivalent) */}
              <section className="lg:col-span-5 flex flex-col gap-4 order-1 lg:order-2">
                <div className={`rounded-2xl p-3 border shadow-xs flex flex-col gap-2 relative ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                }`}>
                  
                  {/* Status Header for Visualizer */}
                  <div className={`px-2 pt-1 pb-1.5 flex items-center justify-between border-b ${
                    isDark ? 'border-slate-800' : 'border-slate-50'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        3D Particle Field Simulation
                      </span>
                    </div>
                    <span className={`text-[10px] font-mono border px-2 py-0.5 rounded ${
                      isDark ? 'text-slate-400 bg-slate-950 border-slate-805 border-slate-800' : 'text-slate-400 bg-slate-50 border-slate-100'
                    }`}>
                      FPS: 60/60 · Buffer: OK
                    </span>
                  </div>

                  {/* The high-fidelity Interactive Canvas */}
                  <div className="h-[340px] md:h-[480px] w-full relative">
                    <ParticleCanvas
                      viewType={viewType}
                      selectedId={selectedId}
                      params={params}
                      isExcited={isExcited}
                      onExcitedEnd={handleExcitedEnd}
                      onSelectSubatomic={setSelectedSubatomic}
                      theme={theme}
                    />

                    {/* Excitation Flash Indicator Overlay */}
                    <AnimatePresence>
                      {isExcited && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 pointer-events-none rounded-2xl border-4 border-indigo-500/30 flex items-center justify-center bg-indigo-50/5 animate-pulse"
                        >
                          <span className="px-4 py-2 bg-indigo-600/90 text-white font-mono font-bold text-xs tracking-widest rounded-full shadow-lg flex items-center gap-2">
                            <Sparkles className="w-4 h-4 animate-bounce" />
                            LASER ENERGY EXCITED STATE
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Legend Indicator footer */}
                  <div className="px-2 py-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500" /> Proton (+)
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-slate-400" /> Neutron (0)
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-indigo-600" /> Electron (e-)
                      </span>
                    </div>
                    <span>*Click canvas items to probe</span>
                  </div>

                </div>
              </section>

              {/* Column 3: Chemical Property Info Card (20% width equivalent) */}
              <section className="lg:col-span-3 flex flex-col gap-6 order-3">
                <InfoCard
                  viewType={viewType}
                  selectedId={selectedId}
                  params={params}
                  selectedSubatomic={selectedSubatomic}
                  onClearSubatomic={() => setSelectedSubatomic(null)}
                  theme={theme}
                />
              </section>

            </div>

            {/* Dynamic Chemical & Subatomic Database Registry with filtered display */}
            <ElementDatabase
              currentView={viewType}
              onSelectPreset={(type, id) => {
                if (type === 'atom') {
                  setSelectedAtomId(id);
                  setActiveTab('atoms');
                } else {
                  setSelectedMoleculeId(id);
                  setActiveTab('molecules');
                }
              }}
              activeId={selectedId}
              typeFilter={activeTab === 'atoms' ? 'atom' : 'molecule'}
            />

            {/* Quick Informational Grid Section */}
            <div id="educational-legend-rail" className={`grid grid-cols-1 md:grid-cols-3 gap-6 rounded-2xl p-5 border shadow-3xs mt-2 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
            }`}>
              <div className="flex gap-3">
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold font-mono shrink-0 ${
                  isDark ? 'bg-indigo-950/30 border-indigo-900/40 text-blue-400' : 'bg-blue-50 border-blue-105 text-blue-600'
                }`}>
                  p⁺
                </div>
                <div>
                  <h4 className={`text-xs font-bold uppercase font-mono tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>The Proton</h4>
                  <p className="text-[11.5px] text-slate-400 leading-relaxed mt-1">
                    Subatomic particle residing securely in the central nucleus with a positive electrostatic charge. Determines atomic identity.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold font-mono shrink-0 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
                }`}>
                  n⁰
                </div>
                <div>
                  <h4 className={`text-xs font-bold uppercase font-mono tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>The Neutron</h4>
                  <p className="text-[11.5px] text-slate-400 leading-relaxed mt-1">
                    Subatomic sister particle that acts as physical chemical stabilizer, keeping Protons from pushing each other out via nuclear forces.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold font-mono shrink-0 ${
                  isDark ? 'bg-indigo-950/30 border-indigo-900/40 text-indigo-400' : 'bg-indigo-50 border-indigo-150 text-indigo-500'
                }`}>
                  e⁻
                </div>
                <div>
                  <h4 className={`text-xs font-bold uppercase font-mono tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>The Electron</h4>
                  <p className="text-[11.5px] text-slate-400 leading-relaxed mt-1">
                    Extremely lightweight fundamental particle orbiting in spherical probability clouds, keeping structural charge balance.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

      </main>

      {/* Bottom Data Rail in Artistic Flair specifications */}
      <footer className={`w-full py-5 flex flex-col md:flex-row items-center px-8 justify-between gap-4 mt-8 border-t transition-colors ${
        isDark ? 'bg-slate-950 border-slate-900 text-slate-400' : 'bg-slate-50 border-blue-50 text-slate-600'
      }`}>
        <div className="flex-1 flex flex-wrap gap-6 md:gap-11 justify-center md:justify-start">
          <div className="flex gap-2.5 items-center">
            <span className={`w-2 h-2 rounded-full ${stability > 75 ? 'bg-blue-500' : stability > 45 ? 'bg-amber-400' : 'bg-red-500 animate-ping'}`} />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Simulation Stability: <span className={`font-mono font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{stability}%</span>
            </span>
          </div>
          <div className="flex gap-2.5 items-center">
            <span className="w-2 h-2 bg-blue-300 rounded-full" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Decay Rate Shift: <span className={`font-mono font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{decayRate}</span>
            </span>
          </div>
          <div className="flex gap-2.5 items-center">
            <span className="w-2 h-2 bg-blue-600 rounded-full" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              System Charge: <span className={`font-mono font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{chargeState}</span>
            </span>
          </div>
        </div>
        <div className={`text-[10px] font-mono select-all ${isDark ? 'text-slate-605 text-slate-500' : 'text-slate-405 text-slate-400'}`}>
          COORD_REF: 42.112.0019 // REALTIME_RENDER_ACTIVE_60FPS
        </div>
      </footer>   </div>
  );
}
