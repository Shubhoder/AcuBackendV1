import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface WaveformData {
  amplitude: number;
  timestamp: number;
}

interface RealTimeWaveformProps {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  onWaveformDataUpdate?: (data: WaveformData[]) => void;
  maxDataPoints?: number;
}

export const RealTimeWaveform: React.FC<RealTimeWaveformProps> = ({
  isRecording,
  isPaused,
  duration,
  onWaveformDataUpdate,
  maxDataPoints = 200,
}) => {
  const [waveformData, setWaveformData] = useState<WaveformData[]>([]);
  const [currentAmplitude, setCurrentAmplitude] = useState(0);
  const animationRef = useRef<Animated.Value>(new Animated.Value(0));
  const dataIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateTime = useRef(0);

  // Optimized amplitude generation with memoization
  const generateAmplitude = useCallback((timestamp: number): number => {
    // Base amplitude with some variation
    const baseAmplitude = 0.3 + Math.sin(timestamp * 0.1) * 0.2;
    const randomVariation = (Math.random() - 0.5) * 0.4;
    const finalAmplitude = Math.max(0.05, Math.min(1, baseAmplitude + randomVariation));
    
    return finalAmplitude;
  }, []);

  // Optimized waveform data update
  const updateWaveformData = useCallback((newAmplitude: number, timestamp: number) => {
    setWaveformData(prev => {
      const newData = [...prev, { amplitude: newAmplitude, timestamp }];
      // Keep only the last maxDataPoints
      if (newData.length > maxDataPoints) {
        return newData.slice(-maxDataPoints);
      }
      return newData;
    });
  }, [maxDataPoints]);

  // Start real-time waveform generation with performance optimizations
  useEffect(() => {
    if (isRecording && !isPaused) {
      // Start data collection with throttling
      dataIntervalRef.current = setInterval(() => {
        const now = Date.now();
        if (now - lastUpdateTime.current < 50) return; // Throttle to 20fps for data
        lastUpdateTime.current = now;

        const timestamp = now;
        const amplitude = generateAmplitude(timestamp);
        
        updateWaveformData(amplitude, timestamp);
        setCurrentAmplitude(amplitude);
      }, 50); // Update every 50ms for smoother data collection

      // Start animation with optimized timing
      animationIntervalRef.current = setInterval(() => {
        Animated.sequence([
          Animated.timing(animationRef.current, {
            toValue: 1,
            duration: 150,
            useNativeDriver: false,
          }),
          Animated.timing(animationRef.current, {
            toValue: 0,
            duration: 150,
            useNativeDriver: false,
          }),
        ]).start();
      }, 300); // Slower animation cycle for better performance
    } else {
      // Clear intervals when not recording or paused
      if (dataIntervalRef.current) {
        clearInterval(dataIntervalRef.current);
        dataIntervalRef.current = null;
      }
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
        animationIntervalRef.current = null;
      }
    }

    return () => {
      if (dataIntervalRef.current) {
        clearInterval(dataIntervalRef.current);
      }
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, [isRecording, isPaused, generateAmplitude, updateWaveformData]);

  // Optimized parent notification with throttling
  useEffect(() => {
    if (onWaveformDataUpdate && waveformData.length > 0) {
      const timeoutId = setTimeout(() => {
        onWaveformDataUpdate(waveformData);
      }, 100); // Throttle notifications to parent

      return () => clearTimeout(timeoutId);
    }
  }, [waveformData, onWaveformDataUpdate]);

  // Calculate bar width based on available space and data points
  const barWidth = Math.max(2, (width - 80) / Math.max(waveformData.length, 1));

  return (
    <View style={styles.container}>
      <View style={styles.waveformContainer}>
        {waveformData.map((data, index) => (
          <Animated.View
            key={`${data.timestamp}-${index}`}
            style={[
              styles.bar,
              {
                width: barWidth,
                height: data.amplitude * 60 + 10, // Scale amplitude to height
                backgroundColor: isRecording && !isPaused 
                  ? '#00AEEF' 
                  : isPaused 
                    ? '#FF9500' 
                    : '#00AEEF',
                opacity: isRecording && !isPaused 
                  ? animationRef.current.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.6, 1],
                    })
                  : 0.8,
              },
            ]}
          />
        ))}
        
        {/* Current recording indicator */}
        {isRecording && !isPaused && (
          <Animated.View
            style={[
              styles.currentIndicator,
              {
                opacity: animationRef.current,
                transform: [{
                  scale: animationRef.current.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.2],
                  }),
                }],
              },
            ]}
          />
        )}
      </View>
      
      {/* Status indicator */}
      <View style={styles.statusContainer}>
        <View style={[
          styles.statusDot,
          { backgroundColor: isRecording ? (isPaused ? '#FF9500' : '#00AEEF') : '#E5E5EA' }
        ]} />
        <Animated.Text style={[
          styles.statusText,
          { opacity: animationRef.current.interpolate({
            inputRange: [0, 1],
            outputRange: [0.7, 1],
          })}
        ]}>
          {isRecording ? (isPaused ? 'Paused' : 'Recording...') : 'Ready'}
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 80,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  bar: {
    marginHorizontal: 1,
    borderRadius: 2,
    minHeight: 4,
  },
  currentIndicator: {
    position: 'absolute',
    right: 0,
    width: 4,
    height: 80,
    backgroundColor: '#00AEEF',
    borderRadius: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
}); 