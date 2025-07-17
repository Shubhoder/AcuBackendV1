import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Waveform,
  type IWaveformRef,
} from '@simform_solutions/react-native-audio-waveform';

interface PlaybackWaveformProps {
  audioPath: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onSeek?: (time: number) => void;
  onPlayerStateChange?: (playerState: any) => void;
  onPanStateChange?: (isMoving: boolean) => void;
}

export const PlaybackWaveform: React.FC<PlaybackWaveformProps> = ({
  audioPath,
  isPlaying,
  currentTime,
  duration,
  onSeek,
  onPlayerStateChange,
  onPanStateChange,
}) => {
  const waveformRef = useRef<IWaveformRef>(null);

  // Control waveform player based on expo-audio state
  useEffect(() => {
    if (waveformRef.current) {
      if (isPlaying) {
        console.log('▶️ Starting waveform player');
        waveformRef.current.startPlayer();
      } else {
        console.log('⏸️ Pausing waveform player');
        waveformRef.current.pausePlayer();
      }
    }
  }, [isPlaying]);

  // Sync waveform position when seeking
  useEffect(() => {
    if (waveformRef.current && duration > 0) {
      const progress = currentTime / duration;
      console.log('📊 Expo Audio Progress - Current:', currentTime.toFixed(2), 'Duration:', duration.toFixed(2), 'Progress:', progress.toFixed(3));
      
      // Try to sync waveform position
      try {
        // @ts-ignore - seekTo might be available
        if (waveformRef.current.seekTo) {
          waveformRef.current.seekTo(progress);
        }
      } catch (error) {
        console.log('❌ Waveform seek not available:', error);
      }
    }
  }, [currentTime, duration]);

  // Handle waveform seek events (when user drags on waveform)
  const handlePlayerStateChange = (playerState: any) => {
    console.log('🎵 Waveform Player State Change:', playerState);
    
    // Handle seek events from waveform
    if (playerState.currentTime !== undefined && onSeek) {
      console.log('⏰ Waveform seeking to time:', playerState.currentTime);
      onSeek(playerState.currentTime);
    }
    if (onPlayerStateChange) {
      onPlayerStateChange(playerState);
    }
  };

  // Handle pan state changes
  const handlePanStateChange = (isMoving: boolean) => {
    console.log('👆 Pan State Change - Is Moving:', isMoving);
    if (onPanStateChange) {
      onPanStateChange(isMoving);
    }
  };

  // Handle waveform load state
  const handleWaveformLoadState = (isLoading: boolean) => {
    console.log('📈 Waveform Load State:', isLoading ? 'Loading...' : 'Loaded');
  };

  // Handle errors
  const handleError = (error: any) => {
    console.log('❌ Waveform Error:', error);
  };

  return (
    <View style={styles.container}>
      <Waveform
        mode="static"
        ref={waveformRef}
        path={audioPath}
        candleSpace={2}
        candleWidth={4}
        scrubColor="#00AEEF"
        waveColor="#545454"
        onPlayerStateChange={handlePlayerStateChange}
        onPanStateChange={handlePanStateChange}
        onChangeWaveformLoadState={handleWaveformLoadState}
        onError={handleError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 100,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
}); 