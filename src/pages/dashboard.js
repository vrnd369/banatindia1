import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { updateProfile } from 'firebase/auth';
import { FaUser, FaShoppingBag, FaHeart, FaCog, FaSignOutAlt, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import './dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [wishlist, setWishlist] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [updateError, setUpdateError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setEditedName(user.displayName || '');
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const stored = localStorage.getItem('wishlist');
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleWishlistClick = () => {
    navigate('/wishlist');
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedName(user.displayName || '');
    setUpdateError('');
  };

  const handleSaveClick = async () => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: editedName
      });
      setUser({ ...user, displayName: editedName });
      setIsEditing(false);
      setUpdateError('');
    } catch (error) {
      setUpdateError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedName(user.displayName || '');
    setUpdateError('');
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="user-info">
          <div className="user-avatar">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">
                {user.displayName && user.displayName.length > 0
                  ? user.displayName[0].toUpperCase()
                  : (user.email && user.email.length > 0
                      ? user.email[0].toUpperCase()
                      : (user.phoneNumber && user.phoneNumber.length > 0
                          ? user.phoneNumber[0]
                          : '?'))}
              </div>
            )}
          </div>
          <h3>{user.displayName || user.email}</h3>
        </div>
        <nav className="dashboard-nav">
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FaUser /> Profile
          </button>
          <button 
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <FaShoppingBag /> Orders
          </button>
          <button 
            className={`nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={handleWishlistClick}
          >
            <FaHeart /> Wishlist
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FaCog /> Settings
          </button>
          <button className="nav-item sign-out" onClick={handleSignOut}>
            <FaSignOutAlt /> Sign Out
          </button>
        </nav>
      </div>

      <div className="dashboard-content">
        {activeTab === 'profile' && (
          <div className="profile-section">
            <h2>Profile Information</h2>
            <div className="profile-details">
              <div className="detail-item">
                <label>Name:</label>
                {isEditing ? (
                  <div className="edit-field">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      placeholder="Enter your name"
                      className="edit-input"
                    />
                    <div className="edit-actions">
                      <button onClick={handleSaveClick} className="save-btn" title="Save">
                        <FaCheck />
                      </button>
                      <button onClick={handleCancelEdit} className="cancel-btn" title="Cancel">
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="display-field">
                    <p>{user.displayName || 'Not set'}</p>
                    <button onClick={handleEditClick} className="edit-btn" title="Edit">
                      <FaEdit />
                    </button>
                  </div>
                )}
              </div>
              {updateError && <div className="error-message">{updateError}</div>}
              <div className="detail-item">
                <label>Email:</label>
                <p>{user.email}</p>
              </div>
              <div className="detail-item">
                <label>Account Created:</label>
                <p>{new Date(user.metadata.creationTime).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>Order History</h2>
            <div className="orders-list">
              <p className="no-orders">No orders found. Start shopping!</p>
            </div>
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="wishlist-section">
            <h2>Wishlist</h2>
            <div className="wishlist-items">
              <p className="no-items">Your wishlist is empty. Add some items!</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-section">
            <h2>Account Settings</h2>
            <div className="settings-form">
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={user.email} disabled />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 