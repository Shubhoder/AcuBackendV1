import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar, Button, TextInput, Checkbox } from '../../components/ui';
import { Logo } from '../../components/common';
import { useAuthContext } from '@/contexts/AuthContext';
import { Colors, Typography, Spacing } from '../../constants';

export default function SignUpScreen() {
  const router = useRouter();
  const { signup } = useAuthContext();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('johndoe@gmail.com');
  const [mobile, setMobile] = useState('9865453215');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !mobile || !username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!agreeTerms) {
      Alert.alert('Error', 'Please agree to Terms & Service');
      return;
    }

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
        router.replace('/(tabs)');
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
    router.push('/auth/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar time="9:41" signalStrength={4} batteryLevel={80} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Logo size={280} />
        
        <View style={styles.header}>
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subtitle}>
            Create an account to hire the medical transcription services of Acu Trans Solutions
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.nameRow}>
            <View style={styles.nameField}>
              <TextInput
                label="First Name"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First Name"
              />
            </View>
            <View style={styles.nameField}>
              <TextInput
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last Name"
              />
            </View>
          </View>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="johndoe@gmail.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            label="Mobile"
            value={mobile}
            onChangeText={setMobile}
            placeholder="9865453215"
            keyboardType="phone-pad"
          />

          <View style={styles.credentialsRow}>
            <View style={styles.credentialsField}>
              <TextInput
                label="Username"
                value={username}
                onChangeText={setUsername}
                placeholder="Enter Username"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.credentialsField}>
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••"
                isPassword
              />
            </View>
          </View>

          <View style={styles.termsContainer}>
            <Checkbox
              checked={agreeTerms}
              onToggle={() => setAgreeTerms(!agreeTerms)}
            />
            <Text style={styles.termsText}>
              Agree with{' '}
              <Text style={styles.termsLink}>Terms & Service</Text>
            </Text>
          </View>

          <Button
            title="Sign Up"
            onPress={handleSignUp}
            loading={isLoading}
            size="large"
            style={styles.signUpButton}
          />

          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleSignInPress}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  title: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: Typography.sizes.md,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeights.normal * Typography.sizes.md,
  },
  form: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    marginHorizontal: -Spacing.xs,
  },
  nameField: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  credentialsRow: {
    flexDirection: 'row',
    marginHorizontal: -Spacing.xs,
  },
  credentialsField: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  termsText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    marginLeft: Spacing.sm,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: Typography.weights.semiBold,
  },
  signUpButton: {
    width: '100%',
    marginBottom: Spacing.lg,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: Typography.sizes.md,
    color: Colors.text.secondary,
  },
  signInLink: {
    fontSize: Typography.sizes.md,
    color: Colors.primary,
    fontWeight: Typography.weights.semiBold,
  },
});