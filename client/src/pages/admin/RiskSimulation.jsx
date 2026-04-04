import React from 'react';
import { CloudLightning } from 'lucide-react';

const RiskSimulation = ({ simulateEvent }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Risk Simulation Console</h1>
        <p className="text-slate-500 font-medium tracking-tight">Manually test the parametric payout engine by triggering environmental disasters.</p>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-black p-10 rounded-3xl text-white shadow-2xl relative overflow-hidden flex flex-col border border-slate-800">
        <div className="absolute -right-20 -top-20 opacity-10 pointer-events-none">
          <CloudLightning size={400} />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-extrabold mb-3 flex items-center"><CloudLightning className="mr-3 text-yellow-400" size={28}/> Simulation Matrix</h2>
          <p className="text-slate-400 text-sm mb-10 leading-relaxed max-w-lg font-medium">Trigger parametric weather events to visually test the autonomous backend payout systems for the current worker network.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button onClick={() => simulateEvent('demo_story')} className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700 border border-indigo-500 hover:shadow-indigo-500/40 text-left px-6 py-6 rounded-2xl transition-all flex justify-between items-center group shadow-md shadow-indigo-500/20 mb-4">
              <div className="flex flex-col">
                <span className="font-extrabold tracking-wide text-white text-lg">Full Pitch Demo Sequence</span>
                <span className="text-xs font-medium text-indigo-200 mt-1">Simulates complete cycle: Worker login → Rain detected → Claim triggered → Instant Payout.</span>
              </div>
              <span className="text-xs font-black bg-white text-indigo-700 px-4 py-2 rounded-xl uppercase tracking-wider shadow-sm group-hover:scale-105 transition-transform">Auto-Run</span>
            </button>
            <div className="md:col-span-2 h-px w-full bg-slate-800 my-4"></div>
            <button onClick={() => simulateEvent('rain')} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-left px-6 py-5 rounded-2xl transition-all flex justify-between items-center group shadow-sm">
              <span className="font-bold tracking-wide">Category 4 Rainstorm</span>
              <span className="text-xs font-black bg-slate-900 group-hover:bg-indigo-700 text-indigo-400 group-hover:text-white px-3 py-1.5 rounded-lg transition-colors">Force Trigger</span>
            </button>
            <button onClick={() => simulateEvent('flood')} className="bg-slate-800 hover:bg-cyan-600 border border-slate-700 hover:border-cyan-500 text-left px-6 py-5 rounded-2xl transition-all flex justify-between items-center group shadow-md">
              <span className="font-bold tracking-wide">Flash Flood Surge</span>
              <span className="text-xs font-black bg-slate-900 group-hover:bg-cyan-700 text-cyan-400 group-hover:text-white px-3 py-1.5 rounded-lg transition-colors">Force Trigger</span>
            </button>
            <button onClick={() => simulateEvent('road block')} className="bg-slate-800 hover:bg-red-600 border border-slate-700 hover:border-red-500 text-left px-6 py-5 rounded-2xl transition-all flex justify-between items-center group shadow-md">
              <span className="font-bold tracking-wide">Total Gridlock</span>
              <span className="text-xs font-black bg-slate-900 group-hover:bg-red-700 text-red-400 group-hover:text-white px-3 py-1.5 rounded-lg transition-colors">Force Trigger</span>
            </button>
            <button onClick={() => simulateEvent('pollution')} className="bg-slate-800 hover:bg-amber-600 border border-slate-700 hover:border-amber-500 text-left px-6 py-5 rounded-2xl transition-all flex justify-between items-center group shadow-md">
              <span className="font-bold tracking-wide">Severe AQI Spike</span>
              <span className="text-xs font-black bg-slate-900 group-hover:bg-amber-700 text-amber-400 group-hover:text-white px-3 py-1.5 rounded-lg transition-colors">Force Trigger</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskSimulation;
