import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as firebaseAuth from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbZgWR5LiXESlV2LnZGfKR2M2AUNEXkoE",
  authDomain: "cryptosphere-2c60e.firebaseapp.com",
  projectId: "cryptosphere-2c60e",
  storageBucket: "cryptosphere-2c60e.appspot.com",
  messagingSenderId: "299904779707",
  appId: "1:299904779707:web:c24e76828ac23e90b6309e",
  measurementId: "G-8JRFHRP7BS",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with React Native AsyncStorage
const auth = initializeAuth(app, {
  persistence: reactNativePersistence(AsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
