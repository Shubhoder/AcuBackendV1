import { useRouter } from "expo-router";
import { 
  Image, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Alert, 
  ActivityIndicator 
} from "react-native";
import { useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";

const DeleteAccountScreen = () => {
  const router = useRouter();
  const authContext = useAuthContext();
  const deleteAccount = authContext.deleteAccount;
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: confirmDeleteAccount,
        },
      ]
    );
  };

  const confirmDeleteAccount = async () => {
    setIsLoading(true);
    try {
      await deleteAccount();
      
      Alert.alert(
        "Account Deleted",
        "Your account has been successfully deleted.",
        [{ text: "OK", onPress: () => router.replace("/auth") }]
      );
    } catch (error) {
      console.error('Delete account error:', error);
      
      let errorMessage = "Failed to delete account. Please try again.";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
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
      {/* Bin Icon */}
      <Image
        source={require("../../assets/bin.png")}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Title */}
      <Text style={styles.title}>Delete Account</Text>

      {/* Sub Text */}
      <Text style={styles.subText}>
        Are you sure you want to delete your account?
      </Text>

      {/* Description */}
      <Text style={styles.description}>
        Once you delete your account, it cannot be undone. All your data will be
        permanently erased from this app, including your profile information,
        preference & saved Dictation.
      </Text>

      {/* Buttons */}
      <TouchableOpacity 
        style={[styles.deleteButton, isLoading && styles.buttonDisabled]}
        onPress={handleDeleteAccount}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#D71E28" size="small" />
        ) : (
          <Text style={styles.deleteButtonText}>Delete My Account</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.goBackButton, isLoading && styles.buttonDisabled]}
        onPress={() => router.back()}
        disabled={isLoading}
      >
        <Text style={styles.goBackText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DeleteAccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
  subText: {
    fontSize: 18,
    color: "#4B5563",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  deleteButton: {
    backgroundColor: "#FFD1D1",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    width: "100%",
    marginBottom: 16,
  },
  deleteButtonText: {
    color: "#D71E28",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  goBackButton: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    width: "100%",
  },
  goBackText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
