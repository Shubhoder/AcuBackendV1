import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DocumentItem {
  id: number;
  title: string;
  sender: string;
  date: string;
  duration: string;
  section?: string;
}

interface VoiceWaveformProps {
  itemId: number;
  isSelected: boolean;
}

const DocumentsScreen = () => {
  type TabType = "pending" | "outbox" | "sent";

  const [activeTab, setActiveTab] = useState<TabType>("pending");

  const tabs: { key: TabType; label: string }[] = [
    { key: "pending", label: "Pending" },
    { key: "outbox", label: "Outbox" },
    { key: "sent", label: "Sent" },
  ];
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  // Create sections with data
  const todayData: DocumentItem[] = [
    {
      id: 1,
      title: "DICT# KH000121",
      sender: "John Potter",
      date: "28 May 2024 | 04:22pm",
      duration: "00:30:40",
      section: "today",
    },
    {
      id: 2,
      title: "DICT# KH000121",
      sender: "John Potter",
      date: "28 May 2024 | 04:22pm",
      duration: "00:30:40",
      section: "today",
    },
    {
      id: 3,
      title: "DICT# KH000121",
      sender: "John Potter",
      date: "28 May 2024 | 04:22pm",
      duration: "00:30:40",
      section: "today",
    },
  ];

  const may2024Data: DocumentItem[] = [
    {
      id: 4,
      title: "DICT# KH000121",
      sender: "John Potter",
      date: "15 May 2024 | 02:15pm",
      duration: "00:25:30",
      section: "may2024",
    },
    // {
    //   id: 5,
    //   title: "DICT# KH000121",
    //   sender: "John Potter",
    //   date: "14 May 2024 | 11:45am",
    //   duration: "00:18:22",
    //   section: "may2024",
    // },
    // {
    //   id: 6,
    //   title: "DICT# KH000121",
    //   sender: "John Potter",
    //   date: "12 May 2024 | 09:30am",
    //   duration: "00:42:15",
    //   section: "may2024",
    // },
    // {
    //   id: 7,
    //   title: "DICT# KH000121",
    //   sender: "John Potter",
    //   date: "10 May 2024 | 03:20pm",
    //   duration: "00:35:45",
    //   section: "may2024",
    // },
    // {
    //   id: 8,
    //   title: "DICT# KH000121",
    //   sender: "John Potter",
    //   date: "08 May 2024 | 01:10pm",
    //   duration: "00:28:50",
    //   section: "may2024",
    // },
  ];

  const sentTodayData: DocumentItem[] = [
    {
      id: 1,
      title: "MHH000042",
      sender: "John Potter",
      date: "28 May 2024 | 04:22pm",
      duration: "00:30:40",
      section: "today",
    },
    {
      id: 2,
      title: "MHH000042",
      sender: "John Potter",
      date: "28 May 2024 | 02:15pm",
      duration: "00:25:30",
      section: "today",
    },
  ];

  const sentMay2024Data: DocumentItem[] = [
    {
      id: 3,
      title: "MHH000042",
      sender: "John Potter",
      date: "25 May 2024 | 11:45am",
      duration: "00:18:22",
      section: "may2024",
    },
    // {
    //   id: 4,
    //   title: "MHH000042",
    //   sender: "John Potter",
    //   date: "22 May 2024 | 09:30am",
    //   duration: "00:42:15",
    //   section: "may2024",
    // },
    // {
    //   id: 5,
    //   title: "MHH000042",
    //   sender: "John Potter",
    //   date: "20 May 2024 | 03:20pm",
    //   duration: "00:35:45",
    //   section: "may2024",
    // },
    // {
    //   id: 6,
    //   title: "MHH000042",
    //   sender: "John Potter",
    //   date: "18 May 2024 | 01:10pm",
    //   duration: "00:28:50",
    //   section: "may2024",
    // },
  ];

  const toggleItemSelection = (itemId: number) => {
    if (selectedItemId === itemId) {
      setSelectedItemId(null);
    } else {
      setSelectedItemId(itemId);
    }
  };

  // Generate random waveform data for each item
  const generateWaveform = (seed: number) => {
    const heights = [];
    for (let i = 0; i < 50; i++) {
      heights.push(Math.sin(i * 0.1 + seed) * 15 + 20);
    }
    return heights;
  };

  const VoiceWaveform: React.FC<VoiceWaveformProps> = ({
    itemId,
    isSelected,
  }) => {
    const waveformData = generateWaveform(itemId);
    const playedIndex = isSelected ? 15 : 0;

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: 40,
          marginVertical: 10,
        }}
      >
        {waveformData.map((height, index) => (
          <View
            key={index}
            style={{
              width: 2,
              height: height,
              backgroundColor: index < playedIndex ? "#00AEEF" : "#E5E7EB",
              marginHorizontal: 1,
              borderRadius: 1,
            }}
          />
        ))}
      </View>
    );
  };

  const renderActions = (itemId: number) => {
    if (activeTab === "pending") {
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          <TouchableOpacity
            style={{
              alignItems: "center",
              marginHorizontal: 30,
            }}
          >
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "#E0F4FF",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Feather name="trash-2" size={24} color="#00AEEF" />
            </View>
            <Text style={{ color: "#9CA3AF", fontSize: 12 }}>Discard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              alignItems: "center",
              marginHorizontal: 30,
            }}
          >
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "#E0F4FF",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Feather name="upload" size={24} color="#00AEEF" />
            </View>
            <Text style={{ color: "#9CA3AF", fontSize: 12 }}>Send</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              alignItems: "center",
              marginHorizontal: 30,
            }}
          >
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "#E0F4FF",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Feather name="play" size={24} color="#00AEEF" />
            </View>
            <Text style={{ color: "#9CA3AF", fontSize: 12 }}>Resume</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (activeTab === "outbox") {
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          <TouchableOpacity
            style={{
              alignItems: "center",
              marginHorizontal: 40,
            }}
          >
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "#E0F4FF",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Feather name="upload" size={24} color="#00AEEF" />
            </View>
            <Text style={{ color: "#9CA3AF", fontSize: 12 }}>Send</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              alignItems: "center",
              marginHorizontal: 40,
            }}
          >
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "#E0F4FF",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Feather name="share-2" size={24} color="#00AEEF" />
            </View>
            <Text style={{ color: "#9CA3AF", fontSize: 12 }}>Resume</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  // Create combined data with section headers
  const getCurrentData = () => {
    const isSentTab = activeTab === "sent";
    const todayItems = isSentTab ? sentTodayData : todayData;
    const may2024Items = isSentTab ? sentMay2024Data : may2024Data;

    // Combine data with section indicators
    const combinedData = [
      { id: "today-header", isHeader: true, title: "Today" },
      ...todayItems,
      { id: "may2024-header", isHeader: true, title: "May 2024" },
      ...may2024Items,
    ];

    return combinedData;
  };

  const renderItem = ({ item }: { item: any }) => {
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

    // Render regular item
    const isSelected = selectedItemId === item.id;

    return (
      <TouchableOpacity
        onPress={() => toggleItemSelection(item.id)}
        style={{
          backgroundColor: "#fff",
          marginHorizontal: 16,
          marginVertical: 4,
          borderRadius: 8,
          padding: 16,
          elevation: 1,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* Play Button */}
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: isSelected ? "#00AEEF" : "#E5E7EB",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            {isSelected ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 3,
                    height: 16,
                    backgroundColor: "#fff",
                    marginRight: 2,
                  }}
                />
                <View
                  style={{
                    width: 3,
                    height: 16,
                    backgroundColor: "#fff",
                  }}
                />
              </View>
            ) : (
              <Feather name="play" size={20} color="#666" />
            )}
          </View>

          {/* Content */}
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#1F2937" }}>
              {item.title}
            </Text>
            <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 2 }}>
              {item.sender}
            </Text>
            <Text style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>
              {item.date}
            </Text>
          </View>

          {/* Duration */}
          <Text style={{ fontSize: 12, color: "#9CA3AF", marginLeft: 16 }}>
            {item.duration}
          </Text>

          {/* Action Buttons for Sent Tab */}
          {activeTab === "sent" && (
            <View style={{ flexDirection: "row", marginLeft: 16 }}>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#E0F4FF",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 8,
                }}
              >
                <Feather name="camera" size={20} color="#00AEEF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#E0F4FF",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Feather name="upload" size={20} color="#00AEEF" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Voice Waveform - Only show for selected item */}
        {isSelected && (
          <VoiceWaveform itemId={item.id} isSelected={isSelected} />
        )}

        {/* Action Buttons - Only show for selected item */}
        {isSelected && activeTab !== "sent" && renderActions(item.id)}
      </TouchableOpacity>
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
                setSelectedItemId(null); // Reset selection when changing tabs
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
        <FlatList
          data={getCurrentData()}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Floating Tabs */}
      {/* <FloatingTabs /> */}
    </SafeAreaView>
  );
};

export default DocumentsScreen;
