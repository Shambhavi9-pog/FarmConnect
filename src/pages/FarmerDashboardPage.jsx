import React, { useState } from 'react';
import { 
  PlusCircle, 
  Package, 
  TrendingUp, 
  Phone, 
  MessageCircle, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  MapPin, 
  Scale, 
  User, 
  Sparkles,
  Search,
  ExternalLink,
  ShieldCheck,
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMarket } from '../context/MarketContext';
import { EditCropModal } from './EditCropModal';

export const FarmerDashboardPage = ({ onNavigate, onOpenAuth }) => {
  const { user } = useAuth();
  const { crops, deleteCrop, toggleCropStatus, setSelectedCropForDetail } = useMarket();

  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'enquiries' | 'profile'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'available' | 'sold_out'
  const [editingCrop, setEditingCrop] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // If not logged in as farmer, prompt them
  if (!user || user.role !== 'farmer') {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Farmer Dashboard Access</h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Please sign in with a Farmer account or click "Simulate Demo Farmer" below to test the full farmer management dashboard.
        </p>
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onOpenAuth('login')}
            className="px-6 py-2.5 bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  // Filter crops belonging to this farmer (or all crops matching farmerId/mobile or all in demo mode)
  const farmerCrops = crops.filter(c => {
    if (c.farmerId === user.id) return true;
    if (user.mobile && c.farmerMobile === user.mobile) return true;
    if (user.name && c.farmerName === user.name) return true;
    return false;
  });

  // Calculate stats
  const totalListings = farmerCrops.length;
  const inStockListings = farmerCrops.filter(c => c.status === 'available').length;
  const soldOutListings = farmerCrops.filter(c => c.status === 'sold_out').length;
  
  // Total enquiries collected across all this farmer's crops
  const allEnquiries = farmerCrops.flatMap(c => 
    (c.enquiries || []).map(enq => ({ ...enq, cropName: c.cropName, cropUnit: c.unit, cropPrice: c.price }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  // Estimated inventory market value
  const estimatedInventoryValue = farmerCrops.reduce((acc, c) => {
    if (c.status === 'available') {
      return acc + (Number(c.price) * Number(c.quantity));
    }
    return acc;
  }, 0);

  // Status filtered listings
  const displayedCrops = farmerCrops.filter(c => {
    if (filterStatus === 'available') return c.status === 'available';
    if (filterStatus === 'sold_out') return c.status === 'sold_out';
    return true;
  });

  const handleDelete = (id) => {
    deleteCrop(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Welcome Header Banner */}
      <div className="bg-gradient-to-r from-farm-800 via-farm-700 to-emerald-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-white/20 text-farm-100 backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Verified Grower Profile</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Welcome back, {user.name}! 🌾
            </h1>
            <p className="text-xs sm:text-sm text-farm-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-farm-300" />
              <span>{user.village ? `${user.village}, ` : ''}{user.district}, {user.state}</span>
              <span>•</span>
              <span className="font-mono">Contact: {user.mobile}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('add-crop')}
              className="px-5 py-3 rounded-xl bg-white text-farm-900 hover:bg-farm-50 font-extrabold text-xs shadow-lg flex items-center gap-2 transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4 text-farm-700" />
              <span>List New Harvest</span>
            </button>
            <button
              onClick={() => onNavigate('browse')}
              className="px-4 py-3 rounded-xl bg-farm-900/40 hover:bg-farm-900 text-white border border-white/20 font-bold text-xs flex items-center gap-2 transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>View Live Market</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Crops */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Listings</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{totalListings}</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              {inStockListings} currently active
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-farm-50 text-farm-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* In-Stock Harvest */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Stock Crops</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">{inStockListings}</p>
            <p className="text-[11px] text-slate-500 mt-1">
              {soldOutListings} marked as sold
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Consumer Inquiries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Consumer Inquiries</p>
            <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{allEnquiries.length}</p>
            <p className="text-[11px] text-amber-700 font-medium mt-1">Direct buyer interest</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Est. Inventory Worth */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Stock Value</p>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              ₹{estimatedInventoryValue.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">At listed farm-gate rate</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 px-1 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'listings'
              ? 'border-farm-600 text-farm-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Crop Listings ({farmerCrops.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`pb-3 px-1 text-sm font-bold flex items-center gap-2 border-b-2 transition-all relative ${
            activeTab === 'enquiries'
              ? 'border-farm-600 text-farm-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>Direct Buyer Inquiries</span>
          {allEnquiries.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500 text-white font-extrabold">
              {allEnquiries.length}
            </span>
          )}
        </button>
      </div>

      {/* 4. Tab 1: Listings Management */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          
          {/* Action & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-600">Filter Status:</span>
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  filterStatus === 'all' ? 'bg-farm-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All ({farmerCrops.length})
              </button>
              <button
                onClick={() => setFilterStatus('available')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  filterStatus === 'available' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                In Stock ({inStockListings})
              </button>
              <button
                onClick={() => setFilterStatus('sold_out')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  filterStatus === 'sold_out' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Sold Out ({soldOutListings})
              </button>
            </div>

            <button
              onClick={() => onNavigate('add-crop')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Another Crop</span>
            </button>
          </div>

          {/* Listings Table / Cards */}
          {displayedCrops.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No Crop Listings Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You haven't listed any crops under this filter yet. Add your harvest availability to begin receiving buyer inquiries!
              </p>
              <button
                onClick={() => onNavigate('add-crop')}
                className="mt-2 inline-flex items-center gap-1.5 px-5 py-2.5 bg-farm-600 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                <PlusCircle className="w-4 h-4" /> List First Crop
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedCrops.map((crop) => (
                <div
                  key={crop.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Image & status */}
                    <div className="relative h-44 w-full bg-slate-100">
                      <img
                        src={crop.imageUrl}
                        alt={crop.cropName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-800 shadow-sm">
                          {crop.cropCategory}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={() => toggleCropStatus(crop.id)}
                          className={`px-3 py-1 rounded-full text-xs font-extrabold shadow-sm transition-transform active:scale-95 ${
                            crop.status === 'available'
                              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                              : 'bg-rose-500 text-white hover:bg-rose-600'
                          }`}
                          title="Click to toggle availability"
                        >
                          {crop.status === 'available' ? '● In Stock' : '✕ Sold Out'}
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4 space-y-2">
                      <h4 className="font-extrabold text-slate-900 text-base line-clamp-1">
                        {crop.cropName}
                      </h4>

                      <div className="flex items-baseline justify-between pt-1">
                        <div>
                          <p className="text-[11px] text-slate-500 font-semibold">Price</p>
                          <p className="text-xl font-black text-farm-800">
                            ₹{crop.price} <span className="text-xs font-normal text-slate-600">/ {crop.unit}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] text-slate-500 font-semibold">Available Stock</p>
                          <p className="text-sm font-bold text-slate-900">
                            {crop.quantity} {crop.unit}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-farm-600" />
                          <span>{crop.harvestDate || 'Fresh batch'}</span>
                        </span>
                        <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          {(crop.enquiries || []).length} Inquiries
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => toggleCropStatus(crop.id)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-white text-xs font-bold transition-colors"
                    >
                      {crop.status === 'available' ? 'Mark Sold' : 'Mark Available'}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingCrop(crop)}
                        className="p-1.5 rounded-lg bg-farm-50 text-farm-700 hover:bg-farm-100 transition-colors"
                        title="Edit Listing"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {deleteConfirmId === crop.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(crop.id)}
                            className="px-2 py-1 rounded bg-rose-600 text-white text-[11px] font-bold"
                          >
                            Confirm Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-1.5 py-1 rounded bg-slate-200 text-slate-700 text-[11px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(crop.id)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* 5. Tab 2: Enquiries Inbox */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Consumer Purchase Inquiries</h3>
              <p className="text-xs text-slate-500">
                Interested buyers who contacted you regarding your crop availability.
              </p>
            </div>
            <span className="text-xs font-bold text-farm-800 bg-farm-100 px-3 py-1 rounded-full">
              {allEnquiries.length} Inquiries Received
            </span>
          </div>

          {allEnquiries.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <MessageCircle className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No Inquiries Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                When consumers browse your crop listings and submit an enquiry form, their inquiries and contact details will appear right here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allEnquiries.map((enq) => {
                const cleanPhone = (enq.consumerPhone || '').replace(/\D/g, '');
                const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                  `Hello ${enq.consumerName}, I am ${user.name}. I received your enquiry on FarmConnect regarding "${enq.cropName}".`
                )}`;

                return (
                  <div
                    key={enq.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-farm-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-slate-900 text-sm">{enq.consumerName}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Direct Buyer
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Enquired for: <strong className="text-slate-800">{enq.cropName}</strong>
                        </p>
                      </div>

                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(enq.date).toLocaleDateString('en-IN')}
                      </span>
                    </div>

                    <div className="bg-earth-50 p-3 rounded-xl border border-earth-200 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Quantity Desired:</span>
                        <span className="font-bold text-slate-900">{enq.quantityNeeded}</span>
                      </div>
                      {enq.deliveryDate && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Timeline:</span>
                          <span className="font-semibold text-slate-700">{enq.deliveryDate}</span>
                        </div>
                      )}
                      <p className="text-slate-700 italic pt-1 border-t border-earth-200/80">
                        "{enq.message}"
                      </p>
                    </div>

                    {/* Quick Call / WhatsApp */}
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={`tel:${enq.consumerPhone}`}
                        className="flex-1 py-2 px-3 rounded-xl bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call ({enq.consumerPhone})</span>
                      </a>

                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Reply</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Edit Crop Modal */}
      {editingCrop && (
        <EditCropModal
          crop={editingCrop}
          onClose={() => setEditingCrop(null)}
        />
      )}

    </div>
  );
};
