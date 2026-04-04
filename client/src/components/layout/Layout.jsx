import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow mt-16 relative">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
