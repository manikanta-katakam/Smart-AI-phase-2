import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  isLoading = false, 
  disabled = false,
  className = '',
  fullWidth = false
}) => {
  const baseStyle = "relative inline-flex items-center justify-center font-semibold rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 overflow-hidden";
  
  const variants = {
    primary: "bg-indigo-600 outline-none text-white hover:bg-indigo-700 shadow-md hover:shadow-lg focus:ring-indigo-500",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-500",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-md focus:ring-red-500",
    ghost: "bg-transparent text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500"
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.95 }}
      initial={{ opacity: 0.9 }}
      whileHover={{ opacity: 1 }}
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} px-6 py-3 ${className} ${disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
      ) : null}
      <span className={isLoading ? 'opacity-90' : ''}>{children}</span>
      
      {!isLoading && !disabled && variant === 'primary' && (
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent hover:animate-[shimmer_1.5s_infinite]" />
      )}
    </motion.button>
  );
};

export default Button;
