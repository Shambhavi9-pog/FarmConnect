import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Package, 
  MessageCircle, 
  MapPin, 
  Trash2, 
  Eye, 
  RotateCcw, 
  Search, 
  CheckCircle, 
  AlertTriangle,
  ExternalLink,
  Phone,
  Database
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { useAuth } from '../context/AuthContext';

export const AdminDashboardPage = ({ onNavigate }) => {
  const { crops, registeredFarmers, deleteCrop, resetToSampleData, setSelectedCropForDetail } = useMarket();
  const { isFirebaseConfigured, user, switchDemoRole } = useAuth();

  const [activeTab, setActiveTab] = useState('crops'); // 'crops' | 'farmers' | 'system'
  const [searchModQuery, setSearchModQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Platform statistics
  const totalListings = crops.length;
  const inStockListings = crops.filter(c => c.status === 'available').length;
  const totalFarmers = registeredFarmers.length;
  const totalEnquiries = crops.reduce((acc, c) => acc + (c.enquiries?.length || 0), 0);
  const districts = [...new Set(crops.map(c => c.district))];

  // Moderation filtered crops
  const moderatedCrops = crops.filter(crop => {
    if (!searchModQuery) return true;
    const q = searchModQuery.toLowerCase();
    return (
      crop.cropName.toLowerCase().includes(q) ||
      crop.farmerName.toLowerCase().includes(q) ||
      crop.district.toLowerCase().includes(q)
    );
  });

  const handleDeleteListing = (id) => {
    deleteCrop(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Admin Header */}
      <div className="bg-gradient-to-r from-purple-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Platform Administration & Content Moderation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              FarmConnect Admin Control Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Supervise direct farmer listings, verify grower accounts, monitor inquiry velocity, and maintain marketplace integrity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={resetToSampleData}
              className="px-4 py-2.5 rounded-xl bg-purple-700/60 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 border border-purple-400/30 transition-all"
              title="Reset platform data back to original 12 verified sample records"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Sample Data</span>
            </button>
            <button
              onClick={() => onNavigate('browse')}
              className="px-4 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-all"
            >
              Live Marketplace
            </button>
          </div>
        </div>
      </div>

      {/* 2. Platform Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Registered Farmers</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{totalFarmers}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">100% Verified profiles</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Listings</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{totalListings}</p>
          <p className="text-[11px] text-slate-500 mt-1">{inStockListings} currently available</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Buyer Inquiries</p>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{totalEnquiries}</p>
          <p className="text-[11px] text-amber-700 font-semibold mt-1">Direct inquiries logged</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Covered Districts</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{districts.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Ludhiana, Nashik, Mysuru...</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm col-span-2 lg:col-span-1">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">System Engine</p>
          <p className="text-sm font-black text-slate-900 mt-2 flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${isFirebaseConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span>{isFirebaseConfigured ? 'Cloud Firestore' : 'Demo Mode (Local)'}</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Persistence: Ready</p>
        </div>

      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('crops')}
          className={`pb-3 px-1 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'crops'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Crop Listings Moderation ({crops.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('farmers')}
          className={`pb-3 px-1 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'farmers'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Registered Farmers Directory ({registeredFarmers.length})</span>
        </button>
      </div>

      {/* 4. Tab 1: Moderation Table */}
      {activeTab === 'crops' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
          
          {/* Moderation Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Filter listings by crop, farmer, or district..."
                value={searchModQuery}
                onChange={(e) => setSearchModQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <p className="text-xs text-slate-500">
              Showing <strong>{moderatedCrops.length}</strong> listings
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Crop</th>
                  <th className="py-3 px-4">Farmer</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {moderatedCrops.map(crop => (
                  <tr key={crop.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={crop.imageUrl}
                          alt={crop.cropName}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{crop.cropName}</p>
                          <span className="text-[10px] text-slate-500 font-semibold">{crop.cropCategory}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-800">{crop.farmerName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{crop.farmerMobile}</p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="text-slate-800">{crop.district}</p>
                      <p className="text-[11px] text-slate-400">{crop.state}</p>
                    </td>

                    <td className="py-3 px-4 font-bold text-farm-800">
                      ₹{crop.price} / {crop.unit}
                    </td>

                    <td className="py-3 px-4">
                      {crop.quantity} {crop.unit}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        crop.status === 'available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {crop.status === 'available' ? 'Active' : 'Sold Out'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedCropForDetail(crop)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title="Inspect listing details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {deleteConfirmId === crop.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDeleteListing(crop.id)}
                              className="px-2 py-1 rounded bg-rose-600 text-white text-[10px] font-bold"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-1.5 py-1 rounded bg-slate-200 text-slate-700 text-[10px]"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(crop.id)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                            title="Remove inappropriate or duplicate listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* 5. Tab 2: Registered Farmers Directory */}
      {activeTab === 'farmers' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Registered Agriculturalists</h3>
              <p className="text-xs text-slate-500">Farmers currently verified on the platform.</p>
            </div>
            <span className="text-xs font-bold bg-farm-100 text-farm-800 px-3 py-1 rounded-full">
              {registeredFarmers.length} Farmers Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {registeredFarmers.map(farmer => (
              <div
                key={farmer.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 hover:border-purple-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-farm-700 text-white flex items-center justify-center font-bold text-base shadow-sm">
                    {farmer.name?.charAt(0) || 'F'}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{farmer.name}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-farm-600" />
                      <span>{farmer.district}, {farmer.state}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Contact:</span>
                    <span className="font-mono font-bold text-slate-800">{farmer.mobile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Village:</span>
                    <span className="font-semibold text-slate-700">{farmer.village || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Verified Grower
                    </span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <a
                    href={`tel:${farmer.mobile}`}
                    className="text-xs font-bold text-farm-700 hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call ({farmer.mobile})
                  </a>
                  <span className="text-[11px] text-slate-400">
                    {crops.filter(c => c.farmerMobile === farmer.mobile || c.farmerName === farmer.name).length} Listed Crops
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
