import { useState } from "react";
import {
  
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useOutboxContext } from "../../contexts/OutboxContext";
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
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  
  const outboxContext = useOutboxContext();
  const recordings = outboxContext.recordings;
  const getRecordingsByDate = outboxContext.getRecordingsByDate;
  const deleteRecording = outboxContext.deleteRecording;

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
          });
        });
      });
      
      return combinedData;
    }
    
    // Return empty data for pending and sent tabs (can be implemented later)
    return [];
  };

  const handleExpand = (id: string) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  const handleToggleSelection = (id: string) => {
    setSelectedItemId(prev => prev === id ? null : id);
  };

  const clearSelection = () => {
    setSelectedItemId(null);
  };

  const handleShare = (id: string) => {
    const recording = recordings.find(r => r.id === id);
    if (recording) {
      console.log('Sharing recording:', id);
      // TODO: Implement share functionality
    }
  };

  const handleSend = (id: string) => {
    const recording = recordings.find(r => r.id === id);
    if (recording) {
      console.log('Sending recording:', id);
      // TODO: Implement send functionality
    }
  };

  const handleDelete = (id: string) => {
    const recording = recordings.find(r => r.id === id);
    if (recording) {
      console.log('Deleting recording:', id);
      // TODO: Implement delete functionality with confirmation
      deleteRecording(id);
      setSelectedItemId(null);
    }
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
        isSelected={selectedItemId === item.id}
        waveformData={item.waveformData}
        onExpand={() => handleExpand(item.id)}
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

        
        
        
      </View>

      {/* Content */}
      <FlatList
        data={getCurrentData()}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

export default DocumentsScreen;