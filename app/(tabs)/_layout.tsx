
import { Slot, usePathname } from "expo-router";
import React from "react";
import { View, StyleSheet } from "react-native";
import FloatingTabs from "../floatingTabs";

export default function Layout() {
  const pathname = usePathname();

  // Hide tabs on auth screens and settings screens
  const hideTabsOn = ["/auth/login", "/auth/signup", "/auth", "/settingsnew/change-password", "/settingsnew/delete-account"];
  
  const shouldShowTabs = !hideTabsOn.some(route => pathname.startsWith(route));

  return (
    <View style={styles.container}>
      <Slot />
      {shouldShowTabs && <FloatingTabs />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
