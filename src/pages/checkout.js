import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './checkout.css';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, totalPrice } = location.state || { cartItems: [], totalPrice: 0 };

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Address
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Payment
    paymentMethod: 'upi',
    upiId: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be 10 digits';
    }

    if (step === 2) {
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.pincode) newErrors.pincode = 'PIN code is required';
      else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'PIN code must be 6 digits';
    }

    if (step === 3) {
      if (formData.paymentMethod === 'upi' && !formData.upiId) {
        newErrors.upiId = 'UPI ID is required';
      }
      if (formData.paymentMethod === 'card') {
        if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
        if (!formData.cardExpiry) newErrors.cardExpiry = 'Card expiry is required';
        if (!formData.cardCvv) newErrors.cardCvv = 'CVV is required';
      }
    }

    return newErrors;
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    // Here you would typically send the order to your backend
    console.log('Order submitted:', { formData, cartItems, totalPrice });
    
    // Show success message
    alert('Order placed successfully!');
    
    // Navigate to confirmation or dashboard
    navigate('/dashboard');
  };

  const renderPersonalInfo = () => (
    <div className="checkout-section">
      <h3>Personal Information</h3>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="firstName">First Name*</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={errors.firstName ? 'error' : ''}
          />
          {errors.firstName && <span className="error-message">{errors.firstName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name*</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={errors.lastName ? 'error' : ''}
          />
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email*</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number*</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={errors.phone ? 'error' : ''}
            maxLength="10"
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>
      </div>
    </div>
  );

  const renderAddress = () => (
    <div className="checkout-section">
      <h3>Shipping Address</h3>
      <div className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="address">Street Address*</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className={errors.address ? 'error' : ''}
          />
          {errors.address && <span className="error-message">{errors.address}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="city">City*</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className={errors.city ? 'error' : ''}
          />
          {errors.city && <span className="error-message">{errors.city}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="state">State*</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className={errors.state ? 'error' : ''}
          />
          {errors.state && <span className="error-message">{errors.state}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="pincode">PIN Code*</label>
          <input
            type="text"
            id="pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleInputChange}
            className={errors.pincode ? 'error' : ''}
            maxLength="6"
          />
          {errors.pincode && <span className="error-message">{errors.pincode}</span>}
        </div>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="checkout-section">
      <h3>Payment Method</h3>
      <div className="payment-methods">
        <div className="payment-option">
          <input
            type="radio"
            id="upi"
            name="paymentMethod"
            value="upi"
            checked={formData.paymentMethod === 'upi'}
            onChange={handleInputChange}
          />
          <label htmlFor="upi">UPI Payment</label>
        </div>

        <div className="payment-option">
          <input
            type="radio"
            id="card"
            name="paymentMethod"
            value="card"
            checked={formData.paymentMethod === 'card'}
            onChange={handleInputChange}
          />
          <label htmlFor="card">Credit/Debit Card</label>
        </div>

        <div className="payment-option">
          <input
            type="radio"
            id="cod"
            name="paymentMethod"
            value="cod"
            checked={formData.paymentMethod === 'cod'}
            onChange={handleInputChange}
          />
          <label htmlFor="cod">Cash on Delivery</label>
        </div>
      </div>

      {formData.paymentMethod === 'upi' && (
        <div className="payment-details">
          <div className="form-group">
            <label htmlFor="upiId">UPI ID*</label>
            <input
              type="text"
              id="upiId"
              name="upiId"
              value={formData.upiId}
              onChange={handleInputChange}
              className={errors.upiId ? 'error' : ''}
              placeholder="username@upi"
            />
            {errors.upiId && <span className="error-message">{errors.upiId}</span>}
          </div>
        </div>
      )}

      {formData.paymentMethod === 'card' && (
        <div className="payment-details">
          <div className="form-group full-width">
            <label htmlFor="cardNumber">Card Number*</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              className={errors.cardNumber ? 'error' : ''}
              maxLength="16"
              placeholder="1234 5678 9012 3456"
            />
            {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="cardExpiry">Expiry Date*</label>
            <input
              type="text"
              id="cardExpiry"
              name="cardExpiry"
              value={formData.cardExpiry}
              onChange={handleInputChange}
              className={errors.cardExpiry ? 'error' : ''}
              placeholder="MM/YY"
              maxLength="5"
            />
            {errors.cardExpiry && <span className="error-message">{errors.cardExpiry}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="cardCvv">CVV*</label>
            <input
              type="password"
              id="cardCvv"
              name="cardCvv"
              value={formData.cardCvv}
              onChange={handleInputChange}
              className={errors.cardCvv ? 'error' : ''}
              maxLength="3"
            />
            {errors.cardCvv && <span className="error-message">{errors.cardCvv}</span>}
          </div>
        </div>
      )}
    </div>
  );

  const renderOrderSummary = () => (
    <div className="order-summary">
      <h3>Order Summary</h3>
      <div className="summary-items">
        {cartItems.map((item) => (
          <div key={item.id} className="summary-item">
            <div className="item-info">
              <img src={item.image} alt={item.name} className="item-image" />
              <div className="item-details">
                <h4>{item.name}</h4>
                <p>Quantity: {item.quantity}</p>
              </div>
            </div>
            <div className="item-price">₹{item.price * item.quantity}</div>
          </div>
        ))}
      </div>
      <div className="summary-total">
        <div className="total-row">
          <span>Subtotal:</span>
          <span>₹{totalPrice}</span>
        </div>
        <div className="total-row">
          <span>Shipping:</span>
          <span>₹{totalPrice > 0 ? 40 : 0}</span>
        </div>
        <div className="total-row grand-total">
          <span>Total:</span>
          <span>₹{totalPrice + (totalPrice > 0 ? 40 : 0)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <div className="checkout-form">
          <div className="steps-indicator">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>Personal Info</div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>Address</div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>Payment</div>
          </div>

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderPersonalInfo()}
            {currentStep === 2 && renderAddress()}
            {currentStep === 3 && renderPayment()}

            <div className="form-actions">
              {currentStep > 1 && (
                <button type="button" onClick={handleBack} className="back-button">
                  Back
                </button>
              )}
              {currentStep < 3 ? (
                <button type="button" onClick={handleNext} className="next-button">
                  Next
                </button>
              ) : (
                <button type="submit" className="place-order-button">
                  Place Order
                </button>
              )}
            </div>
          </form>
        </div>
        {renderOrderSummary()}
      </div>
    </div>
  );
};

export default CheckoutPage; 