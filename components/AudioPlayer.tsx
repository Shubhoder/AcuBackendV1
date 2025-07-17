import {
  AudioModule,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from 'expo-audio';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { PlaybackWaveform } from './PlaybackWaveform';

interface AudioPlayerProps {
  audioUri: string;
  onPlaybackComplete?: () => void;
  onEditResume?: () => void;
  audioDuration?: number;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUri,
  onPlaybackComplete,
  onEditResume,
  audioDuration = 30,
}) => {
  const player = useAudioPlayer(audioUri);
  const playerStatus = useAudioPlayerStatus(player);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const lastStatusRef = useRef<any>(null);

  useEffect(() => {
    // Set audio mode for speaker output
    (async () => {
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: false,
      });
    })();
  }, []);

  // Sync with actual player status with improved precision
  useEffect(() => {
    if (playerStatus) {
      // Update current time with more precision
      const newCurrentTime = playerStatus.currentTime || 0;
      const newDuration = playerStatus.duration || audioDuration;
      
      console.log('🎧 Audio Player Status - Current Time:', newCurrentTime.toFixed(2), 'Duration:', newDuration.toFixed(2), 'Playing:', playerStatus.playing);
      
      setCurrentTime(newCurrentTime);
      setDuration(newDuration);
      
      // Check if playback has ended
      if (playerStatus.didJustFinish && !hasEnded) {
        console.log('🏁 Playback completed');
        setHasEnded(true);
        if (onPlaybackComplete) {
          onPlaybackComplete();
        }
        // Auto-reset to beginning but don't start playing
        // handleSeekToStart();
      }
      
      // Reset ended flag when starting new playback
      if (playerStatus.playing && hasEnded) {
        setHasEnded(false);
      }
      
      lastStatusRef.current = playerStatus;
    }
  }, [playerStatus, audioDuration, onPlaybackComplete, hasEnded]);

  const handlePlay = async () => {
    try {
      // Reset ended flag when manually starting playback
      setHasEnded(false);
      player.volume = 0;
      player.play();
    } catch (err) {
      console.error('Failed to play audio', err);
      Alert.alert('Playback Error', 'Could not play audio.');
    }
  };

  const handlePause = async () => {
    try {
       player.pause();
    } catch (err) {
      console.error('Failed to pause audio', err);
    }
  };

  const handleSeekToStart = async () => {
    try {
      await player.seekTo(0);
      setCurrentTime(0);
      setHasEnded(false);
    } catch (err) {
      console.error('Failed to seek to start', err);
    }
  };

  const handleSeek = async (time: number) => {
    try {
      // Ensure time is within bounds
      const clampedTime = Math.max(0, Math.min(duration, time));
      console.log('🎯 Seeking audio to:', clampedTime.toFixed(2), 'seconds');
      await player.seekTo(clampedTime);
      setCurrentTime(clampedTime);
      
      // Reset ended flag when seeking
      if (hasEnded) {
        setHasEnded(false);
      }
    } catch (err) {
      console.error('❌ Failed to seek audio', err);
    }
  };




  const handleEditResume = () => {
    if (onEditResume) {
      onEditResume();
    }
  };

  return (
    <View style={styles.container}>
      {/* Playback Waveform */}
      <PlaybackWaveform
        audioPath={audioUri}
        isPlaying={playerStatus?.playing || false}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
        onPlayerStateChange={(playerState) => console.log('🎵 External Player State:', playerState)}
        onPanStateChange={(isMoving) => console.log('👆 External Pan State:', isMoving)}
      />
      
      {/* Playback Controls */}
      <View style={styles.buttonRow}>
        <Button
          title={playerStatus?.playing ? "⏸️ Pause" : "▶️ Play"}
          onPress={playerStatus?.playing ? handlePause : handlePlay}
          color="#007AFF"
        />
        <Button
          title="🔄 Restart"
          onPress={handleSeekToStart}
          color="#FF9500"
        />
      </View>
      
      {/* Edit/Resume Button - More Prominent */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={handleEditResume}
        activeOpacity={0.8}
      >
        <View style={styles.editButtonContent}>
          <Text style={styles.editButtonIcon}>🎤</Text>
          <Text style={styles.editButtonText}>Edit & Append</Text>
        </View>
        <Text style={styles.editButtonSubtext}>Add more audio to this recording</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  editButton: {
    backgroundColor: '#00AEEF',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: "#00AEEF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  editButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  editButtonIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  editButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 