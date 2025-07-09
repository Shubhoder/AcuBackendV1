import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const DeleteAccountScreen = () => {
  const router = useRouter();

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
      <TouchableOpacity style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete My Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.goBackButton}
        onPress={() => router.back()}
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
    textAlign: "center",
  },
});
