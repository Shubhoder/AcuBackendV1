import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Alert,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FloatingTabs from "../floatingTabs";

const AudioRecordingScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState("00:03:20");
  const [playbackTime, setPlaybackTime] = useState("00:02:20");
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  const generateWaveform = () => {
    const heights = [15, 30, 10, 35, 20, 40, 15, 30, 10, 35, 20, 40, 15, 20];
    return heights.map((height, i) => (
      <View
        key={i}
        style={{
          width: 5,
          height,
          backgroundColor: "#00AEEF",
          marginHorizontal: 2,
          borderRadius: 3,
        }}
      />
    ));
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Camera permission is needed.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedPhotos([...selectedPhotos, result.assets[0].uri]);
    }
  };

  const handleChoosePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Gallery permission is needed.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const newPhotos = result.assets.map((a) => a.uri);
      setSelectedPhotos([...selectedPhotos, ...newPhotos]);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>MHH000042</Text>
        <Ionicons name="person-add-outline" size={22} color="#00AEEF" />
      </View>
      {/* Waveform */}
      <View style={styles.waveform}>{generateWaveform()}</View>
      {/* Playback Time */}
      <Text style={styles.playbackLabel}>
        Playback Time: <Text style={styles.playbackTime}>{playbackTime}</Text>
      </Text>
      {/* Play button */}
      <TouchableOpacity
        style={styles.playButton}
        onPress={() => setIsPlaying(!isPlaying)}
      >
        <Ionicons name={isPlaying ? "pause" : "play"} size={30} color="#fff" />
      </TouchableOpacity>
      {/* Insert / Over toggle */}
      <View style={styles.toggleWrapper}>
        <Text style={styles.toggleLabel}>Insert</Text>
        <View style={styles.toggleTrack}>
          <View style={styles.toggleThumb} />
        </View>
        <Text style={styles.toggleLabel}>Over</Text>
      </View>
      {/* Recording Time */}
      <Text style={styles.recordingTime}>{recordingTime}</Text>
      <Text style={styles.status}>Recording Paused</Text>
      {/* Resume */}
      <TouchableOpacity>
        <Text style={styles.resumeText}>Click Here to Resume Recording</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.resumeButton}>
        <Ionicons name="play" size={40} color="#fff" />
      </TouchableOpacity>
      {/* Action buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="trash-outline" size={26} color="#00AEEF" />
          <Text style={styles.actionText}>Discard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="arrow-up" size={26} color="#00AEEF" />
          <Text style={styles.actionText}>Send</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="copy-outline" size={26} color="#00AEEF" />
          <Text style={styles.actionText}>Draft</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => setUploadModalVisible(true)}
        >
          <Ionicons name="camera-outline" size={26} color="#00AEEF" />
          <Text style={styles.actionText}>Upload</Text>
        </TouchableOpacity>
      </View>
      {/* Upload Modal */}
      <Modal
        visible={uploadModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setUploadModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Ionicons name="cloud-upload-outline" size={26} color="#999" />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.modalTitle}>Upload files</Text>
                <Text style={styles.modalSubtitle}>
                  Select and upload the files of your choice
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setUploadModalVisible(false)}
                style={{ marginLeft: "auto" }}
              >
                <Ionicons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.uploadOptions}>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleTakePhoto}
              >
                <Ionicons name="camera-outline" size={28} color="#333" />
                <Text style={styles.uploadButtonText}>Take photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleChoosePhoto}
              >
                <Ionicons name="image-outline" size={28} color="#333" />
                <Text style={styles.uploadButtonText}>Choose photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Floating Tabs */}
      <FloatingTabs />/
    </View>
  );
};

export default AudioRecordingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    alignItems: "center",
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#333" },
  waveform: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
    alignItems: "flex-end",
  },
  playbackLabel: {
    textAlign: "center",
    fontSize: 14,
    color: "#777",
  },
  playbackTime: {
    color: "#00AEEF",
    fontWeight: "600",
  },
  playButton: {
    backgroundColor: "#00AEEF",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignSelf: "center",
    marginVertical: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  toggleLabel: { fontSize: 14, color: "#333", marginHorizontal: 8 },
  toggleTrack: {
    width: 50,
    height: 8,
    backgroundColor: "#ccc",
    borderRadius: 4,
    justifyContent: "center",
  },
  toggleThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#00AEEF",
    position: "absolute",
    right: 0,
  },
  recordingTime: {
    fontSize: 38,
    color: "#00AEEF",
    fontWeight: "bold",
    textAlign: "center",
    // marginTop: 3,
  },
  status: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginVertical: 8,
  },
  resumeText: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
    marginTop: 8,
  },
  resumeButton: {
    backgroundColor: "#00AEEF",
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    borderWidth: 3,
    borderColor: "#ccc",
    marginBottom: 5,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    // marginTop: 30,
    paddingHorizontal: 16,
  },
  actionItem: { alignItems: "center" },
  actionText: { color: "#555", fontSize: 14, marginTop: 6 },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#777",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 16,
  },
  uploadOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  uploadButton: {
    backgroundColor: "#F0F8FF",
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: "center",
    width: "45%",
  },
  uploadButtonText: {
    marginTop: 10,
    fontSize: 14,
    color: "#333",
  },
});
