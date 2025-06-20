import React, { useState, useEffect, useRef } from 'react';
import { FaShoppingCart, FaHeart, FaUser, FaSearch, FaFacebookF, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase/config';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  createUserWithEmailAndPassword
} from "firebase/auth";
import googleLogo from "../assets/googlelogo.png";
import LoginModal from '../pages/login';

// --- Global search data ---
const productData = [
  { id: 1, name: "Kids Soft Toothbrush", description: "Perfect for children's sensitive teeth and gums. Recommended for ages 3-6.", category: "children", path: "/shop/children" },
  { id: 2, name: "Children's Medium Bristle", description: "Designed for kids 5-12 years. Helps develop good brushing habits.", category: "children", path: "/shop/children" },
  { id: 3, name: "Kids Special Brush", description: "Fun design for young children with extra-soft bristles for gentle cleaning.", category: "children", path: "/shop/children" },
  { id: 4, name: "Soft Adult Brush", description: "Gentle on gums with advanced cleaning technology for adults.", category: "adult", path: "/shop/adult" },
  { id: 5, name: "Medium Adult Brush", description: "Perfect balance of cleaning power and comfort for daily use.", category: "adult", path: "/shop/adult" },
  { id: 6, name: "Hard Adult Brush", description: "Deep cleaning action for adults who prefer firmer bristles.", category: "adult", path: "/shop/adult" },
  { id: 7, name: "Soft Old Age Brush", description: "Extra soft bristles specially designed for sensitive gums and teeth.", category: "old-age", path: "/shop/old-age" },
  { id: 8, name: "Medium Old Age Brush", description: "Comfortable grip handle with medium-soft bristles for better control.", category: "old-age", path: "/shop/old-age" },
  { id: 9, name: "Special Old Age Brush", description: "Easy-grip design perfect for those with arthritis or limited mobility.", category: "old-age", path: "/shop/old-age" },
];
const categoryData = [
  { id: 'children', name: "Children's Collection", description: "Specially designed toothbrushes with soft bristles and fun colors to make brushing enjoyable for kids aged 3-12.", path: "/shop/children" },
  { id: 'adult', name: "Adult Premium Series", description: "Professional-grade toothbrushes with precision-engineered bristles for comprehensive oral care and plaque removal.", path: "/shop/adult" },
  { id: 'old age', name: "Essential Care Line", description: "Ultra-gentle toothbrushes designed for sensitive teeth and gums, providing effective cleaning without irritation.", path: "/shop/old-age" },
];
const staticPages = [
  { name: "Home", description: "Welcome to Banat - premium toothbrushes for all ages.", path: "/" },
  { name: "About", description: "About Banat and our mission.", path: "/about" },
  { name: "Contact", description: "Contact Banat for support or inquiries.", path: "/contact" },
];

