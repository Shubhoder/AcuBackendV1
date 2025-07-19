import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState, useCallback, memo, useMemo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { PlaybackWaveform, PlaybackWaveformRef } from "./PlaybackWaveform";
import { useAudioContext } from "../contexts/AudioContext";
import * as FileSystem from 'expo-file-system';

export interface AudioCardProps {
  id: number | string;
  title: string;
  sender: string;
  date: string;
  duration: string;
  uri?: string;
  expanded?: boolean;
  isSelected?: boolean;
  waveformData?: number[];
  onExpand?: () => void;
  onToggleSelection?: () => void;
  showActions?: boolean;
  onDelete?: () => void;
  onSend?: () => void;
  onShare?: () => void;
}

export const AudioCard: React.FC<AudioCardProps> = memo(({
  id, title, sender, date, duration, uri,
  expanded = false, isSelected = false,
  waveformData,
  onExpand, onToggleSelection,
  showActions = false, onDelete, onSend, onShare
}) => {
  // Use global audio context for state management
  const { 
    currentAudioId, 
    isPlaying: globalIsPlaying, 
    currentTime: globalCurrentTime, 
    duration: globalDuration,
    playAudio, 
    pauseAudio, 
    seekTo 
  } = useAudioContext();
  
  // Local state for immediate button feedback
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [isAudioFileValid, setIsAudioFileValid] = useState(true);
  const [isCheckingFile, setIsCheckingFile] = useState(false);
  
  // Waveform ref to control playback
  const waveformRef = React.useRef<PlaybackWaveformRef>(null);
  
  // Determine if this card is the currently playing audio
  const isCurrentAudio = currentAudioId === id.toString();
  const isActuallyPlaying = isCurrentAudio && globalIsPlaying;
  
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

  // Use global duration if available, otherwise parse from string
  const total = useMemo(() => {
    return globalDuration > 0 
      ? globalDuration 
      : parseDurationToSeconds(duration);
  }, [globalDuration, parseDurationToSeconds, duration]);

  // Validate audio file exists and is accessible
  const validateAudioFile = useCallback(async (fileUri: string) => {
    if (!fileUri) return false;
    
    try {
      setIsCheckingFile(true);
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      const isValid = fileInfo.exists && fileInfo.size > 0;
      setIsAudioFileValid(isValid);
      
      if (!isValid) {
        console.error('❌ Audio file validation failed:', fileUri);
        console.error('📁 File info:', fileInfo);
      }
      
      return isValid;
    } catch (error) {
      console.error('❌ Error validating audio file:', error);
      setIsAudioFileValid(false);
      return false;
    } finally {
      setIsCheckingFile(false);
    }
  }, []);

  // Validate audio file when URI changes
  useEffect(() => {
    if (uri) {
      validateAudioFile(uri);
    }
  }, [uri, validateAudioFile]);

  // Handle play/pause button press with immediate feedback
  const handlePlayPause = useCallback(async () => {
    if (!uri) {
      console.error('❌ No URI available for audio playback');
      Alert.alert('Error', 'No audio file available for playback.');
      return;
    }

    if (!isAudioFileValid) {
      console.error('❌ Audio file is not valid');
      Alert.alert('Error', 'Audio file is corrupted or not accessible. Please try recording again.');
      return;
    }
    
    console.log(`🎵 Play/Pause clicked - Card: ${id}, Current Audio: ${currentAudioId}, Playing: ${globalIsPlaying}`);
    
    // Immediate visual feedback
    setIsButtonPressed(true);
    
    try {
      if (isCurrentAudio && globalIsPlaying) {
        // Pause current audio
        console.log('⏸️ Pausing audio from card:', id);
        await pauseAudio();
      } else {
        // Play this audio (will stop any other audio automatically)
        console.log('▶️ Playing audio from card:', id, 'URI:', uri);
        await playAudio(id.toString(), uri);
      }
    } catch (error) {
      console.error('❌ Error in handlePlayPause:', error);
      // Show user-friendly error message
      Alert.alert('Playback Error', 'Unable to play audio file. The file may be corrupted or in an unsupported format.');
    } finally {
      // Reset button state after a short delay
      setTimeout(() => {
        setIsButtonPressed(false);
      }, 150);
    }
  }, [uri, id, currentAudioId, globalIsPlaying, isCurrentAudio, isAudioFileValid, playAudio, pauseAudio]);

  const handleSeek = useCallback(async (time: number) => {
    if (isCurrentAudio && uri && isAudioFileValid) {
      try {
        console.log('🎯 AudioCard seeking to:', time.toFixed(2));
        await seekTo(time);
      } catch (error) {
        console.error('❌ Error seeking in AudioCard:', error);
      }
    }
  }, [isCurrentAudio, uri, isAudioFileValid, seekTo]);

  // Handle waveform player state changes
  const handlePlayerStateChange = useCallback((playerState: any) => {
    console.log('🎵 AudioCard Player State:', playerState);
    
    // Only handle state changes if this is the current audio
    if (isCurrentAudio) {
      // The global context will handle the actual state updates
      // This is mainly for logging and debugging
    }
  }, [isCurrentAudio]);

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
                  backgroundColor: isActuallyPlaying ? '#00AEEF' : '#E5E7EB',
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
  }, [waveformData, isActuallyPlaying]);

  // Determine button state and appearance
  const buttonIsPlaying = isActuallyPlaying || isButtonPressed;
  const buttonBackgroundColor = buttonIsPlaying ? "#00AEEF" : "#E5E7EB";

  // Memoize the pan state change handler to prevent unnecessary re-renders
  const handlePanStateChange = useCallback((isMoving: boolean) => {
    console.log('👆 AudioCard Pan State:', isMoving);
  }, []);

  // Render error state for invalid audio files
  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Feather name="alert-triangle" size={16} color="#EF4444" />
      <Text style={styles.errorText}>Audio file unavailable</Text>
    </View>
  );

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
            isButtonPressed && styles.playButtonPressed,
            !isAudioFileValid && styles.disabledButton
          ]}
          activeOpacity={0.7}
          disabled={!isAudioFileValid || isCheckingFile}
        >
          {isCheckingFile ? (
            <View style={styles.loadingIndicator}>
              <Text style={styles.loadingText}>...</Text>
            </View>
          ) : buttonIsPlaying ? (
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
          
          {/* Show error state if audio file is invalid */}
          {!expanded && !isAudioFileValid && !isCheckingFile && renderErrorState()}
        </View>
        <Text style={styles.duration}>{duration}</Text>
      </View>

      {/* Always render waveform player for consistent control, but hide in collapsed state */}
      {uri && isAudioFileValid && !isCheckingFile && (
        <View style={[
          styles.waveformContainer,
          !expanded && styles.hiddenWaveform
        ]}>
          <PlaybackWaveform
            ref={waveformRef}
            audioPath={uri}
            isPlaying={isActuallyPlaying}
            currentTime={isCurrentAudio ? globalCurrentTime : 0}
            duration={total}
            onSeek={handleSeek}
            onPlayerStateChange={handlePlayerStateChange}
            onPanStateChange={handlePanStateChange}
          />
        </View>
      )}

      {/* Show error message in expanded view if audio file is invalid */}
      {expanded && !isAudioFileValid && !isCheckingFile && (
        <View style={styles.expandedErrorContainer}>
          <Feather name="alert-triangle" size={24} color="#EF4444" />
          <Text style={styles.expandedErrorText}>Audio file is corrupted or not accessible</Text>
          <Text style={styles.expandedErrorSubtext}>Please try recording again or contact support</Text>
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
  disabledButton: {
    backgroundColor: "#F3F4F6",
    opacity: 0.6,
  },
  loadingIndicator: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
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
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginLeft: 4,
  },
  expandedErrorContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  expandedErrorText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  expandedErrorSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
});