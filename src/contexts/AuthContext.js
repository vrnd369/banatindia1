import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth, sendVerificationCode, verifyCode, cleanupRecaptcha } from '../firebase/config';
import { saveUserProfile, getUserProfile } from '../firebase/userDb';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Phone authentication methods
  function sendPhoneOTP(phoneNumber) {
    return sendVerificationCode(phoneNumber);
  }

  function verifyPhoneOTP(code) {
    return verifyCode(code);
  }

  function cleanupPhoneAuth() {
    return cleanupRecaptcha();
  }

  // Update user profile
  async function updateUserProfileData(updates) {
    if (!currentUser) throw new Error('No user logged in');
    
    // Update Firebase Auth profile if displayName is provided
    if (updates.displayName) {
      await updateProfile(currentUser, { displayName: updates.displayName });
    }
    
    // Update database profile
    await saveUserProfile(currentUser.uid, updates);
    
    // Update local state
    setUserProfile(prev => ({ ...prev, ...updates }));
  }

  // Load user profile from database with timeout and error state
  async function loadUserProfile(userId) {
    try {
      setProfileError(null);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Profile load timeout')), 10000)
      );
      let profile = await Promise.race([
        getUserProfile(userId),
        timeoutPromise
      ]);
      if (!profile) {
        // Create a default profile if missing
        const user = auth.currentUser;
        profile = {
          displayName: user?.displayName || '',
          email: user?.email || '',
          phoneNumber: user?.phoneNumber || '',
          photoURL: user?.photoURL || '',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          isActive: true
        };
        await saveUserProfile(userId, profile);
      }
      setUserProfile(profile);
      setProfileError(null);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUserProfile(null);
      setProfileError(error.message || 'Failed to load profile');
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Load user profile from database
        await loadUserProfile(user.uid);
      } else {
        setUserProfile(null);
        setProfileError(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    profileError,
    signup,
    login,
    logout,
    resetPassword,
    sendPhoneOTP,
    verifyPhoneOTP,
    cleanupPhoneAuth,
    updateUserProfileData,
    loadUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
      {profileError && (
        <div style={{color: 'red', textAlign: 'center', margin: '2rem'}}>
          <b>Profile Error:</b> {profileError}
        </div>
      )}
    </AuthContext.Provider>
  );
} 