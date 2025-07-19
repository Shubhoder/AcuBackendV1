import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState, useCallback, memo, useMemo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PlaybackWaveform, PlaybackWaveformRef } from "./PlaybackWaveform";

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
  onToggleSelection?: () => void;
  showActions?: boolean;
  onDelete?: () => void;
  onSend?: () => void;
  onShare?: () => void;
}

export const AudioCard: React.FC<AudioCardProps> = memo(({
  id, title, sender, date, duration, uri,
  expanded = false, isPlaying = false, isSelected = false,
  waveformData, currentTime = 0,
  onExpand, onToggleSelection,
  showActions = false, onDelete, onSend, onShare
}) => {
  // Local state for immediate button feedback
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [localIsPlaying, setLocalIsPlaying] = useState(false);
  const [localCurrentTime, setLocalCurrentTime] = useState(0);
  const [localDuration, setLocalDuration] = useState(0);
  
  // Waveform ref to control playback
  const waveformRef = React.useRef<PlaybackWaveformRef>(null);
  
  // Update local state when props change (only if different to avoid unnecessary updates)
  useEffect(() => {
    if (isPlaying !== localIsPlaying) {
      setLocalIsPlaying(isPlaying);
    }
    if (Math.abs(currentTime - localCurrentTime) > 0.1) {
      setLocalCurrentTime(currentTime);
    }
  }, [isPlaying, currentTime, localIsPlaying, localCurrentTime]);

  // Handle play/pause button press with immediate feedback
  const handlePlayPause = useCallback(async () => {
    if (!uri) {
      console.error('❌ No URI available for audio playback');
      return;
    }
    
    console.log(`🎵 Play/Pause clicked - Card: ${id}, Expanded: ${expanded}, Current State: ${localIsPlaying ? 'Playing' : 'Paused'}`);
    
    // Immediate visual feedback
    setIsButtonPressed(true);
    
    try {
      if (waveformRef.current) {
        if (localIsPlaying) {
          // Pause current audio
          console.log('⏸️ Pausing audio from card:', id);
          waveformRef.current.pausePlayer();
          setLocalIsPlaying(false);
        } else {
          // Play this audio
          console.log('▶️ Playing audio from card:', id, 'URI:', uri);
          waveformRef.current.startPlayer();
          setLocalIsPlaying(true);
        }
      } else {
        console.log('⚠️ Waveform ref not available yet, setting local state');
        // If waveform isn't ready yet, just update local state
        // The waveform will sync when it becomes available
        setLocalIsPlaying(!localIsPlaying);
      }
    } catch (error) {
      console.error('❌ Error in handlePlayPause:', error);
      // Reset state on error
      setLocalIsPlaying(false);
    } finally {
      // Reset button state after a short delay
      setTimeout(() => {
        setIsButtonPressed(false);
      }, 150);
    }
  }, [uri, localIsPlaying, id, expanded]);

  // Helper function to parse duration string to seconds
  const parseDurationToSeconds = useCallback((durationStr: string): number => {
    try {
      const parts = durationStr.split(':').map(Number);
      if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
      } else if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
      }
      return 0;
    } catch (error) {
      console.error('❌ Error parsing duration:', error);
      return 0;
    }
  }, []);

  // Progress calculation - use local duration if available, otherwise parse from string
  const total = useMemo(() => {
    return localDuration > 0 
      ? localDuration 
      : parseDurationToSeconds(duration);
  }, [localDuration, parseDurationToSeconds, duration]);

  const handleSeek = useCallback(async (time: number) => {
    if (waveformRef.current && uri) {
      try {
        console.log('🎯 AudioCard seeking to:', time.toFixed(2));
        setLocalCurrentTime(time);
      } catch (error) {
        console.error('❌ Error seeking in AudioCard:', error);
      }
    }
  }, [uri]);

  // Handle waveform player state changes
  const handlePlayerStateChange = useCallback((playerState: any) => {
    console.log('🎵 AudioCard Player State:', playerState);
    
    if (playerState.currentTime !== undefined) {
      setLocalCurrentTime(playerState.currentTime);
    }
    
    if (playerState.duration !== undefined) {
      setLocalDuration(playerState.duration);
    }
    
    // Update playing state based on waveform player
    if (playerState.isPlaying !== undefined) {
      setLocalIsPlaying(playerState.isPlaying);
    }
  }, []);

  // Compact waveform display for collapsed state
  const renderCompactWaveform = useCallback(() => {
    if (!waveformData || waveformData.length === 0) return null;
    
    try {
      const maxBars = 20; // Show limited bars in compact mode
      const step = Math.max(1, Math.floor(waveformData.length / maxBars));
      const compactData = waveformData.filter((_, index) => index % step === 0).slice(0, maxBars);
      
      return (
        <View style={styles.compactWaveform}>
          {compactData.map((amplitude, index) => (
            <View
              key={index}
              style={[
                styles.compactBar,
                {
                  height: Math.max(4, (amplitude || 0) * 20),
                  backgroundColor: localIsPlaying ? '#00AEEF' : '#E5E7EB',
                }
              ]}
            />
          ))}
        </View>
      );
    } catch (error) {
      console.error('❌ Error rendering compact waveform:', error);
      return null;
    }
  }, [waveformData, localIsPlaying]);

  // Determine button state and appearance
  const buttonIsPlaying = localIsPlaying || isButtonPressed;
  const buttonBackgroundColor = buttonIsPlaying ? "#00AEEF" : "#E5E7EB";

  // Memoize the pan state change handler to prevent unnecessary re-renders
  const handlePanStateChange = useCallback((isMoving: boolean) => {
    console.log('👆 AudioCard Pan State:', isMoving);
  }, []);

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

        {/* Play/Pause button with improved responsiveness */}
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation(); // Prevent card expansion when clicking play button
            handlePlayPause();
          }}
          style={[
            styles.playButton,
            { backgroundColor: buttonBackgroundColor },
            isButtonPressed && styles.playButtonPressed
          ]}
          activeOpacity={0.7}
        >
          {buttonIsPlaying ? (
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
          
          {/* Compact waveform in collapsed state */}
          {!expanded && renderCompactWaveform()}
        </View>
        <Text style={styles.duration}>{duration}</Text>
      </View>

      {/* Always render waveform player for consistent control, but hide in collapsed state */}
      {uri && (
        <View style={[
          styles.waveformContainer,
          !expanded && styles.hiddenWaveform
        ]}>
          <PlaybackWaveform
            ref={waveformRef}
            audioPath={uri}
            isPlaying={localIsPlaying}
            currentTime={localCurrentTime}
            duration={total}
            onSeek={handleSeek}
            onPlayerStateChange={handlePlayerStateChange}
            onPanStateChange={handlePanStateChange}
          />
        </View>
      )}

      {/* Expanded player UI */}
      {expanded && (
        <View style={styles.expandedContent}>
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
});

AudioCard.displayName = 'AudioCard';

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
  playButtonPressed: {
    transform: [{ scale: 0.95 }],
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
  hiddenWaveform: {
    display: 'none', // Hide the waveform when collapsed
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
  compactWaveform: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 8,
    height: 20,
    paddingHorizontal: 4,
  },
  compactBar: {
    width: 2,
    borderRadius: 1,
    marginHorizontal: 1,
  },
});