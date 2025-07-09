import { Stack } from "expo-router";

export default function SettingsNewLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="change-password" />
      <Stack.Screen name="delete-account" />
    </Stack>
  );
}
