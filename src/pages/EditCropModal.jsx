import React, { useState } from 'react';
import { 
  X, 
  Sprout, 
  CheckCircle, 
  Image as ImageIcon, 
  MapPin, 
  Calendar, 
  Phone, 
  Tag, 
  DollarSign, 
  Package, 
  Layers,
  Sparkles
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { PRESET_CROP_IMAGES, CROP_CATEGORIES, UNITS } from '../data/presetImages';

export const EditCropModal = ({ crop, onClose }) => {
  const { updateCrop } = useMarket();

  const [formData, setFormData] = useState({
    cropName: crop.cropName || '',
    cropCategory: crop.cropCategory || 'Vegetables',
    imageUrl: crop.imageUrl || '',
    quantity: crop.quantity || '',
    unit: crop.unit || 'kg',
    price: crop.price || '',
    village: crop.village || '',
    district: crop.district || '',
    state: crop.state || 'Punjab',
    harvestDate: crop.harvestDate || '',
    status: crop.status || 'available',
    farmerMobile: crop.farmerMobile || '',
    description: crop.description || '',
    isOrganic: Boolean(crop.isOrganic)
  });

  const [showPresetPicker, setShowPresetPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.cropName || !formData.price || !formData.quantity) {
      alert('Please fill out all required crop details.');
      return;
    }

    setSubmitting(true);
    updateCrop(crop.id, {
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity)
    });
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-earth-50 border-b border-earth-200 flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">Edit Crop Listing</h3>
            <p className="text-xs text-slate-500">Update your harvest pricing, quantity, or status</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Status Switcher Banner */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="font-bold text-slate-700">Listing Status:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'available' })}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  formData.status === 'available'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                ● Available (In Stock)
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'sold_out' })}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  formData.status === 'sold_out'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                ✕ Sold Out
              </button>
            </div>
          </div>

          {/* Crop Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Crop / Variety Name *</label>
              <input
                type="text"
                required
                value={formData.cropName}
                onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={formData.cropCategory}
                onChange={(e) => setFormData({ ...formData, cropCategory: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500 bg-white"
              >
                {CROP_CATEGORIES.filter(c => c !== 'All Categories').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price, Unit & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Unit *</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500 bg-white"
              >
                {UNITS.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Available Quantity *</label>
              <input
                type="number"
                min="0"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500"
              />
            </div>
          </div>

          {/* Image & Preset Picker */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700">Crop Photo</label>
              <button
                type="button"
                onClick={() => setShowPresetPicker(!showPresetPicker)}
                className="text-farm-700 font-bold hover:underline"
              >
                {showPresetPicker ? 'Hide presets' : 'Select from preset photos'}
              </button>
            </div>

            <input
              type="url"
              placeholder="Photo URL (or choose from presets)"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500"
            />

            {showPresetPicker && (
              <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                {PRESET_CROP_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, imageUrl: preset.url });
                      setShowPresetPicker(false);
                    }}
                    className={`relative rounded-xl overflow-hidden h-16 border-2 transition-all ${
                      formData.imageUrl === preset.url ? 'border-farm-600 scale-95' : 'border-transparent'
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                    <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] p-0.5 truncate">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Harvest Date & Contact Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Harvest Date</label>
              <input
                type="date"
                value={formData.harvestDate}
                onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500 bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Farmer Contact Mobile *</label>
              <input
                type="tel"
                required
                value={formData.farmerMobile}
                onChange={(e) => setFormData({ ...formData, farmerMobile: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500"
              />
            </div>
          </div>

          {/* Organic Certification Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="editOrganic"
              checked={formData.isOrganic}
              onChange={(e) => setFormData({ ...formData, isOrganic: e.target.checked })}
              className="w-4 h-4 text-farm-600 rounded focus:ring-farm-500"
            />
            <label htmlFor="editOrganic" className="font-semibold text-slate-800 cursor-pointer">
              100% Organically Grown (Pesticide & Chemical-Free)
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Crop Description & Quality Notes</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-farm-600 hover:bg-farm-700 text-white font-bold rounded-xl shadow-md transition-colors"
            >
              Save Changes
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
