import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar, Button } from '../../components/ui';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing } from '../../constants';

export default function SettingsScreen() {
  const { logout } = useAuthContext();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/auth/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar time="9:41" signalStrength={4} batteryLevel={80} />
      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your app preferences</Text>
        
        <View style={styles.logoutContainer}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
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
    marginBottom: Spacing.xxl,
  },
  logoutContainer: {
    marginTop: Spacing.xxl,
  },
  logoutButton: {
    minWidth: 120,
  },
});