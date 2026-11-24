import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../services/firebase';
import { SAMPLE_FARMERS } from '../data/sampleFarmers';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('farmconnect_user');
      return saved ? JSON.parse(saved) : SAMPLE_FARMERS[0]; // Default to Demo Farmer Gurpreet Singh for instant hackathon exploration
    } catch {
      return SAMPLE_FARMERS[0];
    }
  });

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Sync user state to localStorage for demo persistence
  useEffect(() => {
    if (user) {
      localStorage.setItem('farmconnect_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('farmconnect_user');
    }
  }, [user]);

  // If Firebase is configured, listen to auth state changes
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            setUser({ uid: firebaseUser.uid, ...userSnap.data() });
          } else {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || 'Farmer / Consumer',
              role: 'farmer'
            });
          }
        } catch (e) {
          console.warn('Error fetching Firestore user profile:', e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);

    // If Firebase configured, try Firebase Auth
    if (isFirebaseConfigured && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const userDocRef = doc(db, 'users', cred.user.uid);
        const userSnap = await getDoc(userDocRef);
        const userData = userSnap.exists() 
          ? { uid: cred.user.uid, ...userSnap.data() } 
          : { uid: cred.user.uid, email: cred.user.email, role: 'farmer' };
        setUser(userData);
        setLoading(false);
        return { success: true, user: userData };
      } catch (err) {
        setLoading(false);
        setAuthError(err.message);
        return { success: false, error: err.message };
      }
    }

    // Demo Mode login logic
    const matchedFarmer = SAMPLE_FARMERS.find(f => f.email.toLowerCase() === email.toLowerCase());
    if (matchedFarmer) {
      const demoUser = { ...matchedFarmer, role: 'farmer' };
      setUser(demoUser);
      setLoading(false);
      return { success: true, user: demoUser };
    }

    if (email.toLowerCase().includes('admin')) {
      const adminUser = {
        id: 'admin-1',
        name: 'FarmConnect Super Admin',
        email: email,
        role: 'admin',
        title: 'Platform Administrator'
      };
      setUser(adminUser);
      setLoading(false);
      return { success: true, user: adminUser };
    }

    // Default to Consumer account in demo mode
    const consumerUser = {
      id: `consumer-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase()),
      email: email,
      role: 'consumer',
      mobile: '9876500000',
      district: 'Demo District',
      state: 'Demo State'
    };
    setUser(consumerUser);
    setLoading(false);
    return { success: true, user: consumerUser };
  };

  // Farmer registration handler
  const registerFarmer = async (formData) => {
    setLoading(true);
    setAuthError(null);

    const { name, mobile, village, district, state, email, password } = formData;

    if (isFirebaseConfigured && auth) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const newProfile = {
          uid: cred.user.uid,
          name,
          mobile,
          village,
          district,
          state,
          email,
          role: 'farmer',
          createdAt: new Date().toISOString(),
          rating: 5.0,
          reviewsCount: 0,
          organicCertified: false
        };

        if (db) {
          await setDoc(doc(db, 'users', cred.user.uid), newProfile);
        }
        setUser(newProfile);
        setLoading(false);
        return { success: true, user: newProfile };
      } catch (err) {
        setLoading(false);
        setAuthError(err.message);
        return { success: false, error: err.message };
      }
    }

    // Demo Mode Registration
    const newFarmerUser = {
      id: `farmer-${Date.now()}`,
      name,
      mobile,
      village,
      district,
      state,
      email,
      role: 'farmer',
      rating: 5.0,
      reviewsCount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      farmSizeAcres: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      bio: `Local grower from ${village}, ${district}. Direct farm supplier.`
    };

    setUser(newFarmerUser);
    // Also save into local farmers list
    try {
      const existingFarmers = JSON.parse(localStorage.getItem('farmconnect_registered_farmers') || '[]');
      existingFarmers.push(newFarmerUser);
      localStorage.setItem('farmconnect_registered_farmers', JSON.stringify(existingFarmers));
    } catch (e) {
      console.warn('Could not save to local farmers list:', e);
    }

    setLoading(false);
    return { success: true, user: newFarmerUser };
  };

  // Switch to preset demo accounts for rapid testing during evaluation
  const switchDemoRole = (roleType) => {
    if (roleType === 'farmer') {
      setUser({ ...SAMPLE_FARMERS[0], role: 'farmer' });
    } else if (roleType === 'consumer') {
      setUser({
        id: 'consumer-rajesh',
        name: 'Rajesh Sharma',
        email: 'rajesh.sharma@example.com',
        mobile: '9811223344',
        role: 'consumer',
        district: 'South Delhi',
        state: 'Delhi'
      });
    } else if (roleType === 'admin') {
      setUser({
        id: 'admin-super',
        name: 'Virendra Singh (Kisan Mitra Admin)',
        email: 'admin@farmconnect.org',
        role: 'admin',
        mobile: '18001801551',
        title: 'State Market Surveillance Officer'
      });
    }
  };

  // Sign out
  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.warn('Firebase signout error:', e);
      }
    }
    setUser(null);
    localStorage.removeItem('farmconnect_user');
  };

  // Update profile
  const updateProfile = (updatedFields) => {
    setUser(prev => {
      const updated = { ...prev, ...updatedFields };
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      authError,
      isFirebaseConfigured,
      login,
      registerFarmer,
      logout,
      switchDemoRole,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
