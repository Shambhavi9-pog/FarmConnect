import React, { useState } from 'react';
import { 
  Scale, 
  MapPin, 
  Phone, 
  MessageCircle, 
  CheckCircle, 
  TrendingDown, 
  TrendingUp, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Calendar,
  Sparkles,
  Search,
  Eye
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { MANDI_BENCHMARKS } from '../data/sampleCrops';

export const PriceComparePage = ({ onNavigate }) => {
  const { crops, setSelectedCropForDetail, setSelectedCropForEnquiry } = useMarket();

  // Find all distinct crop names that have at least 1 listing
  const allCropNames = [...new Set(crops.map(c => c.cropName))];

  // Set default selected crop to one that has multiple farmers
  const [selectedCropName, setSelectedCropName] = useState(() => {
    // Look for a crop that appears more than once
    const multiSellerCrop = allCropNames.find(name => crops.filter(c => c.cropName === name).length > 1);
    return multiSellerCrop || allCropNames[0] || 'Sharbati Golden Wheat';
  });

  // Filter crops matching the selected crop name
  const competingCrops = crops.filter(
    c => c.cropName.toLowerCase().trim() === selectedCropName.toLowerCase().trim()
  );

  // Mandi benchmark data
  const benchmarkInfo = MANDI_BENCHMARKS[selectedCropName];

  // Calculate pricing metrics
  const prices = competingCrops.map(c => Number(c.price)).filter(p => !isNaN(p));
  const lowestPrice = prices.length ? Math.min(...prices) : 0;
  const highestPrice = prices.length ? Math.max(...prices) : 0;
  const avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
  const unit = competingCrops[0]?.unit || 'kg';

  // Find best value seller
  const bestValueSeller = competingCrops.find(c => Number(c.price) === lowestPrice);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4" /> Multi-Farmer Transparency
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Crop Price Comparison
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Compare prices offered by different local farmers for the same produce against official APMC Mandi benchmarks.
          </p>
        </div>

        <button
          onClick={() => onNavigate('browse')}
          className="text-xs font-bold text-farm-700 hover:text-farm-900 self-start md:self-auto flex items-center gap-1 hover:underline"
        >
          <span>View All Market Listings</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Crop Selector Horizontal Pills */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
          Select Crop to Compare Sellers:
        </label>
        
        <div className="flex flex-wrap gap-2">
          {allCropNames.map((name) => {
            const sellerCount = crops.filter(c => c.cropName === name).length;
            const isSelected = selectedCropName === name;

            return (
              <button
                key={name}
                onClick={() => setSelectedCropName(name)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{name}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isSelected ? 'bg-amber-800 text-amber-100' : 'bg-slate-200 text-slate-600'
                }`}>
                  {sellerCount} {sellerCount === 1 ? 'farmer' : 'farmers'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Analytics Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Lowest Price */}
        <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Best Direct Price</span>
            <p className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1">
              ₹{lowestPrice} <span className="text-xs font-normal text-emerald-800">/ {unit}</span>
            </p>
            {bestValueSeller && (
              <p className="text-[11px] text-emerald-700 font-semibold mt-1 truncate">
                by {bestValueSeller.farmerName}
              </p>
            )}
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        {/* Highest Price */}
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Max Price</span>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              ₹{highestPrice} <span className="text-xs font-normal text-slate-500">/ {unit}</span>
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Across all {competingCrops.length} sellers
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Average Direct Rate */}
        <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Average Direct Rate</span>
            <p className="text-2xl sm:text-3xl font-black text-blue-950 mt-1">
              ₹{avgPrice} <span className="text-xs font-normal text-blue-800">/ {unit}</span>
            </p>
            <p className="text-[11px] text-blue-700 font-medium mt-1">Middlemen fee: ₹0</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
        </div>

        {/* Mandi Benchmark */}
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Mandi Benchmark</span>
            <p className="text-2xl sm:text-3xl font-black text-amber-950 mt-1">
              {benchmarkInfo ? `₹${benchmarkInfo.averageMandiPrice}` : 'Market MSP'}
              <span className="text-xs font-normal text-amber-800 ml-1">/ {unit}</span>
            </p>
            <p className="text-[11px] text-amber-700 font-medium mt-1 truncate">
              {benchmarkInfo ? benchmarkInfo.stateBenchmark : 'Official APMC Benchmark'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* 4. Visual Price Graph Comparison */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <span>Visual Rate Spread for "{selectedCropName}"</span>
          <span className="text-xs text-slate-400 font-normal">(Rates in ₹ per {unit})</span>
        </h3>

        <div className="space-y-3 pt-2">
          {competingCrops.map(crop => {
            const isLowest = Number(crop.price) === lowestPrice;
            const percentage = highestPrice > 0 ? (Number(crop.price) / (highestPrice * 1.15)) * 100 : 50;

            return (
              <div key={crop.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-800 font-bold">{crop.farmerName}</span>
                    <span className="text-slate-400">({crop.district}, {crop.state})</span>
                    {crop.isOrganic && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Organic
                      </span>
                    )}
                    {isLowest && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[10px] font-bold">
                        Lowest Price
                      </span>
                    )}
                  </div>
                  <span className="font-extrabold text-slate-900 text-sm">
                    ₹{crop.price} / {crop.unit}
                  </span>
                </div>

                {/* Progress bar visual */}
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${percentage}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      isLowest ? 'bg-emerald-500' : 'bg-farm-600'
                    }`}
                  />
                </div>
              </div>
            );
          })}

          {/* Benchmark line if present */}
          {benchmarkInfo && (
            <div className="pt-2 border-t border-dashed border-slate-200">
              <div className="flex items-center justify-between text-xs text-amber-800 font-semibold mb-1">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Mandi Reference Rate ({benchmarkInfo.stateBenchmark})</span>
                </span>
                <span className="font-bold">₹{benchmarkInfo.averageMandiPrice} / {unit}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${(benchmarkInfo.averageMandiPrice / (highestPrice * 1.15)) * 100}%` }}
                  className="h-full bg-amber-400 rounded-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. Detailed Side-by-Side Comparison Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-slate-900">
          Available Farmer Offers ({competingCrops.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competingCrops.map(crop => {
            const isLowest = Number(crop.price) === lowestPrice;
            const cleanPhone = (crop.farmerMobile || '').replace(/\D/g, '');
            const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
              `Hello ${crop.farmerName}, I saw your price of ₹${crop.price}/${crop.unit} for "${crop.cropName}" on FarmConnect. I would like to order.`
            )}`;

            return (
              <div
                key={crop.id}
                className={`bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between ${
                  isLowest ? 'border-emerald-400 ring-2 ring-emerald-400/20' : 'border-slate-200'
                }`}
              >
                <div>
                  {/* Photo & Badge */}
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img src={crop.imageUrl} alt={crop.cropName} className="w-full h-full object-cover" />
                    {isLowest && (
                      <div className="absolute top-3 left-3 bg-emerald-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-md">
                        ★ Best Price
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm">
                      Stock: {crop.quantity} {crop.unit}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">{crop.farmerName}</h4>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-farm-600 shrink-0" />
                          <span>{crop.village ? `${crop.village}, ` : ''}{crop.district}, {crop.state}</span>
                        </div>
                      </div>
                      <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" title="Verified Farmer" />
                    </div>

                    {/* Price Callout */}
                    <div className="bg-earth-50 rounded-2xl p-3.5 border border-earth-200/80">
                      <span className="text-[11px] text-slate-500 font-semibold">Offered Farm-Gate Price</span>
                      <div className="text-2xl font-black text-farm-800">
                        ₹{crop.price}
                        <span className="text-xs font-normal text-slate-600 ml-1">/ {crop.unit}</span>
                      </div>
                      {crop.mandiBenchmarkPrice && (
                        <p className="text-[11px] font-semibold text-slate-600 mt-1">
                          {crop.price < crop.mandiBenchmarkPrice ? (
                            <span className="text-emerald-700">
                              ₹{crop.mandiBenchmarkPrice - crop.price} cheaper than Mandi rate
                            </span>
                          ) : (
                            <span>Mandi benchmark: ₹{crop.mandiBenchmarkPrice}/{crop.unit}</span>
                          )}
                        </p>
                      )}
                    </div>

                    {/* Meta details */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <div className="p-2 rounded-xl bg-slate-50">
                        <span className="text-slate-400 block text-[10px]">Harvest</span>
                        <span className="font-bold text-slate-800">{crop.harvestDate || 'Fresh'}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50">
                        <span className="text-slate-400 block text-[10px]">Method</span>
                        <span className="font-bold text-slate-800">{crop.isOrganic ? '100% Organic' : 'Conventional'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Contact Action Strip */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${crop.farmerMobile}`}
                      className="py-2.5 px-3 rounded-xl border border-farm-300 bg-white hover:bg-farm-50 text-farm-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5 text-farm-600" />
                      <span>Call Farmer</span>
                    </a>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  <button
                    onClick={() => setSelectedCropForDetail(crop)}
                    className="w-full py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-farm-700 hover:bg-white transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Crop & Harvest Details</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
