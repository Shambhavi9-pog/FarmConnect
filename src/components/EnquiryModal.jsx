import React, { useState } from 'react';
import { X, Send, Phone, User, MessageSquare, Package, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMarket } from '../context/MarketContext';

export const EnquiryModal = ({ crop, onClose }) => {
  const { user } = useAuth();
  const { submitEnquiry } = useMarket();

  const [formData, setFormData] = useState({
    consumerName: user?.name || '',
    consumerPhone: user?.mobile || '',
    quantityNeeded: '',
    message: '',
    deliveryDate: ''
  });

  const [submitted, setSubmitted] = useState(false);

  if (!crop) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.consumerName || !formData.consumerPhone || !formData.quantityNeeded) {
      alert('Please fill out your name, contact phone, and required quantity.');
      return;
    }

    submitEnquiry(crop.id, {
      consumerName: formData.consumerName,
      consumerPhone: formData.consumerPhone,
      quantityNeeded: `${formData.quantityNeeded} ${crop.unit}`,
      message: formData.message || `Interested in buying ${formData.quantityNeeded} ${crop.unit} of ${crop.cropName}.`,
      deliveryDate: formData.deliveryDate || 'As soon as possible'
    });

    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-farm-50 border-b border-farm-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">Send Direct Crop Enquiry</h3>
            <p className="text-xs text-farm-700 font-medium">To Farmer: {crop.farmerName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>
            <h4 className="text-lg font-bold text-slate-900">Enquiry Sent to {crop.farmerName}!</h4>
            <p className="text-xs text-slate-500">
              The farmer will receive your enquiry in their dashboard along with your contact number.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Target Crop Summary Pill */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-800">{crop.cropName}</p>
                <p className="text-slate-500">Rate: ₹{crop.price} / {crop.unit}</p>
              </div>
              <span className="font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Stock: {crop.quantity} {crop.unit}
              </span>
            </div>

            {/* Consumer Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Full Name / Business *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar / FreshMart Stores"
                  value={formData.consumerName}
                  onChange={(e) => setFormData({ ...formData, consumerName: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500"
                />
              </div>
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Contact Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number for farmer callback"
                  value={formData.consumerPhone}
                  onChange={(e) => setFormData({ ...formData, consumerPhone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500"
                />
              </div>
            </div>

            {/* Quantity Required */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Quantity Needed ({crop.unit}) *
              </label>
              <div className="relative">
                <Package className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  min="1"
                  required
                  placeholder={`How many ${crop.unit}s do you require?`}
                  value={formData.quantityNeeded}
                  onChange={(e) => setFormData({ ...formData, quantityNeeded: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500"
                />
              </div>
            </div>

            {/* Message / Query */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Message / Logistics Query (Optional)
              </label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <textarea
                  rows="3"
                  placeholder="Ask about farm pickup, transport availability, or specific packaging..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-farm-600 hover:bg-farm-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-farm-600/30 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Enquiry</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
