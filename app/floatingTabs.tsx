import { Feather } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface TabButtonProps {
  icon: string;
  route: string;
  isActive: boolean;
  onPress: () => void;
}

export default function FloatingTabs() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route: string) => pathname === route;

  return (
    <View style={styles.navbar}>
      <TabButton
        icon="home"
        route="/"
        isActive={isActive("/")}
        onPress={() => router.push("/")}
      />
      <TabButton
        icon="file-text"
        route="/documents"
        isActive={isActive("/documents")}
        onPress={() => router.push("/documents")}
      />
      <TabButton
        icon="mic"
        route="/record"
        isActive={isActive("/record")}
        onPress={() => router.push("/record")}
      />
      <TabButton
        icon="settings"
        route="/settings"
        isActive={isActive("/settings")}
        onPress={() => router.push("/settings")}
      />
      <TabButton
        icon="log-out"
        route="/logout"
        isActive={isActive("/logout")}
        onPress={() => router.push("/logout")}
      />
    </View>
  );
}

function TabButton({ icon, route, isActive, onPress }: TabButtonProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.iconWrapper,
          isActive && styles.activeIconWrapper,
        ]}
      >
        <Feather
          name={icon as any}
          size={22}
          color={isActive ? "#fff" : "#00AEEF"}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  navbar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#ccc",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  iconWrapper: {
    padding: 12,
    borderRadius: 30,
  },
  activeIconWrapper: {
    backgroundColor: "#00AEEF",
  },
});
