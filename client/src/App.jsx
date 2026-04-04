import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import { Suspense, lazy } from 'react';

const LandingPage = lazy(() => import('./pages/LandingPage.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const WorkerDashboard = lazy(() => import('./pages/WorkerDashboard.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));
const Chat = lazy(() => import('./pages/Chat.jsx'));
const PaymentPage = lazy(() => import('./pages/PaymentPage.jsx'));

const App = () => {
  return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        <Suspense fallback={<div className="flex h-screen items-center justify-center font-bold text-slate-500">Loading SmartShield...</div>}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<LandingPage />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="dashboard" element={
                <ProtectedRoute>
                  <WorkerDashboard />
                </ProtectedRoute>
              } />
              <Route path="payment" element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              } />
              <Route path="admin/*" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="chat" element={<Chat />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
  );
};

export default App;
