// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { writeData, readData, addData, updateData, deleteData, subscribeToData, queryData } from './realtimeDb';

// Your web app's Firebase configuration Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABxHrf9BtamMLNs19WxjQ8aKEcHWTp1BE",
  authDomain: "banat-8f61a.firebaseapp.com",
  databaseURL: "https://banat-8f61a-default-rtdb.firebaseio.com",
  projectId: "banat-8f61a",
  storageBucket: "banat-8f61a.firebasestorage.app",
  messagingSenderId: "748027003819",
  appId: "1:748027003819:web:e39381e4174be3119908ee",
  measurementId: "G-WNNCBBM3ZX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Set language to English
auth.languageCode = 'en';

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Realtime Database
export const realtimeDb = getDatabase(app);

// Initialize Analytics
export const analytics = getAnalytics(app);

let recaptchaVerifier = null;

// Function to initialize reCAPTCHA verifier
const initializeRecaptcha = () => {
  try {
    if (recaptchaVerifier) {
      try {
        recaptchaVerifier.clear();
      } catch (error) {
        console.error('Error clearing existing reCAPTCHA:', error);
      }
      recaptchaVerifier = null;
    }

    recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'normal',
      callback: () => {
        console.log('reCAPTCHA verified');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
        recaptchaVerifier = null;
      }
    });

    return recaptchaVerifier;
  } catch (error) {
    console.error('Error initializing reCAPTCHA:', error);
    throw error;
  }
};

// Function to send verification code
export const sendVerificationCode = async (phoneNumber) => {
  try {
    // Format phone number if needed
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
    
    // Initialize reCAPTCHA if not already initialized
    if (!recaptchaVerifier) {
      recaptchaVerifier = initializeRecaptcha();
      // Render the reCAPTCHA widget explicitly
      await recaptchaVerifier.render();
    }
    
    // Send verification code
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
    window.confirmationResult = confirmationResult;
    return confirmationResult;
  } catch (error) {
    console.error('Error sending verification code:', error);
    // Clear the verifier if there's an error
    if (recaptchaVerifier) {
      try {
        recaptchaVerifier.clear();
      } catch (clearError) {
        console.error('Error clearing reCAPTCHA:', clearError);
      }
      recaptchaVerifier = null;
    }
    throw error;
  }
};

// Function to verify code
export const verifyCode = async (code) => {
  try {
    if (!window.confirmationResult) {
      throw new Error('Please send verification code first');
    }
    const result = await window.confirmationResult.confirm(code);
    return result;
  } catch (error) {
    console.error('Error verifying code:', error);
    throw error;
  }
};

// Function to cleanup reCAPTCHA
export const cleanupRecaptcha = () => {
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch (error) {
      console.error('Error clearing reCAPTCHA:', error);
    }
    recaptchaVerifier = null;
  }
};

// Write data
export const writeDataToDb = async (path, data) => {
  try {
    await writeData(path, data);
    console.log(`Data written successfully to ${path}`);
  } catch (error) {
    console.error(`Error writing data to ${path}:`, error);
    throw error;
  }
};

// Read data
export const readDataFromDb = async (path) => {
  try {
    const data = await readData(path);
    console.log(`Data read successfully from ${path}:`, data);
    return data;
  } catch (error) {
    console.error(`Error reading data from ${path}:`, error);
    throw error;
  }
};

// Add new data with auto-generated key
export const addDataToDb = async (path, data) => {
  try {
    const newKey = await addData(path, data);
    console.log(`New data added successfully with key: ${newKey}`);
    return newKey;
  } catch (error) {
    console.error(`Error adding data to ${path}:`, error);
    throw error;
  }
};

// Update specific fields
export const updateDataInDb = async (path, data) => {
  try {
    await updateData(path, data);
    console.log(`Data updated successfully in ${path}`);
  } catch (error) {
    console.error(`Error updating data in ${path}:`, error);
    throw error;
  }
};

// Delete data
export const deleteDataFromDb = async (path) => {
  try {
    await deleteData(path);
    console.log(`Data deleted successfully from ${path}`);
  } catch (error) {
    console.error(`Error deleting data from ${path}:`, error);
    throw error;
  }
};

// Subscribe to real-time updates
export const subscribeToDataInDb = (path, callback) => {
  return subscribeToData(path, callback);
};

// Query with filters
export const queryDataInDb = async (path, options) => {
  return await queryData(path, options);
};

export default app; 