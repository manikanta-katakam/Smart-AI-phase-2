import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, CloudLightning, Activity, ArrowRight, Zap, Target } from 'lucide-react';

const Landing = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-6 py-24 md:py-32 flex-1 flex flex-col justify-center items-center overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto text-center z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center px-4 py-2 mt-8 mb-6 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold tracking-wide"
          >
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2 pulse-dot"></span>
            SmartShield v2.0 Now Live
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6"
          >
            Automated Protection for <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Gig Economy Workers
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Parametric insurance powered by real-time climate AI. When intense rain or roadblocks hit your zone, payouts are triggered instantly. Zero paperwork.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Link to="/register" className="px-8 py-4 rounded-full bg-slate-900 text-white font-semibold text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center">
              Start Free Coverage <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/login" className="px-8 py-4 rounded-full bg-white text-slate-800 border border-slate-200 font-semibold text-lg hover:bg-slate-50 transition-all flex items-center justify-center">
              Login to Console
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-24 relative z-10 border-t border-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How the Platform Works</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">SmartShield uses hyper-local risk assessment to automate payouts the exact minute you lose your earning capability due to external variables.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<CloudLightning size={32} className="text-indigo-600" />}
              title="1. Climate AI Triggers"
              desc="OpenWeather integration detects heavy blockages or flash floods in your mapped gig zone instantly."
            />
            <FeatureCard 
              icon={<Activity size={32} className="text-purple-600" />}
              title="2. Smart Risk Premiums"
              desc="Your weekly premium is calculated dynamically using a generalized Trust Score and active routing risk factors."
            />
            <FeatureCard 
              icon={<Zap size={32} className="text-emerald-600" />}
              title="3. Zero Paperwork Payouts"
              desc="If risk thresholds exceed our parameters, your digital wallet immediately receives the insured loss amount."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all"
  >
    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-slate-100">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{desc}</p>
  </motion.div>
);

export default Landing;
