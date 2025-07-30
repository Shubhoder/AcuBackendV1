import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuthContext } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";

const ChangePasswordScreen = () => {
  const router = useRouter();
  const authContext = useAuthContext();
  const changePassword = authContext.changePassword;
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const newErrors = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!oldPassword) {
      newErrors.oldPassword = "Old password is required";
    }
    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleChangePassword = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await changePassword(oldPassword, newPassword);
      
      Alert.alert(
        "Success",
        "Password changed successfully!",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Change password error:', error);
      
      let errorMessage = "Failed to change password. Please try again.";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.status === 401) {
        errorMessage = "Current password is incorrect.";
      } else if (error.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
      <View style={[styles.inputWrapper, errors.oldPassword && styles.inputError]}>
        <TextInput
          value={oldPassword}
          onChangeText={(text) => {
            setOldPassword(text);
            if (text) setErrors(prev => ({ ...prev, oldPassword: "" }));
          }}
          secureTextEntry={!showOldPass}
          style={styles.input}
          placeholder="Enter your current password"
        />
        <TouchableOpacity onPress={() => setShowOldPass(!showOldPass)}>
          <Feather
            name={showOldPass ? "eye" : "eye-off"}
            size={22}
            color="#9CA3AF"
          />
        </TouchableOpacity>
      </View>
      {errors.oldPassword ? <Text style={styles.errorText}>{errors.oldPassword}</Text> : null}

      {/* New Password */}
      <Text style={styles.label}>New password</Text>
      <View style={[styles.inputWrapper, errors.newPassword && styles.inputError]}>
        <TextInput
          value={newPassword}
          onChangeText={(text) => {
            setNewPassword(text);
            if (text) setErrors(prev => ({ ...prev, newPassword: "" }));
          }}
          secureTextEntry={!showNewPass}
          style={styles.input}
          placeholder="Enter your new password"
        />
        <TouchableOpacity onPress={() => setShowNewPass(!showNewPass)}>
          <Feather
            name={showNewPass ? "eye" : "eye-off"}
            size={22}
            color="#9CA3AF"
          />
        </TouchableOpacity>
      </View>
      {errors.newPassword ? <Text style={styles.errorText}>{errors.newPassword}</Text> : null}

      {/* Confirm New Password */}
      <Text style={styles.label}>Confirm new password</Text>
      <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
        <TextInput
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (text) setErrors(prev => ({ ...prev, confirmPassword: "" }));
          }}
          secureTextEntry={!showConfirmPass}
          style={styles.input}
          placeholder="Confirm your new password"
        />
        <TouchableOpacity onPress={() => setShowConfirmPass(!showConfirmPass)}>
          <Feather
            name={showConfirmPass ? "eye" : "eye-off"}
            size={22}
            color="#9CA3AF"
          />
        </TouchableOpacity>
      </View>
      {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

      {/* Change Password Button */}
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleChangePassword}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Change Password</Text>
        )}
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
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  inputError: {
    borderColor: "#EF4444",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    marginTop: -12,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#00AEEF",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
