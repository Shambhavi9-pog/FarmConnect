import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sprout, 
  Store, 
  TrendingUp, 
  LayoutDashboard, 
  ShieldCheck, 
  PlusCircle, 
  LogOut, 
  User, 
  Menu, 
  X,
  Phone,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

export const Navbar = ({ currentView, setCurrentView, onOpenAuth }) => {
  const { user, logout, switchDemoRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navigate = (view) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => navigate('home')} 
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-farm-700 to-farm-500 flex items-center justify-center text-white shadow-md shadow-farm-700/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-farm-700 transition-colors">
                  Farm<span className="text-farm-600">Connect</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-farm-100 text-farm-800 uppercase tracking-wider">
                  Direct Mandi
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                Local Farmer Market Information System
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => navigate('home')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentView === 'home'
                  ? 'text-farm-700 bg-farm-50'
                  : 'text-slate-600 hover:text-farm-700 hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => navigate('browse')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                currentView === 'browse'
                  ? 'text-farm-700 bg-farm-50'
                  : 'text-slate-600 hover:text-farm-700 hover:bg-slate-50'
              }`}
            >
              <Store className="w-4 h-4" />
              Browse Crops
            </button>

            <button
              onClick={() => navigate('compare')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                currentView === 'compare'
                  ? 'text-farm-700 bg-farm-50'
                  : 'text-slate-600 hover:text-farm-700 hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Price Compare
            </button>

            {/* Farmer Dashboard Link */}
            <button
              onClick={() => navigate('farmer-dashboard')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                currentView === 'farmer-dashboard'
                  ? 'text-farm-700 bg-farm-50'
                  : 'text-slate-600 hover:text-farm-700 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Farmer Dashboard
            </button>

            {/* Admin Dashboard */}
            <button
              onClick={() => navigate('admin-dashboard')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                currentView === 'admin-dashboard'
                  ? 'text-purple-700 bg-purple-50'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </button>
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {user?.role === 'farmer' && (
              <button
                onClick={() => navigate('add-crop')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-farm-600 hover:bg-farm-700 text-white text-xs font-bold shadow-sm shadow-farm-600/30 hover:shadow transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Crop</span>
              </button>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-slate-200 hover:border-farm-400 bg-white shadow-sm hover:shadow transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-farm-100 border border-farm-200 text-farm-700 flex items-center justify-center font-bold text-xs uppercase overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name?.charAt(0) || 'U'
                    )}
                  </div>
                  <div className="hidden lg:block leading-tight">
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">{user.name}</p>
                    <p className="text-[10px] font-medium text-farm-600 capitalize">{user.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email || user.mobile}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-farm-100 text-farm-800 uppercase tracking-wide">
                        {user.role} Account
                      </span>
                    </div>

                    <div className="py-1">
                      {user.role === 'farmer' && (
                        <>
                          <button
                            onClick={() => navigate('farmer-dashboard')}
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-farm-50 hover:text-farm-700 flex items-center gap-2"
                          >
                            <LayoutDashboard className="w-3.5 h-3.5" /> Farmer Dashboard
                          </button>
                          <button
                            onClick={() => navigate('add-crop')}
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-farm-50 hover:text-farm-700 flex items-center gap-2"
                          >
                            <PlusCircle className="w-3.5 h-3.5" /> Publish New Crop
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => navigate('compare')}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-farm-50 hover:text-farm-700 flex items-center gap-2"
                      >
                        <TrendingUp className="w-3.5 h-3.5" /> Compare Crop Prices
                      </button>

                      <button
                        onClick={() => navigate('admin-dashboard')}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" /> Platform Admin Portal
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1 mt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-farm-700 hover:bg-slate-100 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-2 rounded-xl bg-farm-600 hover:bg-farm-700 text-white text-xs font-bold shadow-sm shadow-farm-600/30 transition-all"
                >
                  Register as Farmer
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {user?.role === 'farmer' && (
              <button
                onClick={() => navigate('add-crop')}
                className="p-2 rounded-lg bg-farm-600 text-white"
                title="Add Crop"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-xl">
          {user && (
            <div className="p-3 bg-farm-50 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-farm-200 text-farm-800 flex items-center justify-center font-bold text-sm">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="leading-tight">
                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                <p className="text-xs text-farm-700 font-semibold capitalize">{user.role} Account</p>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-1">
            <button
              onClick={() => navigate('home')}
              className={`text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
                currentView === 'home' ? 'bg-farm-100 text-farm-800' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigate('browse')}
              className={`text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                currentView === 'browse' ? 'bg-farm-100 text-farm-800' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Store className="w-4 h-4 text-farm-600" />
              Browse Crops & Mandi
            </button>
            <button
              onClick={() => navigate('compare')}
              className={`text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                currentView === 'compare' ? 'bg-farm-100 text-farm-800' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-amber-600" />
              Price Comparison
            </button>
            <button
              onClick={() => navigate('farmer-dashboard')}
              className={`text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                currentView === 'farmer-dashboard' ? 'bg-farm-100 text-farm-800' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-600" />
              Farmer Dashboard
            </button>
            <button
              onClick={() => navigate('admin-dashboard')}
              className={`text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                currentView === 'admin-dashboard' ? 'bg-purple-100 text-purple-800' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              Admin Portal
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 px-4 rounded-xl border border-rose-200 text-rose-700 font-semibold text-sm hover:bg-rose-50"
              >
                Sign Out
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onOpenAuth('login');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 rounded-xl border border-slate-200 text-slate-800 font-bold text-sm text-center"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    onOpenAuth('register');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 rounded-xl bg-farm-600 text-white font-bold text-sm text-center"
                >
                  Farmer Join
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
