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

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthContext();
  const [email, setEmail] = useState('Loisbecket@gmail.com');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpPress = () => {
    router.push('/auth/signup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar time="9:41" signalStrength={4} batteryLevel={80} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Logo size={280} />
        
        <View style={styles.header}>
          <Text style={styles.title}>Get Started now</Text>
          <Text style={styles.subtitle}>
            Log in to access the medical transcription services of Acu Trans Solutions.
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Loisbecket@gmail.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••"
            isPassword
          />

          <View style={styles.rememberMeContainer}>
            <Checkbox
              checked={rememberMe}
              onToggle={() => setRememberMe(!rememberMe)}
              label="Remember me"
            />
          </View>

          <Button
            title="Log In"
            onPress={handleLogin}
            loading={isLoading}
            size="large"
            style={styles.loginButton}
          />

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUpPress}>
              <Text style={styles.signUpLink}>Sign Up</Text>
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
  rememberMeContainer: {
    marginBottom: Spacing.xl,
  },
  loginButton: {
    width: '100%',
    marginBottom: Spacing.lg,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: Typography.sizes.md,
    color: Colors.text.secondary,
  },
  signUpLink: {
    fontSize: Typography.sizes.md,
    color: Colors.primary,
    fontWeight: Typography.weights.semiBold,
  },
});