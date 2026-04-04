import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, LogOut, Menu, Bell, MessageSquare, Briefcase } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully");
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname.includes(path) ? "text-indigo-600 font-bold bg-indigo-50" : "text-gray-600 hover:text-indigo-600 hover:bg-slate-50";
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm h-20 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center w-full">
          
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl group-hover:scale-105 transition-transform shadow-md">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="ml-3 font-extrabold text-xl tracking-tight text-slate-800">
              SmartShield<span className="text-indigo-600">.ai</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className={`px-4 py-2 rounded-full transition-all flex items-center text-sm ${isActive(user.role === 'admin' ? '/admin' : '/dashboard')}`}>
                  <Briefcase className="h-4 w-4 mr-2" />
                  Console
                </Link>
                <Link to="/chat" className={`p-2 rounded-full transition-all relative ${isActive('/chat')}`}>
                  <MessageSquare className="h-5 w-5" />
                </Link>
                <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                
                {/* Profile Chip */}
                <div className="flex items-center pl-4 border-l border-gray-200">
                  <div className="flex items-center space-x-2 text-slate-700 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 shadow-inner">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <span className="font-semibold text-sm mr-1 pr-1">{user?.name || 'User'}</span>
                  </div>
                  <button onClick={handleLogout} className="ml-3 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-indigo-600 font-semibold transition px-4 py-2 rounded-full hover:bg-slate-50">Log in</Link>
                <Link to="/register" className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-slate-800 transition shadow-md hover:shadow-lg">Get Protected</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="text-slate-500 hover:text-indigo-600 focus:outline-none">
              <Menu className="h-7 w-7" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
