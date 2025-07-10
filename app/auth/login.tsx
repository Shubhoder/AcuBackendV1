// app/auth/login.tsx
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Import your custom UI components. Ensure paths are correct.
import { Button, Checkbox, TextInput } from "../../components/ui";

// Import your constants. Ensure paths are correct.
import { Colors, Spacing, Typography } from "../../constants";

// Import your shared authentication styles
import { authStyles } from "../../styles/authStyles"; // Adjust path as per your file structure

// Import assets. Ensure paths are correct and assets exist.
import Corner from '../../assets/corner.png';
import AppLogo from '../../assets/logo.png';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  // Logic to load saved credentials from AsyncStorage
  useEffect(() => {
    const loadRememberedCredentials = async () => {
      try {
        const res = await AsyncStorage.getItem('userLogin');
        if (res) {
          const data = JSON.parse(res);
          setRememberMe(true);
          setEmail(data?.userName || '');
          setPassword(data?.password || '');
        }
      } catch (error) {
        console.error('Failed to fetch user login from AsyncStorage:', error);
      }
    };
    loadRememberedCredentials();
  }, []);

  const handleLogin = async () => {
    setErrors({ email: '', password: '' });
    let isValid = true;

    if (!email) {
      setErrors(prev => ({ ...prev, email: '  Please Enter Your Username' }));
      isValid = false;
    }
    if (!password) {
      setErrors(prev => ({ ...prev, password: '  Please Enter Your Password' }));
      isValid = false;
    }

    if (!isValid) return;

    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        if (rememberMe) {
          const data = {
            userName: email,
            password: password,
          };
          await AsyncStorage.setItem('userLogin', JSON.stringify(data));
        } else {
          await AsyncStorage.removeItem('userLogin');
        }
        router.replace("../(tabs)");
      } else {
        Alert.alert("Error", "Login failed. Please check your credentials.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpPress = () => {
    router.push("./signup");
  };

  const onPressCheckBox = async (value: boolean) => {
    setRememberMe(value);
    if (!value) {
      await AsyncStorage.removeItem('userLogin');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={authStyles.container}>
        {isLoading && (
          <Modal visible={isLoading} transparent animationType="fade">
            <View style={authStyles.modalContainer}>
              <View
                style={{
                  backgroundColor: 'white',
                  height: 70,
                  width: 70,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                }}>
                <ActivityIndicator size="large" color="black" />
              </View>
            </View>
          </Modal>
        )}

        <Image source={Corner} style={authStyles.cornerimage} />

        <ScrollView
          contentContainerStyle={authStyles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={authStyles.appLogoContainer}>
            <Image source={AppLogo} style={authStyles.appLogo} />
          </View>

          <View style={authStyles.header}>
            <Text style={authStyles.title}>Welcome to Your Dictation Assistant</Text>
            <Text style={authStyles.subtitle}>
              Log in to start recording your voice effortlessly.
            </Text>
          </View>

          <View style={authStyles.form}>
            <TextInput
              label="Username"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (text) {
                  setErrors(prev => ({ ...prev, email: '' }));
                }
              }}
              placeholder="Username"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (text) {
                  setErrors(prev => ({ ...prev, password: '' }));
                }
              }}
              placeholder="********"
              isPassword
              error={errors.password}
            />

            <View style={authStyles.rememberMeContainerWrapper}>
                <Checkbox
                  checked={rememberMe}
                  onToggle={onPressCheckBox}
                  label="Remember Me"
                />
            </View>

            <View style={authStyles.formAction}>
              <Button
                title="Log in"
                onPress={handleLogin}
                loading={isLoading}
              />
            </View>

            <TouchableOpacity onPress={handleSignUpPress}>
              <Text style={authStyles.formFooter}>
                Create an account?{' '}
                <Text style={authStyles.linkText}>
                  Sign UP
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

// No need for a separate StyleSheet.create if all styles are from authStyles
// If you had any *unique* styles for LoginScreen that shouldn't be shared,
// you would define a `localStyles` StyleSheet here and merge it.