import { Feather } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function FloatingTabs() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => router.push("/home")}>
        <View
          style={[
            styles.iconWrapper,
            pathname === "/home" && styles.activeIconWrapper,
          ]}
        >
          <Feather
            name="home"
            size={22}
            color={pathname === "/home" ? "#fff" : "#00AEEF"}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/documents")}>
        <View
          style={[
            styles.iconWrapper,
            pathname === "/documents" && styles.activeIconWrapper,
          ]}
        >
          <Feather
            name="file-text"
            size={22}
            color={pathname === "/documents" ? "#fff" : "#00AEEF"}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/record")}>
        <View
          style={[
            styles.micButton,
            pathname === "/recording" && styles.activeMicButton,
          ]}
        >
          <Feather name="mic" size={24} color="#fff" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/settings")}>
        <View
          style={[
            styles.iconWrapper,
            pathname === "/settings" && styles.activeIconWrapper,
          ]}
        >
          <Feather
            name="settings"
            size={22}
            color={pathname === "/settings" ? "#fff" : "#00AEEF"}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/logout")}>
        <View
          style={[
            styles.iconWrapper,
            pathname === "/logout" && styles.activeIconWrapper,
          ]}
        >
          <Feather
            name="log-out"
            size={22}
            color={pathname === "/logout" ? "#fff" : "#00AEEF"}
          />
        </View>
      </TouchableOpacity>
    </View>
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
  micButton: {
    backgroundColor: "#00AEEF",
    padding: 16,
    borderRadius: 50,
    elevation: 5,
  },
  activeMicButton: {
    backgroundColor: "#0079B5",
  },
});
