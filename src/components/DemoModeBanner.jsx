import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarket } from '../context/MarketContext';
import { Info, Key, RotateCcw, X, CheckCircle, ExternalLink, ShieldAlert } from 'lucide-react';

export const DemoModeBanner = () => {
  const { isFirebaseConfigured, switchDemoRole, user } = useAuth();
  const { resetToSampleData } = useMarket();
  const [showConfigGuide, setShowConfigGuide] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isFirebaseConfigured || isDismissed) return null;

  return (
    <>
      <aside aria-label="Demo Mode Notice" className="bg-amber-50 border-b border-amber-200 text-amber-900 text-xs sm:text-sm px-4 py-2.5 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-200 text-amber-800">
              DEMO MODE
            </span>
            <p className="font-medium text-amber-900">
              Firebase keys are not configured. Running with persistent local simulation and authentic Indian mandi data.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto justify-end">
            {/* Quick Role Switcher for Evaluators */}
            <div className="flex items-center bg-white rounded-md border border-amber-300 p-0.5 text-xs shadow-sm">
              <span className="text-slate-500 px-1.5 font-medium hidden lg:inline">Simulate Role:</span>
              <button
                onClick={() => switchDemoRole('farmer')}
                className={`px-2 py-1 rounded font-medium transition-colors ${user?.role === 'farmer' ? 'bg-farm-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                title="Switch to Demo Farmer (Gurpreet Singh)"
              >
                🌾 Farmer
              </button>
              <button
                onClick={() => switchDemoRole('consumer')}
                className={`px-2 py-1 rounded font-medium transition-colors ${user?.role === 'consumer' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                title="Switch to Demo Consumer (Rajesh Sharma)"
              >
                🛒 Consumer
              </button>
              <button
                onClick={() => switchDemoRole('admin')}
                className={`px-2 py-1 rounded font-medium transition-colors ${user?.role === 'admin' ? 'bg-purple-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                title="Switch to Platform Admin"
              >
                🛡️ Admin
              </button>
            </div>

            <button
              onClick={() => setShowConfigGuide(true)}
              className="inline-flex items-center gap-1 font-semibold text-amber-800 hover:text-amber-950 underline text-xs"
            >
              <Key className="w-3.5 h-3.5" /> Setup Firebase
            </button>

            <button
              onClick={resetToSampleData}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 text-xs px-2 py-1 rounded bg-amber-100 hover:bg-amber-200"
              title="Reset data back to initial 12 sample crops"
            >
              <RotateCcw className="w-3 h-3" /> Reset Data
            </button>

            <button
              onClick={() => setIsDismissed(true)}
              className="text-amber-700 hover:text-amber-900 p-0.5 rounded"
              title="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Firebase Setup Modal Guide */}
      {showConfigGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-farm-50 text-farm-600">
                  <Key className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Firebase Setup Guide</h3>
              </div>
              <button
                onClick={() => setShowConfigGuide(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 my-4 text-sm text-slate-600 leading-relaxed">
              <p>
                FarmConnect comes pre-engineered with a <strong>Dual Engine</strong>. It works out of the box in <em>Demo Mode</em>, or with your real Cloud Firebase project:
              </p>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 space-y-1">
                <p className="text-slate-400"># In your .env file:</p>
                <p>VITE_FIREBASE_API_KEY=AIzaSy...</p>
                <p>VITE_FIREBASE_AUTH_DOMAIN=farmconnect-xyz.firebaseapp.com</p>
                <p>VITE_FIREBASE_PROJECT_ID=farmconnect-xyz</p>
                <p>VITE_FIREBASE_STORAGE_BUCKET=farmconnect-xyz.appspot.com</p>
                <p>VITE_FIREBASE_MESSAGING_SENDER_ID=123456789</p>
                <p>VITE_FIREBASE_APP_ID=1:123456789:web:abcdef</p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900 space-y-1.5">
                <p className="font-semibold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> Demo Mode Features Fully Enabled:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-emerald-800">
                  <li>Farmer Registration & Authentication simulation</li>
                  <li>Adding, editing, and deleting real crop listings (persisted in browser)</li>
                  <li>Submitting consumer inquiries delivered directly to farmer dashboard</li>
                  <li>Multi-filter search (category, district, price, organic status)</li>
                  <li>Cross-farmer price comparison with mandi benchmarks</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfigGuide(false)}
                className="px-4 py-2 bg-farm-700 hover:bg-farm-800 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Got It, Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
