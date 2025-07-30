// app/auth/signup.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button, TextInput, Checkbox } from '../../components/ui';
import { useAuthContext } from '../../contexts/AuthContext';
import { Colors, Spacing, Typography } from '../../constants';

// Import your shared authentication styles
import { authStyles } from "../../styles/authStyles";

// Import assets
import Corner from '../../assets/corner.png';
import AppLogo from '../../assets/logo.png';

export default function SignUpScreen() {
  const router = useRouter();
  const authContext = useAuthContext();
  const signup = authContext?.signup;
  const [name, setName] = useState(''); // Combined name field for backend
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: '',
  });

  const handleSignUp = async () => {
    // Reset errors first
    setErrors({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: '',
    });
    
    let isValid = true;
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: '',
    };

    // Validate all fields
    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await signup({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      
      Alert.alert(
        'Success', 
        'Account created successfully! You are now logged in.',
        [{ text: 'OK', onPress: () => router.replace('../(tabs)') }]
      );
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Handle specific error cases
      let errorMessage = "Signup failed. Please try again.";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.status === 409) {
        errorMessage = "An account with this email already exists.";
      } else if (error.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      }
      
      Alert.alert("Signup Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInPress = () => {
    router.push("./login");
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
            <Text style={authStyles.title}>Create Your Account</Text> {/* Changed title */}
            <Text style={authStyles.subtitle}>
              Sign up to access medical transcription services.
            </Text> {/* Changed subtitle */}
          </View>

          <View style={authStyles.form}>
            <View style={authStyles.nameRow}>
              <View style={authStyles.nameField}>
                <TextInput
                  label="Name"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (text) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  placeholder="Enter your name"
                  error={errors.name}
                />
              </View>
            </View>

            <TextInput
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (text) setErrors(prev => ({ ...prev, email: '' }));
              }}
              placeholder="johndoe@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <View style={authStyles.credentialsRow}>
              <View style={authStyles.credentialsField}>
                <TextInput
                  label="Password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (text) setErrors(prev => ({ ...prev, password: '' }));
                  }}
                  placeholder="********"
                  isPassword
                  error={errors.password}
                />
              </View>
              <View style={authStyles.credentialsField}>
                <TextInput
                  label="Confirm Password"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (text) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }}
                  placeholder="********"
                  isPassword
                  error={errors.confirmPassword}
                />
              </View>
            </View>

            <View style={authStyles.rememberMeContainerWrapper}> {/* Reusing this style for terms, name changed below */}
              <Checkbox
                checked={agreeTerms}
                onToggle={() => {
                  setAgreeTerms(!agreeTerms);
                  if (!agreeTerms) setErrors(prev => ({ ...prev, agreeTerms: '' }));
                }}
                label="Agree with Terms & Service"
              />
              {errors.agreeTerms ? <Text style={localStyles.errorTextTerms}>{errors.agreeTerms}</Text> : null}
            </View>


            <View style={authStyles.formAction}>
              <Button
                title="Sign Up"
                onPress={handleSignUp}
                loading={isLoading}
              />
            </View>

            <TouchableOpacity onPress={handleSignInPress}>
              <Text style={authStyles.formFooter}>
                Already have an account?{' '}
                <Text style={authStyles.linkText}>
                  Sign In
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

// Any styles unique to the SignupScreen, or small overrides, go here.
// For the most part, we want to reuse authStyles.
const localStyles = StyleSheet.create({
  // The error text for the checkbox needs a bit of a different margin perhaps
  errorTextTerms: {
    color: Colors.text.error,
    fontSize: Typography.sizes.sm,
    marginTop: Spacing.sm, // Smaller margin than input error
    marginLeft: 2, // Align with checkbox
  },
});