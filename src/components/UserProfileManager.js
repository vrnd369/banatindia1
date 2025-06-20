import React, { useEffect, useState } from 'react';
import {
  saveUserProfile,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  subscribeToUserProfile,
  searchUsersByName,
  getActiveUsers
} from '../firebase/userDb';

const UserProfileManager = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    photoURL: ''
  });

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeToUserProfile(userId, (data) => {
      setProfile(data);
      setLoading(false);
      if (data) {
        setFormData({
          displayName: data.displayName || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          photoURL: data.photoURL || ''
        });
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (profile) {
        await updateUserProfile(userId, formData);
      } else {
        await saveUserProfile(userId, formData);
      }
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      try {
        await deleteUserProfile(userId);
        setProfile(null);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="user-profile-manager">
      {error && <div className="error-message">{error}</div>}
      
      {!editMode && profile ? (
        <div className="profile-view">
          <h2>{profile.displayName}</h2>
          <img 
            src={profile.photoURL || 'https://via.placeholder.com/150'} 
            alt={profile.displayName}
            className="profile-image"
          />
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phoneNumber}</p>
          <p><strong>Last Login:</strong> {new Date(profile.lastLogin).toLocaleString()}</p>
          <div className="button-group">
            <button onClick={() => setEditMode(true)}>Edit Profile</button>
            <button onClick={handleDelete} className="delete-button">Delete Profile</button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="profile-form">
          <h2>{profile ? 'Edit Profile' : 'Create Profile'}</h2>
          
          <div className="form-group">
            <label htmlFor="displayName">Display Name:</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="photoURL">Photo URL:</label>
            <input
              type="url"
              id="photoURL"
              name="photoURL"
              value={formData.photoURL}
              onChange={handleInputChange}
            />
          </div>

          <div className="button-group">
            <button type="submit">{profile ? 'Update Profile' : 'Create Profile'}</button>
            {profile && (
              <button type="button" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default UserProfileManager; 