const Header = ({ cartItems = [], wishlist = [] }) => {
  const { currentUser, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [globalSearch, setGlobalSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const allSearchData = [
    ...productData,
    ...categoryData,
    ...staticPages,
  ];

  const filteredResults = globalSearch.trim()
    ? allSearchData.filter(item =>
        (item.name && item.name.toLowerCase().includes(globalSearch.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(globalSearch.toLowerCase()))
      )
    : [];

  const handleResultClick = (path) => {
    setShowDropdown(false);
    setGlobalSearch("");
    navigate(path);
  };

  const handleLoginClick = (e) => {
    e.stopPropagation();
    setShowLoginOptions(true);
  };

  const handleLoginOptionClick = (isSignUpMode, e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSignUp(isSignUpMode);
    setShowLoginModal(true);
    setShowLoginOptions(false);
    setProfileDropdown(false);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleWishlistClick = () => {
    navigate('/wishlist');
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      handleCloseModal();
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      handleCloseModal();
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
      handleCloseModal();
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          "recaptcha-container-header",
          { size: "invisible" },
          auth
        );
      }
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError("");
    setLoading(true);
    try {
      await confirmationResult.confirm(otp);
      handleCloseModal();
      navigate("/dashboard");
    } catch (error) {
      setError("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdown(false);
        setShowLoginOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleProfileDropdown = (e) => {
    e.stopPropagation();
    setProfileDropdown(!profileDropdown);
    if (!profileDropdown) {
      setShowLoginOptions(false);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <img src="/logo.png" alt="Banat Logo" />
        </Link>

        {/* Search Bar */}
        <div className="search-bar" style={{ position: 'relative' }}>
          <FaSearch className="search-icon" style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: '#00b5ad', fontSize: 20 }} />
          <input
            type="text"
            placeholder="Search products, categories, pages..." 
            className="search-input"
            style={{ paddingLeft: 44, border: '2px solid #00b5ad', borderRadius: 32, color: '#222' }}
            value={globalSearch}
            onChange={e => {
              setGlobalSearch(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            autoComplete="off"
          />
          {showDropdown && filteredResults.length > 0 && (
            <div className="global-search-dropdown">
              {filteredResults.map((item, idx) => (
                <div
                  key={idx}
                  className="global-search-result"
                  onMouseDown={() => handleResultClick(item.path)}
                >
                  <div className="global-search-title">{item.name}</div>
                  <div className="global-search-desc">{item.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side Icons */}
        <div className="header-right">
          <div className="icon-container" onClick={handleWishlistClick} style={{cursor: 'pointer'}}>
            <FaHeart className="icon" />
            <span className="icon-label">Wishlist</span>
            {wishlist.length > 0 && (
              <span className="cart-count" style={{background: '#ff4374', top: -8, right: -8}}>{wishlist.length}</span>
            )}
          </div>
          <Link to="/cart" className="icon-container cart-link">
            <FaShoppingCart className="icon" />
            <span className="icon-label">Cart</span>
            {cartItemsCount > 0 && (
              <span className="cart-count">{cartItemsCount}</span>
            )}
          </Link>
          <div 
            ref={profileRef}
            className="icon-container profile-container" 
            style={{position: 'relative'}} 
            onClick={toggleProfileDropdown}
          >
            <FaUser className="icon" />
            {currentUser && <span className="profile-name">{currentUser.displayName || currentUser.email}</span>}
            <span className="icon-label">Profile</span>
            
            {profileDropdown && (
              <div className="profile-dropdown profile-dropdown-card">
                <div className="banat-login-logo banat-logo-amazon-style" style={{marginBottom: '16px'}}>
                  Banat<span style={{color:'#00b5ad'}}>.com</span>
                </div>
                {!currentUser ? (
                  !showLoginOptions ? (
                    <button 
                      className="profile-dropdown-btn profile-dropdown-login-btn" 
                      onClick={handleLoginClick}
                    >
                      LOGIN
                    </button>
                  ) : (
                    <div className="login-options">
                      <button 
                        className="profile-dropdown-btn profile-dropdown-login-btn" 
                        onClick={(e) => handleLoginOptionClick(false, e)}
                      >
                        LOGIN
                      </button>
                      <button 
                        className="profile-dropdown-btn profile-dropdown-signup-btn" 
                        onClick={(e) => handleLoginOptionClick(true, e)}
                      >
                        SIGNUP
                      </button>
                    </div>
                  )
                ) : (
                  <>
                    <div className="profile-dropdown-welcome">Welcome</div>
                    <div className="profile-dropdown-message">{currentUser.displayName || currentUser.email}</div>
                    <div className="profile-dropdown-divider"></div>
                    <button 
                      className="profile-dropdown-link" 
                      onClick={() => navigate('/dashboard?tab=profile')}
                    >
                      Profile
                    </button>
                    <button 
                      className="profile-dropdown-link" 
                      onClick={() => navigate('/dashboard?tab=orders')}
                    >
                      Orders
                    </button>
                    <button 
                      className="profile-dropdown-link" 
                      onClick={() => navigate('/wishlist')}
                    >
                      Wishlist
                    </button>
                    <button 
                      className="profile-dropdown-link" 
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)} 
          isSignUp={isSignUp}
        />
      )}
    </header>
  );
};

export default Header; 