import React, { useState, useEffect } from 'react';
import { auth, sendVerificationCode, verifyCode, cleanupRecaptcha } from '../firebase/config';
import './PhoneAuth.css';

const PhoneAuth = ({ onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set language to English
    auth.languageCode = 'en';
    
    // Cleanup function
    return () => {
      cleanupRecaptcha();
    };
  }, []);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Format phone number
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      
      // Send OTP
      const confirmationResult = await sendVerificationCode(formattedPhone);
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
      const result = await verifyCode(otp);
      if (result.user) {
        onClose();
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

  const handleChangeNumber = () => {
    setStep('phone');
    setError('');
    setOtp('');
    setPhoneNumber('');
    cleanupRecaptcha();
  };

  return (
    <div className="phone-auth-section">
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
          {error && <div className="error-message">{error}</div>}
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
          {error && <div className="error-message">{error}</div>}
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading || otp.length !== 6}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <button 
            type="button"
            className="back-button"
            onClick={handleChangeNumber}
            disabled={loading}
          >
            Change Phone Number
          </button>
        </form>
      )}
    </div>
  );
};

export default PhoneAuth; 