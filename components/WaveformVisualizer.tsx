import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import { useAudioContext } from '../contexts/AudioContext';

interface WaveformVisualizerProps {
  isRecording: boolean;
  audioRecorder: any;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ 
  isRecording, 
  audioRecorder 
}) => {
  const { addWaveformSample, currentRecording, getAllWaveformSamples } = useAudioContext();
  const [animatedValues] = useState(() => 
    new Array(60).fill(0).map(() => new Animated.Value(5))
  );
  const [currentWaveform, setCurrentWaveform] = useState<number[]>(new Array(60).fill(5));
  
  // Simulate real-time waveform data when recording
  useEffect(() => {
    if (!isRecording || !audioRecorder) return;

    const interval = setInterval(() => {
      // Generate simulated amplitude data
      const amplitude = Math.random() * 0.8 + 0.2; // Random amplitude between 0.2 and 1.0
      const height = Math.max(5, Math.min(45, amplitude * 40 + 8));
      
      // Add to audio context for persistence
      addWaveformSample(height);
      
      // Update local waveform display - scroll left and add new value
      setCurrentWaveform(prev => {
        const newWaveform = [...prev.slice(1), height];
        
        // Animate each bar smoothly
        newWaveform.forEach((value, index) => {
          Animated.timing(animatedValues[index], {
            toValue: value,
            duration: 80,
            useNativeDriver: false,
          }).start();
        });
        
        return newWaveform;
      });
    }, 100); // Update every 100ms for smooth animation

    return () => clearInterval(interval);
  }, [isRecording, audioRecorder, addWaveformSample, animatedValues]);
  
  // Initialize waveform with previous samples when in resume mode
  useEffect(() => {
    if (currentRecording.resumeMode && currentRecording.previousWaveformSamples.length > 0) {
      const allSamples = getAllWaveformSamples();
      const maxBars = 60;
      
      let displaySamples: number[];
      if (allSamples.length <= maxBars) {
        displaySamples = [
          ...allSamples,
          ...new Array(Math.max(0, maxBars - allSamples.length)).fill(5)
        ];
      } else {
        // Show the most recent samples
        displaySamples = allSamples.slice(-maxBars);
      }
      
      setCurrentWaveform(displaySamples);
      
      displaySamples.forEach((value, index) => {
        Animated.timing(animatedValues[index], {
          toValue: value,
          duration: 300,
          useNativeDriver: false,
        }).start();
      });
    }
  }, [currentRecording.resumeMode, currentRecording.previousWaveformSamples, getAllWaveformSamples, animatedValues]);

  // Reset waveform when not recording and not in resume mode
  useEffect(() => {
    if (!isRecording && !currentRecording.resumeMode) {
      const baselineWaveform = new Array(60).fill(5);
      setCurrentWaveform(baselineWaveform);
      
      baselineWaveform.forEach((value, index) => {
        Animated.timing(animatedValues[index], {
          toValue: value,
          duration: 300,
          useNativeDriver: false,
        }).start();
      });
    }
  }, [isRecording, currentRecording.resumeMode, animatedValues]);

  return (
    <View style={styles.waveformContainer}>
      <View style={styles.waveformHeader}>
        <View style={styles.waveform}>
          {animatedValues.map((animatedValue, index) => (
            <Animated.View
              key={index}
              style={[
                styles.waveformBar,
                {
                  height: animatedValue,
                  backgroundColor: isRecording ? '#00AEEF' : '#E5E7EB',
                  opacity: isRecording ? 1 : 0.6,
                },
              ]}
            />
          ))}
        </View>
        {isRecording && audioRecorder && (
          <View style={styles.recordingIndicatorHeader}>
            <View style={styles.recordingDotHeader} />
            <Text style={styles.recordingTextHeader}>LIVE</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  waveformContainer: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  waveformHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    flex: 1,
  },
  waveformBar: {
    width: 3,
    minHeight: 4,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 1,
    borderRadius: 1.5,
  },
  recordingIndicatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 16,
  },
  recordingDotHeader: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginRight: 6,
  },
  recordingTextHeader: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
}); 