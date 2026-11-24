import React, { useState } from 'react';
import { 
  Sprout, 
  Search, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Truck, 
  Users, 
  PhoneCall, 
  CheckCircle2, 
  Sparkles,
  Scale,
  Award,
  ChevronRight,
  Store,
  ShoppingCart
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { useAuth } from '../context/AuthContext';
import { CropCard } from '../components/CropCard';
import { CROP_CATEGORIES } from '../data/presetImages';

export const HomePage = ({ onNavigate, onOpenAuth }) => {
  const { 
    crops, 
    setSearchQuery, 
    setSelectedCategory, 
    setSelectedDistrict,
    setSelectedCropForDetail,
    setSelectedCropForEnquiry
  } = useMarket();

  const { user } = useAuth();

  const [heroSearch, setHeroSearch] = useState('');
  const [heroLocation, setHeroLocation] = useState('');

  // Handle hero search trigger
  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch) setSearchQuery(heroSearch);
    if (heroLocation) setSelectedDistrict(heroLocation);
    onNavigate('browse');
  };

  // Top featured crops
  const featuredCrops = crops.filter(c => c.status === 'available').slice(0, 6);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-farm-50/70 via-earth-50 to-white pt-8 sm:pt-16 pb-16 sm:pb-24 border-b border-emerald-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-farm-100/80 border border-farm-200 text-farm-800 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-farm-600" />
              <span>India's Transparent Direct Agricultural Exchange</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Fresh from Farmers,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-farm-700 via-farm-600 to-emerald-500">
                Directly to You.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Empowering local Indian agriculturalists to sell grains, vegetables, and fruits straight to consumers, bulk buyers, and local markets with zero intermediary commission.
            </p>

            {/* Hero Interactive Search Bar */}
            <form 
              onSubmit={handleHeroSearch}
              className="mt-8 bg-white p-2 sm:p-2.5 rounded-2xl shadow-xl shadow-farm-900/5 border border-slate-200 flex flex-col md:flex-row items-center gap-2 max-w-3xl mx-auto"
            >
              {/* Crop input */}
              <div className="flex-1 flex items-center gap-3 px-3 py-2 w-full">
                <Search className="w-5 h-5 text-farm-600 shrink-0" />
                <input
                  type="text"
                  placeholder="What crop are you looking for? (e.g. Wheat, Tomatoes, Basmati)"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  className="w-full text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

              {/* Location input */}
              <div className="flex-1 flex items-center gap-3 px-3 py-2 w-full">
                <MapPin className="w-5 h-5 text-amber-600 shrink-0" />
                <input
                  type="text"
                  placeholder="District or State (e.g. Ludhiana, Nashik)"
                  value={heroLocation}
                  onChange={(e) => setHeroLocation(e.target.value)}
                  className="w-full text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3.5 bg-farm-600 hover:bg-farm-700 text-white font-bold text-sm rounded-xl shadow-md shadow-farm-600/30 transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <span>Find Harvest</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Keyword Pills */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-400">Popular:</span>
              {['Wheat', 'Red Tomatoes', 'Nashik Onions', 'Basmati Rice', 'Potatoes'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setSearchQuery(item);
                    onNavigate('browse');
                  }}
                  className="px-2.5 py-1 rounded-full bg-white/80 hover:bg-farm-100 hover:text-farm-800 border border-slate-200/80 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* CTA action buttons */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => onNavigate('browse')}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <Store className="w-4 h-4 text-farm-400" />
                <span>Explore Live Market</span>
              </button>

              <button
                onClick={() => {
                  if (user?.role === 'farmer') {
                    onNavigate('add-crop');
                  } else {
                    onOpenAuth('register');
                  }
                }}
                className="px-6 py-3 rounded-xl bg-farm-600 hover:bg-farm-700 text-white font-bold text-sm shadow-md shadow-farm-600/20 transition-all flex items-center gap-2"
              >
                <Sprout className="w-4 h-4" />
                <span>List Your Crops (Free)</span>
              </button>

              <button
                onClick={() => onNavigate('compare')}
                className="px-5 py-3 rounded-xl border border-slate-300 hover:border-amber-400 hover:bg-amber-50 text-slate-700 font-bold text-sm transition-all flex items-center gap-2"
              >
                <Scale className="w-4 h-4 text-amber-600" />
                <span>Compare Prices</span>
              </button>
            </div>

          </div>

        </div>

        {/* Impact Metric Strip */}
        <div className="max-w-6xl mx-auto px-4 mt-12 sm:mt-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 sm:p-6 bg-white/95 rounded-2xl border border-slate-200/80 shadow-lg backdrop-blur-md">
            
            <div className="text-center p-2">
              <p className="text-2xl sm:text-3xl font-black text-farm-700">₹0</p>
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wide mt-0.5">Middlemen Cuts</p>
              <p className="text-[11px] text-slate-500">100% Direct Farmer Revenue</p>
            </div>

            <div className="text-center p-2 border-l border-slate-100">
              <p className="text-2xl sm:text-3xl font-black text-slate-900">45,000+</p>
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wide mt-0.5">Quintals Available</p>
              <p className="text-[11px] text-slate-500">Direct From Harvest Fields</p>
            </div>

            <div className="text-center p-2 border-l border-slate-100">
              <p className="text-2xl sm:text-3xl font-black text-farm-700">12+ States</p>
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wide mt-0.5">Districts Covered</p>
              <p className="text-[11px] text-slate-500">Punjab, Maharashtra & more</p>
            </div>

            <div className="text-center p-2 border-l border-slate-100">
              <p className="text-2xl sm:text-3xl font-black text-amber-600">100%</p>
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wide mt-0.5">Verified Contacts</p>
              <p className="text-[11px] text-slate-500">Direct WhatsApp & Phone</p>
            </div>

          </div>
        </div>
      </section>

      {/* 2. FEATURED CROPS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-farm-700 uppercase tracking-wider mb-1">
              <Sprout className="w-4 h-4" /> Freshly Harvested
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Featured Available Crops
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Directly listed by verified farmers across Indian agricultural hubs.
            </p>
          </div>

          <button
            onClick={() => onNavigate('browse')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-farm-700 hover:text-farm-900 group"
          >
            <span>View All {crops.length} Listings</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Crops Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCrops.map((crop) => (
            <CropCard
              key={crop.id}
              crop={crop}
              onViewDetails={setSelectedCropForDetail}
              onOpenEnquiry={setSelectedCropForEnquiry}
              onCompare={(name) => {
                setSearchQuery(name);
                onNavigate('compare');
              }}
            />
          ))}
        </div>
      </section>

      {/* 3. BENEFITS FOR FARMERS & CONSUMERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-farm-700 uppercase tracking-wider">Direct Agricultural Revolution</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Why FarmConnect Wins for Everyone
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Eliminating 3-tier commission brokers brings dignity to farmers and maximum freshness to consumers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* For Farmers Card */}
          <div className="bg-gradient-to-br from-farm-900 to-farm-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-farm-800/80 text-farm-300 flex items-center justify-center mb-6">
              <Sprout className="w-6 h-6" />
            </div>

            <h3 className="text-2xl font-black mb-3">For Local Farmers</h3>
            <p className="text-sm text-farm-200 leading-relaxed mb-6">
              Take back control of your harvest earnings. No middlemen commissions, no delayed payments, and no predatory distress selling.
            </p>

            <ul className="space-y-3.5 text-sm text-farm-100">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-farm-400 shrink-0 mt-0.5" />
                <span><strong>25% to 40% Higher Realization:</strong> Keep 100% of the sale value directly.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-farm-400 shrink-0 mt-0.5" />
                <span><strong>Direct WhatsApp & Calls:</strong> Connect instantly with verified retail and wholesale buyers.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-farm-400 shrink-0 mt-0.5" />
                <span><strong>Publish in 60 Seconds:</strong> Simple form with preset images designed specifically for non-technical farmers.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-farm-400 shrink-0 mt-0.5" />
                <span><strong>Transparent Mandi Benchmark:</strong> Price your produce fairly against official APMC rates.</span>
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-farm-800">
              <button
                onClick={() => {
                  if (user?.role === 'farmer') onNavigate('farmer-dashboard');
                  else onOpenAuth('register');
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-farm-500 hover:bg-farm-400 text-farm-950 font-bold text-sm shadow-md transition-colors"
              >
                Join as a Registered Farmer
              </button>
            </div>
          </div>

          {/* For Consumers Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-amber-300 flex items-center justify-center mb-6">
              <ShoppingCart className="w-6 h-6" />
            </div>

            <h3 className="text-2xl font-black mb-3">For Consumers & Bulk Buyers</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Procure farm-fresh harvests directly from verified growers at true wholesale prices without retail inflation.
            </p>

            <ul className="space-y-3.5 text-sm text-slate-200">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Peak Freshness & Nutrient Value:</strong> Harvested straight from the field to your doorstep.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Transparent Price Comparison:</strong> Compare rates across multiple farmers for identical crops.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Traceable Origins:</strong> Know exactly which farmer, village, and district produced your food.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Organic & Natural Filters:</strong> Easily discover certified chemical-free produce.</span>
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <button
                onClick={() => onNavigate('browse')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-colors"
              >
                Start Exploring Market Listings
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section className="bg-earth-100/60 py-16 sm:py-20 border-y border-earth-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-farm-700 uppercase tracking-wider">Simple & Transparent</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              How FarmConnect Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              A 3-step seamless connection bridging fields to consumers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm relative">
              <div className="w-12 h-12 rounded-2xl bg-farm-100 text-farm-700 font-black text-xl flex items-center justify-center mb-5">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Farmer Lists Produce</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Farmers register in 30 seconds, select their crop category, enter quantity, harvest date, and set their desired price per kg or quintal.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm relative">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 font-black text-xl flex items-center justify-center mb-5">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Buyer Discovers & Compares</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Consumers filter by district, check organic status, compare prices against official Mandi rates, and inspect high-resolution harvest photos.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 font-black text-xl flex items-center justify-center mb-5">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Direct Contact & Deal</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                One-tap Call or WhatsApp connects buyer and farmer directly. Arrange farm pickup or local transport with zero intermediary transaction fees.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. CALL TO ACTION STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-farm-800 via-farm-700 to-emerald-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black">Ready to Support Indian Agriculture?</h3>
            <p className="text-sm text-farm-100">
              Join thousands of farmers and conscious consumers trading directly without middlemen.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onOpenAuth('register')}
              className="px-6 py-3.5 bg-white hover:bg-slate-100 text-farm-900 font-bold text-sm rounded-xl shadow-md transition-all"
            >
              Register as Farmer
            </button>
            <button
              onClick={() => onNavigate('browse')}
              className="px-6 py-3.5 bg-farm-900/60 hover:bg-farm-900 text-white border border-farm-400 font-bold text-sm rounded-xl transition-all"
            >
              Browse Produce
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
