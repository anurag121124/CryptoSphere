import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { getApp } from "firebase/app";
import { handleRegister, requestOTP, verifyPhoneOTP } from "../../../services/auth.service";

interface SignupProps {
  navigation: any;
}

const Signup: React.FC<SignupProps> = ({ navigation }) => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [verificationId, setVerificationId] = useState<string>("");
  const [showOtp, setShowOtp] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ReCAPTCHA verifier
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);

  const validateForm = (): string | null => {
    if (!firstName.trim()) return "First name is required";
    if (!lastName.trim()) return "Last name is required";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Valid email is required";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
  };

  const handleSignup = async () => {
    const error = validateForm();
    if (error) {
      Alert.alert("Validation Error", error);
      return;
    }

    try {
      setIsLoading(true);
      await handleRegister(
        {
          email,
          password,
          firstName,
          lastName,
          phoneNumber,
        },
        () => {
          if (phoneNumber) {
            requestPhoneVerification();
          } else {
            navigation.navigate("Login");
          }
        }
      );
    } catch (error: any) {
      Alert.alert("Registration Error", error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const requestPhoneVerification = async () => {
    try {
      const verfId = await requestOTP(phoneNumber, recaptchaVerifier.current!);
      setVerificationId(verfId);
      setShowOtp(true);
    } catch (error: any) {
      Alert.alert("OTP Request Failed", error.message);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      Alert.alert("OTP Error", "Please enter the OTP");
      return;
    }

    try {
      setIsLoading(true);
      const user = await verifyPhoneOTP(verificationId, otp);
      Alert.alert("Success", "Phone number verified successfully");
      navigation.navigate("Login");
    } catch (error: any) {
      Alert.alert("Verification Failed", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={getApp().options}
      />
            <StatusBar barStyle="light-content" />

      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Sign Up</Text>
          <Text style={styles.subText}>
            {!showOtp
              ? "Create your account to get started"
              : "Verify your phone number"}
          </Text>
        </View>

        <View style={styles.formContainer}>
          {!showOtp ? (
            <>
              {/* Input Fields */}
              <InputField
                label="First Name"
                placeholder="Enter first name"
                value={firstName}
                onChangeText={setFirstName}
              />
              <InputField
                label="Last Name"
                placeholder="Enter last name"
                value={lastName}
                onChangeText={setLastName}
              />
              <InputField
                label="Email"
                placeholder="Enter email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <InputField
                label="Phone Number (Optional)"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
              <InputField
                label="Password"
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <InputField
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.primaryButton,
                  isLoading && styles.disabledButton,
                ]}
                onPress={handleSignup}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryButtonText}>Create Account</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* OTP Verification */}
              <InputField
                label="Enter OTP"
                placeholder="Enter 6-digit verification code"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
              />
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.primaryButton,
                  isLoading && styles.disabledButton,
                ]}
                onPress={handleVerifyOtp}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryButtonText}>Verify OTP</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={styles.switchContainer}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.switchText}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "email-address" | "phone-pad" | "number-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  secureTextEntry?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  autoCapitalize = "sentences",
  secureTextEntry = false,
}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#666"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      secureTextEntry={secureTextEntry}
    />
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
  },
  subText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 10,
  },
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    padding: 15,
    backgroundColor: "#1e1e1e",
    color: "#fff",
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  button: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  primaryButton: {
    backgroundColor: "#1DB954",
  },
  disabledButton: {
    backgroundColor: "#3a3a3a",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  switchContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  switchText: {
    color: "#1DB954",
    fontSize: 14,
  },
});

export default Signup;
