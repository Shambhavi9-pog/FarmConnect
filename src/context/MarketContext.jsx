import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../services/firebase';
import { INITIAL_CROPS } from '../data/sampleCrops';
import { SAMPLE_FARMERS } from '../data/sampleFarmers';

const MarketContext = createContext(null);

export const MarketProvider = ({ children }) => {
  // Initialize crops from localStorage or initial fallback
  const [crops, setCrops] = useState(() => {
    try {
      const saved = localStorage.getItem('farmconnect_crops');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading crops from localStorage:', e);
    }
    return INITIAL_CROPS;
  });

  const [registeredFarmers, setRegisteredFarmers] = useState(() => {
    try {
      const saved = localStorage.getItem('farmconnect_registered_farmers');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading farmers from localStorage:', e);
    }
    return SAMPLE_FARMERS;
  });

  // Filters & Search state for Consumers
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedState, setSelectedState] = useState('All States');
  const [sortBy, setSortBy] = useState('harvest_recent');
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Active modal controls
  const [selectedCropForDetail, setSelectedCropForDetail] = useState(null);
  const [selectedCropForEnquiry, setSelectedCropForEnquiry] = useState(null);

  // Toast feedback
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync crops to localStorage for demo persistence
  useEffect(() => {
    try {
      localStorage.setItem('farmconnect_crops', JSON.stringify(crops));
    } catch (e) {
      console.warn('Failed to sync crops to localStorage:', e);
    }
  }, [crops]);

  // Firestore sync if configured
  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;

    const fetchFirestoreCrops = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'crops'));
        if (!querySnapshot.empty) {
          const loadedCrops = [];
          querySnapshot.forEach((docSnap) => {
            loadedCrops.push({ id: docSnap.id, ...docSnap.data() });
          });
          setCrops(loadedCrops);
        }
      } catch (err) {
        console.warn('Error reading from Cloud Firestore, using local data:', err);
      }
    };

    fetchFirestoreCrops();
  }, []);

  // Add new crop listing
  const addCrop = async (newCropData) => {
    const newCrop = {
      id: `crop-${Date.now()}`,
      createdAt: new Date().toISOString(),
      viewsCount: 1,
      enquiries: [],
      status: 'available',
      ...newCropData
    };

    if (isFirebaseConfigured && db) {
      try {
        const docRef = await addDoc(collection(db, 'crops'), {
          ...newCrop,
          createdAt: serverTimestamp()
        });
        newCrop.id = docRef.id;
      } catch (err) {
        console.warn('Could not save to Cloud Firestore:', err);
      }
    }

    setCrops(prev => [newCrop, ...prev]);
    showToast(`🌾 "${newCrop.cropName}" listed successfully!`);
    return newCrop;
  };

  // Update existing crop listing
  const updateCrop = async (cropId, updatedFields) => {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'crops', cropId);
        await updateDoc(docRef, updatedFields);
      } catch (err) {
        console.warn('Could not update in Cloud Firestore:', err);
      }
    }

    setCrops(prev => prev.map(crop => {
      if (crop.id === cropId) {
        return { ...crop, ...updatedFields, updatedAt: new Date().toISOString() };
      }
      return crop;
    }));

    showToast('Listing updated successfully!');
  };

  // Delete crop listing
  const deleteCrop = async (cropId) => {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'crops', cropId));
      } catch (err) {
        console.warn('Could not delete from Cloud Firestore:', err);
      }
    }

    setCrops(prev => prev.filter(c => c.id !== cropId));
    showToast('Listing removed from marketplace.', 'info');
  };

  // Toggle crop status between available and sold_out
  const toggleCropStatus = (cropId) => {
    const target = crops.find(c => c.id === cropId);
    if (!target) return;
    const nextStatus = target.status === 'available' ? 'sold_out' : 'available';
    updateCrop(cropId, { status: nextStatus });
    showToast(`Status changed to ${nextStatus === 'available' ? 'In Stock' : 'Sold Out'}`);
  };

  // Submit direct consumer enquiry
  const submitEnquiry = (cropId, enquiryData) => {
    const newEnquiry = {
      id: `enq-${Date.now()}`,
      date: new Date().toISOString(),
      status: 'new',
      ...enquiryData
    };

    setCrops(prev => prev.map(crop => {
      if (crop.id === cropId) {
        const existingEnquiries = crop.enquiries || [];
        return {
          ...crop,
          enquiries: [newEnquiry, ...existingEnquiries]
        };
      }
      return crop;
    }));

    showToast('📨 Your enquiry has been sent directly to the farmer!');
  };

  // Reset demo data to defaults
  const resetToSampleData = () => {
    setCrops(INITIAL_CROPS);
    setRegisteredFarmers(SAMPLE_FARMERS);
    localStorage.removeItem('farmconnect_crops');
    localStorage.removeItem('farmconnect_registered_farmers');
    showToast('Demo data reset to default sample records.');
  };

  // Extract distinct districts and states for filters
  const availableDistricts = ['All Districts', ...new Set(crops.map(c => c.district).filter(Boolean))];
  const availableStates = ['All States', ...new Set(crops.map(c => c.state).filter(Boolean))];

  // Filtered and sorted crops
  const filteredCrops = crops.filter(crop => {
    // Search query matching
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const matchName = crop.cropName?.toLowerCase().includes(q);
      const matchFarmer = crop.farmerName?.toLowerCase().includes(q);
      const matchVillage = crop.village?.toLowerCase().includes(q);
      const matchDistrict = crop.district?.toLowerCase().includes(q);
      const matchCategory = crop.cropCategory?.toLowerCase().includes(q);
      if (!matchName && !matchFarmer && !matchVillage && !matchDistrict && !matchCategory) {
        return false;
      }
    }

    // Category filter
    if (selectedCategory !== 'All Categories' && crop.cropCategory !== selectedCategory) {
      return false;
    }

    // District filter
    if (selectedDistrict !== 'All Districts' && crop.district !== selectedDistrict) {
      return false;
    }

    // State filter
    if (selectedState !== 'All States' && crop.state !== selectedState) {
      return false;
    }

    // Organic filter
    if (onlyOrganic && !crop.isOrganic) {
      return false;
    }

    // Available only filter
    if (onlyAvailable && crop.status !== 'available') {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') {
      return Number(a.price) - Number(b.price);
    }
    if (sortBy === 'price_desc') {
      return Number(b.price) - Number(a.price);
    }
    if (sortBy === 'quantity_desc') {
      return Number(b.quantity) - Number(a.quantity);
    }
    if (sortBy === 'harvest_recent') {
      return new Date(b.harvestDate || b.createdAt) - new Date(a.harvestDate || a.createdAt);
    }
    return 0;
  });

  return (
    <MarketContext.Provider value={{
      crops,
      filteredCrops,
      registeredFarmers,
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
      addCrop,
      updateCrop,
      deleteCrop,
      toggleCropStatus,
      submitEnquiry,
      resetToSampleData,
      selectedCropForDetail,
      setSelectedCropForDetail,
      selectedCropForEnquiry,
      setSelectedCropForEnquiry,
      toasts,
      showToast,
      removeToast
    }}>
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) throw new Error('useMarket must be used within a MarketProvider');
  return context;
};
