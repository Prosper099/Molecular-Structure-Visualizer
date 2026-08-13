/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ATOM_PRESETS, MOLECULE_PRESETS, getAtomPresetById } from '../data/elements';
import { SimulationParams } from '../types';
import { Sparkles, Eye, Orbit, Maximize2, RotateCcw, ShieldAlert, Cpu } from 'lucide-react';

interface ControlPanelProps {
  viewType: 'atom' | 'molecule';
  setViewType: (val: 'atom' | 'molecule') => void;
  selectedId: string;
  setSelectedId: (id: string) => void;
  params: SimulationParams;
  setParams: (p: SimulationParams | ((prev: SimulationParams) => SimulationParams)) => void;
  onExcitate: () => void;
  onReset: () => void;
}

export default function ControlPanel({
  viewType,
  setViewType,
  selectedId,
  setSelectedId,
  params,
  setParams,
  onExcitate,
  onReset,
}: ControlPanelProps) {

  const updateParam = (key: keyof SimulationParams, value: any) => {
    setParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const selectedAtom = viewType === 'atom' ? getAtomPresetById(selectedId) : null;
  const selectedMolecule = viewType === 'molecule' ? MOLECULE_PRESETS.find(m => m.id === selectedId) : null;

  return (
    <div id="control-panel-container" className="bg-white/90 backdrop-blur-md rounded-2xl p-5 md:p-6 border border-blue-50/70 shadow-xs flex flex-col gap-6">
      
      {/* Category Toggle (Atoms vs Molecules) */}
      <div id="category-selector" className="grid grid-cols-2 gap-2 p-1 bg-slate-50 border border-slate-100 rounded-xl">
        <button
          id="btn-select-atoms"
          onClick={() => {
            setViewType('atom');
            setSelectedId(ATOM_PRESETS[0].symbol);
          }}
          className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            viewType === 'atom'
              ? 'bg-white text-blue-600 shadow-3xs'
              : 'text-slate-400 hover:text-slate-750'
          }`}
        >
          Simple Atoms
        </button>
        <button
          id="btn-select-molecules"
          onClick={() => {
            setViewType('molecule');
            setSelectedId(MOLECULE_PRESETS[0].id);
          }}
          className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            viewType === 'molecule'
              ? 'bg-white text-blue-600 shadow-3xs'
              : 'text-slate-400 hover:text-slate-750'
          }`}
        >
          Complex Molecules
        </button>
      </div>

      {/* Preset Elements Grid */}
      <div id="presets-list-section">
        <label className="text-[11px] font-bold font-mono text-slate-400 uppercase tracking-widest block mb-3">
          Select {viewType === 'atom' ? 'Atomic Preset' : 'Molecular Preset'}
        </label>
        
        {viewType === 'atom' ? (
          <div id="atoms-grid" className="grid grid-cols-5 gap-2">
            {ATOM_PRESETS.map((atom) => {
              const active = selectedId === atom.symbol;
              return (
                <button
                  key={atom.symbol}
                  id={`preset-atom-${atom.symbol}`}
                  onClick={() => setSelectedId(atom.symbol)}
                  className={`relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                    active
                      ? 'bg-blue-50/50 border-blue-400 text-blue-700 shadow-3xs ring-2 ring-blue-50'
                      : 'bg-white border-slate-100 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <span className="text-[9px] font-mono text-slate-400 font-bold absolute top-1 left-1.5 leading-none">
                    {atom.protons}
                  </span>
                  
                  {/* Small round dot at the top right as requested in the design layout */}
                  <span className={`w-1.5 h-1.5 rounded-full absolute top-1 right-1.5 ${active ? 'bg-blue-500 animate-pulse' : 'bg-slate-200'}`} />

                  <span className="text-lg font-bold tracking-tight leading-none mt-2.5">{atom.symbol}</span>
                  <span className="text-[9px] text-slate-400 mt-1 block truncate w-full text-center">
                    {atom.name}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div id="molecules-grid" className="grid grid-cols-2 gap-2">
            {MOLECULE_PRESETS.map((m) => {
              const active = selectedId === m.id;
              return (
                <button
                  key={m.id}
                  id={`preset-molecule-${m.id}`}
                  onClick={() => setSelectedId(m.id)}
                  className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left cursor-pointer relative ${
                    active
                      ? 'bg-blue-50/50 border-blue-400 text-blue-800 shadow-3xs ring-2 ring-blue-50'
                      : 'bg-white border-slate-100 hover:border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-blue-500 animate-pulse' : 'bg-slate-200'}`} />
                    <span className="text-xs font-mono font-bold text-blue-600 leading-none">
                      {m.formula}
                    </span>
                  </div>
                  <span className="text-[13px] font-semibold text-slate-800">{m.name}</span>
                  <span className="text-[9px] text-slate-400 mt-1 truncate block w-full">{m.bondingType}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <hr className="border-slate-150 my-1" />

      {/* Physics Engine Property Editors */}
      <div id="physics-controls-section" className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold font-mono text-slate-400 uppercase tracking-wider block">
            Quantum Mechanics Parameters
          </label>
          <button
            id="btn-reset-params"
            onClick={onReset}
            className="flex items-center gap-1 text-[11px] font-mono text-slate-500 hover:text-blue-600 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Restore Defaults
          </button>
        </div>

        {/* ELECTRON MASS SLIDER */}
        <div id="slider-electron-mass" className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-medium text-slate-700">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-500" />
              Electron Rest Mass (mₑ)
            </span>
            <span className="font-mono text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
              {params.electronMass.toFixed(2)}x
            </span>
          </div>
          <input
            id="input-electron-mass-slider"
            type="range"
            min="0.10"
            max="5.00"
            step="0.05"
            value={params.electronMass}
            onChange={(e) => updateParam('electronMass', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          {/* Reaction Explanatory Note below */}
          <span className="text-[10px] font-mono leading-relaxed text-slate-400 mt-0.5">
            {params.electronMass < 0.7 ? (
              <span className="text-teal-600">✦ Light cloud spreads: Waves expand outward, speeds intensify.</span>
            ) : params.electronMass > 1.3 ? (
              <span className="text-indigo-600 animate-pulse">▼ Heavy collapse: Muon-like state compiles energy tightly around nuclei.</span>
            ) : (
              <span>Standard electron weight: Grounded physical atomic radii structure.</span>
            )}
          </span>
        </div>

        {/* SPEED COEFFICIENT SLIDER */}
        <div id="slider-speed" className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-medium text-slate-700">
            <span className="flex items-center gap-1.5">
              <Orbit className="w-3.5 h-3.5 text-blue-500" />
              Kinetic Energy Speed
            </span>
            <span className="font-mono text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
              {params.speedMultiplier.toFixed(2)}x
            </span>
          </div>
          <input
            id="input-speed-slider"
            type="range"
            min="0.00"
            max="3.00"
            step="0.10"
            value={params.speedMultiplier}
            onChange={(e) => updateParam('speedMultiplier', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <span className="text-[10px] font-mono text-slate-400">
            {params.speedMultiplier === 0 ? (
              <span className="text-red-500 font-bold">Absolute zero (0 Kelvin) has frozen subatomic particles.</span>
            ) : params.speedMultiplier > 2.0 ? (
              <span className="text-blue-600 font-bold">Thrashing particles in extreme thermal heating simulation.</span>
            ) : (
              <span>Controls relative velocity of structural shells.</span>
            )}
          </span>
        </div>

        {/* NUCLEAR CHARGE SLIDER */}
        <div id="slider-nucleus-charge" className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-medium text-slate-700">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-500" />
              Electrostatic Core Charge (Ze)
            </span>
            <span className="font-mono text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
              {params.nucleusCharge.toFixed(2)}x
            </span>
          </div>
          <input
            id="input-nucleus-charge"
            type="range"
            min="0.50"
            max="2.50"
            step="0.05"
            value={params.nucleusCharge}
            onChange={(e) => updateParam('nucleusCharge', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <span className="text-[10px] font-mono text-slate-400">
            {params.nucleusCharge > 1.5 ? (
              <span>Strong gravitational electro-pull compressing electron shells.</span>
            ) : params.nucleusCharge < 0.8 ? (
              <span>Weak magnetic pull; outer shells drift towards ionization boundaries.</span>
            ) : (
              <span>Standard nuclear electrostatic pull values.</span>
            )}
          </span>
        </div>

        {/* CAMERA ZOOM */}
        <div id="slider-zoom" className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-medium text-slate-700">
            <span className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-blue-500" />
              Visual Stage Magnification
            </span>
            <span className="font-mono text-slate-500 font-bold">
              {params.scale.toFixed(1)}x
            </span>
          </div>
          <input
            id="input-zoom-slider"
            type="range"
            min="0.6"
            max="2.2"
            step="0.1"
            value={params.scale}
            onChange={(e) => updateParam('scale', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      <hr className="border-slate-150 my-1" />

      {/* Rendering and Style Filters */}
      <div id="style-filters-section" className="flex flex-col gap-3.5">
        <label className="text-[11px] font-bold font-mono text-slate-400 uppercase tracking-wider block">
          Orbital Style & Aesthetics
        </label>

        {/* Orbital Representation Buttons */}
        <div id="orbital-style-button-group" className="grid grid-cols-3 gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-100">
          <button
            id="orbital-style-bohr"
            onClick={() => updateParam('orbitalStyle', 'bohr')}
            className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
              params.orbitalStyle === 'bohr'
                ? 'bg-white text-blue-600 shadow-xs border border-slate-100'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Bohr Path
          </button>
          <button
            id="orbital-style-wave"
            onClick={() => updateParam('orbitalStyle', 'wave')}
            className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
              params.orbitalStyle === 'wave'
                ? 'bg-white text-blue-600 shadow-xs border border-slate-100'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Wave Cloud
          </button>
          <button
            id="orbital-style-shell"
            onClick={() => updateParam('orbitalStyle', 'shell')}
            className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
              params.orbitalStyle === 'shell'
                ? 'bg-white text-blue-600 shadow-xs border border-slate-100'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Density Ring
          </button>
        </div>

        {/* Secondary Switches */}
        <div id="toggles-group" className="flex flex-col gap-2.5">
          <label className="flex items-center justify-between text-xs text-slate-600 cursor-pointer select-none">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              Draw Particle Motion Trails
            </span>
            <input
              id="toggle-show-trails"
              type="checkbox"
              checked={params.showTrails}
              onChange={(e) => updateParam('showTrails', e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 border-slate-200 accent-blue-600 focus:ring-0 focus:ring-offset-0"
            />
          </label>

          <label className="flex items-center justify-between text-xs text-slate-600 cursor-pointer select-none">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              Show Core Neural Grid Lines
            </span>
            <input
              id="toggle-grid-lines"
              type="checkbox"
              checked={params.gridLines}
              onChange={(e) => updateParam('gridLines', e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 border-slate-200 accent-blue-600 focus:ring-0 focus:ring-offset-0"
            />
          </label>
        </div>
      </div>

      {/* Energy excitation button */}
      <button
        id="btn-excitation-strike"
        onClick={onExcitate}
        className="w-full bg-blue-600 text-white py-4 px-4 rounded-xl text-xs font-bold tracking-widest uppercase shadow-md shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
      >
        <Sparkles className="w-4 h-4" />
        Inject Energy Blast (ΔE Laser Impulse)
      </button>

      <span className="text-[9.5px] text-center text-slate-400 leading-normal block -mt-1 font-mono">
        Laser pulse momentarily drives electrons to excited outer shell radii.
      </span>

    </div>
  );
}
