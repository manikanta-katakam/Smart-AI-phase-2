import React from 'react';
import { Layers, ShieldAlert, AlertCircle, Clock, MapPin } from 'lucide-react';

const CommunityReports = ({ reports }) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Community Reports</h1>
          <p className="text-slate-500 font-medium tracking-tight">Active hazard crowdsourcing data points from the worker collective.</p>
        </div>
        <span className="bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-widest px-6 py-2.5 rounded-full border border-emerald-200 animate-pulse-slow">Live Engine Feed</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {reports.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">
            <h3 className="text-2xl font-black text-slate-900 mb-2">No active hazards.</h3>
            <p className="text-slate-500 font-medium">The network is currently reporting optimal conditions.</p>
          </div>
        ) : (
          reports.map(r => (
            <div key={r._id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.03] transition-all flex flex-col h-full group">
               <div className="flex justify-between items-start mb-6 w-full">
                 <div className={`p-4 rounded-2xl ${r.type === 'flood' ? 'bg-cyan-50 text-cyan-600 border border-cyan-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                    <AlertCircle size={28}/>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-slate-400 flex items-center"><Clock size={10} className="mr-1"/> {new Date(r.createdAt).toLocaleTimeString()}</span>
                    <span className="mt-1 text-[10px] font-bold py-1 px-3 rounded-full bg-slate-100 text-slate-600 uppercase tracking-widest">Active Hazard</span>
                 </div>
               </div>
               
               <h4 className="text-2xl font-black text-slate-900 capitalize mb-4 group-hover:text-indigo-600 transition-colors">
                  {r.type} <span className="opacity-40">Encountered</span>
               </h4>
               
               <p className="text-slate-600 font-semibold leading-relaxed mb-8 flex-1 border-l-4 border-indigo-500 pl-4 bg-slate-50 py-4 pr-4 rounded-r-xl">
                 {r.description || 'No detailed data provided.'}
               </p>

               <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto">
                 <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-sm ring-2 ring-white">
                       {r.userId?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <span className="text-xs font-black text-slate-400 group-hover:text-slate-900 transition-colors">{r.userId?.name || 'Anonymous User'}</span>
                 </div>
                 <div className="text-indigo-600 flex items-center font-black text-[10px] uppercase tracking-widest group-hover:underline cursor-pointer">
                    View on Map <MapPin size={12} className="ml-1"/>
                 </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityReports;
