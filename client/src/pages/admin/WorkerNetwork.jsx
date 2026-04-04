import React from 'react';
import { Users, MapPin, Download, Search } from 'lucide-react';
import api from '../../api/axios';

const WorkerNetwork = ({ workers, searchQuery, setSearchQuery, handleToggleStatus }) => {
  const filteredWorkers = workers.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    w.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const downloadReport = async (wId, wName) => {
    try {
      const response = await api.get(`/users/${wId}/report`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Worker_Report_${wName.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      alert('Failed to download report');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Worker Network</h1>
          <p className="text-slate-500 font-medium tracking-tight">Management silo for active nodes and trust scoring algorithms.</p>
        </div>
        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search nodes by name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm font-medium text-slate-800"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-100">
           <div className="grid grid-cols-12 gap-4 text-xs font-black text-slate-400 uppercase tracking-widest">
             <div className="col-span-5">Worker Node Details</div>
             <div className="col-span-3">Trust Signal</div>
             <div className="col-span-4 text-right">Actions</div>
           </div>
        </div>
        <div className="divide-y divide-slate-50">
          {filteredWorkers.length === 0 ? (
            <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-sm">No matching nodes found.</div>
          ) : (
            filteredWorkers.map(w => (
              <div key={w._id} className="px-8 py-6 grid grid-cols-12 gap-4 items-center hover:bg-slate-50/50 transition-colors group">
                <div className="col-span-5 flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-lg border border-indigo-100 group-hover:scale-105 transition-transform">
                    {w.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-lg leading-tight">{w.name}</h4>
                    <p className="text-xs text-slate-500 font-bold flex items-center mt-1">
                      <MapPin size={12} className="mr-1 text-slate-400"/> 
                      {w.location?.lat ? `Log: ${w.location.lat.toFixed(2)}, ${w.location.lng.toFixed(2)}` : 'Location Offline'}
                    </p>
                  </div>
                </div>
                <div className="col-span-3">
                  <div className={`inline-flex flex-col px-4 py-2 rounded-2xl border ${w.trustScore > 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">SCORE</span>
                    <span className="text-xl font-black">{w.trustScore}</span>
                  </div>
                </div>
                <div className="col-span-4 flex justify-end items-center space-x-3">
                  <button 
                    onClick={() => downloadReport(w._id, w.name)}
                    className="p-3 text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-600 hover:text-white hover:shadow-lg transition-all"
                    title="Download Data Report"
                  >
                    <Download size={18} />
                  </button>
                  <button 
                    onClick={() => handleToggleStatus(w._id)}
                    className={`font-black text-xs px-6 py-3 rounded-xl border transition-all ${w.status === 'active' ? 'bg-white text-red-600 border-red-100 hover:bg-red-50' : 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30'}`}
                  >
                    {w.status === 'active' ? 'BLOCK NODE' : 'ACTIVATE NODE'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerNetwork;
