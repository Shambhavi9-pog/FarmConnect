import React from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Phone, 
  MessageCircle, 
  Send, 
  ShieldCheck, 
  CheckCircle, 
  Scale, 
  Sparkles, 
  Award,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';

export const CropDetailModal = ({ 
  crop, 
  onClose, 
  onOpenEnquiry,
  onCompare 
}) => {
  const { crops, setSelectedCropForDetail } = useMarket();

  if (!crop) return null;

  const isAvailable = crop.status === 'available';
  const cleanPhone = (crop.farmerMobile || '').replace(/\D/g, '');
  const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
    `Hello ${crop.farmerName}, I am contacting you regarding your "${crop.cropName}" listed on FarmConnect for ₹${crop.price}/${crop.unit}. I would like to inquire about purchasing.`
  )}`;

  // Find other farmers selling the same crop
  const otherSellers = crops.filter(
    c => c.id !== crop.id && c.cropName.toLowerCase().trim() === crop.cropName.toLowerCase().trim()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-farm-700 bg-farm-100 px-2.5 py-1 rounded-full">
              {crop.cropCategory}
            </span>
            {crop.isOrganic && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-600" /> Organic Certified
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Main Hero Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 h-64 sm:h-72 border border-slate-200 shadow-inner">
              <img
                src={crop.imageUrl}
                alt={crop.cropName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold shadow-md ${
                  isAvailable ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                }`}>
                  {isAvailable ? 'Currently In Stock' : 'Sold Out'}
                </span>
              </div>
            </div>

            {/* Price & Primary Specs */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {crop.cropName}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-farm-600" />
                  <span>{crop.village ? `${crop.village}, ` : ''}{crop.district}, {crop.state}</span>
                </div>
              </div>

              {/* Price Callout */}
              <div className="bg-earth-50 rounded-2xl p-4 border border-earth-200">
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Direct Farm Gate Price</p>
                    <div className="text-3xl font-black text-farm-800">
                      ₹{Number(crop.price).toLocaleString('en-IN')}
                      <span className="text-sm font-medium text-slate-600 ml-1">/ {crop.unit}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-500">Total Available</p>
                    <p className="text-lg font-bold text-slate-900">
                      {Number(crop.quantity).toLocaleString('en-IN')} {crop.unit}
                    </p>
                  </div>
                </div>

                {crop.mandiBenchmarkPrice && (
                  <div className="mt-3 pt-2.5 border-t border-earth-200/80 flex items-center justify-between text-xs">
                    <span className="text-slate-600">Official Mandi Benchmark:</span>
                    <span className="font-bold text-slate-800">
                      ₹{crop.mandiBenchmarkPrice} / {crop.unit}
                    </span>
                  </div>
                )}
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-farm-600" />
                  <div>
                    <p className="text-slate-400 font-medium">Harvest Date</p>
                    <p className="font-bold text-slate-800">{crop.harvestDate || 'Fresh batch'}</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <div>
                    <p className="text-slate-400 font-medium">Min Order</p>
                    <p className="font-bold text-slate-800">{crop.minOrder || 1} {crop.unit}</p>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900">Crop Details & Quality Notes</h4>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {crop.description || 'Premium farm-fresh harvest cultivated using ethical and sustainable farming practices.'}
            </p>
          </div>

          {/* Direct Farmer Contact Card */}
          <div className="bg-farm-50/80 border border-farm-200 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-farm-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {crop.farmerName?.charAt(0) || 'F'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-slate-900">{crop.farmerName}</h4>
                    <ShieldCheck className="w-4 h-4 text-farm-600" />
                  </div>
                  <p className="text-xs text-slate-600">
                    Direct Farmer • Verified Contact: <span className="font-mono font-semibold">{crop.farmerMobile}</span>
                  </p>
                </div>
              </div>

              <div className="text-xs font-semibold text-farm-800 bg-farm-100 px-3 py-1.5 rounded-full inline-flex items-center gap-1 self-start sm:self-auto">
                <Award className="w-3.5 h-3.5" /> 100% Middlemen Free
              </div>
            </div>

            {/* Direct Contact Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <a
                href={`tel:${crop.farmerMobile}`}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-farm-700 hover:bg-farm-800 text-white font-bold text-xs shadow-sm transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call {crop.farmerMobile}</span>
              </a>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  onClose();
                  onOpenEnquiry(crop);
                }}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-farm-600 text-farm-800 hover:bg-farm-100 font-bold text-xs transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Send Online Enquiry</span>
              </button>
            </div>
          </div>

          {/* Alternative Sellers for Same Crop */}
          {otherSellers.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-amber-600" />
                  <span>Other Farmers Selling "{crop.cropName}"</span>
                </h4>
                <button
                  onClick={() => {
                    onClose();
                    onCompare(crop.cropName);
                  }}
                  className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
                >
                  Full Price Compare <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {otherSellers.map(alt => (
                  <div 
                    key={alt.id}
                    className="p-3 rounded-xl border border-slate-200 bg-white hover:border-farm-400 flex items-center justify-between text-xs transition-all shadow-sm"
                  >
                    <div>
                      <p className="font-bold text-slate-800">{alt.farmerName}</p>
                      <p className="text-slate-500">{alt.district}, {alt.state}</p>
                      <p className="font-extrabold text-farm-700 text-sm mt-0.5">
                        ₹{alt.price} <span className="text-[11px] font-normal text-slate-500">/ {alt.unit}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedCropForDetail(alt)}
                      className="px-3 py-1.5 rounded-lg bg-farm-50 text-farm-700 hover:bg-farm-600 hover:text-white font-bold transition-colors"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
