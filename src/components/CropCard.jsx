import React from 'react';
import { 
  MapPin, 
  Calendar, 
  Phone, 
  MessageCircle, 
  Eye, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Scale, 
  ArrowRight,
  ShieldCheck,
  Send
} from 'lucide-react';

export const CropCard = ({ 
  crop, 
  onViewDetails, 
  onOpenEnquiry,
  onCompare 
}) => {
  const isAvailable = crop.status === 'available';
  const cleanPhone = (crop.farmerMobile || '').replace(/\D/g, '');
  const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
    `Hello ${crop.farmerName}, I saw your listing for "${crop.cropName}" on FarmConnect. Is the stock of ${crop.quantity} ${crop.unit} still available?`
  )}`;

  // Mandi price differential indicator
  const mandiDiff = crop.mandiBenchmarkPrice 
    ? crop.price - crop.mandiBenchmarkPrice 
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
      
      {/* Image container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={crop.imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'}
          alt={crop.cropName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-800 shadow-sm backdrop-blur-md">
              {crop.cropCategory}
            </span>
            {crop.isOrganic && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600/95 text-white shadow-sm flex items-center gap-1 backdrop-blur-md">
                <CheckCircle className="w-3 h-3" /> Organic
              </span>
            )}
          </div>

          <div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold shadow-sm ${
              isAvailable 
                ? 'bg-emerald-500 text-white' 
                : 'bg-rose-500 text-white'
            }`}>
              {isAvailable ? 'In Stock' : 'Sold Out'}
            </span>
          </div>
        </div>

        {/* Harvest Date Overlay Badge */}
        <div className="absolute bottom-2.5 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
          <Calendar className="w-3 h-3 text-farm-300" />
          <span>Harvest: {crop.harvestDate || 'Fresh'}</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          
          {/* Title & Farmer */}
          <div>
            <h3 
              onClick={() => onViewDetails(crop)} 
              className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-farm-700 transition-colors cursor-pointer line-clamp-1"
              title={crop.cropName}
            >
              {crop.cropName}
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
              <span className="font-semibold text-slate-800 truncate">{crop.farmerName}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" title="Direct Verified Grower" />
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-farm-600 shrink-0" />
            <span className="truncate">{crop.village ? `${crop.village}, ` : ''}{crop.district}, {crop.state}</span>
          </div>

          {/* Price & Quantity Grid */}
          <div className="bg-earth-50 rounded-xl p-3 border border-earth-200/60 mt-2">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">Direct Price</span>
                <div className="text-xl sm:text-2xl font-black text-farm-800">
                  ₹{Number(crop.price).toLocaleString('en-IN')}
                  <span className="text-xs font-normal text-slate-600 ml-1">/ {crop.unit}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 font-medium">Available</span>
                <p className="text-sm font-bold text-slate-900">
                  {Number(crop.quantity).toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-600">{crop.unit}</span>
                </p>
              </div>
            </div>

            {/* Mandi benchmark note */}
            {crop.mandiBenchmarkPrice && (
              <div className="mt-2 pt-2 border-t border-earth-200 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Mandi Rate: ₹{crop.mandiBenchmarkPrice}/{crop.unit}</span>
                {mandiDiff < 0 ? (
                  <span className="font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                    ₹{Math.abs(mandiDiff)} below mandi
                  </span>
                ) : mandiDiff > 0 ? (
                  <span className="font-semibold text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded">
                    +₹{mandiDiff} premium
                  </span>
                ) : (
                  <span className="text-slate-600">Fair Mandi Rate</span>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          
          {/* Primary Quick Contact Grid */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${crop.farmerMobile}`}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-farm-200 bg-farm-50 text-farm-700 hover:bg-farm-600 hover:text-white font-bold text-xs transition-colors shadow-sm"
              title={`Call ${crop.farmerName} at ${crop.farmerMobile}`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Secondary Details & Compare Bar */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={() => onCompare(crop.cropName)}
              className="text-xs font-semibold text-amber-700 hover:text-amber-900 inline-flex items-center gap-1 hover:underline"
            >
              <Scale className="w-3 h-3" />
              <span>Compare Prices</span>
            </button>

            <button
              onClick={() => onViewDetails(crop)}
              className="text-xs font-bold text-farm-700 hover:text-farm-900 inline-flex items-center gap-1 hover:underline"
            >
              <span>View Details</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
