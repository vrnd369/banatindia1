import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaGoogle, FaArrowLeft } from 'react-icons/fa';
import googleLogo from '../assets/googlelogo.png';
import './signup.css';

const SignupForm = () => {
  const navigate = useNavigate();
  const { sendPhoneOTP, verifyPhoneOTP, cleanupPhoneAuth, updateUserProfileData } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [step, setStep] = useState('phone'); // 'phone', 'otp', 'info'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState(null);

  useEffect(() => {
    // Cleanup function
    return () => {
      cleanupPhoneAuth();
    };
  }, [cleanupPhoneAuth]);

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
        setVerifiedUser(result.user);
        setStep('info');
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

  const handleCompleteSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!verifiedUser) {
        throw new Error('User verification not completed');
      }

      // Save user profile to Firebase database
      const userData = {
        displayName: `${userInfo.firstName} ${userInfo.lastName}`.trim(),
        email: userInfo.email,
        phoneNumber: verifiedUser.phoneNumber,
        photoURL: '',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        isActive: true,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName
      };

      await updateUserProfileData(userData);
      
      // Navigate to home page after successful signup
      navigate('/');
    } catch (error) {
      console.error('Error completing signup:', error);
      setError('Error completing signup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeNumber = () => {
    setStep('phone');
    setError('');
    setOtp('');
    setPhoneNumber('');
    setVerifiedUser(null);
    setUserInfo({ firstName: '', lastName: '', email: '' });
    cleanupPhoneAuth();
  };

  const handleInputChange = (field, value) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <button className="back-button" onClick={() => navigate('/')}>
          <FaArrowLeft /> Back
        </button>
        
        <div className="banat-login-logo">
          Banat<span style={{color:'#00b5ad'}}>.com</span>
        </div>
        
        <h2>Create Account</h2>
        <p className="signup-subtitle">Join Banat to explore our products</p>

        {error && <div className="error-message">{error}</div>}

        {step === 'phone' && (
          <form onSubmit={handleSendOTP} className="signup-form">
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
              className="signup-button"
              disabled={loading || phoneNumber.length !== 10}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="signup-form">
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
              className="signup-button"
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

        {step === 'info' && (
          <form onSubmit={handleCompleteSignup} className="signup-form">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={userInfo.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Enter your first name"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={userInfo.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Enter your last name"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Email (Optional)</label>
              <input
                type="email"
                value={userInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email address"
                disabled={loading}
              />
              <small className="input-hint">We'll use this for order updates and promotions</small>
            </div>

            <button 
              type="submit" 
              className="signup-button"
              disabled={loading || !userInfo.firstName.trim() || !userInfo.lastName.trim()}
            >
              {loading ? 'Creating Account...' : 'Complete Signup'}
            </button>

            <button 
              type="button"
              className="change-number-button"
              onClick={handleChangeNumber}
              disabled={loading}
            >
              Start Over
            </button>
          </form>
        )}

        <div className="divider">
          <span>or</span>
        </div>

        <button className="google-button">
          <img src={googleLogo} alt="Google" />
          Continue with Google
        </button>

        <p className="login-link">
          Already have an account?{' '}
          <button 
            className="link-button"
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm; 