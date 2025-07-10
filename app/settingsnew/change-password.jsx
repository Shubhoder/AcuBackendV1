import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ChangePasswordScreen = () => {
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/logo2.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Heading */}
      <Text style={styles.heading}>Change Password</Text>
      <Text style={styles.subHeading}>
        Type your old password and new password in order to change
      </Text>

      {/* Old Password */}
      <Text style={styles.label}>Old password</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry={!showOldPass}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setShowOldPass(!showOldPass)}>
          <Feather
            name={showOldPass ? "eye" : "eye-off"}
            size={22}
            color="#9CA3AF"
          />
        </TouchableOpacity>
      </View>

      {/* New Password */}
      <Text style={styles.label}>New password</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!showNewPass}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setShowNewPass(!showNewPass)}>
          <Feather
            name={showNewPass ? "eye" : "eye-off"}
            size={22}
            color="#9CA3AF"
          />
        </TouchableOpacity>
      </View>

      {/* Change Password Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 20,
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
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
    marginTop: 20,
  },
  inputWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  button: {
    backgroundColor: "#0097DB",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 40,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
