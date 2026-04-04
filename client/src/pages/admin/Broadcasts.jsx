import React from 'react';
import { Bell, Heart, Send, CheckCircle } from 'lucide-react';

const Broadcasts = ({ announcement, setAnnouncement, sendAnnouncement }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Emergency Broadcast Layer</h1>
        <p className="text-slate-500 font-medium tracking-tight max-w-lg leading-relaxed">Broadcast critical safety information or network-wide alerts to all active worker nodes via the real-time websocket pipeline.</p>
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl p-10 border border-slate-100 relative group overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-[100%] pointer-events-none group-hover:scale-110 transition-transform"></div>
        
        <div className="flex items-start md:space-x-8 flex-col md:row-reverse md:flex-row mb-12">
           <div className="bg-indigo-600 p-8 rounded-3xl shadow-indigo-500/20 shadow-2xl mb-8 md:mb-0 ring-4 ring-indigo-50 border border-indigo-400">
              <Bell className="text-white" size={40} />
           </div>
           <div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Direct Messaging Feed</h3>
              <p className="text-slate-500 font-medium mb-6">Type a message to be pushed directly into the active dashboards and push notifications of the gig economy workers in the network.</p>
              
              <div className="flex items-center space-x-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                 <div className="flex items-center text-emerald-500"><CheckCircle size={12} className="mr-2"/> Secure Line</div>
                 <div className="flex items-center"><Heart size={12} className="mr-2 text-red-400"/> Critical Only</div>
              </div>
           </div>
        </div>

        <form onSubmit={sendAnnouncement} className="space-y-6">
          <div className="relative">
            <textarea 
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-[30px] p-8 text-lg font-bold text-slate-800 placeholder-slate-400 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white outline-none resize-none transition-all shadow-inner block min-h-[220px]"
              placeholder="e.g. Mandatory route pause initiated for Zone 4 due to flash flood warnings..."
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              required
            ></textarea>
            <div className="absolute bottom-6 right-6">
               <span className={`text-[10px] font-black uppercase py-1 px-4 rounded-lg tracking-widest ${announcement.length > 0 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                 Ready to Broadcast
               </span>
            </div>
          </div>
          
          <button className="group w-full bg-slate-900 text-white font-black py-6 px-8 rounded-[30px] hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-500/40 active:scale-95 transition-all outline-none flex items-center justify-center space-x-4 text-xl tracking-tight">
            <span>Fire Emergency Signal</span>
            <Send className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" size={24}/>
          </button>
        </form>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 px-4 opacity-70">
         <div className="bg-white/50 p-6 rounded-3xl border border-slate-200">
            <h4 className="font-black text-slate-900 text-xs mb-2 uppercase tracking-widest">Global Broadcasts</h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">System ensures 99.9% delivery rate across all connected worker nodes within 250ms latency.</p>
         </div>
         <div className="bg-white/50 p-6 rounded-3xl border border-slate-200">
            <h4 className="font-black text-slate-900 text-xs mb-2 uppercase tracking-widest">Protocol Check</h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">Signal remains active for 15 minutes before recycling the dashboard prompt based on user response.</p>
         </div>
      </div>
    </div>
  );
};

export default Broadcasts;
