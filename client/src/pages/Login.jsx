import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Button from '../components/common/Button';
import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning("Please enter your email and password");
      return;
    }
    
    setLoading(true);
    try {
      const userData = await login(email, password);
      toast.success(`Welcome back, ${userData.name}!`);
      if (userData.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 overflow-hidden relative">
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 z-10"
      >
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-3 rounded-2xl shadow-indigo-200 shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-center text-slate-500 mb-8">Secure login to your SmartShield Console</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                placeholder="you@example.com"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                placeholder="••••••••"
                required 
              />
            </div>
            
            <Button 
              type="submit" 
              fullWidth={true} 
              isLoading={loading}
              className="mt-4"
            >
              Sign In
            </Button>
          </form>
          
          <div className="mt-8 text-center text-sm text-slate-500">
            Don't have an account? <Link to="/register" className="text-indigo-600 font-semibold hover:underline">Get Protected</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
