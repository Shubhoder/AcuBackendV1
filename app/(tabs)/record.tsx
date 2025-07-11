import { useRouter } from "expo-router";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Colors, Spacing, Typography } from "../../constants";

export default function RecordScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <TouchableOpacity
            onPress={() => router.push("../recordingScreen/audio-recording")}
          >
            <Image
              source={require("../../assets/mic.png")}
              style={{ width: 120, height: 120 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Start recording </Text>
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  title: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  subtitle: {
    fontSize: Typography.sizes.md,
    color: Colors.text.secondary,
    textAlign: "center",
  },
});
