import React from 'react';
import { 
  Sprout, 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink, 
  ShieldCheck, 
  Heart,
  TrendingUp,
  FileText
} from 'lucide-react';

export const Footer = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-farm-600 flex items-center justify-center text-white shadow-md">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Farm<span className="text-farm-400">Connect</span>
              </span>
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Empowering local Indian agriculturalists by eliminating predatory middlemen. Direct crop listings, fair Mandi benchmark pricing, and direct farmer-to-consumer relationships.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-farm-400 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Commission Promise</span>
              </div>
              <p className="text-xs text-slate-400">
                100% of the sale price goes directly to the farmer. No platform cuts or hidden intermediary deductions.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-slate-200">Marketplace</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => onNavigate('browse')} className="hover:text-farm-400 transition-colors">
                  All Harvest Listings
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('compare')} className="hover:text-farm-400 transition-colors">
                  Mandi Price Comparison
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('browse')} className="hover:text-farm-400 transition-colors">
                  Organic Certified Crops
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('browse')} className="hover:text-farm-400 transition-colors">
                  Grains & Pulses Directory
                </button>
              </li>
            </ul>
          </div>

          {/* For Farmers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-slate-200">For Farmers</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => onNavigate('farmer-dashboard')} className="hover:text-farm-400 transition-colors">
                  Farmer Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('add-crop')} className="hover:text-farm-400 transition-colors">
                  List Your Harvest
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin-dashboard')} className="hover:text-purple-400 transition-colors">
                  Admin & Moderation
                </button>
              </li>
              <li>
                <a href="https://enam.gov.in" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-farm-400 transition-colors">
                  National e-NAM Portal <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Kisan Helplines & Govt Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-slate-200">Govt Helplines</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-200">Kisan Call Center (Toll-Free)</p>
                  <a href="tel:18001801551" className="text-farm-400 font-mono hover:underline">
                    1800-180-1551 (24x7)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-200">Kisan Grievance & Enquiries</p>
                  <span className="font-mono text-slate-400">support@farmconnect.org</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-200">Active Pilot Regions</p>
                  <p className="text-slate-400">Punjab, Maharashtra, Karnataka, UP, AP</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FarmConnect. Built with modern React, Cloud Firestore, and Tailwind CSS for fair Indian agriculture.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Indian Farmers
            </span>
            <span>•</span>
            <span className="text-emerald-500 font-medium">Demo Mode Ready</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
