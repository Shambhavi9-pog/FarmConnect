import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  User, 
  Phone, 
  MapPin, 
  Mail, 
  Lock, 
  Sprout, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2,
  Tractor,
  ShoppingCart
} from 'lucide-react';

export const AuthModal = ({ isOpen, onClose, initialMode = 'login', defaultRole = 'farmer' }) => {
  const { login, registerFarmer, switchDemoRole, isFirebaseConfigured, authError } = useAuth();

  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [role, setRole] = useState(defaultRole); // 'farmer' | 'consumer'

  // Farmer registration form
  const [farmerForm, setFarmerForm] = useState({
    name: '',
    mobile: '',
    village: '',
    district: '',
    state: 'Punjab',
    email: '',
    password: ''
  });

  // Login form
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    const res = await login(loginForm.email, loginForm.password);
    setSubmitting(false);

    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || 'Login failed. Please check credentials.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!farmerForm.name || !farmerForm.mobile || !farmerForm.village || !farmerForm.district || !farmerForm.email || !farmerForm.password) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (farmerForm.mobile.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    const res = await registerFarmer(farmerForm);
    setSubmitting(false);

    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || 'Registration failed. Try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 pt-6 pb-4 bg-earth-50 border-b border-earth-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-farm-600 text-white flex items-center justify-center shadow-md">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                {mode === 'login' ? 'Welcome to FarmConnect' : 'Farmer Registration'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {mode === 'login' ? 'Access your agricultural dashboard' : 'Join India\'s direct farmer marketplace'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Credentials Bar (Super helpful for Hackathon testing) */}
        <div className="bg-amber-50/80 px-6 py-2.5 border-b border-amber-200 flex items-center justify-between text-xs">
          <span className="text-amber-900 font-semibold">1-Click Test Login:</span>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => {
                switchDemoRole('farmer');
                onClose();
              }}
              className="px-2 py-1 bg-farm-600 text-white rounded font-bold hover:bg-farm-700 text-[11px]"
            >
              Demo Farmer
            </button>
            <button
              type="button"
              onClick={() => {
                switchDemoRole('consumer');
                onClose();
              }}
              className="px-2 py-1 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 text-[11px]"
            >
              Consumer
            </button>
            <button
              type="button"
              onClick={() => {
                switchDemoRole('admin');
                onClose();
              }}
              className="px-2 py-1 bg-purple-600 text-white rounded font-bold hover:bg-purple-700 text-[11px]"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1.5 mx-6 mt-4 bg-slate-100 rounded-xl text-xs font-bold shrink-0">
          <button
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Register as Farmer
          </button>
        </div>

        {/* Error Alert */}
        {(errorMsg || authError) && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg || authError}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. gurpreet@farmconnect.in"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs rounded-xl shadow-md shadow-farm-600/30 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {submitting ? 'Authenticating...' : 'Sign In to FarmConnect'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-500">
                  New farmer?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="font-bold text-farm-600 hover:underline"
                  >
                    Create Farmer Account
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              
              {/* Farmer Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Farmer Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jaswant Singh Dhillon"
                    value={farmerForm.name}
                    onChange={(e) => setFarmerForm({ ...farmerForm, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (Calling & WhatsApp) *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number (e.g. 9876543210)"
                    value={farmerForm.mobile}
                    onChange={(e) => setFarmerForm({ ...farmerForm, mobile: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500"
                  />
                </div>
              </div>

              {/* Village & District */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Village / Town *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Khanna Kalan"
                    value={farmerForm.village}
                    onChange={(e) => setFarmerForm({ ...farmerForm, village: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">District *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ludhiana"
                    value={farmerForm.district}
                    onChange={(e) => setFarmerForm({ ...farmerForm, district: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500"
                  />
                </div>
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
                <select
                  value={farmerForm.state}
                  onChange={(e) => setFarmerForm({ ...farmerForm, state: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500 bg-white"
                >
                  <option value="Punjab">Punjab</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="farmer@example.com"
                    value={farmerForm.email}
                    onChange={(e) => setFarmerForm({ ...farmerForm, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Choose secure password"
                    value={farmerForm.password}
                    onChange={(e) => setFarmerForm({ ...farmerForm, password: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs rounded-xl shadow-md shadow-farm-600/30 transition-all flex items-center justify-center gap-2 mt-4"
              >
                {submitting ? 'Registering Farmer Account...' : 'Complete Registration & Open Dashboard'}
                <Sprout className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-500">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="font-bold text-farm-600 hover:underline"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
