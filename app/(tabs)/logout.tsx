import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
const Logout = () => {
  const { logout } = useAuthContext();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("../auth/login");
  };
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Are you sure to logout?</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Yes, logout</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Logout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  title: {
    fontSize: 18,
    color: "#737373",
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  logoutButton: {
    backgroundColor: "#F1D1BD",
    borderWidth: 1,
    borderColor: "#F1D1BD",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 30,
  },
  logoutText: {
    color: "#F57C21",
    fontSize: 14,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 30,
  },
  cancelText: {
    color: "#737373",
    fontSize: 14,
    fontWeight: "500",
  },
});
