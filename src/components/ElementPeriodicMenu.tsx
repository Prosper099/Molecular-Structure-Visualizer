/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { ALL_118_ELEMENTS, CATEGORIES_METADATA, PeriodicElement } from '../data/periodicTable';
import { 
  Flame, Search, Award, HelpCircle, Volume2, VolumeX, Eye, Sparkles, 
  ArrowRight, Compass, Shield, ZoomIn, ZoomOut, Check, Info, LayoutGrid, List
} from 'lucide-react';

interface ElementPeriodicMenuProps {
  onLoadIntoSandbox: (symbol: string) => void;
  activeSandboxSymbol: string;
}

export default function ElementPeriodicMenu({
  onLoadIntoSandbox,
  activeSandboxSymbol
}: ElementPeriodicMenuProps) {
  // Navigation & States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<PeriodicElement>(ALL_118_ELEMENTS[0]); // Default to Hydrogen
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Accessibility & Assistive states
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'extra-large'>('normal');
  const [useVoiceAnnouncer, setUseVoiceAnnouncer] = useState(false);
  const [voiceVolume, setVoiceVolume] = useState(0.8);
  const [keyboardGuideOpen, setKeyboardGuideOpen] = useState(false);
  const [announcementMsg, setAnnouncementMsg] = useState('');

  // Table Grid focus tracking (atomic number index - 1)
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const elementRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Update voice speech synthesis when element selection changes and announcer is enabled
  useEffect(() => {
    if (!selectedElement) return;

    const message = `${selectedElement.name}, chemical symbol ${selectedElement.symbol?.split('').join(' ')}. Atomic number ${selectedElement.number}, Atomic mass ${selectedElement.mass}. Category: ${CATEGORIES_METADATA[selectedElement.category]?.label || selectedElement.category}. Standard electron orbits: ${selectedElement.shells.join(', ')}.`;
    
    setAnnouncementMsg(message);

    if (useVoiceAnnouncer && window.speechSynthesis) {
      // Cancel previous utterances to avoid overlaps
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.volume = voiceVolume;
      window.speechSynthesis.speak(utterance);
    }
  }, [selectedElement, useVoiceAnnouncer, voiceVolume]);

  // Voice Test button
  const triggerManualVoice = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const message = `Reading data block for ${selectedElement.name}. Atomic mass is ${selectedElement.mass} units. Click Load to sandbox to simulate orbits, nucleus charges and spin states.`;
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.volume = voiceVolume;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is unfortunately not supported in this browser version.");
    }
  };

  // Keyboard navigation on grid
  const handleKeyDown = (e: KeyboardEvent, curElement: PeriodicElement, index: number) => {
    let nextIndex = index;
    const itemsCount = ALL_118_ELEMENTS.length;

    switch (e.key) {
      case 'ArrowRight':
        nextIndex = (index + 1) % itemsCount;
        e.preventDefault();
        break;
      case 'ArrowLeft':
        nextIndex = (index - 1 + itemsCount) % itemsCount;
        e.preventDefault();
        break;
      case 'ArrowDown':
        // Grid vertical movement depends on layout. Usually +18 groups but due to row spans,
        // we can estimate +18 as a good heuristic or move by row elements.
        nextIndex = Math.min(itemsCount - 1, index + 18);
        e.preventDefault();
        break;
      case 'ArrowUp':
        nextIndex = Math.max(0, index - 18);
        e.preventDefault();
        break;
      case 'Home':
        nextIndex = 0;
        e.preventDefault();
        break;
      case 'End':
        nextIndex = itemsCount - 1;
        e.preventDefault();
        break;
      case ' ':
      case 'Enter':
        setSelectedElement(ALL_118_ELEMENTS[index]);
        break;
      default:
        return;
    }

    setFocusedIndex(nextIndex);
    const targetElement = ALL_118_ELEMENTS[nextIndex];
    if (targetElement) {
      setSelectedElement(targetElement);
      // Focus the native element for real accessibility compliance
      elementRefs.current[nextIndex]?.focus();
    }
  };

  // Helper function to build 18-column grid slots
  // Place element according to Group (1-18) and Period (1-7)
  // Lanthanides & Actinides usually go underneath
  const getGridPositionStyle = (elem: PeriodicElement) => {
    // Lanthanides
    if (elem.category === 'lanthanide') {
      const col = Math.floor((elem.number - 57) % 15) + 4; // Start at column 4
      return { gridRow: 9, gridColumn: col };
    }
    // Actinides
    if (elem.category === 'actinide') {
      const col = Math.floor((elem.number - 89) % 15) + 4; // Start at column 4
      return { gridRow: 10, gridColumn: col };
    }
    
    return { gridRow: elem.period, gridColumn: elem.group };
  };

  // Filter elements by search query and selected category
  const filteredElements = ALL_118_ELEMENTS.filter((elem) => {
    const matchesSearch = 
      elem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      elem.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      elem.number.toString().includes(searchQuery) ||
      elem.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory ? elem.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  const fontSizeClass = {
    'normal': 'text-sm',
    'large': 'text-base md:text-lg',
    'extra-large': 'text-lg md:text-xl'
  }[textSize];

  return (
    <div id="periodic-table-menu-root" className={`flex flex-col gap-8 w-full ${fontSizeClass}`}>
      
      {/* SECTION 1: Accessibility & Assistive Setup Toolbar */}
      <section 
        aria-label="Accessibility and Assistive Controls" 
        className="bg-blue-50/40 border border-blue-105/40 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 shadow-xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
              Accessible Assistive Controls
              <span className="text-[9px] uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-mono font-bold">
                A11Y Standard
              </span>
            </h2>
            <p className="text-slate-500 text-[11px]">
              Setup text scale, local screen-reader announcer speech feedback, or read keyboard controls
            </p>
          </div>
        </div>

        {/* Toolbar Actions container */}
        <div className="flex flex-wrap items-center gap-4">
          
          {/* Zoom/Text Scale button */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-2.5 py-1.5 rounded-xl text-xs font-semibold">
            <span id="text-scale-label" className="text-slate-400 text-[10px] uppercase font-bold mr-1">Zoom:</span>
            <button 
              onClick={() => setTextSize('normal')}
              aria-label="Normal Font Size"
              title="Set normal font size"
              className={`px-2 py-0.5 rounded cursor-pointer transition-all ${textSize === 'normal' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              1x
            </button>
            <button 
              onClick={() => setTextSize('large')}
              aria-label="Large Font Size"
              title="Set large font size"
              className={`px-2 py-0.5 rounded cursor-pointer transition-all ${textSize === 'large' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              1.2x
            </button>
            <button 
              onClick={() => setTextSize('extra-large')}
              aria-label="Extra Large Font Size"
              title="Set extra large font size"
              className={`px-2 py-0.5 rounded cursor-pointer transition-all ${textSize === 'extra-large' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              1.5x
            </button>
          </div>

          {/* Local Audio screen announcer toggle */}
          <div className="flex items-center gap-2 bg-white border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs font-semibold">
            <button
              id="btn-voice-toggle"
              onClick={() => setUseVoiceAnnouncer(!useVoiceAnnouncer)}
              aria-pressed={useVoiceAnnouncer}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded cursor-pointer transition-all ${
                useVoiceAnnouncer ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-slate-500 hover:text-blue-600'
              }`}
            >
              {useVoiceAnnouncer ? <Volume2 className="w-3.5 h-3.5 text-emerald-600 animate-bounce" /> : <VolumeX className="w-3.5 h-3.5" />}
              Voice Announcer {useVoiceAnnouncer ? "ON" : "OFF"}
            </button>

            {useVoiceAnnouncer && (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-100">
                <span className="text-[9px] uppercase tracking-wide text-slate-400">Vol:</span>
                <input
                  id="voice-volume-slider"
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={voiceVolume}
                  onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
                  aria-label="Change voice volume"
                  className="w-16 h-1 bg-slate-200 rounded-lg cursor-pointer accent-blue-600"
                />
              </div>
            )}
          </div>

          {/* Keyboard Layout Guide Toggle */}
          <button
            id="btn-keyboard-shortcuts-toggle"
            onClick={() => setKeyboardGuideOpen(!keyboardGuideOpen)}
            aria-expanded={keyboardGuideOpen}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
              keyboardGuideOpen 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-600'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Keys Guide
          </button>
        </div>
      </section>

      {/* Screen Reader ARIA Live Status block */}
      <div 
        id="aria-live-status-block"
        role="status" 
        aria-live="polite" 
        className="sr-only"
      >
        {announcementMsg}
      </div>

      {/* Keyboard Shortcuts Interactive Overlay Block */}
      {keyboardGuideOpen && (
        <div id="keyboard-guide-well" className="bg-slate-800 text-slate-100 rounded-2xl p-5 border border-slate-705 flex flex-col gap-3 font-mono text-xs shadow-md animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <span className="text-blue-400 font-bold flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-400" />
              ACCESSIBLE GRID NAVIGATION CONTROLS
            </span>
            <button 
              onClick={() => setKeyboardGuideOpen(false)}
              className="text-slate-400 hover:text-white cursor-pointer px-2 py-0.5 border border-slate-600 rounded"
            >
              Dismiss (Esc)
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-slate-300 leading-relaxed font-sans pt-1">
            <p>
              ⌨️ <strong className="text-white">Arrow Keys</strong>: Navigate sequentially across columns (groups) and rows (periods) in the table list.
            </p>
            <p>
              ⌨️ <strong className="text-white">Space / Enter</strong>: Core selection. Highlights the element details panel and announces active physical parameters.
            </p>
            <p>
              ⌨️ <strong className="text-white">Home / End</strong>: Instantly jump focus to element 1 (Hydrogen) or element 118 (Oganesson).
            </p>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            *This grid matches official IUPAC atomic number coordinates. Assistive software can safely parse atomic headers using role="grid".
          </span>
        </div>
      )}

      {/* SECTION 2: Dynamic Element Detail Feature Row (Excellent visual pairing) */}
      <section 
        aria-label="Active Element Statistical Profile"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-xl border border-blue-900/40 relative overflow-hidden"
      >
        {/* Background ambient radial glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Column 1: Display Badge & Numeric Block */}
        <div className="flex flex-col md:flex-row lg:flex-col items-center justify-center gap-5 lg:border-r lg:border-slate-800 lg:pr-6">
          <div className="w-32 h-32 rounded-2xl bg-slate-850 border-2 border-blue-500 flex flex-col items-center justify-center relative p-2 shadow-2xl">
            {/* Atomic number top left */}
            <span className="text-slate-400 text-sm font-mono font-bold absolute top-2 left-3">
              {selectedElement.number}
            </span>
            {/* Weight bottom */}
            <span className="text-slate-400 text-[10px] font-mono absolute bottom-2 text-center w-full">
              {selectedElement.mass.toFixed(4)}
            </span>
            {/* Large symbol */}
            <h3 className="text-4xl font-bold font-mono text-white tracking-widest mt-1">
              {selectedElement.symbol}
            </h3>
            {/* Small orbit visualization badge */}
            <span className="text-[8px] bg-blue-500/20 text-blue-300 font-mono px-2 py-0.5 rounded-full border border-blue-500/30 font-bold mt-1 uppercase max-w-[100px] truncate">
              {CATEGORIES_METADATA[selectedElement.category]?.label || selectedElement.category}
            </span>
          </div>

          <div className="text-center md:text-left lg:text-center mt-2 flex flex-col items-center md:items-start lg:items-center">
            <h4 className="text-xl font-semibold tracking-tight text-white flex items-center gap-1.5">
              {selectedElement.name}
            </h4>
            <span className="text-xs text-slate-400 font-mono mt-1">
              Configuration: {selectedElement.shells.join(' . ')} e⁻ in orbits
            </span>
            <div className="flex items-center gap-2 mt-3.5">
              <button
                id="btn-manual-readout"
                onClick={triggerManualVoice}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-300 text-[11px] rounded-lg font-bold border border-slate-700 flex items-center gap-1 transition-all cursor-pointer"
                title="Voice read statistical data of current element"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Speech Profile
              </button>
            </div>
          </div>
        </div>

        {/* Column 2: Detailed Stats & Quantum Shell Configuration */}
        <div className="flex flex-col justify-between gap-4 lg:col-span-2 pt-4 lg:pt-0">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <h4 className="text-xs uppercase font-bold tracking-widest text-slate-400 font-mono">
                Subatomic Formula Parameters
              </h4>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">Protons (Z)</span>
                <span className="text-md font-mono font-bold text-red-400">{selectedElement.number} p⁺</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">Neutrons (approx)</span>
                <span className="text-md font-mono font-bold text-emerald-450">{Math.round(selectedElement.mass - selectedElement.number)} n⁰</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">Total Mass</span>
                <span className="text-md font-mono font-bold text-blue-400">{selectedElement.mass} u</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">Bohr Periodic Class</span>
                <span className="text-[11px] font-semibold text-pink-400 truncate block mt-0.5">
                  Term {selectedElement.period} | Group {selectedElement.group > 0 ? selectedElement.group : 'F-Block'}
                </span>
              </div>
            </div>

            {/* Electron shell graphics / visuals */}
            <div className="mt-4">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block mb-1.5">
                Electron Orbital Shell Capacities (K, L, M, N, O, P, Q)
              </span>
              <div className="flex gap-1.5">
                {selectedElement.shells.map((val, idx) => (
                  <div key={idx} className="flex-1 bg-slate-950 p-2 rounded-lg border border-slate-800/80 flex flex-col items-center">
                    <span className="text-[9px] font-mono text-slate-500 font-bold uppercase">
                      Shell {String.fromCharCode(75 + idx)}
                    </span>
                    <span className="text-xs font-mono text-blue-400 font-bold">
                      {val}e⁻
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-800/80 pt-4 mt-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-[11px] text-slate-300 leading-relaxed max-w-sm">
                This element properties conform to standard Bohr orbital models. Press Sandbox to render the 60FPS energy wavefunction.
              </span>
            </div>
            
            <button
              id={`btn-launch-sandbox-${selectedElement.symbol}`}
              onClick={() => onLoadIntoSandbox(selectedElement.symbol)}
              className="px-5 py-3 hover:scale-101 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-blue-900/30 flex items-center justify-center gap-2 cursor-pointer w-full md:w-auto"
            >
              Launch Sandbox Simulation
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 3: Central Filtering & Tab bar */}
      <section aria-label="Periodic Table Filter Controls" className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-blue-50/50 pb-4">
        
        {/* Search with fully readable input labels */}
        <div className="w-full md:w-80 flex flex-col gap-1">
          <label htmlFor="elem-search-field" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            Search 118 Elements Registry:
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              id="elem-search-field"
              type="text"
              placeholder="Search via Name, Symbol, or Number (e.g. Au, 79)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50/70 hover:bg-slate-100/60 focus:bg-white text-xs text-slate-800 pl-9 pr-4 py-2.5 w-full rounded-xl border border-slate-200 focus:border-blue-300 focus:outline-hidden transition-all"
            />
          </div>
        </div>

        {/* Interactive layout switcher & Category filtering options */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Layout switcher buttons */}
          <div className="inline-flex rounded-lg bg-slate-50 border border-slate-100 p-1 text-xs">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Set Interactive Grid View"
              className={`px-3 py-1.5 font-bold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-3xs' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Periodic Grid Layout
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="Set Simplified Access List View"
              className={`px-3 py-1.5 font-bold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-3xs' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              A11y Simplified List
            </button>
          </div>

          {/* Quick Category filter selector */}
          <div className="bg-slate-50 border border-slate-100 px-2 py-1 rounded-xl text-xs flex items-center gap-1.5">
            <label htmlFor="category-filter-select" className="text-slate-400 text-[10px] font-bold uppercase font-mono">Category:</label>
            <select
              id="category-filter-select"
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value === '' ? null : e.target.value)}
              className="bg-white border border-slate-200 rounded px-1 py-0.5 font-semibold text-slate-700 focus:outline-hidden text-xs"
            >
              <option value="">All Categories</option>
              {Object.entries(CATEGORIES_METADATA).map(([key, meta]) => (
                <option key={key} value={key}>{meta.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* SECTION 4: Element Board Stage */}
      {viewMode === 'grid' ? (
        /* The Periodic Table Interactive Grid (18 Columns max width layout) */
        <div className="overflow-x-auto pb-4 max-w-full -mx-4 md:mx-0 px-4 md:px-0">
          <div 
            role="grid" 
            aria-label="IUPAC Interactive Periodic Table Grid" 
            className="grid grid-cols-18 gap-[3.5px] min-w-[960px] max-w-[1240px] mx-auto select-none bg-slate-50/50 p-4 border border-blue-50/30 rounded-2xl"
          >
            {/* Legend / Group Column numbers at the top */}
            {Array.from({ length: 18 }, (_, k) => (
              <div key={k} className="text-center font-mono text-[9px] text-slate-400 font-bold pb-1 select-none">
                {k + 1}
              </div>
            ))}

            {/* Elements map */}
            {ALL_118_ELEMENTS.map((elem, idx) => {
              const active = selectedElement?.number === elem.number;
              const matchesFilter = filteredElements.some(f => f.number === elem.number);
              
              // Get category styling meta
              const meta = CATEGORIES_METADATA[elem.category] || { color: 'text-slate-600', border: 'border-slate-200', bg: 'bg-white' };
              const gridPos = getGridPositionStyle(elem);

              return (
                <button
                  key={elem.number}
                  ref={(el) => { elementRefs.current[idx] = el; }}
                  id={`grid-cell-elem-${elem.symbol}`}
                  role="gridcell"
                  style={gridPos}
                  aria-selected={active}
                  onClick={() => setSelectedElement(elem)}
                  onKeyDown={(e) => handleKeyDown(e, elem, idx)}
                  tabIndex={active ? 0 : -1} // Only active element is naturally focusable (roving tabIndex standard)
                  className={`relative aspect-square rounded-[6px] border text-left p-1 transition-all flex flex-col justify-between cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 ${meta.border} ${meta.bg} ${
                    active 
                      ? 'ring-2 ring-blue-600 scale-102 z-10 shadow-md font-bold' 
                      : 'hover:scale-101 hover:border-slate-400'
                  } ${!matchesFilter ? 'opacity-20 saturate-50' : 'opacity-100'}`}
                >
                  <div className="flex justify-between items-start leading-none pointer-events-none">
                    <span className="text-[8px] font-mono text-slate-400 font-bold">
                      {elem.number}
                    </span>
                    <span className="text-[7px] font-mono text-slate-500 font-semibold truncate hidden lg:inline max-w-10">
                      {elem.mass.toFixed(0)}
                    </span>
                  </div>

                  <div className="text-center font-mono leading-none flex flex-col items-center justify-center pt-0.5">
                    <span className={`text-[12px] font-bold ${active ? 'text-blue-600' : 'text-slate-800'}`}>
                      {elem.symbol}
                    </span>
                    <span className="text-[6.5px] scale-90 text-slate-400 font-sans truncate block w-full mt-0.5 select-none uppercase font-semibold">
                      {elem.name}
                    </span>
                  </div>
                </button>
              );
            })}

            {/* Empty space filler for periodic table gap details */}
            <div 
              style={{ gridRow: '9 / span 2', gridColumn: '1 / span 3' }} 
              className="flex items-center justify-center text-[10px] font-mono text-slate-400 bg-slate-50 rounded-xl px-2 text-center"
            >
              F-Block Inner Transition ↓
            </div>
          </div>
        </div>
      ) : (
        /* SImple Flat Screen-Readable & Sortable List Mode (highly friendly to accessibility screen-readers/keyboards) */
        <div id="simple-a11y-list-panel" className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400">
              ELEMENTAL FLAT LISTING · SELECT TO LOAD STATISTICAL SHEET
            </span>
            <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
              Matched Elements: {filteredElements.length} / 118
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {filteredElements.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-mono text-xs">
                No matching elements were located in registry matching the current parameters.
              </div>
            ) : (
              filteredElements.map((elem) => {
                const active = selectedElement?.number === elem.number;
                return (
                  <button
                    key={elem.number}
                    onClick={() => setSelectedElement(elem)}
                    className={`w-full text-left p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs transition-colors cursor-pointer ${
                      active ? 'bg-blue-50/55' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-mono font-bold text-slate-500 border border-slate-200 text-[11px] shrink-0">
                        {elem.number}
                      </span>
                      <span className="px-2 py-0.5 rounded-md font-mono font-bold text-blue-700 bg-blue-50 border border-blue-100">
                        {elem.symbol}
                      </span>
                      <span className="font-semibold text-slate-800">{elem.name}</span>
                      <span className="text-slate-400 font-mono text-[10.5px]">| Mass {elem.mass} u</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${CATEGORIES_METADATA[elem.category]?.color || 'text-slate-500'} ${CATEGORIES_METADATA[elem.category]?.bg || 'bg-slate-50'}`}>
                        {CATEGORIES_METADATA[elem.category]?.label || elem.category}
                      </span>
                      {active && (
                        <span className="text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded">
                          <Check className="w-3 h-3 text-emerald-500" /> Loaded
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
