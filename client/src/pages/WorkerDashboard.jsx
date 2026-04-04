import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { Shield, CloudRain, AlertTriangle, IndianRupee, Activity, Umbrella, TrendingUp, Compass, HeartPulse, RefreshCcw, AlertOctagon, X, MapPin, Cpu } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import SOSButton from '../components/common/SOSButton';
import ChatbotWidget from '../components/chat/ChatbotWidget';
import Button from '../components/common/Button';
import WeatherMap from '../components/weather/WeatherMap';

const WorkerDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);
  const [claims, setClaims] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [reportData, setReportData] = useState({ type: 'roadblock', description: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const policyRes = await api.get('/policies');
        setPolicy(policyRes.data);
      } catch (e) {
        console.log('No policy active');
      }
      try {
        const claimsRes = await api.get('/claims/myclaims');
        setClaims(claimsRes.data);
      } catch (e) {
        console.log('Error fetching claims');
      }
      try {
        const predRes = await api.get('/predict');
        setPrediction(predRes.data);
      } catch (e) {
        console.log('No prediction available');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const plans = [
    { name: 'Basic', price: 50, coverage: 2000, color: 'emerald' },
    { name: 'Standard', price: 100, coverage: 5000, color: 'indigo' },
    { name: 'Premium', price: 200, coverage: 10000, color: 'purple' }
  ];

  const handleSelectPlan = (plan) => {
    navigate('/payment', { state: { plan } });
  };

  const submitReport = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const loc = user?.location || { lat: 28.7041, lng: 77.1025 };
      await api.post('/reports', { ...reportData, location: loc });
      toast.success("Hazard broadcasted to community network.");
      setShowReportModal(false);
      setReportData({ type: 'roadblock', description: '' });
    } catch (err) {
      toast.error("Failed to broadcast hazard report.");
    } finally {
      setCreating(false);
    }
  };

  const renderSkeleton = () => (
    <div className="animate-pulse space-y-8 max-w-7xl mx-auto px-4 py-8">
      <div className="h-10 bg-gray-200 rounded-full w-1/3 mb-10"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-48 bg-gray-200 rounded-3xl"></div>
        <div className="h-48 bg-gray-200 rounded-3xl"></div>
        <div className="h-48 bg-gray-200 rounded-3xl"></div>
      </div>
      <div className="h-64 bg-gray-200 rounded-3xl"></div>
    </div>
  );

  if (loading) return renderSkeleton();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="mb-8 flex flex-col md:flex-row md:justify-between items-start md:items-end gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Console, {user?.name}</h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Your personalized Parametric AI Protection interface.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setShowReportModal(true)} className="flex items-center space-x-2 text-white bg-slate-900 hover:bg-black transition px-5 py-2.5 rounded-xl font-bold text-sm shadow-md">
            <AlertOctagon size={16} />
            <span>Report Hazard</span>
          </button>
          <button onClick={() => window.location.reload()} className="flex items-center space-x-2 text-slate-700 bg-slate-50 hover:bg-slate-100 transition px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-sm shadow-sm">
            <RefreshCcw size={16} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
        </div>
      </div>

      <div className="mb-8 max-w-7xl mx-auto">
        <WeatherMap />
      </div>

      {!policy ? (
        <div className="mt-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Select Your Protection Engine</h2>
            <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">Gig routes carry environmental hazards. Enable SmartShield to trigger zero-paperwork payouts during disruptions.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((p, idx) => (
              <div key={idx} className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-10 flex flex-col items-center text-center relative overflow-hidden hover:shadow-2xl hover:scale-[1.05] hover:border-indigo-100 transition-all group">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-${p.color}-50 rounded-bl-[100%] transition-transform group-hover:scale-125`}></div>
                
                <div className={`w-16 h-16 rounded-2xl bg-${p.color}-500 flex items-center justify-center text-white shadow-lg shadow-${p.color}-500/20 mb-8 relative z-10`}>
                   <Umbrella size={32} />
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-2 relative z-10 capitalize">{p.name} Protect</h3>
                <div className="flex items-baseline mb-8 relative z-10">
                   <span className="text-4xl font-black text-slate-900">₹{p.price || 0}</span>
                   <span className="text-slate-400 font-bold ml-1 text-sm">/week</span>
                </div>
                
                <div className="w-full space-y-4 mb-10 border-t border-slate-50 pt-8 relative z-10">
                   <div className="flex justify-between items-center text-sm font-bold text-slate-500 tracking-tight">
                     <span>Coverage</span>
                     <span className="text-slate-900 font-black">₹{p.coverage?.toLocaleString() || '0'}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm font-bold text-slate-500 tracking-tight">
                     <span>AI Matrix</span>
                     <span className="text-emerald-500 font-black flex items-center"><Activity size={14} className="mr-1"/> Active</span>
                   </div>
                   <div className="flex justify-between items-center text-sm font-bold text-slate-500 tracking-tight">
                     <span>Payout</span>
                     <span className="text-slate-900 font-black">Instant Link</span>
                   </div>
                </div>
                
                <Button fullWidth onClick={() => { setSelectedPlan(p); setShowPaymentModal(true); }} className="rounded-2xl py-5 shadow-lg group-hover:shadow-indigo-500/20">
                   Activate Engine
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Main Grid: Coverage, Wallet, Trust */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Coverage Card */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-[-20%] right-[-10%] p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Shield size={180} />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-indigo-200 font-bold text-xs uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">Active Coverage Limit</h3>
                  </div>
                  <p className="text-5xl font-black mb-1 drop-shadow-md tracking-tight">₹{policy?.coverage?.toLocaleString() || '0'}</p>
                  <p className="text-indigo-200 text-sm font-medium mt-3 flex items-center">
                    <Activity size={16} className="mr-2"/> AI Predicts Safe Route
                  </p>
                </div>
                {policy.aiExplanation && (
                  <div className="mt-6 bg-black/20 p-4 rounded-2xl border border-white/10 text-xs text-indigo-100 font-medium leading-relaxed backdrop-blur-md">
                    <span className="text-yellow-400 font-bold mr-1">AI Note:</span> {policy.aiExplanation}
                  </div>
                )}
              </div>
            </div>

            {/* Wallet Integration Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden">
               <div className="absolute -right-10 -bottom-10 bg-emerald-50 w-48 h-48 rounded-full opacity-60"></div>
               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg">Digital Wallet</h3>
                    <div className="p-2.5 bg-emerald-100 rounded-2xl shadow-inner"><TrendingUp className="text-emerald-600" size={20} /></div>
                  </div>
                  <p className="text-4xl font-black text-slate-900 mb-2 font-mono">₹{user?.wallet?.balance?.toLocaleString() || '0'}</p>
                  <p className="text-slate-500 text-xs font-semibold mb-6">Available Balance</p>
                  
                  <div className="flex justify-between border-t border-slate-50 pt-5 mt-auto">
                    <div>
                      <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Total Paid</p>
                      <p className="text-slate-700 font-bold">₹{user?.wallet?.totalPremiumPaid?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Total Earned</p>
                      <p className="text-emerald-600 font-bold">₹{user?.wallet?.totalClaimsReceived?.toLocaleString() || '0'}</p>
                    </div>
                  </div>
               </div>
            </div>

            {/* Trust Score & Premium Matrix */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
              <div className="absolute -left-10 -top-10 bg-purple-50 w-40 h-40 rounded-full opacity-60"></div>
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg">Premium Engine</h3>
                  <div className="p-2.5 bg-purple-100 rounded-2xl shadow-inner"><HeartPulse className="text-purple-600" size={20} /></div>
                </div>
                
                <div className="flex items-baseline mb-6 border-b border-slate-50 pb-5">
                  <span className="text-4xl font-black text-slate-900 mr-2">₹{policy.premium}</span>
                  <span className="text-slate-500 text-sm font-semibold">/week</span>
                </div>
                
                <div className="space-y-3 mt-auto">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-600 flex items-center"><Compass size={14} className="mr-1.5 text-indigo-400"/> GPS Consistency</span>
                    <span className="text-xs font-black text-slate-800 bg-slate-100 px-2 py-1 rounded-md">{user?.trustScoreDetails?.gpsConsistency || 100}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-600 flex items-center"><Activity size={14} className="mr-1.5 text-emerald-400"/> Safe Behavior</span>
                    <span className="text-xs font-black text-slate-800 bg-slate-100 px-2 py-1 rounded-md">{user?.trustScoreDetails?.behavior || 100}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full" style={{ width: `${user?.trustScore || 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Prediction Engine Card */}
          {prediction && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 shadow-sm border border-indigo-100 mb-8 flex flex-col md:flex-row md:items-center justify-between overflow-hidden relative group">
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-200 blur-3xl rounded-full opacity-60"></div>
              <div className="relative z-10 md:w-1/2 md:pr-8 mb-6 md:mb-0">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/30">
                    <Cpu className="text-white" size={24} />
                  </div>
                  <h3 className="font-extrabold text-slate-900 tracking-tight flex items-center">
                    AI Prediction Engine <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 font-black text-[10px] rounded uppercase tracking-widest animate-pulse">LIVE</span>
                  </h3>
                </div>
                <p className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">
                  Tomorrow Risk: <span className={prediction?.nextRisk === 'HIGH' ? "text-red-500" : "text-amber-500"}>{prediction?.nextRisk || 'LOW'}</span>
                </p>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-slate-500 font-bold text-sm tracking-wide">Probability Vector:</span>
                  <span className="bg-slate-200 text-slate-800 font-black px-2 py-0.5 rounded text-sm">{prediction?.probability || '12%'}</span>
                </div>
                <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white shadow-sm">
                  <p className="text-slate-600 font-semibold text-sm leading-relaxed mb-3">
                    <span className="font-bold text-indigo-700">Suggestion:</span> {prediction.recommendation}
                  </p>
                  <button onClick={() => { setSelectedPlan(plans[2]); setShowPaymentModal(true); }} className="w-full bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-black transition-colors shadow-md">
                    Activate Recommended Plan
                  </button>
                </div>
              </div>

              {/* Chart Side */}
              <div className="relative z-10 md:w-1/2 h-[220px] bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">24-Hour Predictive Risk Trend</p>
                <ResponsiveContainer width="100%" height="85%">
                  <AreaChart data={[ { time: '6 AM', risk: 20 }, { time: '12 PM', risk: 45 }, { time: '4 PM', risk: 78 }, { time: '8 PM', risk: 85 }, { time: '12 AM', risk: 60 } ]}>
                    <defs>
                      <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#cbd5e1" tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}/>
                    <Area type="monotone" dataKey="risk" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-12">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">Recent Automated Payouts</h3>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider">Blockchain Secured</span>
            </div>
            <div className="divide-y divide-slate-50">
              {claims.length === 0 ? (
                <div className="p-16 text-center text-slate-400">
                  <Shield size={48} className="mx-auto mb-4 text-slate-200" />
                  <p className="font-medium text-lg text-slate-500">No claims triggered yet.</p>
                  <p className="text-sm mt-1">SmartShield will autonomously process funds during weather anomalies.</p>
                </div>
              ) : (
                claims.map(claim => (
                  <div key={claim._id} className="p-6 px-8 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center space-x-6 mb-4 md:mb-0">
                      <div className={`p-4 rounded-2xl shadow-sm group-hover:scale-110 transition-transform ${claim.triggerType === 'rain' || claim.triggerType === 'flood' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                        {claim.triggerType === 'rain' || claim.triggerType === 'flood' ? <CloudRain size={28} /> : <AlertTriangle size={28} />}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 capitalize flex items-center">
                          {claim.triggerType} Interruption
                          <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-widest">
                            {claim.status}
                          </span>
                        </h4>
                        <p className="text-sm text-slate-500 font-medium mt-1">{new Date(claim.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                        {claim.aiExplanation && <p className="text-xs text-indigo-600 mt-2 font-medium bg-indigo-50 px-3 py-1.5 rounded-lg inline-block">{claim.aiExplanation}</p>}
                      </div>
                    </div>
                    <div className="text-left md:text-right ml-20 md:ml-0">
                      <p className="text-3xl font-black text-emerald-600 font-mono tracking-tight">+₹{claim?.payout?.toLocaleString() || '0'}</p>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Deposited</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      <SOSButton location={user?.location} emergencyContact={user?.emergencyContact} />
      <ChatbotWidget />

      {/* Report Hazard Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 p-8 relative">
            <button onClick={() => setShowReportModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 bg-slate-50 rounded-full p-2">
              <X size={18} />
            </button>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-red-50 p-3 rounded-2xl">
                <AlertOctagon className="text-red-500" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Broadcast Hazard</h2>
            </div>
            
            <form onSubmit={submitReport} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Hazard Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setReportData({...reportData, type: 'roadblock'})} className={`py-3 rounded-xl border-2 font-bold text-sm transition ${reportData.type === 'roadblock' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'}`}>
                    Roadblock
                  </button>
                  <button type="button" onClick={() => setReportData({...reportData, type: 'flood'})} className={`py-3 rounded-xl border-2 font-bold text-sm transition ${reportData.type === 'flood' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'}`}>
                    Flash Flood
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Location Detection</label>
                <div className="flex items-center text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100 font-medium text-sm">
                  <MapPin size={16} className="mr-2" /> GPS Coordinates Locked
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Additional Warning Context</label>
                <textarea 
                  value={reportData.description}
                  onChange={(e) => setReportData({...reportData, description: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition resize-none h-24"
                  placeholder="E.g. The bridge on 54th street is completely submerged..."
                ></textarea>
              </div>
              
              <Button type="submit" isLoading={creating} fullWidth className="py-4 shadow-xl">
                Alert Community & Admins
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal Flow */}
      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 p-8 relative">
            <button onClick={() => setShowPaymentModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 bg-slate-50 rounded-full p-2">
              <X size={18} />
            </button>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Checkout: {selectedPlan.name} Plan</h2>
            <p className="text-slate-500 font-medium mb-6 text-sm">Secure parametric coverage activation via SmartShield Network.</p>
            
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-6 space-y-3">
               <div className="flex justify-between items-center text-sm">
                 <span className="font-bold text-slate-600">Weekly Premium</span>
                 <span className="font-extrabold text-slate-900">₹{selectedPlan.price}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="font-bold text-slate-600">Coverage Limit</span>
                 <span className="font-extrabold text-slate-900">₹{selectedPlan.coverage.toLocaleString()}</span>
                 <span className="font-extrabold text-slate-900">₹{selectedPlan?.coverage?.toLocaleString() || 0}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="font-bold text-slate-600">Benefits</span>
                 <span className="font-bold text-emerald-600">AI Claims, Zero Docs</span>
               </div>
               <div className="border-t border-slate-200 my-2 pt-3 flex justify-between items-center">
                 <span className="font-black text-slate-800">Total Due</span>
                 <span className="font-black text-2xl text-slate-900">₹{selectedPlan?.price || 0}</span>
               </div>
            </div>

            <Button 
               fullWidth 
               className="py-4 shadow-xl text-lg flex justify-center items-center" 
               onClick={() => {
                 toast.loading("Simulating Gateway...", { id: "pay" });
                 setTimeout(() => {
                    toast.success("Payment Successful! Plan Activated.", { id: "pay" });
                    setShowPaymentModal(false);
                    window.location.reload();
                 }, 2000);
               }}
            >
              Proceed to Payment
            </Button>
          </div>
        </div>
      )}

    </div>
  );
};

export default WorkerDashboard;
