import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/contexts/AuthContext';
import { OutboxProvider } from '@/contexts/OutboxContext';
import { AudioProvider } from '@/contexts/AudioContext';
import { WaveformProvider } from '@/contexts/WaveformContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <OutboxProvider>
          <WaveformProvider>
            <AudioProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="auth" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="settingsnew" />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="dark" />
            </AudioProvider>
          </WaveformProvider>
        </OutboxProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}