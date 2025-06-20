import React from 'react';
import { FaHeart, FaShoppingBag, FaTrash } from 'react-icons/fa';
import './wishlist.css';

const Wishlist = ({ wishlist = [], onRemoveFromWishlist, onAddToCart }) => {
  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="wishlist-empty">
        <FaHeart className="empty-icon" />
        <h2>Your Wishlist is Empty</h2>
        <p>Add items to your wishlist to keep track of products you love!</p>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <h2 className="wishlist-title">My Wishlist</h2>
      <div className="wishlist-grid">
        {wishlist.map((item) => (
          <div key={item.id} className="wishlist-item">
            <div className="wishlist-item-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="wishlist-item-details">
              <h3>{item.name}</h3>
              <p className="wishlist-item-description">{item.description}</p>
              <p className="wishlist-item-price">₹{item.price}</p>
              <div className="wishlist-item-actions">
                <button 
                  className="add-to-cart-btn"
                  onClick={() => onAddToCart(item)}
                >
                  <FaShoppingBag className="action-icon" />
                  Add to Cart
                </button>
                <button 
                  className="remove-btn"
                  onClick={() => onRemoveFromWishlist(item.id)}
                >
                  <FaTrash className="action-icon" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist; 