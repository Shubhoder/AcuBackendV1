import { Stack } from "expo-router";

export default function RecordingScreenLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="index" /> */}
      <Stack.Screen name="audio-recording" />
    </Stack>
  );
}
