import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FloatingTabs from "../floatingTabs";

const SettingsScreen = () => {
  const router = useRouter();
  return (
    <ScrollView style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/logo2.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Heading */}
      <Text style={styles.heading}>Settings</Text>
      <Text style={styles.subHeading}>Manage your account</Text>

      {/* General Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>GENERAL</Text>

        <TouchableOpacity
          style={styles.listItem}
          onPress={() => router.push("/settingsnew/change-password")}
        >
          <Feather name="lock" size={20} color="#00AEEF" />
          <Text style={styles.listText}>Change Password</Text>
          <Feather name="chevron-right" size={22} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.listItem}
          onPress={() => router.push("/settingsnew/delete-account")}
        >
          <Feather name="trash-2" size={20} color="#00AEEF" />
          <Text style={styles.listText}>Delete My Account</Text>
          <Feather name="chevron-right" size={22} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Others Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Others</Text>

        <TouchableOpacity style={styles.listItem}>
          <Feather name="shield" size={20} color="#00AEEF" />
          <Text style={styles.listText}>Privacy Policy</Text>
          <Feather name="chevron-right" size={22} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem}>
          <Feather name="life-buoy" size={20} color="#00AEEF" />
          <Text style={styles.listText}>Support</Text>
          <Feather name="chevron-right" size={22} color="#333" />
        </TouchableOpacity>
      </View>
      <View>
        <FloatingTabs />
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  logo: {
    width: 250,
    height: 70,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#111827",
  },
  subHeading: {
    fontSize: 16,
    textAlign: "center",
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 24,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  listText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#111827",
  },
});
