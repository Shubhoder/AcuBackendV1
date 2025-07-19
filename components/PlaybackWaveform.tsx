import React, { useRef, useEffect, useCallback, memo, forwardRef, useImperativeHandle, useState } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
} from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
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
  const containerWidthRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragOpacity = useRef(new Animated.Value(0)).current;
  const [isDragging, setIsDragging] = useState(false);

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
    if (waveformRef.current && isInitializedRef.current && !isSeekingRef.current && !isDraggingRef.current) {
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
    if (waveformRef.current && duration > 0 && !isSeekingRef.current && !isDraggingRef.current && isInitializedRef.current) {
      const timeDiff = Math.abs(currentTime - lastCurrentTimeRef.current);
      
      // Only update if there's a significant time difference to avoid jitter
      if (timeDiff > 0.1) {
        console.log('📊 Syncing waveform - Current:', currentTime.toFixed(2), 'Duration:', duration.toFixed(2));
        lastCurrentTimeRef.current = currentTime;
        lastSeekTimeRef.current = currentTime;
      }
    }
  }, [currentTime, duration]);

  // Enhanced drag gesture handler with visual feedback
  const handlePanGesture = useCallback((event: PanGestureHandlerGestureEvent) => {
    const { translationX, state } = event.nativeEvent;
    
    if (state === State.BEGAN) {
      // Drag started
      isDraggingRef.current = true;
      isSeekingRef.current = true;
      setIsDragging(true);
      console.log('👆 Drag gesture started');
      
      // Haptic feedback for better UX
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        console.log('Haptic feedback not available');
      }
      
      // Animate visual feedback
      Animated.timing(dragOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
      
      if (onPanStateChange) {
        onPanStateChange(true);
      }
    } else if (state === State.ACTIVE) {
      // Drag in progress - calculate seek position
      if (containerWidthRef.current > 0 && duration > 0) {
        const progress = Math.max(0, Math.min(1, translationX / containerWidthRef.current));
        const seekTime = progress * duration;
        
        console.log('🔄 Dragging to time:', seekTime.toFixed(2));
        
        // Update refs to prevent conflicts
        lastSeekTimeRef.current = seekTime;
        lastCurrentTimeRef.current = seekTime;
        
        // Call seek callback
        if (onSeek) {
          onSeek(seekTime);
        }
      }
    } else if (state === State.END || state === State.CANCELLED) {
      // Drag ended
      isDraggingRef.current = false;
      setIsDragging(false);
      console.log('👆 Drag gesture ended');
      
      // Haptic feedback for completion
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {
        console.log('Haptic feedback not available');
      }
      
      // Animate visual feedback out
      Animated.timing(dragOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      
      // Reset seeking flag after a short delay to allow waveform to settle
      setTimeout(() => {
        isSeekingRef.current = false;
      }, 300);
      
      if (onPanStateChange) {
        onPanStateChange(false);
      }
    }
  }, [duration, onSeek, onPanStateChange, dragOpacity]);

  // Handle waveform seek events (when user taps on waveform)
  const handlePlayerStateChange = useCallback((playerState: any) => {
    console.log('🎵 Waveform Player State Change:', playerState);
    
    // Mark as initialized when we get the first state
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      console.log('✅ Waveform player initialized');
    }
    
    // Handle seek events from waveform (tap gestures)
    if (playerState.currentTime !== undefined && onSeek && !isDraggingRef.current) {
      const seekTime = playerState.currentTime;
      console.log('⏰ Waveform tap seeking to time:', seekTime.toFixed(2));
      
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

  // Handle pan state changes from waveform library
  const handlePanStateChange = useCallback((isMoving: boolean) => {
    console.log('👆 Waveform Pan State Change - Is Moving:', isMoving);
    
    // Only update if we're not handling our own drag gesture
    if (!isDraggingRef.current) {
      isSeekingRef.current = isMoving;
    }
    
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
    
    // Check if it's a decode error and provide more specific logging
    if (error?.message?.includes('decode')) {
      console.error('❌ Audio file decode error - this usually means the file is corrupted or in an unsupported format');
      console.error('📁 Audio path:', audioPath);
    }
    
    // Reset initialization flag on error
    isInitializedRef.current = false;
    
    // Try to validate the file exists
    const validateFile = async () => {
      try {
        const { getInfoAsync } = await import('expo-file-system');
        const fileInfo = await getInfoAsync(audioPath);
        console.error('📁 File validation result:', fileInfo);
      } catch (validationError) {
        console.error('❌ File validation failed:', validationError);
      }
    };
    
    validateFile();
  }, [audioPath]);

  // Handle container layout
  const handleContainerLayout = useCallback((event: any) => {
    const { width } = event.nativeEvent.layout;
    containerWidthRef.current = width;
    console.log('📏 Container width updated:', width);
  }, []);

  return (
    <View style={styles.container} onLayout={handleContainerLayout}>
      <PanGestureHandler
        onGestureEvent={handlePanGesture}
        activeOffsetX={[-5, 5]} // Require 5px horizontal movement to activate (more sensitive)
        activeOffsetY={[-15, 15]} // Require 15px vertical movement to fail gesture
      >
        <View style={styles.waveformContainer}>
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
          
          {/* Visual feedback overlay for drag gesture */}
          <Animated.View 
            style={[
              styles.dragOverlay,
              {
                opacity: dragOpacity,
                backgroundColor: isDragging ? 'rgba(0, 174, 239, 0.1)' : 'transparent',
              }
            ]}
            pointerEvents="none"
          />
        </View>
      </PanGestureHandler>
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
  waveformContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  dragOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(0, 174, 239, 0.3)',
  },
}); 