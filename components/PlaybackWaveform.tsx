import React, { useRef, useEffect, useCallback, memo } from 'react';
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

export const PlaybackWaveform: React.FC<PlaybackWaveformProps> = memo(({
  audioPath,
  isPlaying,
  currentTime,
  duration,
  onSeek,
  onPlayerStateChange,
  onPanStateChange,
}) => {
  const waveformRef = useRef<IWaveformRef>(null);
  const isSeekingRef = useRef(false);
  const lastSeekTimeRef = useRef(0);
  const lastCurrentTimeRef = useRef(0);

  // Control waveform player based on expo-audio state
  useEffect(() => {
    if (waveformRef.current && !isSeekingRef.current) {
      try {
        if (isPlaying) {
          console.log('▶️ Starting waveform player');
          waveformRef.current.startPlayer();
        } else {
          console.log('⏸️ Pausing waveform player');
          waveformRef.current.pausePlayer();
        }
      } catch (error) {
        console.error('❌ Error controlling waveform player:', error);
      }
    }
  }, [isPlaying]);

  // Sync waveform position when seeking (but avoid during user interaction)
  useEffect(() => {
    if (waveformRef.current && duration > 0 && !isSeekingRef.current) {
      const timeDiff = Math.abs(currentTime - lastCurrentTimeRef.current);
      
      // Only update if there's a significant time difference to avoid jitter
      if (timeDiff > 0.1) {
        console.log('📊 Syncing waveform - Current:', currentTime.toFixed(2), 'Duration:', duration.toFixed(2));
        lastCurrentTimeRef.current = currentTime;
        lastSeekTimeRef.current = currentTime;
      }
    }
  }, [currentTime, duration]);

  // Handle waveform seek events (when user drags on waveform)
  const handlePlayerStateChange = useCallback((playerState: any) => {
    console.log('🎵 Waveform Player State Change:', playerState);
    
    // Handle seek events from waveform
    if (playerState.currentTime !== undefined && onSeek) {
      const seekTime = playerState.currentTime;
      console.log('⏰ Waveform seeking to time:', seekTime.toFixed(2));
      
      // Set seeking flag to prevent conflicts
      isSeekingRef.current = true;
      lastSeekTimeRef.current = seekTime;
      lastCurrentTimeRef.current = seekTime;
      
      // Call the seek callback
      onSeek(seekTime);
      
      // Reset seeking flag after a short delay
      setTimeout(() => {
        isSeekingRef.current = false;
      }, 200);
    }
    
    if (onPlayerStateChange) {
      onPlayerStateChange(playerState);
    }
  }, [onSeek, onPlayerStateChange]);

  // Handle pan state changes
  const handlePanStateChange = useCallback((isMoving: boolean) => {
    console.log('👆 Pan State Change - Is Moving:', isMoving);
    isSeekingRef.current = isMoving;
    
    if (onPanStateChange) {
      onPanStateChange(isMoving);
    }
  }, [onPanStateChange]);

  // Handle waveform load state
  const handleWaveformLoadState = useCallback((isLoading: boolean) => {
    console.log('📈 Waveform Load State:', isLoading ? 'Loading...' : 'Loaded');
  }, []);

  // Handle errors
  const handleError = useCallback((error: any) => {
    console.error('❌ Waveform Error:', error);
  }, []);

  return (
    <View style={styles.container}>
      <Waveform
        mode="static"
        ref={waveformRef}
        path={audioPath}
        candleSpace={7}
        candleWidth={4}
        candleHeightScale={18}
        scrubColor="#00AEEF"
        waveColor="#545454"
        onPlayerStateChange={handlePlayerStateChange}
        onPanStateChange={handlePanStateChange}
        onChangeWaveformLoadState={handleWaveformLoadState}
        onError={handleError}
      />
    </View>
  );
});

PlaybackWaveform.displayName = 'PlaybackWaveform';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 100,
    paddingHorizontal: 1,
    paddingVertical: 16,
  },
}); 