import React, { useState, useContext, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, ArrowRight, User, Mic, MicOff, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { io } from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';

const socket = io('http://localhost:5002'); // Or dynamic if env varies

const ChatbotWidget = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      text: `Hi ${user?.name?.split(' ')[0] || 'there'}! I'm your SmartShield AI assistant. How can I help you today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, loading]);

  useEffect(() => {
    socket.on('riskAlert', (data) => {
      if (data.level === 'HIGH' || data.level === 'PAYOUT' || data.level === 'MEDIUM') {
        toast((t) => (
          <div className="flex items-center space-x-3">
             <ShieldAlert className={data.level === 'HIGH' ? "text-red-500" : "text-amber-500"} />
             <span><b>SmartShield Alert</b><br/><span className="text-sm">{data.message}</span></span>
          </div>
        ), {
          duration: 6000,
          position: 'top-right',
          style: { border: data.level === 'HIGH' ? '1px solid #ef4444' : '1px solid #f59e0b' }
        });
      }
    });
    return () => socket.off('riskAlert');
  }, []);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListen = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Voice recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(null, transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  const handleSend = async (e, presetText = null) => {
    if (e) e.preventDefault();
    const userMsg = presetText || input;
    if (!userMsg.trim()) return;

    if (window.speechSynthesis) window.speechSynthesis.cancel();

    const newTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const payloadHistory = messages.slice(-5);
    setMessages(prev => [...prev, { role: 'user', text: userMsg, time: newTime }]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post('/chat', { 
        message: userMsg,
        userData: user,
        history: payloadHistory
      });
      
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: data.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        speak(data.reply);
        setLoading(false);
      }, 800);

    } catch (err) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: "⚠️ AI temporarily unavailable. Try again.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setLoading(false);
      }, 800);
    }
  };

  const quickActions = [
    "Check my premium",
    "Why is risk high?",
    "Will I get payout?",
    "Suggest best plan",
    "Run Demo (Storm)"
  ];

  const triggerDemo = () => {
    toast.success('Simulation initializing... Please wait.');
    socket.emit('simulateDemoPhase', 1);
    setTimeout(() => socket.emit('simulateDemoPhase', 2), 4000);
    setTimeout(() => socket.emit('simulateDemoPhase', 3), 8000);
  };

  const renderFormattedText = (text) => {
    const parts = text.split(/(premium|risk|plan|basic|standard)/gi);
    return parts.map((part, i) => {
      const lower = part.toLowerCase();
      if (['premium', 'risk', 'plan', 'basic', 'standard'].includes(lower)) {
        return <span key={i} className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-900 font-extrabold px-1.5 py-0.5 rounded-md mx-0.5 shadow-sm">{part}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <>
      <Toaster />
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-[130px] md:bottom-8 md:right-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-2xl z-40 hover:shadow-indigo-500/50 transition-all flex items-center justify-center border-2 border-white/20"
      >
        <Sparkles size={26} className="text-white" />
        {messages.length === 1 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-indigo-600 rounded-full animate-ping"></span>}
        {messages.length === 1 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-indigo-600 rounded-full"></span>}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-4 md:right-8 w-[calc(100vw-32px)] md:w-[450px] bg-slate-50/95 rounded-3xl overflow-hidden z-50 border border-slate-200/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] flex flex-col h-[650px] max-h-[85vh] backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md p-4 px-6 flex justify-between items-center border-b border-slate-100 relative z-10 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/30">
                  <Bot className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center">
                    SmartShield AI
                    <Sparkles size={12} className="ml-1.5 text-amber-400" />
                  </h3>
                  <div className="flex items-center mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5"></span>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Online & Ready</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors bg-slate-100 hover:bg-slate-200 rounded-full p-2 focus:outline-none">
                <X size={16} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-5 overflow-y-auto bg-slate-50/30 flex flex-col hide-scrollbar relative">
              <div className="space-y-6 mt-auto">
                {messages.map((m, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    key={i} 
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} flex-col`}
                  >
                    <div className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {m.role === 'ai' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mr-3 flex-shrink-0 mt-1 shadow-md">
                          <Bot size={14} className="text-white" />
                        </div>
                      )}
                      
                      <div className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                        <div 
                          className={`p-4 text-[14px] leading-relaxed shadow-sm ${
                            m.role === 'user' 
                              ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-3xl rounded-tr-sm font-medium shadow-indigo-500/20' 
                              : 'bg-white/90 backdrop-blur-md text-slate-700 border border-slate-200/50 rounded-3xl rounded-tl-sm shadow-slate-200/50'
                          }`}
                        >
                          {m.role === 'ai' ? renderFormattedText(m.text) : m.text}
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold mt-1.5 px-1">{m.time}</span>
                      </div>

                      {m.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center ml-3 flex-shrink-0 mt-1 shadow-inner border border-slate-300">
                          <User size={14} className="text-slate-500" />
                        </div>
                      )}
                    </div>
                    {/* Render Plan recommendation card if text contains specific phrase */}
                    {m.role === 'ai' && m.text.toLowerCase().includes('suggest') && m.text.toLowerCase().includes('plan') && (
                       <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-2 ml-11 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl shadow-sm max-w-[70%]">
                          <h4 className="font-bold text-indigo-900 text-xs mb-1">Recommended Action</h4>
                          <p className="text-xs text-slate-600 mb-3">Upgrade to Premium Plan for full 100% weather and mobility disruption coverage.</p>
                          <button onClick={() => {toast.success('Simulated: Navigating to payment flow...'); setTimeout(() => toast.success('Payment Processed: Premium Active!'), 2000)}} className="bg-indigo-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg w-full shadow-sm hover:bg-indigo-700 transition">Proceed to Payment / Upgrade</button>
                       </motion.div>
                    )}
                  </motion.div>
                ))}
                
                {loading && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start w-full">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mr-3 flex-shrink-0 mt-1 shadow-md">
                      <Bot size={14} className="text-white" />
                    </div>
                    <div className="flex flex-col items-start">
                      <div className="p-4 bg-white/90 border border-slate-200/50 rounded-3xl rounded-tl-sm shadow-sm flex flex-col justify-center min-h-[52px]">
                        <div className="flex space-x-1.5 items-center px-2">
                           <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce"></span>
                           <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-bounce" style={{animationDelay: '150ms'}}></span>
                           <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce" style={{animationDelay: '300ms'}}></span>
                        </div>
                      </div>
                      <span className="text-[10px] text-indigo-400 font-bold mt-1.5 px-1 tracking-wider animate-pulse">AI is thinking...</span>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} className="h-2" />
              </div>
            </div>

            {/* Quick Actions */}
            {!loading && (
              <div className="px-5 pb-4 pt-1 bg-slate-50/80 flex flex-wrap gap-2 z-10">
                {quickActions.map((action, idx) => (
                  <motion.button 
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    key={idx}
                    onClick={() => action.includes('Demo') ? triggerDemo() : handleSend(null, action)}
                    className={`${action.includes('Demo') ? 'bg-indigo-100 border-indigo-300 text-indigo-800 ring-2 ring-indigo-200 animate-pulse' : 'bg-white border-slate-200 hover:border-indigo-400 hover:text-indigo-700 text-slate-600'} border hover:shadow-md text-[11px] font-bold px-3.5 py-2 rounded-xl transition-all flex items-center`}
                  >
                    {action} <ArrowRight size={10} className="ml-1.5 opacity-60" />
                  </motion.button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white/90 backdrop-blur-xl border-t border-slate-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] relative z-20">
              <form onSubmit={(e) => handleSend(e)} className="flex bg-slate-50 rounded-2xl p-1.5 border border-slate-200 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-300 relative items-center">
                <button
                  type="button"
                  onClick={toggleListen}
                  className={`w-10 h-10 ml-1 flex flex-shrink-0 items-center justify-center rounded-xl transition-all ${isListening ? 'bg-red-100 text-red-600 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {isListening ? <Mic size={18} /> : <MicOff size={18} />}
                </button>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent px-3 py-3 focus:outline-none text-sm font-medium text-slate-800 placeholder-slate-400"
                  placeholder={isListening ? "Listening..." : "Message SmartShield AI..."}
                />
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit" 
                  disabled={(!input.trim() && !isListening) || loading} 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-12 h-10 flex flex-shrink-0 items-center justify-center rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:grayscale transition-all focus:outline-none"
                >
                  <Send size={18} className="translate-x-0.5" />
                </motion.button>
              </form>
              <p className="text-center text-[9px] text-slate-400 font-medium mt-3 uppercase tracking-widest">AI & Voice powered via Gemini & Web Speech API</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
