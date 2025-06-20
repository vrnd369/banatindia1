import React, { useState, useEffect } from "react";
import "./login.css";
import googleLogo from "../assets/googlelogo.png";
import loginImage from "../assets/banat1.png";
import { FaFacebookF, FaTimes, FaPhone, FaEnvelope } from "react-icons/fa";
import { auth } from "../firebase/config";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LoginModal = ({ onClose, isSignUp }) => {
  const navigate = useNavigate();
  const { sendPhoneOTP, verifyPhoneOTP, cleanupPhoneAuth } = useAuth();
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Cleanup function
    return () => {
      if (loginMethod === 'phone') {
        cleanupPhoneAuth();
      }
    };
  }, [loginMethod, cleanupPhoneAuth]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
      navigate("/dashboard");
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered. Please sign in instead.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Format phone number
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      
      // Send OTP
      const confirmationResult = await sendPhoneOTP(formattedPhone);
      if (confirmationResult) {
        setStep('otp');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      let errorMessage = 'Error sending OTP. Please try again.';
      
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format. Please check and try again.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Phone authentication is not enabled. Please contact support.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.code === 'auth/internal-error') {
        errorMessage = 'An error occurred. Please try again.';
        setPhoneNumber('');
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Please complete the reCAPTCHA verification to proceed.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await verifyPhoneOTP(otp);
      if (result.user) {
        onClose();
        navigate("/dashboard");
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      let errorMessage = 'Invalid OTP. Please try again.';
      
      if (error.code === 'auth/code-expired') {
        errorMessage = 'OTP has expired. Please request a new one.';
        setStep('phone');
      } else if (error.code === 'auth/invalid-verification-code') {
        errorMessage = 'Invalid OTP. Please check and try again.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.code === 'auth/internal-error') {
        errorMessage = 'An error occurred. Please try again.';
        setStep('phone');
        setPhoneNumber('');
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
      navigate("/dashboard");
    } catch (error) {
      setError("Error signing in with Google. Please try again.");
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
      navigate("/dashboard");
    } catch (error) {
      setError("Error signing in with Facebook. Please try again.");
    }
  };

  const handleChangeNumber = () => {
    setStep('phone');
    setError('');
    setOtp('');
    setPhoneNumber('');
    cleanupPhoneAuth();
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setPhoneNumber('');
    setOtp('');
    setStep('phone');
    setError('');
  };

  // Bulletproof cleanup: always cleanup reCAPTCHA before closing or switching tabs
  const handleClose = () => {
    if (loginMethod === 'phone') {
      cleanupPhoneAuth();
    }
    onClose();
  };

  const handleTabSwitch = (method) => {
    if (loginMethod === 'phone') {
      cleanupPhoneAuth();
    }
    setLoginMethod(method);
    resetForm();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-left">
          <img src={loginImage} alt="Banat" className="login-image" />
        </div>
        
        <div className="modal-right">
          <button className="close-button" onClick={handleClose}>
            <FaTimes />
          </button>
          
          <div className="banat-login-logo">
            <img src="/logo.png" alt="Banat Logo" className="banat-logo" />
          </div>
          
          <h2>{isSignUp ? 'Create Account' : 'Welcome Back!'}</h2>
          <p className="subtitle">{isSignUp ? 'Join Banat to explore our products' : 'Sign in to continue shopping'}</p>
          
          {error && <div className="error-message">{error}</div>}

          {/* Login Method Toggle */}
          <div className="login-method-toggle">
            <button
              type="button"
              className={`toggle-button ${loginMethod === 'email' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('email')}
            >
              <FaEnvelope /> Email
            </button>
            <button
              type="button"
              className={`toggle-button ${loginMethod === 'phone' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('phone')}
            >
              <FaPhone /> Phone
            </button>
          </div>

          {/* Email/Password Form */}
          {loginMethod === 'email' && (
            <form onSubmit={handleEmailSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>
          )}

          {/* Phone Authentication Form */}
          {loginMethod === 'phone' && (
            <>
              {step === 'phone' ? (
                <form onSubmit={handleSendOTP}>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <div className="phone-input-container">
                      <span className="country-code">+91</span>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          setPhoneNumber(value.length <= 10 ? value : value.slice(0, 10));
                        }}
                        placeholder="Enter 10-digit number"
                        maxLength="10"
                        required
                        disabled={loading}
                      />
                    </div>
                    <small className="input-hint">Example: 9876543210</small>
                  </div>

                  <div id="recaptcha-container" className="recaptcha-container"></div>

                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={loading || phoneNumber.length !== 10}
                  >
                    {loading ? 'Sending...' : 'Send OTP'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP}>
                  <div className="form-group">
                    <label>Enter OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setOtp(value.length <= 6 ? value : value.slice(0, 6));
                      }}
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                      required
                      disabled={loading}
                    />
                    <small className="input-hint">Enter the 6-digit code sent to your phone</small>
                  </div>

                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={loading || otp.length !== 6}
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>

                  <button 
                    type="button"
                    className="change-number-button"
                    onClick={handleChangeNumber}
                    disabled={loading}
                  >
                    Change Phone Number
                  </button>
                </form>
              )}
            </>
          )}

          <div className="divider">
            <span>or continue with</span>
          </div>

          <div className="social-buttons">
            <button onClick={handleGoogleSignIn} className="google-button">
              <img src={googleLogo} alt="Google" className="google-icon" />
              Continue with Google
            </button>
            
            <button onClick={handleFacebookSignIn} className="facebook-button">
              <FaFacebookF className="facebook-icon" />
              Continue with Facebook
            </button>
          </div>

          <div className="terms">
            By continuing, you agree to Banat's Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
