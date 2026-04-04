import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import api from '../api/axios';
import { Users, Activity, AlertCircle, ShieldAlert, CloudLightning, MapPin, Menu, Home, BarChart2, Bell, Settings, Database, Server, RefreshCw, Layers } from 'lucide-react';
import Overview from './admin/Overview';
import RiskSimulation from './admin/RiskSimulation';
import WorkerNetwork from './admin/WorkerNetwork';
import CommunityReports from './admin/CommunityReports';
import Broadcasts from './admin/Broadcasts';

const AdminDashboard = () => {
  const [workers, setWorkers] = useState([]);
  const [claims, setClaims] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = location.pathname.split('/').pop() || 'overview';

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [wRes, cRes, aRes, rRes] = await Promise.all([
          api.get('/users/workers'),
          api.get('/claims'),
          api.get('/alerts'),
          api.get('/reports/active').catch(() => ({ data: [] }))
        ]);
        setWorkers(wRes.data);
        setClaims(cRes.data);
        setAlerts(aRes.data);
        setReports(rRes.data);
      } catch (e) {
        console.log('Error fetching admin data', e);
      }
      setLoading(false);
    };
    fetchAdminData();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      const res = await api.put(`/users/${id}/status`);
      setWorkers(workers.map(w => w._id === id ? res.data.user : w));
    } catch (e) {
      alert('Failed to toggle status');
    }
  };

  const sendAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await api.post('/alerts', { type: 'announcement', message: announcement, zone: 'Global' });
      alert('Announcement sent!');
      setAnnouncement('');
      const aRes = await api.get('/alerts');
      setAlerts(aRes.data);
    } catch (e) {
      alert('Failed to send announcement');
    }
  };

  const simulateEvent = async (type) => {
    try {
      const activeWorker = workers.find(w => w.status === 'active');
      if (!activeWorker) return alert('No active workers to simulate on.');
      
      await api.post('/claims/trigger', { triggerType: type, userId: activeWorker._id });
      alert(`${type.toUpperCase()} simulated on worker ${activeWorker.name}! Payout processed if eligible.`);
      const cRes = await api.get('/claims');
      setClaims(cRes.data);
    } catch (e) {
      alert(`Simulation failed: ${e.response?.data?.error || e.message}`);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading SmartShield OS...</div>;

  const filteredWorkers = workers.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    w.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPayout = claims.reduce((acc, curr) => acc + curr.payout, 0);
  const chartData = [
    { name: 'Active Workers', value: workers.filter(w => w.status === 'active').length },
    { name: 'Total Claims', value: claims.length },
    { name: 'SOS Alerts', value: alerts.filter(a => a.type === 'sos').length }
  ];

  const SidebarItem = ({ icon: Icon, label, id, path }) => (
    <button 
      onClick={() => navigate(`/admin/${path}`)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl mb-2 transition-all font-semibold text-sm ${activeTab === path ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 group'}`}
    >
      <div className={`${activeTab === path ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'} transition-colors`}>
        <Icon size={18} />
      </div>
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-slate-50">
      
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 px-4 py-8 sticky top-20 h-[calc(100vh-80px)]">
        <div className="mb-8 px-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Command Center</p>
          <h2 className="text-xl font-black text-slate-900">Admin OS</h2>
        </div>
        
        <nav className="flex-1">
          <SidebarItem icon={Home} label="Overview" path="overview" />
          <SidebarItem icon={Activity} label="Risk Simulation" path="risk-simulation" />
          <SidebarItem icon={Users} label="Worker Network" path="workers" />
          <SidebarItem icon={Layers} label="Community Reports" path="community" />
          <SidebarItem icon={Bell} label="Broadcasts" path="broadcasts" />
        </nav>
        
        <div className="mt-auto px-4 py-6 border-t border-slate-100">
          <div className="flex items-center space-x-3 text-emerald-600 bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black tracking-[0.1em] uppercase">SYSTEM ONLINE</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-10 hide-scrollbar scroll-smooth">
        
        <Routes>
          <Route path="/" element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Overview workers={workers} claims={claims} alerts={alerts} reports={reports} totalPayout={totalPayout} />} />
          <Route path="risk-simulation" element={<RiskSimulation simulateEvent={simulateEvent} />} />
          <Route path="workers" element={
            <WorkerNetwork 
              workers={workers} 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              handleToggleStatus={handleToggleStatus} 
            />
          } />
          <Route path="community" element={<CommunityReports reports={reports} />} />
          <Route path="broadcasts" element={
            <Broadcasts 
              announcement={announcement} 
              setAnnouncement={setAnnouncement} 
              sendAnnouncement={sendAnnouncement} 
            />
          } />
        </Routes>

      </main>
    </div>
  );
};

export default AdminDashboard;
