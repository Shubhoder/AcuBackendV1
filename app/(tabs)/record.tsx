import React from "react";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "../../components/ui";
import { Colors, Spacing, Typography } from "../../constants";
import FloatingTabs from "../floatingTabs";

export default function RecordScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar time="9:41" signalStrength={4} batteryLevel={80} />
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/mic.png")}
            style={{ width: 120, height: 120 }}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.subtitle}>Start recording </Text>
      </View>
      <FloatingTabs />
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
