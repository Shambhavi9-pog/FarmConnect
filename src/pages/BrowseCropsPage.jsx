import React from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  SlidersHorizontal, 
  RotateCcw, 
  CheckCircle, 
  Sprout, 
  ArrowUpDown, 
  PackageSearch,
  Store,
  Sparkles
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { CropCard } from '../components/CropCard';
import { CROP_CATEGORIES } from '../data/presetImages';

export const BrowseCropsPage = ({ onNavigate }) => {
  const { 
    filteredCrops, 
    crops,
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory, 
    selectedDistrict, 
    setSelectedDistrict, 
    selectedState, 
    setSelectedState, 
    sortBy, 
    setSortBy, 
    onlyOrganic, 
    setOnlyOrganic, 
    onlyAvailable, 
    setOnlyAvailable,
    availableDistricts,
    availableStates,
    setSelectedCropForDetail,
    setSelectedCropForEnquiry
  } = useMarket();

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setSelectedDistrict('All Districts');
    setSelectedState('All States');
    setSortBy('harvest_recent');
    setOnlyOrganic(false);
    setOnlyAvailable(false);
  };

  const hasActiveFilters = 
    Boolean(searchQuery) || 
    selectedCategory !== 'All Categories' || 
    selectedDistrict !== 'All Districts' || 
    selectedState !== 'All States' || 
    onlyOrganic || 
    onlyAvailable;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-farm-700 uppercase tracking-wider mb-1">
            <Store className="w-4 h-4" /> Consumer Marketplace
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Browse Farm Fresh Crops
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Connect directly with verified local farmers. Compare farm-gate prices with APMC Mandi rates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('compare')}
            className="px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>Compare Same Crops</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Filter & Search Controls */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
        
        {/* Top Search & Primary Selectors Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Keyword Search */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by crop name, farmer name, village..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500 text-xs text-slate-900 placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* District Selector */}
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500 bg-white text-xs text-slate-800"
            >
              {availableDistricts.map(dist => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>

          {/* Sort By Selector */}
          <div className="relative">
            <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500 bg-white text-xs text-slate-800 font-medium"
            >
              <option value="harvest_recent">Harvest: Most Recent</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="quantity_desc">Quantity: High to Low</option>
            </select>
          </div>

        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 no-scrollbar">
          <span className="text-xs font-bold text-slate-400 mr-1 shrink-0">Category:</span>
          {CROP_CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-farm-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Filter Toggles & Reset Bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            {/* Organic Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyOrganic}
                onChange={(e) => setOnlyOrganic(e.target.checked)}
                className="w-4 h-4 text-farm-600 rounded focus:ring-farm-500"
              />
              <span className={`font-semibold ${onlyOrganic ? 'text-farm-800 font-bold' : 'text-slate-600'}`}>
                🌱 Organic Certified Only
              </span>
            </label>

            {/* In-Stock Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-4 h-4 text-farm-600 rounded focus:ring-farm-500"
              />
              <span className={`font-semibold ${onlyAvailable ? 'text-emerald-800 font-bold' : 'text-slate-600'}`}>
                ● In Stock Only
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 font-medium">
              Showing <strong className="text-slate-900">{filteredCrops.length}</strong> of {crops.length} listings
            </span>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 font-bold text-rose-600 hover:text-rose-800 hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* 3. Crop Listings Grid */}
      {filteredCrops.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-4 max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <PackageSearch className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">No Harvest Listings Found</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No crops matched your current filter criteria. Try searching for a different crop name or clearing your district/category filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Show All Available Crops</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map(crop => (
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
      )}

    </div>
  );
};
