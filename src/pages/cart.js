import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";
import "./cart.css";

const Cart = ({
  cartItems,
  incrementQuantity,
  decrementQuantity,
  onDelete,
  onSaveForLater,
  onShare,
}) => {
  const navigate = useNavigate();
  const [showShareButtons, setShowShareButtons] = useState({});

  if (!cartItems || cartItems.length === 0) {
    return <div className="cart-empty">Your cart is empty.</div>;
  }

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    navigate('/checkout', { state: { cartItems, totalPrice } });
  };

  const toggleShareButtons = (itemId) => {
    setShowShareButtons(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleShare = (item, platform) => {
    const text = `Check out ${item.name} on Banat!`;
    const url = window.location.href;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'instagram':
        // Since Instagram doesn't have a direct share URL, we'll copy the link to clipboard
        navigator.clipboard.writeText(text + ' ' + url);
        alert('Link copied! You can now share it on Instagram');
        break;
      default:
        break;
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Shopping Cart</h2>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item card">
            <div className="cart-item-main">
              <img
                src={item.image.default || item.image}
                alt={item.name}
                className="cart-item-image"
              />
              <div className="cart-item-info">
                <h4>{item.name}</h4>
                {item.color && (
                  <p className="cart-item-detail">Colour: {item.color}</p>
                )}
                {item.styleName && (
                  <p className="cart-item-detail">Style: {item.styleName}</p>
                )}
                {item.seller && (
                  <p className="cart-item-detail">Sold by: {item.seller}</p>
                )}
                <p className="cart-item-detail">
                  Price: <span className="cart-item-price">₹{item.price}</span>
                </p>
                <div className="quantity-control">
                  <button 
                    onClick={() => decrementQuantity(item.id)}
                    className="qty-btn"
                  >
                    -
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button 
                    onClick={() => incrementQuantity(item.id)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>
                <p className="cart-item-subtotal">
                  Subtotal: ₹{item.price * item.quantity}
                </p>
                <button
                  className="cart-action-link"
                  onClick={() => onSaveForLater && onSaveForLater(item.id)}
                >
                  Save for later
                </button>
              </div>
            </div>
            <div className="cart-item-actions">
              <button
                className="cart-action-link"
                onClick={() => onDelete && onDelete(item.id)}
              >
                Delete
              </button>
              <div className="share-buttons-container">
                <button
                  className="cart-action-link share-button"
                  onClick={() => toggleShareButtons(item.id)}
                >
                  Share
                </button>
                {showShareButtons[item.id] && (
                  <div className="social-icons">
                    <button
                      className="social-share-icon whatsapp"
                      onClick={() => handleShare(item, 'whatsapp')}
                      title="Share on WhatsApp"
                    >
                      <FaWhatsapp />
                    </button>
                    <button
                      className="social-share-icon facebook"
                      onClick={() => handleShare(item, 'facebook')}
                      title="Share on Facebook"
                    >
                      <FaFacebook />
                    </button>
                    <button
                      className="social-share-icon instagram"
                      onClick={() => handleShare(item, 'instagram')}
                      title="Share on Instagram"
                    >
                      <FaInstagram />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="cart-total-bar">
          <span>
            Subtotal ({cartItems.reduce((sum, i) => sum + i.quantity, 0)} items):
          </span>
          <span className="cart-total">₹{totalPrice}</span>
        </div>
        <button className="checkout-button" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
