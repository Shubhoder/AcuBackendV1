import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import { PanGestureHandler, State, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

interface WaveformData {
  amplitude: number;
  timestamp: number;
}

interface PlaybackWaveformProps {
  waveformData: WaveformData[];
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  onSeek?: (time: number) => void;
  onRewind?: () => void;
  onForward?: () => void;
}

export const PlaybackWaveform: React.FC<PlaybackWaveformProps> = ({
  waveformData,
  duration,
  currentTime,
  isPlaying,
  onSeek,
  onRewind,
  onForward,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [isDragging, setIsDragging] = useState(false);
  const [seekTime, setSeekTime] = useState(currentTime);
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const lastUpdateTime = useRef(0);

  // Optimized progress update with throttling
  const updateProgress = useCallback((newTime: number, newDuration: number) => {
    const now = Date.now();
    if (now - lastUpdateTime.current < 16) return; // Throttle to ~60fps
    lastUpdateTime.current = now;

    const progress = newDuration > 0 ? newTime / newDuration : 0;
    
    // Use spring animation for smoother updates
    Animated.spring(animatedProgress, {
      toValue: progress,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
    
    translateX.setValue(progress * (width - 40));
  }, [animatedProgress, translateX]);

  // Update seek time when current time changes (but not when dragging)
  useEffect(() => {
    if (!isDragging) {
      setSeekTime(currentTime);
      updateProgress(currentTime, duration);
    }
  }, [currentTime, duration, isDragging, updateProgress]);

  // Optimized gesture event handler
  const onGestureEvent = useCallback(
    Animated.event(
      [{ nativeEvent: { translationX: translateX } }],
      { 
        useNativeDriver: false,
        listener: (event: PanGestureHandlerGestureEvent) => {
          // Additional gesture handling if needed
        }
      }
    ),
    [translateX]
  );

  const onHandlerStateChange = useCallback((event: PanGestureHandlerGestureEvent) => {
    const { state, translationX } = event.nativeEvent;

    if (state === State.BEGAN) {
      setIsDragging(true);
    } else if (state === State.ACTIVE) {
      const progress = Math.max(0, Math.min(1, translationX / (width - 40)));
      const newTime = progress * duration;
      setSeekTime(newTime);
    } else if (state === State.END) {
      setIsDragging(false);
      const progress = Math.max(0, Math.min(1, translationX / (width - 40)));
      const newTime = progress * duration;
      
      if (onSeek) {
        onSeek(newTime);
      }
      
      // Smooth animation to final position
      Animated.spring(translateX, {
        toValue: progress * (width - 40),
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [duration, onSeek, translateX]);

  // Optimized tap handler
  const handleWaveformTap = useCallback((event: any) => {
    const { locationX } = event.nativeEvent;
    const progress = Math.max(0, Math.min(1, locationX / (width - 40)));
    const newTime = progress * duration;
    
    if (onSeek) {
      onSeek(newTime);
    }
  }, [duration, onSeek]);

  // Calculate bar width and spacing
  const totalBars = waveformData.length;
  const barWidth = Math.max(1, (width - 40) / Math.max(totalBars, 1));

  // Calculate current position for playback indicator with precise timing
  const progress = duration > 0 ? currentTime / duration : 0;
  const currentPosition = progress * (width - 40);

  return (
    <View style={styles.container}>
      {/* Waveform Display with Optimized Gesture Support */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetX={[-10, 10]} // Reduce gesture activation threshold
        failOffsetY={[-20, 20]} // Prevent accidental vertical gestures
      >
        <Animated.View style={styles.gestureArea}>
          <TouchableOpacity 
            style={styles.waveformContainer}
            onPress={handleWaveformTap}
            activeOpacity={0.8}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {waveformData.map((data, index) => {
              const barProgress = index / totalBars;
              const isPlayed = barProgress <= progress;
              const isCurrent = Math.abs(barProgress - progress) < 0.02;
              
              return (
                <Animated.View
                  key={`${data.timestamp}-${index}`}
                  style={[
                    styles.bar,
                    {
                      width: barWidth,
                      height: Math.max(4, data.amplitude * 40 + 8),
                      backgroundColor: isCurrent 
                        ? '#00AEEF' 
                        : isPlayed 
                          ? '#00AEEF' 
                          : '#E5E7EB',
                      opacity: isCurrent ? 1 : isPlayed ? 0.8 : 0.4,
                      transform: [{
                        scale: isCurrent && isPlaying ? 1.1 : 1
                      }]
                    },
                  ]}
                />
              );
            })}
            
            {/* Optimized Playback indicator */}
            <Animated.View
              style={[
                styles.playbackIndicator,
                {
                  left: currentPosition,
                  backgroundColor: isPlaying ? '#00AEEF' : '#FF9500',
                  transform: [{
                    scale: isPlaying ? 1.2 : 1
                  }]
                },
              ]}
            />
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>

      {/* Time display */}
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>
          {formatTime(isDragging ? seekTime : currentTime)}
        </Text>
        <Text style={styles.durationText}>
          {formatTime(duration)}
        </Text>
      </View>
      
      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <Animated.View 
            style={[
              styles.progressFill,
              { 
                width: animatedProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%']
                })
              }
            ]} 
          />
        </View>
      </View>

      {/* Gesture instructions */}
      <Text style={styles.gestureHint}>
        Tap to seek • Drag to scrub
      </Text>
    </View>
  );
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  gestureArea: {
    width: '100%',
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 60,
    marginBottom: 12,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  bar: {
    marginHorizontal: 0.5,
    borderRadius: 1,
    minHeight: 4,
  },
  playbackIndicator: {
    position: 'absolute',
    width: 2,
    height: 60,
    borderRadius: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#00AEEF',
    fontWeight: '600',
  },
  durationText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  progressBarContainer: {
    width: '100%',
    height: 16,
    justifyContent: 'center',
  },
  progressBar: {
    width: '100%',
    height: 3,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00AEEF',
    borderRadius: 2,
  },
  gestureHint: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
}); 