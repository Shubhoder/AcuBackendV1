import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useOutboxContext } from "../../contexts/OutboxContext";
import { useOutboxPlayer } from "../../hooks/useOutboxPlayer";
import { useAudioActions } from "../../hooks/useAudioActions";
import { AudioCard } from "../../components/audio";
import { AudioService } from "../../services/audioService";

interface DocumentItem {
  id: string;
  title: string;
  sender: string;
  date: string;
  duration: string;
  section?: string;
  uri?: string;
  waveformData?: number[];
  isPlaying?: boolean;
  isHeader?: boolean;
}

const DocumentsScreen = () => {
  type TabType = "pending" | "outbox" | "sent";

  const [activeTab, setActiveTab] = useState<TabType>("outbox");
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  
  const { recordings, isLoading, getRecordingsByDate, deleteRecording } = useOutboxContext();
  const { isPlaying, playRecording, pauseRecording, stopAllRecordings, currentTime } = useOutboxPlayer(recordings);
  
  // Use the audio actions hook
  const {
    selectedItemId,
    handleToggleSelection,
    handleShare,
    handleSend,
    handleDelete,
    clearSelection,
  } = useAudioActions(recordings, deleteRecording, stopAllRecordings);

  const tabs: { key: TabType; label: string }[] = [
    { key: "pending", label: "Pending" },
    { key: "outbox", label: "Outbox" },
    { key: "sent", label: "Sent" },
  ];

  // Get dynamic data based on active tab
  const getDynamicData = () => {
    if (activeTab === "outbox") {
      const groupedRecordings = getRecordingsByDate();
      const combinedData: DocumentItem[] = [];
      
      Object.entries(groupedRecordings).forEach(([dateKey, recordings]) => {
        // Add section header
        combinedData.push({
          id: `header-${dateKey}`,
          title: dateKey,
          sender: "",
          date: "",
          duration: "",
          isHeader: true,
        });
        
        // Add recordings for this date
        recordings.forEach(recording => {
          combinedData.push({
            id: recording.id,
            title: recording.title || recording.filename,
            sender: "Dr. Rajeev", // Default sender
            date: `${recording.dateRecorded} | ${recording.timeRecorded}`,
            duration: AudioService.formatDuration(recording.duration),
            uri: recording.uri,
            waveformData: recording.waveformData?.map(data => data.amplitude),
            isPlaying: isPlaying(recording.id),
          });
        });
      });
      
      return combinedData;
    }
    
    // Return empty data for pending and sent tabs (can be implemented later)
    return [];
  };

  const handlePlayPause = async (itemId: string) => {
    const recording = recordings.find(r => r.id === itemId);
    if (recording) {
      try {
        if (isPlaying(itemId)) {
          await pauseRecording(itemId);
        } else {
          await stopAllRecordings(); // Stop any other playing recordings
          await playRecording(itemId);
        }
      } catch (error) {
        console.error('Error handling play/pause:', error);
      }
    }
  };

  const handleExpand = (id: string) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  // Get current data based on active tab
  const getCurrentData = () => {
    return getDynamicData();
  };

  const renderItem = ({ item }: { item: DocumentItem }) => {
    // Render section header
    if (item.isHeader) {
      return (
        <View style={{ paddingHorizontal: 16, marginVertical: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#9CA3AF" }}>
            {item.title}
          </Text>
        </View>
      );
    }

    // Render audio card using the reusable component
    return (
      <AudioCard
        id={item.id}
        title={item.title}
        sender={item.sender}
        date={item.date}
        duration={item.duration}
        uri={item.uri}
        expanded={expandedCardId === item.id}
        isPlaying={isPlaying(item.id)}
        isSelected={selectedItemId === item.id}
        waveformData={item.waveformData}
        currentTime={currentTime}
        onExpand={() => handleExpand(item.id)}
        onPlayPause={() => handlePlayPause(item.id)}
        onToggleSelection={() => handleToggleSelection(item.id)}
        showActions={activeTab === "outbox"}
        onShare={() => handleShare(item.id)}
        onSend={() => handleSend(item.id)}
        onDelete={() => handleDelete(item.id)}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F1F5F9" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 16,
          backgroundColor: "#F1F5F9",
        }}
      >
        <Text style={{ fontSize: 16, color: "#6B7280", marginRight: 16 }}>
          Select
        </Text>

        {/* Tabs */}
        <View
          style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => {
                setActiveTab(tab.key);
                setExpandedCardId(null);
                clearSelection(); // Reset selection when changing tabs
                stopAllRecordings(); // Stop all recordings when changing tabs
              }}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: activeTab === tab.key ? "#00AEEF" : "#E5E7EB",
                borderRadius: 20,
                marginHorizontal: 4,
              }}
            >
              <Text
                style={{
                  color: activeTab === tab.key ? "#fff" : "#6B7280",
                  fontWeight: "500",
                  fontSize: 14,
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search Icon */}
        <TouchableOpacity style={{ marginLeft: 16 }}>
          <Feather name="search" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        {/* List */}
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: '#666' }}>Loading recordings...</Text>
          </View>
        ) : getCurrentData().length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
              {activeTab === 'outbox' ? 'No recordings in outbox.\nStart recording to see your files here.' : 'No recordings found.'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={getCurrentData()}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default DocumentsScreen;
