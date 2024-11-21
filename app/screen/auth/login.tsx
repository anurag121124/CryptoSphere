import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { handleLogin } from '../../../services/auth.service';
import { User } from '../../../types/types';
import { useNavigation } from '@react-navigation/native';

const Login = ({navigation}) => {
  const [isEmailLogin, setIsEmailLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async () => {
    try {
      setIsLoading(true);
      const credentials = isEmailLogin ? { email, password } : { phoneNumber, password };
      await handleLogin(credentials);
      navigation.navigate('Home');
    } catch (error: any) {
      Alert.alert('Login Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Welcome Back</Text>
          <Text style={styles.subText}>Sign in to continue</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.loginTypeSwitch}>
            <TouchableOpacity
              style={[styles.loginTypeButton, isEmailLogin && styles.activeLoginType]}
              onPress={() => setIsEmailLogin(true)}
            >
              <Text style={[styles.loginTypeText, isEmailLogin && styles.activeLoginTypeText]}>
                Email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.loginTypeButton, !isEmailLogin && styles.activeLoginType]}
              onPress={() => setIsEmailLogin(false)}
            >
              <Text style={[styles.loginTypeText, !isEmailLogin && styles.activeLoginTypeText]}>
                Phone
              </Text>
            </TouchableOpacity>
          </View>

          {isEmailLogin ? (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor="#666"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              {isEmailLogin ? 'Password' : 'OTP'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={isEmailLogin ? 'Enter your password' : 'Enter OTP'}
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={isEmailLogin}
              keyboardType={isEmailLogin ? 'default' : 'number-pad'}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton, isLoading && styles.disabledButton]}
            onPress={handleLoginSubmit}
            disabled={isLoading}
          >
            <Text style={styles.primaryButtonText}>
              {isLoading ? 'Loading...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchContainer}
            onPress={() => navigation.navigate('Signup') }
          >
            <Text style={styles.switchText}>Don't have an account? Create one</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#121212' },
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoText: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  subText: { fontSize: 16, color: '#888', textAlign: 'center' },
  formContainer: { width: '100%' },
  inputContainer: { marginBottom: 20 },
  inputLabel: { color: '#fff', fontSize: 16, marginBottom: 8 },
  input: {
    width: '100%',
    padding: 15,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  button: { width: '100%', padding: 16, borderRadius: 12, alignItems: 'center', marginVertical: 8 },
  primaryButton: { backgroundColor: '#1DB954' },
  disabledButton: { opacity: 0.6 },
  primaryButtonText: { color: '#fff' },
  switchContainer: { alignItems: 'center', marginTop: 16 },
  switchText: { color: '#1DB954', fontSize: 14 },
  loginTypeSwitch: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  loginTypeButton: { flex: 1, padding: 12, alignItems: 'center', backgroundColor: '#1e1e1e' },
  activeLoginType: { backgroundColor: '#1DB954' },
  loginTypeText: { color: '#666', fontSize: 16, fontWeight: '600' },
  activeLoginTypeText: { color: '#fff' },
});
