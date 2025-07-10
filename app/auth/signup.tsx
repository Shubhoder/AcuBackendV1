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
import { useAuthContext } from '@/contexts/AuthContext';
import { Colors, Spacing, Typography } from '../../constants';

// Import your shared authentication styles
import { authStyles } from "../../styles/authStyles";

// Import assets
import Corner from '../../assets/corner.png';
import AppLogo from '../../assets/logo.png';

export default function SignUpScreen() {
  const router = useRouter();
  const { signup } = useAuthContext();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(''); // Initialized to empty
  const [mobile, setMobile] = useState(''); // Initialized to empty
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Added for typical signup flow
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeTerms: '',
  });

  const handleSignUp = async () => {
    // Reset errors first
    setErrors({
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      username: '',
      password: '',
      confirmPassword: '',
      agreeTerms: '',
    });
    
    let isValid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      username: '',
      password: '',
      confirmPassword: '',
      agreeTerms: '',
    };

    // Validate all fields
    if (!firstName) {
      newErrors.firstName = 'First Name is required';
      isValid = false;
    }
    if (!lastName) {
      newErrors.lastName = 'Last Name is required';
      isValid = false;
    }
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }
    if (!mobile) {
      newErrors.mobile = 'Mobile number is required';
      isValid = false;
    }
    if (!username) {
      newErrors.username = 'Username is required';
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
      newErrors.confirmPassword = 'Confirm Password is required';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms & Service';
      isValid = false;
    }

    // Set all errors at once
    setErrors(newErrors);

    if (!isValid) return;

    setIsLoading(true);
    try {
      const success = await signup({
        firstName,
        lastName,
        email,
        mobile,
        username,
        password,
      });

      if (success) {
        Alert.alert("Success", "Account created successfully! Please log in."); // Inform user to log in
        router.replace("./login"); // Redirect to login after successful signup
      } else {
        Alert.alert('Error', 'Sign up failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during sign up');
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
                  label="First Name"
                  value={firstName}
                  onChangeText={(text) => {
                    setFirstName(text);
                    if (text) setErrors(prev => ({ ...prev, firstName: '' }));
                  }}
                  placeholder="First Name"
                  error={errors.firstName}
                />
              </View>
              <View style={authStyles.nameField}>
                <TextInput
                  label="Last Name"
                  value={lastName}
                  onChangeText={(text) => {
                    setLastName(text);
                    if (text) setErrors(prev => ({ ...prev, lastName: '' }));
                  }}
                  placeholder="Last Name"
                  error={errors.lastName}
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

            <TextInput
              label="Mobile"
              value={mobile}
              onChangeText={(text) => {
                setMobile(text);
                if (text) setErrors(prev => ({ ...prev, mobile: '' }));
              }}
              placeholder="9876543210"
              keyboardType="phone-pad"
              error={errors.mobile}
            />

            <View style={authStyles.credentialsRow}>
              <View style={authStyles.credentialsField}>
                <TextInput
                  label="Username"
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text);
                    if (text) setErrors(prev => ({ ...prev, username: '' }));
                  }}
                  placeholder="Enter Username"
                  autoCapitalize="none"
                  error={errors.username}
                />
              </View>
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
            </View>

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