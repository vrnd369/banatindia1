import {
  writeDataToDb,
  readDataFromDb,
  addDataToDb,
  updateDataInDb,
  deleteDataFromDb,
  subscribeToDataInDb,
  queryDataInDb
} from './config';

// User profile structure
const createUserProfile = (userData) => ({
  displayName: userData.displayName || '',
  email: userData.email || '',
  phoneNumber: userData.phoneNumber || '',
  photoURL: userData.photoURL || '',
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
  isActive: true
});

// Create or update user profile
export const saveUserProfile = async (userId, userData) => {
  const userProfile = createUserProfile(userData);
  return await writeDataToDb(`users/${userId}`, userProfile);
};

// Get user profile
export const getUserProfile = async (userId) => {
  return await readDataFromDb(`users/${userId}`);
};

// Update specific user fields
export const updateUserProfile = async (userId, updates) => {
  return await updateDataInDb(`users/${userId}`, {
    ...updates,
    lastUpdated: new Date().toISOString()
  });
};

// Delete user profile
export const deleteUserProfile = async (userId) => {
  return await deleteDataFromDb(`users/${userId}`);
};

// Subscribe to user profile changes
export const subscribeToUserProfile = (userId, callback) => {
  return subscribeToDataInDb(`users/${userId}`, callback);
};

// Search users by name
export const searchUsersByName = async (searchTerm) => {
  return await queryDataInDb('users', {
    orderBy: 'displayName',
    startAt: searchTerm,
    endAt: searchTerm + '\uf8ff'
  });
};

// Get active users
export const getActiveUsers = async (limit = 10) => {
  return await queryDataInDb('users', {
    orderBy: 'lastLogin',
    limit: limit
  });
};

// Update user's last login
export const updateLastLogin = async (userId) => {
  return await updateDataInDb(`users/${userId}`, {
    lastLogin: new Date().toISOString()
  });
}; 