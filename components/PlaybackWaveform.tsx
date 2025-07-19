import React, { useRef, useEffect, useCallback, memo, forwardRef, useImperativeHandle } from 'react';
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

export interface PlaybackWaveformRef {
  startPlayer: () => void;
  pausePlayer: () => void;
}

export const PlaybackWaveform = memo(forwardRef<PlaybackWaveformRef, PlaybackWaveformProps>(({
  audioPath,
  isPlaying,
  currentTime,
  duration,
  onSeek,
  onPlayerStateChange,
  onPanStateChange,
}, ref) => {
  const waveformRef = useRef<IWaveformRef>(null);
  const isSeekingRef = useRef(false);
  const lastSeekTimeRef = useRef(0);
  const lastCurrentTimeRef = useRef(0);
  const isInitializedRef = useRef(false);
  const lastIsPlayingRef = useRef(false);

  // Expose player control methods to parent component
  useImperativeHandle(ref, () => ({
    startPlayer: () => {
      if (waveformRef.current && isInitializedRef.current) {
        console.log('▶️ Starting waveform player');
        try {
          waveformRef.current.startPlayer();
        } catch (error) {
          console.error('❌ Error starting waveform player:', error);
        }
      } else {
        console.log('⚠️ Waveform player not ready yet');
      }
    },
    pausePlayer: () => {
      if (waveformRef.current && isInitializedRef.current) {
        console.log('⏸️ Pausing waveform player');
        try {
          waveformRef.current.pausePlayer();
        } catch (error) {
          console.error('❌ Error pausing waveform player:', error);
        }
      } else {
        console.log('⚠️ Waveform player not ready yet');
      }
    },
  }), []);

  // Control waveform player based on isPlaying prop (only when state actually changes)
  useEffect(() => {
    if (waveformRef.current && isInitializedRef.current && !isSeekingRef.current) {
      // Only update if the playing state has actually changed
      if (isPlaying !== lastIsPlayingRef.current) {
        try {
          if (isPlaying) {
            console.log('▶️ Starting waveform player from prop');
            waveformRef.current.startPlayer();
          } else {
            console.log('⏸️ Pausing waveform player from prop');
            waveformRef.current.pausePlayer();
          }
          lastIsPlayingRef.current = isPlaying;
        } catch (error) {
          console.error('❌ Error controlling waveform player:', error);
        }
      }
    }
  }, [isPlaying]);

  // Sync waveform position when seeking (but avoid during user interaction)
  useEffect(() => {
    if (waveformRef.current && duration > 0 && !isSeekingRef.current && isInitializedRef.current) {
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
    
    // Mark as initialized when we get the first state
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      console.log('✅ Waveform player initialized');
    }
    
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
    if (!isLoading) {
      isInitializedRef.current = true;
    }
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
}));

PlaybackWaveform.displayName = 'PlaybackWaveform';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 100,
    paddingHorizontal: 1,
    paddingVertical: 16,
  },
}); 