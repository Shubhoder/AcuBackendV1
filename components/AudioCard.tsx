import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { PlaybackWaveform } from './PlaybackWaveform';

export interface AudioCardProps {
  id: number | string;
  title: string;
  sender: string;
  date: string;
  duration: string;
  uri?: string;
  expanded?: boolean;
  isPlaying?: boolean;
  isSelected?: boolean;
  waveformData?: number[];
  currentTime?: number;
  onExpand?: () => void;
  onPlayPause?: () => void;
  onToggleSelection?: () => void;
  showActions?: boolean;
  onDelete?: () => void;
  onSend?: () => void;
  onShare?: () => void;
}

export const AudioCard: React.FC<AudioCardProps> = ({
  id, title, sender, date, duration, uri,
  expanded = false, isPlaying = false, isSelected = false,
  waveformData, currentTime = 0,
  onExpand, onPlayPause, onToggleSelection,
  showActions = false, onDelete, onSend, onShare
}) => {
  const [localCurrentTime, setLocalCurrentTime] = useState(currentTime);
  const [localIsPlaying, setLocalIsPlaying] = useState(false);
  const [localDuration, setLocalDuration] = useState(0);
  
  // Create audio player if URI is provided
  const player = uri ? useAudioPlayer(uri) : null;
  const status = player ? useAudioPlayerStatus(player) : null;

  // Update local playing state when prop changes
  useEffect(() => {
    setLocalIsPlaying(isPlaying);
  }, [isPlaying]);

  // Handle play/pause logic
  useEffect(() => {
    if (player) {
      if (localIsPlaying) {
        player.play();
      } else {
        player.pause();
      }
    }
  }, [localIsPlaying, player]);

  // Update current time from audio status with improved precision
  useEffect(() => {
    if (status) {
      const newCurrentTime = status.currentTime || 0;
      const newDuration = status.duration || 0;
      
      setLocalCurrentTime(newCurrentTime);
      setLocalDuration(newDuration);
    }
  }, [status?.currentTime, status?.duration]);

  // Handle play/pause button press
  const handlePlayPause = useCallback(() => {
    if (player) {
      if (localIsPlaying) {
        player.pause();
        setLocalIsPlaying(false);
      } else {
        player.play();
        setLocalIsPlaying(true);
      }
    }
    // Also call the parent callback if provided
    if (onPlayPause) {
      onPlayPause();
    }
  }, [player, localIsPlaying, onPlayPause]);

  // Helper function to parse duration string to seconds
  const parseDurationToSeconds = useCallback((durationStr: string): number => {
    const parts = durationStr.split(':').map(Number);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  }, []);

  // Convert waveformData from number[] to WaveformData[] format
  const convertWaveformData = useCallback((): { amplitude: number; timestamp: number }[] => {
    if (!waveformData) return [];
    return waveformData.map((amplitude, index) => ({
      amplitude: Math.max(0, Math.min(1, amplitude)), // Ensure amplitude is between 0-1
      timestamp: index * 100, // Approximate timestamp
    }));
  }, [waveformData]);

  // Progress calculation
  const current = Math.floor(localCurrentTime);
  const total = localDuration > 0 ? Math.floor(localDuration) : parseDurationToSeconds(duration);

  const handleSeek = useCallback(async (time: number) => {
    if (player) {
      try {
        const clampedTime = Math.max(0, Math.min(total, time));
        await player.seekTo(clampedTime);
      } catch (err) {
        console.error('Failed to seek audio', err);
      }
    }
  }, [player, total]);

  const handleRewind = useCallback(async () => {
    const newTime = Math.max(0, localCurrentTime - 10);
    await handleSeek(newTime);
  }, [localCurrentTime, handleSeek]);

  const handleForward = useCallback(async () => {
    const newTime = Math.min(total, localCurrentTime + 10);
    await handleSeek(newTime);
  }, [localCurrentTime, total, handleSeek]);

  return (
    <TouchableOpacity 
      onPress={onExpand} 
      style={[
        styles.container,
        isSelected && styles.selectedContainer
      ]}
    >
      <View style={styles.cardContent}>
        {/* Selection checkbox */}
        {onToggleSelection && (
          <TouchableOpacity 
            style={styles.checkbox} 
            onPress={onToggleSelection}
          >
            <Feather 
              name={isSelected ? "check-square" : "square"} 
              size={20} 
              color={isSelected ? "#00AEEF" : "#9CA3AF"} 
            />
          </TouchableOpacity>
        )}

        {/* Play/Pause button */}
        <TouchableOpacity
          onPress={handlePlayPause}
          style={[
            styles.playButton,
            { backgroundColor: localIsPlaying ? "#00AEEF" : "#E5E7EB" }
          ]}
        >
          {localIsPlaying ? (
            <View style={styles.pauseIcon}>
              <View style={styles.pauseBar} />
              <View style={styles.pauseBar} />
            </View>
          ) : (
            <Feather name="play" size={20} color="#666" />
          )}
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.sender}>{sender}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <Text style={styles.duration}>{duration}</Text>
      </View>

      {/* Expanded player UI */}
      {expanded && (
        <View style={styles.expandedContent}>
          {/* Waveform Display */}
          {waveformData && waveformData.length > 0 && (
            <View style={styles.waveformContainer}>
              <PlaybackWaveform
                waveformData={convertWaveformData()}
                duration={total}
                currentTime={localCurrentTime}
                isPlaying={localIsPlaying}
                onSeek={handleSeek}
                onRewind={handleRewind}
                onForward={handleForward}
              />
            </View>
          )}

          {/* Action buttons */}
          {showActions && (
            <View style={styles.actionsContainer}>
              {onDelete && (
                <TouchableOpacity style={styles.actionItem} onPress={onDelete}>
                  <View style={styles.deleteActionButton}>
                    <Feather name="trash-2" size={24} color="#EF4444" />
                  </View>
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              )}

              {onSend && (
                <TouchableOpacity style={styles.actionItem} onPress={onSend}>
                  <View style={styles.sendActionButton}>
                    <Feather name="send" size={24} color="#00AEEF" />
                  </View>
                  <Text style={styles.actionText}>Send</Text>
                </TouchableOpacity>
              )}

              {onShare && (
                <TouchableOpacity style={styles.actionItem} onPress={onShare}>
                  <View style={styles.shareActionButton}>
                    <Feather name="share-2" size={24} color="#10B981" />
                  </View>
                  <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
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
    overflow: 'hidden', // Prevent content overflow
  },
  selectedContainer: {
    borderColor: "#00AEEF",
    borderWidth: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 10,
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  pauseIcon: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  pauseBar: {
    width: 3,
    height: 16,
    backgroundColor: "#fff",
    marginHorizontal: 1,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  sender: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  date: {
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 2,
  },
  duration: {
    fontSize: 12,
    color: "#9CA3AF",
    marginLeft: 16,
  },
  expandedContent: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  waveformContainer: {
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  deleteActionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFE5E5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  sendActionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E0F4FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  shareActionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  actionItem: {
    alignItems: "center",
    marginHorizontal: 25,
  },
});