import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useWaveformContext } from '../contexts/WaveformContext';

interface WaveformVisualizerProps {
  isRecording: boolean;
  audioRecorder: any;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  isRecording,
  audioRecorder,
}) => {
  const { addWaveformSample, getAllWaveformSamples } = useWaveformContext();
  const animatedValues = useRef<Animated.Value[]>([]).current;

  // Initialize animated values for waveform bars
  useEffect(() => {
    const samples = getAllWaveformSamples() || [];
    if (samples.length > animatedValues.length) {
      const newValues = Array(samples.length - animatedValues.length)
        .fill(0)
        .map(() => new Animated.Value(0));
      animatedValues.push(...newValues);
    }
  }, [getAllWaveformSamples, animatedValues]);

  // Update waveform during recording
  useEffect(() => {
    if (isRecording && audioRecorder) {
      const updateWaveform = () => {
        // Simulate waveform data based on audio levels
        const height = Math.random() * 0.8 + 0.2; // Random height between 0.2 and 1.0
        addWaveformSample(height);
      };

      const interval = setInterval(updateWaveform, 100); // Update every 100ms
      return () => clearInterval(interval);
    }
  }, [isRecording, audioRecorder, addWaveformSample]);

  // Animate waveform bars
  useEffect(() => {
    const samples = getAllWaveformSamples() || [];
    samples.forEach((sample, index) => {
      if (animatedValues[index]) {
        Animated.timing(animatedValues[index], {
          toValue: sample,
          duration: 100,
          useNativeDriver: false,
        }).start();
      }
    });
  }, [getAllWaveformSamples, animatedValues]);

  const renderWaveformBars = () => {
    const samples = getAllWaveformSamples() || [];
    return samples.map((sample, index) => (
      <Animated.View
        key={index}
        style={[
          styles.bar,
          {
            height: animatedValues[index]?.interpolate({
              inputRange: [0, 1],
              outputRange: [4, 40],
            }) || 4,
            backgroundColor: isRecording ? '#00AEEF' : '#E5E7EB',
          },
        ]}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.waveform}>{renderWaveformBars()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 50,
    paddingHorizontal: 20,
  },
  bar: {
    width: 3,
    marginHorizontal: 1,
    borderRadius: 2,
  },
}); 