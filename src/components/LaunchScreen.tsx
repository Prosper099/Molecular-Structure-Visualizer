/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Atom, Compass, Sparkles, Layers, ArrowRight, Table, Cpu } from 'lucide-react';

interface LaunchScreenProps {
  onLaunch: () => void;
}

export default function LaunchScreen({ onLaunch }: LaunchScreenProps) {
  return (
    <div id="welcome-portal-root" className="min-h-screen bg-white text-slate-800 font-sans flex flex-col justify-between relative overflow-hidden selection:bg-blue-100 selection:text-blue-800">
      
      {/* Decorative dynamic ambient mesh gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-50/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-14%] w-[700px] h-[700px] rounded-full bg-indigo-50/45 blur-3xl pointer-events-none" />
      
      {/* Micro Grid Overlay for Science vibe */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(241,245,249,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(241,245,249,0.3)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Header section of the splash page */}
      <header className="w-full max-w-7xl mx-auto px-6 md:px-12 py-8 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Atom className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-600">
            Quantum.Lab v1.2
          </span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
          SYSTEM STATUS: ONLINE
        </div>
      </header>

      {/* Main Branding Central Panel */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-6 relative z-10 text-center py-12">
        
        {/* Animated Custom Logo */}
        <motion.div 
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative w-40 h-40 mb-10 flex items-center justify-center group cursor-pointer"
        >
          {/* External Glowing Rings representing shells */}
          <div className="absolute inset-0 rounded-full border border-blue-100 animate-spin" style={{ animationDuration: '10s' }} />
          <div className="absolute w-[80%] h-[80%] rounded-full border border-indigo-100/80 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
          <div className="absolute w-[50%] h-[50%] rounded-full border border-dashed border-blue-200/50 animate-pulse" />
          
          {/* Electron nodes floating on orbits */}
          <div className="absolute top-0 left-1/2 -ml-1.5 w-3 h-3 rounded-full bg-blue-500 shadow-xs animate-ping" />
          <div className="absolute bottom-[10%] right-[10%] w-2 h-2 rounded-full bg-indigo-500" />
          <div className="absolute left-[5%] top-1/3 w-2.5 h-2.5 rounded-full bg-indigo-600" />

          {/* Central Nucleus with positive energy logo symbol */}
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer relative z-10"
          >
            <Atom className="w-8 h-8 animate-spin" style={{ animationDuration: '15s' }} />
          </motion.div>
        </motion.div>

        {/* Application Name & High-End Subtitle */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-4"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-blue-500 font-extrabold font-mono bg-blue-50/60 px-3.5 py-1.5 rounded-full border border-blue-100/40 inline-block">
            High Fidelity Particle Physics
          </span>
          <h1 className="text-3xl sm:text-5xl font-extralight tracking-tight text-slate-800 leading-tight">
            Atomic &amp; Molecular <br />
            <span className="text-blue-505 font-serif italic font-normal text-blue-600">Structure Visualizer</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
            An interactive educational sandbox environment. Simulate subatomic particles, probe electron shells, adjust physics parameters, and construct complex atomic and molecular lattices in real-time.
          </p>
        </motion.div>

        {/* Proceed Interactive Action Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10"
        >
          <button
            id="launch-app-button"
            onClick={onLaunch}
            className="group cursor-pointer bg-slate-900 text-white hover:bg-blue-600 text-sm font-semibold tracking-wider uppercase px-8 py-4.5 rounded-xl transition-all shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-blue-600/20 flex items-center gap-3 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
          >
            Enter Simulation Lab
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </motion.div>

        {/* App Highlights Bento Panel */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl w-full mt-16 text-left"
        >
          <div className="p-5 bg-slate-50/50 border border-slate-100 rounded-2xl flex gap-3.5 hover:bg-slate-50 hover:border-slate-200 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-mono shrink-0">
              <Table className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">118 Elements</h3>
              <p className="text-xs text-slate-400 mt-1 lines-clamp-2 leading-relaxed">
                Full-featured periodic library displaying shell configurations, atomic weights, stable neutral decay vectors, and chemical properties.
              </p>
            </div>
          </div>

          <div className="p-5 bg-slate-50/50 border border-slate-100 rounded-2xl flex gap-3.5 hover:bg-slate-50 hover:border-slate-200 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-mono shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">Quantum Sandbox</h3>
              <p className="text-xs text-slate-400 mt-1 lines-clamp-2 leading-relaxed">
                Render interactive Bohr shells and quantum cloud probability visualizations. Touch atomic structures directly to inspect core values.
              </p>
            </div>
          </div>

          <div className="p-5 bg-slate-50/50 border border-slate-100 rounded-2xl flex gap-3.5 hover:bg-slate-50 hover:border-slate-200 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-mono shrink-0">
              <Cpu className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">Variable Physics</h3>
              <p className="text-xs text-slate-400 mt-1 lines-clamp-2 leading-relaxed">
                Adjust Electron Mass coefficient, Bohr orbits, nucleus charges, and trigger laser energy state excitations in a reactive Canvas engine.
              </p>
            </div>
          </div>
        </motion.div>

      </main>

      {/* Footer section of scientific disclaimer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center relative z-10 text-[10px] text-slate-400 font-mono gap-2 mt-4">
        <span>Developed with standard HTML5 Canvas &amp; high fidelity calculations.</span>
        <span>COPYRIGHT © 2026 QUANTUM.LAB CORP. ALL RIGHTS RESERVED.</span>
      </footer>

    </div>
  );
}
