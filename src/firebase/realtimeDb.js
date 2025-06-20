import { realtimeDb } from './config';
import { 
  ref, 
  set, 
  get, 
  onValue, 
  off, 
  push, 
  update, 
  remove,
  query,
  orderByChild,
  limitToLast,
  startAt,
  endAt
} from 'firebase/database';

// Write data to a specific path
export const writeData = async (path, data) => {
  try {
    await set(ref(realtimeDb, path), data);
    return true;
  } catch (error) {
    console.error('Error writing data:', error);
    throw error;
  }
};

// Read data from a specific path
export const readData = async (path) => {
  try {
    const snapshot = await get(ref(realtimeDb, path));
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error('Error reading data:', error);
    throw error;
  }
};

// Add new data with auto-generated key
export const addData = async (path, data) => {
  try {
    const newRef = push(ref(realtimeDb, path));
    await set(newRef, data);
    return newRef.key;
  } catch (error) {
    console.error('Error adding data:', error);
    throw error;
  }
};

// Update specific fields without overwriting entire object
export const updateData = async (path, data) => {
  try {
    await update(ref(realtimeDb, path), data);
    return true;
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
};

// Delete data from a specific path
export const deleteData = async (path) => {
  try {
    await remove(ref(realtimeDb, path));
    return true;
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
};

// Listen for real-time updates
export const subscribeToData = (path, callback) => {
  const dataRef = ref(realtimeDb, path);
  onValue(dataRef, (snapshot) => {
    const data = snapshot.exists() ? snapshot.val() : null;
    callback(data);
  });
  
  // Return unsubscribe function
  return () => off(dataRef);
};

// Query data with filters
export const queryData = async (path, options = {}) => {
  try {
    let dataRef = ref(realtimeDb, path);
    
    // Apply filters if provided
    if (options.orderBy) {
      dataRef = query(dataRef, orderByChild(options.orderBy));
    }
    if (options.limit) {
      dataRef = query(dataRef, limitToLast(options.limit));
    }
    if (options.startAt) {
      dataRef = query(dataRef, startAt(options.startAt));
    }
    if (options.endAt) {
      dataRef = query(dataRef, endAt(options.endAt));
    }

    const snapshot = await get(dataRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error('Error querying data:', error);
    throw error;
  }
}; 