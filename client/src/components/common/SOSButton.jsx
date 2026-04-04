import React, { useState } from 'react';
import { AlertCircle, RefreshCw, PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const SOSButton = ({ location, emergencyContact }) => {
  const [triggering, setTriggering] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | failed

  const handleSOS = async (retry = false) => {
    setTriggering(true);
    setStatus('sending');
    if (retry) toast.info("Retrying connection to Emergency Network...");
    
    try {
      await api.post('/alerts/sos', { location });
      setStatus('sent');
      toast.success("🚨 Emergency SOS Alert Broadcasted! Admins are dispatching help.", { icon: "🚨", autoClose: 6000 });
      setTimeout(() => setStatus('idle'), 15000);
    } catch (e) {
      setStatus('failed');
      toast.error('Network failed. Please retry SOS or dial your emergency contact.');
    }
    setTriggering(false);
  };

  return (
    <>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleSOS(false)}
        disabled={triggering || status === 'sent'}
        className={`fixed bottom-[140px] right-8 rounded-full w-[72px] h-[72px] shadow-2xl flex flex-col items-center justify-center border-4 z-40 transition-all ${status === 'sent' ? 'bg-green-600 border-green-200 cursor-not-allowed text-white shadow-green-500/30' : 'bg-red-600 border-red-200 text-white hover:bg-red-700 hover:shadow-red-500/50'}`}
      >
        <AlertCircle size={28} className={triggering ? 'animate-pulse text-white/80' : 'text-white'} />
        <span className="font-extrabold tracking-wider text-[11px] mt-0.5 text-white uppercase">{status === 'sent' ? 'SENT' : 'SOS'}</span>
        {status === 'idle' && (
          <div className="absolute inset-0 rounded-full border border-red-400 animate-ping opacity-70 border-[3px] pointer-events-none"></div>
        )}
      </motion.button>
      
      <AnimatePresence>
        {status === 'failed' && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-[230px] right-8 bg-white border border-red-100 px-6 py-5 rounded-3xl shadow-2xl z-50 flex flex-col max-w-sm w-80"
          >
            <h4 className="text-red-600 font-bold mb-2 flex items-center text-lg"><AlertCircle className="w-5 h-5 mr-2"/> SOS Delivery Failed</h4>
            <p className="text-gray-600 text-sm mb-5 leading-relaxed">We couldn't reach the admin server. Would you like to force retry or call your emergency contact directly?</p>
            <div className="flex space-x-3">
              <button onClick={() => handleSOS(true)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 py-3 rounded-xl font-bold text-sm transition flex items-center justify-center">
                <RefreshCw size={16} className="mr-1.5" /> Retry
              </button>
              <button 
                onClick={() => toast.info(`Calling ${emergencyContact?.name || 'Emergency'} at ${emergencyContact?.phone || '911'}...`)} 
                className="flex-1 bg-slate-900 hover:bg-black text-white py-3 rounded-xl font-bold text-sm transition flex items-center justify-center shadow-md"
              >
                <PhoneCall size={16} className="mr-1.5" /> Call
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SOSButton;
