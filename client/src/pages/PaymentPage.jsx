import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../api/axios';
import Button from '../components/common/Button';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan } = location.state || { plan: { name: 'Standard', price: 100, coverage: 5000 } };
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Simulate Razorpay / Payment Gateway logic
      setTimeout(async () => {
        try {
          await api.post('/policies', { premium: plan.price, coverage: plan.coverage });
          toast.success(`${plan.name} Protection Activated!`);
          navigate('/dashboard');
        } catch (err) {
          toast.error("Failed to activate policy.");
        } finally {
          setLoading(false);
        }
      }, 2000);
    } catch (error) {
      toast.error("Payment connection failed.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Plan Details */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4 text-center md:text-left">Secure Checkout</h1>
            <p className="text-slate-500 font-medium text-center md:text-left">Activate your AI-powered parametric coverage now.</p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full opacity-50"></div>
            <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-6">Selected Plan</h3>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-900 capitalize">{plan.name} Plan</h4>
                  <p className="text-slate-500 text-sm font-bold">SmartShield OS Protection</p>
                </div>
              </div>
              <div className="text-right">
                 <p className="text-3xl font-black text-slate-900">₹{plan.price}</p>
                 <p className="text-xs font-bold text-slate-400 capitalize">Weekly Premium</p>
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-50 pt-8">
               <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-bold">Coverage Limit</span>
                  <span className="text-slate-900 font-black">₹{plan.coverage.toLocaleString()}</span>
               </div>
               <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-bold">Payout Trigger</span>
                  <span className="text-slate-900 font-black">Autonomous AI Detect</span>
               </div>
               <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-bold">Processing Time</span>
                  <span className="text-emerald-600 font-black">Under 5 minutes</span>
               </div>
            </div>
          </div>

          <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 flex items-start space-x-4">
            <CheckCircle2 className="text-indigo-600 mt-1" size={20} />
            <p className="text-sm font-medium text-slate-600 leading-relaxed">
              By proceeding, you agree to the autonomous payout protocol. SmartShield AI will trigger payments based on verified environmental data in your current zone.
            </p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-[40px] shadow-2xl p-10 border border-slate-100 flex flex-col">
           <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center">
             <CreditCard className="mr-3 text-indigo-500" size={24} /> Payment Intel
           </h3>

           <div className="space-y-4 mb-10">
              <div className="p-5 border-2 border-indigo-600 bg-indigo-50/50 rounded-2xl flex justify-between items-center relative">
                 <div className="flex items-center space-x-4">
                    <div className="w-12 h-8 bg-slate-900 rounded-lg flex items-center justify-center p-1">
                       <span className="text-white text-[8px] font-black italic tracking-tighter">RAZORPAY</span>
                    </div>
                    <div>
                       <p className="font-black text-slate-900 text-sm">Razorpay Checkout</p>
                       <p className="text-[10px] font-bold text-slate-400">Cards, UPI, Netbanking</p>
                    </div>
                 </div>
                 <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                 </div>
              </div>

              <div className="p-5 border-2 border-slate-100 opacity-50 grayscale rounded-2xl flex justify-between items-center cursor-not-allowed">
                 <div className="flex items-center space-x-4">
                    <div className="w-12 h-8 bg-indigo-600 rounded-lg flex items-center justify-center p-1">
                       <span className="text-white text-[8px] font-black italic">UPI LITE</span>
                    </div>
                    <div>
                       <p className="font-black text-slate-900 text-sm">Direct UPI Sync</p>
                    </div>
                 </div>
                 <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center"></div>
              </div>
           </div>

           <div className="mt-auto">
              <div className="flex justify-between items-center mb-6">
                 <span className="text-slate-500 font-bold">Total to Pay</span>
                 <span className="text-3xl font-black text-slate-900">₹{plan.price}</span>
              </div>
              <Button fullWidth className="py-6 rounded-3xl" onClick={handlePayment} isLoading={loading}>
                 Complete Activation <ChevronRight className="ml-2" size={20} />
              </Button>
              <div className="flex items-center justify-center mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest space-x-4">
                 <div className="flex items-center"><Lock size={12} className="mr-1"/> 256-Bit SSL</div>
                 <div className="flex items-center">Verified Merchant</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
