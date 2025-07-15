// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, browserLocalPersistence,browserSessionPersistence } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBQG8HUVL76qqkH_veJaP3_DQUWBUOwaXM",
  authDomain: "jobnride-97d77.firebaseapp.com",
  projectId: "jobnride-97d77",
  storageBucket: "jobnride-97d77.appspot.com",
  messagingSenderId: "561435126314",
  appId: "1:561435126314:web:ad978c06a8f89e670d3153",
  measurementId: "G-KCGSXP44C2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: browserSessionPersistence,
});

// Initialize Firestore
const db = getFirestore(app);

// Function to check if user exists in Firebase Authentication
export const checkUserInAuth = async (phoneNumber) => {
  try {
    // Remove any spaces and make sure the format is consistent
    const cleanPhoneNumber = phoneNumber.replace(/\s+/g, '');
    console.log('Checking authentication for phone:', cleanPhoneNumber);
    
    // Query the users collection using the 'mobile' field
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('mobile', '==', cleanPhoneNumber));
    
    console.log('Querying Firestore with phone number:', cleanPhoneNumber);
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      console.log('Found user data:', userData);
      return true;
    }

    // If not found with exact match, try without the plus sign
    const phoneWithoutPlus = cleanPhoneNumber.replace('+', '');
    const q2 = query(usersRef, where('mobile', '==', '+' + phoneWithoutPlus));
    console.log('Trying alternative format:', '+' + phoneWithoutPlus);
    const querySnapshot2 = await getDocs(q2);

    if (!querySnapshot2.empty) {
      const userData = querySnapshot2.docs[0].data();
      console.log('Found user data with alternative format:', userData);
      return true;
    }

    console.log('No user found with phone number:', cleanPhoneNumber);
    return false;

  } catch (error) {
    console.error('Error checking user in Auth:', error);
    throw error;
  }
};

export { auth, app, db };