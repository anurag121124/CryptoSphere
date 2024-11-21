import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  PhoneAuthProvider,
  signInWithCredential,
  signOut,RecaptchaVerifier
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/index"; // Replace with your Firebase initialization file
import { User } from "../types/types";
import { Credentials } from "../types/types";
// Register a new user
export const handleRegister = async (
  credentials: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  },
  setUser: (user: User) => void
): Promise<void> => {
  try {
    const { email, password, firstName, lastName, phoneNumber } = credentials;
    const auth = getAuth();

    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userData: User = {
      email,
      firstName,
      lastName,
      phoneNumber: phoneNumber || null,
    };

    // Save user data to Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), userData);
    setUser(userData);
  } catch (error: any) {
    console.error("Registration Error:", error);
    throw new Error(error.message || "An error occurred during registration");
  }
};

// Verify phone OTP
export const verifyPhoneOTP = async (verificationId: string, code: string) => {
  try {
    const auth = getAuth();

    // Create a credential with the verification ID and the code
    const credential = PhoneAuthProvider.credential(verificationId, code);

    // Sign in the user with the credential
    const userCredential = await signInWithCredential(auth, credential);
    return userCredential.user;
  } catch (error: any) {
    console.error("OTP Verification Error:", error);
    throw new Error(error.message || "Failed to verify OTP");
  }
};

// Request OTP for phone verification
export const requestOTP = async (
  phoneNumber: string,
  recaptchaVerifier: any // Recaptcha verifier should be provided from the frontend
): Promise<string> => {
  try {
    const auth = getAuth();

    // Verify phone number and get the verification ID
    const phoneProvider = new PhoneAuthProvider(auth);
    const verificationId = await phoneProvider.verifyPhoneNumber(phoneNumber, recaptchaVerifier);
    return verificationId;
  } catch (error: any) {
    console.error("OTP Request Error:", error);
    throw new Error(error.message || "Failed to request OTP");
  }
};

// Logout the user
export const handleLogout = async (): Promise<void> => {
  try {
    const auth = getAuth();
    await signOut(auth);
  } catch (error: any) {
    console.error("Logout Error:", error);
    throw new Error(error.message || "Failed to logout");
  }
};


export const handleLogin = async (credentials: { 
  email?: string; 
  password?: string; 
  phoneNumber?: string 
}) => {
  try {
      const { email, password, phoneNumber } = credentials;
      const authInstance = getAuth(); // Explicitly get auth instance
      
      if (email) {
          const userCredential = await signInWithEmailAndPassword(authInstance, email, password!);
          const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
          if (!userDoc.exists()) throw new Error('User document not found');
      } else if (phoneNumber) {
          // Ensure you have a recaptcha container in your HTML
          const recaptchaVerifier = new RecaptchaVerifier(
              authInstance, 
              'recaptcha-container', 
              { 'size': 'invisible' }
          );

          const provider = new PhoneAuthProvider(authInstance);
          const verificationId = await provider.verifyPhoneNumber(
              phoneNumber, 
              recaptchaVerifier
          );

          return verificationId; // Return verification ID for OTP verification
      }
  } catch (error: any) {
      console.error("Login Error:", error);
      throw new Error(error.message || 'An error occurred during login');
  }
};


