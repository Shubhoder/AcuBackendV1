import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';

export default function DocumentsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar time="9:41" signalStrength={4} batteryLevel={80} />
      <View style={styles.content}>
        <Text style={styles.title}>Documents</Text>
        <Text style={styles.subtitle}>View your medical transcription documents</Text>
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
  },
});