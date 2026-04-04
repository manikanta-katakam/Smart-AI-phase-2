import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Button from '../components/common/Button';
import { ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('worker');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.warning("Please fill in all fields");
      return;
    }

    setLoading(true);
    // Simulate fetching GPS location
    const location = { lat: 28.7041, lng: 77.1025 };

    try {
      const userDataParams = { name, email, password, role, location };
      const userData = await register(userDataParams);
      toast.success("Account created! Welcome to SmartShield.");
      if (userData.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 overflow-hidden relative">
      <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 z-10 my-8"
      >
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-3 rounded-2xl shadow-indigo-200 shadow-lg">
              <ShieldAlert className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-2 tracking-tight">Get Protected</h2>
          <p className="text-center text-slate-500 mb-8">Join the AI parametric insurance network</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Account Role</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition appearance-none"
              >
                <option value="worker">Gig Worker</option>
                <option value="admin">Platform Admin</option>
              </select>
            </div>
            
            <Button 
              type="submit" 
              fullWidth={true} 
              isLoading={loading}
              className="mt-6"
            >
              Create Account
            </Button>
          </form>
          
          <div className="mt-8 text-center text-sm text-slate-500">
            Already registered? <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Log in</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
