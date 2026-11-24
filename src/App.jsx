import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { MarketProvider, useMarket } from './context/MarketContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DemoModeBanner } from './components/DemoModeBanner';
import { ToastContainer } from './components/Toast';
import { CropDetailModal } from './components/CropDetailModal';
import { EnquiryModal } from './components/EnquiryModal';

import { HomePage } from './pages/HomePage';
import { BrowseCropsPage } from './pages/BrowseCropsPage';
import { FarmerDashboardPage } from './pages/FarmerDashboardPage';
import { AddCropPage } from './pages/AddCropPage';
import { PriceComparePage } from './pages/PriceComparePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AuthModal } from './pages/AuthModal';

const MainAppContent = () => {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'browse' | 'farmer-dashboard' | 'add-crop' | 'compare' | 'admin-dashboard'
  const [authModalState, setAuthModalState] = useState({ isOpen: false, mode: 'login' });

  const { 
    selectedCropForDetail, 
    setSelectedCropForDetail,
    selectedCropForEnquiry,
    setSelectedCropForEnquiry,
    setSearchQuery
  } = useMarket();

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalState({ isOpen: true, mode });
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-earth-50 text-slate-800 font-sans selection:bg-farm-200 selection:text-farm-900">
      
      {/* 1. Top Demo Mode Notice & Quick Switcher */}
      <DemoModeBanner />

      {/* 2. Global Navigation */}
      <Navbar 
        currentView={currentView} 
        setCurrentView={handleNavigate}
        onOpenAuth={handleOpenAuth} 
      />

      {/* 3. Main View Render */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage 
            onNavigate={handleNavigate} 
            onOpenAuth={handleOpenAuth} 
          />
        )}

        {currentView === 'browse' && (
          <BrowseCropsPage 
            onNavigate={handleNavigate} 
          />
        )}

        {currentView === 'farmer-dashboard' && (
          <FarmerDashboardPage 
            onNavigate={handleNavigate} 
            onOpenAuth={handleOpenAuth} 
          />
        )}

        {currentView === 'add-crop' && (
          <AddCropPage 
            onNavigate={handleNavigate} 
            onOpenAuth={handleOpenAuth} 
          />
        )}

        {currentView === 'compare' && (
          <PriceComparePage 
            onNavigate={handleNavigate} 
          />
        )}

        {currentView === 'admin-dashboard' && (
          <AdminDashboardPage 
            onNavigate={handleNavigate} 
          />
        )}
      </main>

      {/* 4. Global Modals & Notifications */}
      {selectedCropForDetail && (
        <CropDetailModal
          crop={selectedCropForDetail}
          onClose={() => setSelectedCropForDetail(null)}
          onOpenEnquiry={(crop) => setSelectedCropForEnquiry(crop)}
          onCompare={(cropName) => {
            setSearchQuery(cropName);
            handleNavigate('compare');
          }}
        />
      )}

      {selectedCropForEnquiry && (
        <EnquiryModal
          crop={selectedCropForEnquiry}
          onClose={() => setSelectedCropForEnquiry(null)}
        />
      )}

      <AuthModal
        isOpen={authModalState.isOpen}
        initialMode={authModalState.mode}
        onClose={() => setAuthModalState({ isOpen: false, mode: 'login' })}
      />

      <ToastContainer />

      {/* 5. Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MarketProvider>
        <MainAppContent />
      </MarketProvider>
    </AuthProvider>
  );
}
