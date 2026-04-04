import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import api from '../../api/axios';
import L from 'leaflet';
import 'leaflet.heat';
import { ShieldAlert, BarChart2, TrendingUp, Cpu, MapPin, Bell } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';

const HeatmapLayer = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (!points || points.length === 0) return;
    const heatLayer = L.heatLayer(points, { 
      radius: 25, 
      blur: 15, 
      maxZoom: 17,
      gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
    }).addTo(map);
    return () => map.removeLayer(heatLayer);
  }, [points, map]);
  return null;
};

const Overview = ({ workers, claims, alerts, reports, totalPayout }) => {
  const [insight] = useState("AI Insight: 60% of fleet currently traversing HIGH risk extreme-weather zones.");
  const [suggestion] = useState("Recommendation: Implement dynamic 15% surge premium & trigger SOS alerts.");
  const [heatPoints, setHeatPoints] = useState([]);
  const [mapCenter] = useState([28.6139, 77.2090]);

  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const { data } = await api.get('/heatmap');
        setHeatPoints(data.points);
      } catch (err) {
        console.error("Failed to load heatmap", err);
      }
    };
    fetchHeatmap();
  }, []);

  // Data for Risk Bar Chart
  const riskData = [
    { name: 'Low Risk', value: workers.length * 0.2 },
    { name: 'Med Risk', value: workers.length * 0.2 },
    { name: 'High Risk', value: workers.length * 0.6 }
  ];

  // Data for Payout Line Chart
  const payoutData = [
    { day: 'Mon', payout: 2000 },
    { day: 'Tue', payout: 3500 },
    { day: 'Wed', payout: 1000 },
    { day: 'Thu', payout: 8000 },
    { day: 'Fri', payout: 4000 },
    { day: 'Sat', payout: totalPayout > 0 ? totalPayout : 12000 }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 p-2">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">SmartShield Admin OS</h1>
          <p className="text-slate-500 font-medium tracking-tight">Super Analytics & Predictive Actuarial Engine.</p>
        </div>
        <div className="flex items-center space-x-4">
           <div className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white px-6 py-3 rounded-xl shadow-2xl border border-indigo-700/50 font-black flex items-center">
             <ShieldAlert className="mr-2 text-indigo-400" size={20} /> 
             Reserve Pool: ₹{(500000 - totalPayout).toLocaleString()}
           </div>
        </div>
      </div>

      {/* AI INSIGHTS PANEL */}
      <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-3xl border border-indigo-200 p-6 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-400/20 blur-3xl rounded-full"></div>
        <div className="flex items-start md:items-center space-x-4 relative z-10">
           <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/30 text-white">
             <Cpu size={28} />
           </div>
           <div>
             <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center mb-1">
               Actuarial AI Brain <span className="ml-3 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] rounded-full uppercase tracking-widest animate-pulse">Live Analysis</span>
             </h2>
             <p className="text-sm font-bold text-slate-600 mb-1">{insight}</p>
             <p className="text-sm font-semibold text-emerald-600">{suggestion}</p>
           </div>
        </div>
      </motion.div>

      {/* Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-100 group hover:shadow-lg transition-all hover:-translate-y-1">
           <h3 className="text-slate-400 font-bold text-xs tracking-widest uppercase mb-2">Total Fleet (Users)</h3>
           <p className="text-4xl font-black text-slate-900">{workers.length}</p>
        </div>
        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-100 group hover:shadow-lg transition-all hover:-translate-y-1">
           <h3 className="text-slate-400 font-bold text-xs tracking-widest uppercase mb-2">Active Policies</h3>
           <p className="text-4xl font-black text-slate-900">{workers.filter(w => w.status === 'active').length}</p>
        </div>
        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-100 group hover:shadow-lg transition-all hover:-translate-y-1">
           <h3 className="text-slate-400 font-bold text-xs tracking-widest uppercase mb-1">Total Payouts</h3>
           <p className="text-4xl font-black text-emerald-600">₹{totalPayout.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-3xl shadow-lg shadow-indigo-500/20 text-white group hover:scale-[1.03] transition-all">
           <h3 className="text-indigo-200 font-bold text-xs tracking-widest uppercase mb-1">Real-Time SOS Alerts</h3>
           <p className="text-4xl font-black">{alerts.length}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Risk Distribution Bar Chart */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-[400px]">
          <h2 className="text-lg font-bold mb-8 flex items-center text-slate-800 tracking-tight">
            <BarChart2 className="mr-3 text-indigo-500" size={22}/> Risk Distribution Matrix
          </h2>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskData}>
                <XAxis dataKey="name" stroke="#cbd5e1" tick={{fill: '#64748b', fontWeight: 600, fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}/>
                <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 8, 8]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payout Trend Line Chart */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-[400px]">
          <h2 className="text-lg font-bold mb-8 flex items-center text-slate-800 tracking-tight">
            <TrendingUp className="mr-3 text-emerald-500" size={22}/> Payout Velocity Trends
          </h2>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={payoutData}>
                <defs>
                  <linearGradient id="colorPayout" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#cbd5e1" tick={{fill: '#64748b', fontWeight: 600, fontSize: 12}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}/>
                <Area type="monotone" dataKey="payout" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorPayout)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Heatmap & Alerts Feed row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
         
         {/* Live Worker Heatmap */}
         <div className="lg:col-span-2 bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col h-[450px] relative">
            <div className="absolute top-6 left-6 z-[1000]">
              <h2 className="text-lg font-bold flex items-center text-white tracking-tight drop-shadow-md">
                <MapPin className="mr-3 text-rose-500" size={22}/> Real-Time Worker Heatmap
              </h2>
            </div>
            
            <MapContainer center={mapCenter} zoom={11} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <HeatmapLayer points={heatPoints} />
            </MapContainer>
            
            <div className="absolute bottom-6 right-6 z-[1000]">
               <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-white text-xs font-bold flex items-center">
                 <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse mr-2"></span> High Risk Zones Active
               </div>
            </div>
         </div>

         {/* Alerts Feed */}
         <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-[450px]">
            <h2 className="text-lg font-bold mb-6 flex items-center text-slate-800 tracking-tight">
               <Bell className="mr-3 text-rose-500" size={22}/> Live Intelligence Feed
            </h2>
            <div className="flex-1 overflow-y-auto hide-scrollbar space-y-4 pr-2">
               {alerts.length > 0 ? (
                 alerts.map((alert, i) => (
                   <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start">
                     <div className="bg-rose-100 p-2 rounded-xl mr-3"><ShieldAlert className="text-rose-600" size={16}/></div>
                     <div>
                       <p className="font-bold text-slate-800 text-sm mb-1">{alert.type?.toUpperCase() || 'ALARM'} SIGNAL</p>
                       <p className="text-xs text-slate-500">{alert.message || 'Worker distress signal detected.'}</p>
                     </div>
                   </div>
                 ))
               ) : (
                 <>
                   <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 flex items-start">
                     <div className="bg-rose-200 p-2 rounded-xl mr-3"><ShieldAlert className="text-rose-600" size={16}/></div>
                     <div>
                       <p className="font-bold text-slate-800 text-sm mb-1">SYSTEM WARNING</p>
                       <p className="text-xs text-slate-500">Impending severe thunderstorm entering northern corridor.</p>
                     </div>
                   </div>
                   <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 flex items-start mt-4">
                     <div className="bg-indigo-200 p-2 rounded-xl mr-3"><Cpu className="text-indigo-600" size={16}/></div>
                     <div>
                       <p className="font-bold text-slate-800 text-sm mb-1">AI AUTOMATION</p>
                       <p className="text-xs text-slate-500">Triggered automated claim batch #4409 due to flood node match.</p>
                     </div>
                   </div>
                 </>
               )}
            </div>
         </div>

      </div>

    </motion.div>
  );
};

export default Overview;
