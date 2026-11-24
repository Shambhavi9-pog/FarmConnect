import React, { useState } from 'react';
import { 
  Sprout, 
  MapPin, 
  Calendar, 
  Phone, 
  DollarSign, 
  Package, 
  Image as ImageIcon, 
  Sparkles, 
  CheckCircle, 
  ArrowLeft,
  Info,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMarket } from '../context/MarketContext';
import { PRESET_CROP_IMAGES, CROP_CATEGORIES, UNITS } from '../data/presetImages';
import { MANDI_BENCHMARKS } from '../data/sampleCrops';

export const AddCropPage = ({ onNavigate, onOpenAuth }) => {
  const { user } = useAuth();
  const { addCrop } = useMarket();

  const [formData, setFormData] = useState({
    cropName: '',
    cropCategory: 'Grains & Cereals',
    imageUrl: PRESET_CROP_IMAGES[0].url,
    quantity: '',
    unit: 'quintal',
    price: '',
    village: user?.village || 'Khanna Kalan',
    district: user?.district || 'Ludhiana',
    state: user?.state || 'Punjab',
    harvestDate: new Date().toISOString().split('T')[0],
    status: 'available',
    farmerMobile: user?.mobile || '9876543210',
    description: '',
    isOrganic: false,
    minOrder: 1
  });

  const [showPresetPicker, setShowPresetPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // If user is not logged in as farmer
  if (!user || user.role !== 'farmer') {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-xl">
        <Sprout className="w-12 h-12 text-farm-600 mx-auto" />
        <h2 className="text-xl font-black text-slate-900">Farmer Account Required</h2>
        <p className="text-xs text-slate-600">
          Only registered farmers can publish crop listings. Please log in or simulate a demo farmer.
        </p>
        <button
          onClick={() => onOpenAuth('login')}
          className="px-6 py-2.5 bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs rounded-xl shadow-md"
        >
          Sign In as Farmer
        </button>
      </div>
    );
  }

  // Check if crop matches any mandi benchmark
  const matchedBenchmark = MANDI_BENCHMARKS[formData.cropName];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.cropName || !formData.price || !formData.quantity || !formData.farmerMobile) {
      alert('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);

    await addCrop({
      ...formData,
      farmerId: user.id || `farmer-${Date.now()}`,
      farmerName: user.name || 'Local Farmer',
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      minOrder: Number(formData.minOrder) || 1,
      mandiBenchmarkPrice: matchedBenchmark ? matchedBenchmark.averageMandiPrice : Math.round(Number(formData.price) * 0.95)
    });

    setSubmitting(false);
    onNavigate('farmer-dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Back Button & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('farmer-dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-farm-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Farmer Dashboard</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        
        {/* Form Title Banner */}
        <div className="bg-gradient-to-r from-farm-800 to-farm-700 text-white p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center backdrop-blur-md shadow-inner">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black">Publish New Crop Harvest</h1>
              <p className="text-xs sm:text-sm text-farm-100">
                List your produce directly to consumers and bulk buyers across India. Zero commission.
              </p>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 text-xs">
          
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-5 h-5 rounded-full bg-farm-100 text-farm-800 flex items-center justify-center text-[10px]">1</span>
              <span>Crop Details & Variety</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Crop / Variety Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sharbati Golden Wheat, Hybrid Tomatoes, Basmati Paddy"
                  value={formData.cropName}
                  onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Crop Category *</label>
                <select
                  value={formData.cropCategory}
                  onChange={(e) => setFormData({ ...formData, cropCategory: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500 bg-white text-xs"
                >
                  {CROP_CATEGORIES.filter(c => c !== 'All Categories').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mandi Benchmark Info alert if matched */}
            {matchedBenchmark && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Official Benchmark: Average Mandi rate for <strong>{formData.cropName}</strong> is approx <strong>₹{matchedBenchmark.averageMandiPrice}/{matchedBenchmark.unit}</strong>.
                </span>
              </div>
            )}
          </div>

          {/* Section 2: Pricing & Stock Quantity */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-5 h-5 rounded-full bg-farm-100 text-farm-800 flex items-center justify-center text-[10px]">2</span>
              <span>Pricing & Available Stock</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Direct Price (₹) *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="e.g. 2450"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Measurement Unit *</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500 bg-white text-xs"
                >
                  {UNITS.map(u => (
                    <option key={u} value={u}>per {u}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Total Available Quantity *</label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder={`Available in ${formData.unit}`}
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Harvest Date *</label>
                <input
                  type="date"
                  required
                  value={formData.harvestDate}
                  onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500 bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Minimum Order Quantity ({formData.unit})</label>
                <input
                  type="number"
                  min="1"
                  value={formData.minOrder}
                  onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Photo Selection */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-farm-100 text-farm-800 flex items-center justify-center text-[10px]">3</span>
                <span>Crop Photo</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowPresetPicker(!showPresetPicker)}
                className="text-xs font-bold text-farm-700 hover:underline"
              >
                {showPresetPicker ? 'Hide Gallery' : 'Choose from 14 Agricultural Photo Presets'}
              </button>
            </div>

            {/* Selected Image Preview */}
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-bold text-slate-800">Current Listing Photo</p>
                <input
                  type="url"
                  placeholder="Paste direct image URL or pick preset below"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>

            {/* Preset Picker Grid */}
            {showPresetPicker && (
              <div className="p-3 bg-earth-50 border border-earth-200 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto">
                {PRESET_CROP_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, imageUrl: preset.url, cropName: formData.cropName || preset.name });
                      setShowPresetPicker(false);
                    }}
                    className={`relative rounded-xl overflow-hidden h-20 border-2 transition-all group ${
                      formData.imageUrl === preset.url ? 'border-farm-600 shadow-md ring-2 ring-farm-400' : 'border-transparent'
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute inset-x-0 bottom-0 bg-black/70 text-white text-[10px] p-1 truncate font-medium">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Location & Contact */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-5 h-5 rounded-full bg-farm-100 text-farm-800 flex items-center justify-center text-[10px]">4</span>
              <span>Farm Location & Contact Info</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Village / Tehsil *</label>
                <input
                  type="text"
                  required
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">District *</label>
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">State *</label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs"
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
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Farmer Contact Mobile Number (Calling & WhatsApp) *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={formData.farmerMobile}
                  onChange={(e) => setFormData({ ...formData, farmerMobile: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>

            {/* Organic Switch */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-emerald-950">100% Organic & Chemical-Free Certified?</p>
                  <p className="text-[11px] text-emerald-800">Highlight your produce to health-conscious direct buyers.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.isOrganic}
                onChange={(e) => setFormData({ ...formData, isOrganic: e.target.checked })}
                className="w-5 h-5 text-farm-600 rounded focus:ring-farm-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Quality Description & Storage Details</label>
              <textarea
                rows="3"
                placeholder="Mention moisture rate, sun-drying method, grading (Grade A), or packaging (jute sacks, plastic crates)..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={() => onNavigate('farmer-dashboard')}
              className="px-5 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-7 py-3 bg-farm-600 hover:bg-farm-700 text-white font-black rounded-xl shadow-lg shadow-farm-600/30 transition-all flex items-center gap-2"
            >
              <Sprout className="w-4 h-4" />
              <span>{submitting ? 'Publishing Listing...' : 'Publish Crop to Marketplace'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
