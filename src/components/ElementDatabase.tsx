/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { ATOM_PRESETS, MOLECULE_PRESETS, getAtomPresetById } from '../data/elements';
import { ALL_118_ELEMENTS } from '../data/periodicTable';
import { AtomPreset, MoleculePreset } from '../types';
import { 
  Search, 
  Database, 
  ArrowRight, 
  Flame, 
  Cpu, 
  Layers, 
  FileText, 
  Check, 
  Atom, 
  Sparkles, 
  Compass,
  Info
} from 'lucide-react';

interface ElementDatabaseProps {
  currentView: 'atom' | 'molecule';
  onSelectPreset: (type: 'atom' | 'molecule', id: string) => void;
  activeId: string;
  typeFilter?: 'atom' | 'molecule';
}

// Popular element symbols to display by default when search is empty
const POPULAR_ELEMENTS = ['H', 'He', 'Li', 'C', 'N', 'O', 'Ne', 'Na', 'Al', 'Cl', 'Fe', 'Cu', 'Au', 'U'];

export default function ElementDatabase({
  currentView,
  onSelectPreset,
  activeId,
  typeFilter,
}: ElementDatabaseProps) {
  // Separate search queries for the two registries
  const [atomSearch, setAtomSearch] = useState('');
  const [moleculeSearch, setMoleculeSearch] = useState('');

  // Default selection states for viewing details in each section
  const [selectedAtomSymbol, setSelectedAtomSymbol] = useState<string>(
    currentView === 'atom' ? activeId : 'C'
  );
  const [selectedMoleculeId, setSelectedMoleculeId] = useState<string>(
    currentView === 'molecule' ? activeId : 'H2O'
  );

  // Synchronize dynamic selections when active ID from parent changes
  useMemo(() => {
    if (currentView === 'atom') {
      setSelectedAtomSymbol(activeId);
    } else if (currentView === 'molecule') {
      setSelectedMoleculeId(activeId);
    }
  }, [activeId, currentView]);

  // Retrieve current active/inspected details
  const currentAtomDetails = useMemo(() => {
    return getAtomPresetById(selectedAtomSymbol);
  }, [selectedAtomSymbol]);

  const currentMoleculeDetails = useMemo(() => {
    return MOLECULE_PRESETS.find((m) => m.id === selectedMoleculeId) || MOLECULE_PRESETS[0];
  }, [selectedMoleculeId]);

  // Search logic for elements:
  // If search is empty, show curated common elements + curated ATOM_PRESETS.
  // If search contains text, search across ALL 118 periodic table elements!
  const filteredAtoms = useMemo(() => {
    const query = atomSearch.toLowerCase().trim();
    if (!query) {
      // Return custom set of interesting/curated elements plus standard presets
      const uniqueSymbols = Array.from(new Set([...ATOM_PRESETS.map(a => a.symbol), ...POPULAR_ELEMENTS]));
      return uniqueSymbols.map(sym => getAtomPresetById(sym));
    }

    // Otherwise, search on ALL 118 elements
    const matchesPoints = ALL_118_ELEMENTS.filter(
      elem =>
        elem.name.toLowerCase().includes(query) ||
        elem.symbol.toLowerCase().includes(query) ||
        elem.category.toLowerCase().includes(query)
    );

    return matchesPoints.map(elem => getAtomPresetById(elem.symbol));
  }, [atomSearch]);

  // Search logic for complex molecules
  const filteredMolecules = useMemo(() => {
    const query = moleculeSearch.toLowerCase().trim();
    if (!query) return MOLECULE_PRESETS;

    return MOLECULE_PRESETS.filter(
      m =>
        m.name.toLowerCase().includes(query) ||
        m.formula.toLowerCase().includes(query) ||
        m.bondingType.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query)
    );
  }, [moleculeSearch]);

  const renderAtoms = !typeFilter || typeFilter === 'atom';
  const renderMolecules = !typeFilter || typeFilter === 'molecule';

  return (
    <div
      id="separation-elements-molecules-root"
      className="flex flex-col gap-8 w-full border-t border-slate-100 pt-8"
    >
      {/* Dynamic Materials Banner */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            {typeFilter === 'atom' ? 'Elemental Atoms Directory' : typeFilter === 'molecule' ? 'Complex Molecules Directory' : 'Comprehensive Quantum & Chemical Library'}
          </h2>
          <p className="text-xs text-slate-400">
            {typeFilter === 'atom' 
              ? 'Probe and filter all 118 elements of the periodic table. View orbital shell counts, mass structures and details.' 
              : typeFilter === 'molecule' 
                ? 'Search and analyze spatial coordinate vectors, covalent rings, and intermolecular orbital bonding properties.' 
                : 'A parallel diagnostic suite. Inspect subatomic elements and molecular structures side-by-side with separate query registries.'}
          </p>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${typeFilter ? 'grid-cols-1' : 'lg:grid-cols-2'} gap-8`}>
        
        {/* =============== LEFT COLUMN: ATOMIC ELEMENTS REGISTRY =============== */}
        {renderAtoms && (
          <div 
            id="atom-registry-column"
            className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col gap-5 shadow-xs"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50/70 text-blue-600 flex items-center justify-center border border-blue-100/30">
                  <Atom className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">
                    Elemental Atoms Registry
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Search &amp; browse active elements list (118 Periodic elements)
                  </p>
                </div>
              </div>
              
              {/* Element Counter */}
              <span className="text-[10px] font-mono bg-blue-50 text-blue-600 border border-blue-100/30 px-2 py-0.5 rounded-full font-bold">
                Elements Loaded: {filteredAtoms.length}
              </span>
            </div>

          {/* Search Bar for Atoms only */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              id="atom-registry-search"
              type="text"
              placeholder="Search Element (e.g. Lithium, H, Noble, Au)..."
              value={atomSearch}
              onChange={(e) => setAtomSearch(e.target.value)}
              className="bg-slate-50 hover:bg-slate-50/80 focus:bg-white text-xs text-slate-700 pl-9 pr-4 py-2.5 w-full rounded-xl border border-slate-150 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-hidden transition-all font-sans"
            />
          </div>

          {/* Table list of elements */}
          <div className="overflow-y-auto max-h-[280px] rounded-xl border border-slate-100">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-100">
                <tr className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  <th className="py-2.5 px-3">Z (P⁺)</th>
                  <th className="py-2.5 px-3">Symbol</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Family</th>
                  <th className="py-2.5 px-3">Shells</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150/40">
                {filteredAtoms.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-400 font-mono text-[11px]">
                      No elements matching query found. Try searching for other symbols.
                    </td>
                  </tr>
                ) : (
                  filteredAtoms.map((elem) => {
                    const isInspected = selectedAtomSymbol === elem.symbol;
                    const isSimulated = currentView === 'atom' && activeId === elem.symbol;

                    return (
                      <tr
                        key={elem.symbol}
                        onClick={() => setSelectedAtomSymbol(elem.symbol)}
                        className={`hover:bg-blue-50/15 cursor-pointer transition-colors text-[11px] ${
                          isInspected ? 'bg-blue-50/30 text-blue-950 font-medium' : 'text-slate-600'
                        }`}
                      >
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-400">
                          {elem.protons}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-mono font-black text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200/50">
                            {elem.symbol}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">
                          {elem.name}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="inline-block text-[10px] px-2 py-0.5 bg-indigo-50/50 text-indigo-600 rounded-full border border-indigo-100/20 truncate max-w-[110px]">
                            {elem.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">
                          [{elem.protonsByShell.join(', ')}]
                        </td>
                        <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            id={`quick-simulate-atom-${elem.symbol}`}
                            onClick={() => {
                              setSelectedAtomSymbol(elem.symbol);
                              onSelectPreset('atom', elem.symbol);
                            }}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all tracking-wider ${
                              isSimulated
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white'
                            }`}
                          >
                            {isSimulated ? 'Running' : 'Simulate'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Active Detail Spotter / expandable info for elements */}
          <div className="bg-slate-50/60 rounded-xl p-4.5 border border-slate-100 flex flex-col gap-3.5 relative">
            <span className="absolute top-4 right-4 text-[9px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              DETAILED INSPECTOR
            </span>
            
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-lg bg-blue-600 text-white flex flex-col items-center justify-center shadow-xs shrink-0 font-mono">
                <span className="text-[9px] leading-tight font-light">{currentAtomDetails.protons}</span>
                <span className="text-sm font-black leading-tight mt-[-2px]">{currentAtomDetails.symbol}</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-xs tracking-tight">
                  {currentAtomDetails.name} Element Info
                </h4>
                <p className="text-[10px] font-mono text-indigo-600 uppercase tracking-widest mt-0.5">
                  Category: {currentAtomDetails.category}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-2 rounded-lg border border-slate-100 text-center font-mono">
                <span className="block text-[9px] text-slate-400 uppercase tracking-wider">Protons (Z)</span>
                <span className="text-xs font-bold text-slate-700">{currentAtomDetails.protons}p⁺</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-100 text-center font-mono">
                <span className="block text-[9px] text-slate-400 uppercase tracking-wider">Neutrons (N)</span>
                <span className="text-xs font-bold text-slate-700">{currentAtomDetails.neutrons}nº</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-100 text-center font-mono">
                <span className="block text-[9px] text-slate-400 uppercase tracking-wider">Mass (A)</span>
                <span className="text-xs font-bold text-slate-700">~{currentAtomDetails.massNumber}u</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 font-sans leading-relaxed">
              <p>
                <strong>Scientific Profile:</strong> {currentAtomDetails.description}
              </p>
              <p className="bg-blue-50/40 p-2.5 rounded-lg border border-blue-100/30 text-blue-700 font-serif italic text-[11px]">
                💡 <strong>Cosmic Fact:</strong> {currentAtomDetails.funFact}
              </p>
              <div className="text-[11px] font-mono text-slate-400 border-t border-slate-150/50 pt-2 flex items-center justify-between">
                <span>Orbits Configuration: [{currentAtomDetails.protonsByShell.join(', ')}] e⁻</span>
                <button
                  onClick={() => onSelectPreset('atom', currentAtomDetails.symbol)}
                  className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 font-bold tracking-tight uppercase text-[9px]"
                >
                  Load to Canvas
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* =============== RIGHT COLUMN: COMPLEX MOLECULES REGISTRY =============== */}
        {renderMolecules && (
          <div 
            id="molecule-registry-column"
            className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col gap-5 shadow-xs"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50/70 text-emerald-600 flex items-center justify-center border border-emerald-100/30">
                  <Layers className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">
                    Complex Molecules Registry
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Observe molecular synthesis &amp; orbital spatial geometry bonds
                  </p>
                </div>
              </div>
              
              {/* Molecule Counter */}
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-600 border border-emerald-100/30 px-2 py-0.5 rounded-full font-bold">
                Molecules Synthesized: {filteredMolecules.length}
              </span>
            </div>

            {/* Search Bar for Molecules only */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                id="molecule-registry-search"
                type="text"
                placeholder="Search Molecule (e.g. Water, Caffeine, Salt, NH3)..."
                value={moleculeSearch}
                onChange={(e) => setMoleculeSearch(e.target.value)}
                className="bg-slate-50 hover:bg-slate-50/80 focus:bg-white text-xs text-slate-700 pl-9 pr-4 py-2.5 w-full rounded-xl border border-slate-150 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:outline-hidden transition-all font-sans"
              />
            </div>

            {/* Table list of molecules */}
            <div className="overflow-y-auto max-h-[280px] rounded-xl border border-slate-100">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-slate-50 border-b border-slate-100">
                  <tr className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                    <th className="py-2.5 px-3">Formula</th>
                    <th className="py-2.5 px-3">Molecular Name</th>
                    <th className="py-2.5 px-3">Bonding Type</th>
                    <th className="py-2.5 px-3">Atoms Count</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150/40">
                  {filteredMolecules.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-slate-400 font-mono text-[11px]">
                        No complex molecules matching query found. Try another formula.
                      </td>
                    </tr>
                  ) : (
                    filteredMolecules.map((mol) => {
                      const isInspected = selectedMoleculeId === mol.id;
                      const isSimulated = currentView === 'molecule' && activeId === mol.id;

                      return (
                        <tr
                          key={mol.id}
                          onClick={() => setSelectedMoleculeId(mol.id)}
                          className={`hover:bg-emerald-50/15 cursor-pointer transition-colors text-[11px] ${
                            isInspected ? 'bg-emerald-50/20 text-emerald-950 font-medium' : 'text-slate-600'
                          }`}
                        >
                          <td className="py-2.5 px-3">
                            <span className="font-mono font-extrabold text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100/30">
                              {mol.formula}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">
                            {mol.name}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="inline-block text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full border border-slate-200/40">
                              {mol.bondingType}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono font-semibold text-slate-500">
                            {mol.atoms.length} atoms
                          </td>
                          <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                            <button
                              id={`quick-simulate-molecule-${mol.id}`}
                              onClick={() => {
                                setSelectedMoleculeId(mol.id);
                                onSelectPreset('molecule', mol.id);
                              }}
                              className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all tracking-wider ${
                                isSimulated
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-slate-100 text-slate-600 hover:bg-emerald-650 hover:bg-emerald-500 hover:text-white'
                              }`}
                            >
                              {isSimulated ? 'Active' : 'Simulate'}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Active Detail Spotter / expandable info for molecules */}
            <div className="bg-slate-50/60 rounded-xl p-4.5 border border-slate-100 flex flex-col gap-3.5 relative">
              <span className="absolute top-4 right-4 text-[9px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                MOLECULE DETAILS
              </span>
              
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0 font-mono font-black text-xs">
                  {currentMoleculeDetails.formula}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs tracking-tight">
                    {currentMoleculeDetails.name} Structure Overview
                  </h4>
                  <p className="text-[10px] font-mono text-emerald-600 uppercase tracking-widest mt-0.5">
                    Bonds: {currentMoleculeDetails.bondingType}
                  </p>
                </div>
              </div>

              {/* List of elements inside the molecule */}
              <div className="bg-white p-3 rounded-xl border border-slate-100">
                <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1 px-1">
                  Atomic Coordinates Structure Offset Schema
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto pt-1">
                  {currentMoleculeDetails.atoms.map((a, i) => (
                    <span 
                      key={i} 
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md border flex items-center gap-1.5"
                      style={{ 
                        backgroundColor: `${a.color}10`, 
                        borderColor: `${a.color}30`,
                        color: a.color === '#374151' ? '#334155' : a.color
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: a.color }} />
                      <strong>{a.symbol}</strong> ({a.elementName}) [x:{a.offset.x},y:{a.offset.y}]
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 font-sans leading-relaxed">
                <p>
                  <strong>Molecular Dynamics Profile:</strong> {currentMoleculeDetails.description}
                </p>
                <p className="bg-emerald-50/30 p-2.5 rounded-lg border border-emerald-100/30 text-emerald-800 font-serif italic text-[11px]">
                  💡 <strong>Molecule Detail Fact:</strong> {currentMoleculeDetails.funFact}
                </p>
                <div className="text-[11px] font-mono text-slate-400 border-t border-slate-150/50 pt-2 flex items-center justify-between">
                  <span>Integrated Shell Schemes Available</span>
                  <button
                    onClick={() => onSelectPreset('molecule', currentMoleculeDetails.id)}
                    className="text-emerald-600 hover:text-emerald-800 hover:underline flex items-center gap-1 font-bold tracking-tight uppercase text-[9px]"
                  >
                    Load to Canvas
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
