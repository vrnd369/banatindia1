import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaWhatsapp, FaInstagram, FaFacebook, FaShareAlt } from 'react-icons/fa';
import './cart.css';

const ShoppingCart = ({ cartItems, onRemove, onQuantityChange }) => {
  const navigate = useNavigate();
  const [showShareButtons, setShowShareButtons] = useState({});

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const toggleShareButtons = (itemId) => {
    setShowShareButtons(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleShare = (platform, item) => {
    const text = `Check out ${item.name} for ₹${item.price} on our store!`;
    const url = window.location.href;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'instagram':
        // Since Instagram doesn't have a direct share URL, we'll copy to clipboard
        navigator.clipboard.writeText(text + ' ' + url)
          .then(() => alert('Link copied! You can now share it on Instagram'))
          .catch(() => alert('Failed to copy link'));
        break;
      default:
        break;
    }
  };

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>₹{item.price}</p>
                  <div className="quantity-controls">
                    <button onClick={() => onQuantityChange(item.id, 'decrease')}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onQuantityChange(item.id, 'increase')}>+</button>
                  </div>
                </div>
                <div className="cart-item-actions">
                  <button 
                    className="action-button delete"
                    onClick={() => onRemove(item.id)}
                  >
                    <FaTrash />
                  </button>
                  <div className="share-buttons-container">
                    <button 
                      className="action-button share"
                      onClick={() => toggleShareButtons(item.id)}
                    >
                      {showShareButtons[item.id] ? (
                        <div className="social-icons">
                          <button 
                            className="social-share-icon whatsapp"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare('whatsapp', item);
                            }}
                          >
                            <FaWhatsapp />
                          </button>
                          <button 
                            className="social-share-icon facebook"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare('facebook', item);
                            }}
                          >
                            <FaFacebook />
                          </button>
                          <button 
                            className="social-share-icon instagram"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare('instagram', item);
                            }}
                          >
                            <FaInstagram />
                          </button>
                        </div>
                      ) : (
                        <FaShareAlt />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="total">
              <span>Total:</span>
              <span>₹{calculateTotal()}</span>
            </div>
            <button 
              className="checkout-button"
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShoppingCart; 