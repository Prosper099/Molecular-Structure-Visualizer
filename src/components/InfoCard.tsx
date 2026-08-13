/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ATOM_PRESETS, MOLECULE_PRESETS, getAtomPresetById } from '../data/elements';
import { SimulationParams } from '../types';
import { BookOpen, Info, Hash, Award, HelpCircle, Activity } from 'lucide-react';

interface InfoCardProps {
  viewType: 'atom' | 'molecule';
  selectedId: string;
  params: SimulationParams;
  selectedSubatomic: { name: string; details: string; color: string } | null;
  onClearSubatomic: () => void;
  theme?: 'light' | 'dark';
}

export default function InfoCard({
  viewType,
  selectedId,
  params,
  selectedSubatomic,
  onClearSubatomic,
  theme = 'light',
}: InfoCardProps) {
  
  const atom = viewType === 'atom' ? getAtomPresetById(selectedId) : null;
  const molecule = viewType === 'molecule' ? MOLECULE_PRESETS.find((m) => m.id === selectedId) : null;

  const isDark = theme === 'dark';

  // Compute actual physical Bohr radius based on electron mass parameter
  // Bohr Radius formula in picometers (pm): a_0 = 52.9 pm / m_e
  const baseBohrRadius = 52.92;
  const simulatedBohrRadius = baseBohrRadius / params.electronMass;

  // Kinetic energy scaling (T ∝ v^2 ∝ 1/m)
  const kineticEnergyPct = (3 / params.electronMass).toFixed(1);

  return (
    <div
      id="info-card-container"
      className={`rounded-2xl p-5 md:p-6 border transition-all duration-200 flex flex-col gap-6 ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-xl' : 'bg-white border-slate-100 text-slate-800 shadow-sm'
      }`}
    >
      
      {/* Selected Element/Molecule Header */}
      <div id="inspector-header" className="flex items-start justify-between">
        <div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold font-mono border rounded-full mb-2 ${
            isDark ? 'text-indigo-400 bg-indigo-950/40 border-indigo-900/30' : 'text-indigo-600 bg-indigo-50 border-indigo-100'
          }`}>
            {viewType === 'atom' ? 'Atomic Element' : 'Molecular Bond Group'}
          </span>
          <h2 className={`text-2xl font-bold tracking-tight flex items-baseline gap-2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            {viewType === 'atom' ? atom?.name : molecule?.name}
            <span className={`text-lg font-mono font-bold ${isDark ? 'text-indigo-400' : 'text-blue-500'}`}>
              ({viewType === 'atom' ? atom?.symbol : molecule?.formula})
            </span>
          </h2>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">
            {viewType === 'atom' ? `Periodic Category: ${atom?.category}` : `Bonding Classification: ${molecule?.bondingType}`}
          </p>
        </div>
        
        {/* Large high-contrast symbol visual representation */}
        <div className={`w-14 h-14 rounded-xl border flex items-center justify-center font-bold text-lg font-mono ${
          isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-700 shadow-2xs'
        }`}>
          {viewType === 'atom' ? atom?.symbol : molecule?.formula}
        </div>
      </div>

      {/* Description */}
      <div id="inspector-desc" className={`text-xs leading-relaxed p-3.5 rounded-xl border ${
        isDark ? 'bg-slate-950 border-slate-850 text-slate-355 text-slate-300' : 'bg-slate-50/50 border-slate-100 text-slate-600'
      }`}>
        {viewType === 'atom' ? atom?.description : molecule?.description}
      </div>

      {/* Real-Time Quantum Math Inspector */}
      <div id="quantum-math-inspector" className={`border rounded-xl p-4 flex flex-col gap-3 ${
        isDark ? 'bg-indigo-950/20 border-indigo-900/30' : 'bg-blue-50/40 border-blue-100'
      }`}>
        <div className={`flex items-center gap-1.5 text-xs font-bold ${isDark ? 'text-indigo-300' : 'text-blue-700'}`}>
          <Activity className={`w-3.5 h-3.5 ${isDark ? 'text-indigo-400' : 'text-blue-500'}`} />
          Real-Time Quantum Mechanical Equations
        </div>

        {/* The Bohr Radius Equation showing Live Values */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[10px] font-mono text-slate-400 leading-normal">
            Bohr Atomic Radius Equation with variable electron mass (<span className={isDark ? 'text-indigo-300 font-semibold' : 'text-blue-600 font-semibold'}>mₑ</span>):
          </p>
          <div className={`border rounded-lg p-2.5 text-center font-mono select-all shadow-3xs ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-white/80 border-blue-50 text-slate-700'
          }`}>
            <div className={`text-xs font-bold md:text-sm ${isDark ? 'text-indigo-300' : 'text-blue-800'}`}>
              a₀ = <span className="underline">ℏ²</span> = <span className="underline">52.92 pm</span>
              <br className="sm:hidden" />
              <span className="mx-2">÷</span> (<span className={isDark ? 'text-indigo-400 font-bold' : 'text-blue-600 font-bold'}>{params.electronMass.toFixed(2)}mₑ</span> · e²)
            </div>
            {/* Live evaluation */}
            <div className={`text-[10.5px] font-bold mt-1.5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
              ⇒ Effective Bohr Radius a₀ ≈ {simulatedBohrRadius.toFixed(2)} pm
            </div>
          </div>
        </div>

        {/* Quantum energy comment */}
        <div className="grid grid-cols-2 gap-3 text-center mt-0.5">
          <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-white/50 border-blue-50/50'}`}>
            <span className="text-[9px] font-semibold text-slate-400 font-mono block uppercase">Orbital Compression</span>
            <span className={`text-xs font-bold font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{(100 / params.electronMass).toFixed(0)}% radius</span>
          </div>
          <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-white/50 border-blue-50/50'}`}>
            <span className="text-[9px] font-semibold text-slate-400 font-mono block uppercase">Kinetic Wave Speed</span>
            <span className={`text-xs font-bold font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>+{kineticEnergyPct}% energy</span>
          </div>
        </div>
      </div>

      {/* Interactive subatomic click inspector */}
      {selectedSubatomic ? (
        <div id="subatomic-inspector-panel" className={`relative border rounded-xl p-4 flex flex-col gap-2 transition-all ${
          isDark ? 'border-indigo-900/40 bg-indigo-950/20' : 'border-indigo-100 bg-indigo-50/30'
        }`}>
          <span className={`absolute top-2 right-2 px-1.5 py-0.5 text-[8.5px] font-bold rounded-md ${
            isDark ? 'text-indigo-300 bg-indigo-950' : 'text-indigo-500 bg-indigo-100'
          }`}>
            Live Probe
          </span>
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${selectedSubatomic.color}`} />
            <h3 className={`text-xs font-bold uppercase font-mono ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{selectedSubatomic.name}</h3>
          </div>
          <p className={`text-xs leading-relaxed font-sans ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {selectedSubatomic.details}
          </p>
          <button
            id="btn-close-probe"
            onClick={onClearSubatomic}
            className={`text-left text-[10px] font-medium font-mono underline mt-1.5 cursor-pointer ${
              isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-blue-600 hover:text-blue-850 hover:text-blue-800'
            }`}
          >
            Clear Selected Probe
          </button>
        </div>
      ) : (
        <div id="subatomic-empty-prompt" className={`border border-dashed rounded-xl p-4 text-center ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <Info className="w-5 h-5 text-slate-400 opacity-60 mx-auto mb-2" />
          <p className="text-[11px] text-slate-400 font-medium">
            Click particles in the 3D visualizer to probe nucleonic spin alignments and electric charge levels.
          </p>
        </div>
      )}

      {/* Quick stats grid */}
      <div id="quick-stats-grid" className="grid grid-cols-3 gap-3">
        <div className={`border p-3 rounded-xl text-center ${
          isDark ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-100 shadow-2xs'
        }`}>
          <span className="flex items-center justify-center text-slate-400 mb-1">
            <Hash className="w-3.5 h-3.5" />
          </span>
          <span className={`text-xs font-bold block leading-none ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {viewType === 'atom' ? atom?.protons : atom?.protonsByShell?.reduce((a, b) => a + b, 0) || 'Multi'}
          </span>
          <span className="text-[9px] text-slate-400 font-mono uppercase mt-1 block">Protons</span>
        </div>
        <div className={`border p-3 rounded-xl text-center ${
          isDark ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-100 shadow-2xs'
        }`}>
          <span className="flex items-center justify-center text-slate-400 mb-1">
            <BookOpen className="w-3.5 h-3.5" />
          </span>
          <span className={`text-xs font-bold block leading-none ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {viewType === 'atom' ? atom?.neutrons : 'Varied'}
          </span>
          <span className="text-[9px] text-slate-400 font-mono uppercase mt-1 block">Neutrons</span>
        </div>
        <div className={`border p-3 rounded-xl text-center ${
          isDark ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-100 shadow-2xs'
        }`}>
          <span className="flex items-center justify-center text-slate-400 mb-1">
            <Award className="w-3.5 h-3.5" />
          </span>
          <span className={`text-xs font-bold block leading-none font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {viewType === 'atom' ? atom?.protons : 'Valence'}
          </span>
          <span className="text-[9px] text-slate-400 font-mono uppercase mt-1 block">Electrons</span>
        </div>
      </div>

      {/* Fun Fact Footer */}
      <div id="fun-fact-box" className={`border rounded-xl p-4 flex gap-3 ${
        isDark ? 'bg-emerald-950/20 border-emerald-900/30' : 'bg-emerald-50/50 border-emerald-150'
      }`}>
        <HelpCircle className={`w-5 h-5 shrink-0 mt-0.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
        <div>
          <h4 className={`text-[11px] font-bold uppercase font-mono tracking-wider ${isDark ? 'text-emerald-300' : 'text-emerald-800'}`}>
            Cosmological Fact Check
          </h4>
          <p className={`text-[11.5px] leading-relaxed mt-1 ${isDark ? 'text-slate-350' : 'text-slate-600'}`}>
            {viewType === 'atom' ? atom?.funFact : molecule?.funFact}
          </p>
        </div>
      </div>

    </div>
  );
}
