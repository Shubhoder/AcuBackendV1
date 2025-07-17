import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { formatTime } from '../utils/helpers';
import { RealTimeWaveform } from './index';
import { WaveformData } from '../services/audioService';

interface AudioRecorderProps {
  onRecordingComplete: (uri: string) => void;
  onRecordingStart: () => void;
  onRecordingStop: () => void;
  onRecordingPause: () => void;
  onRecordingResume: () => void;
  isPaused: boolean;
  onWaveformDataUpdate?: (data: WaveformData[]) => void;
  onRecorderReady?: (recorder: any) => void;
  // New props for append mode
  isAppending?: boolean;
  previousDuration?: number;
  onDurationUpdate?: (duration: number) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  onRecordingStart,
  onRecordingStop,
  onRecordingPause,
  onRecordingResume,
  isPaused,
  onWaveformDataUpdate,
  onRecorderReady,
  isAppending = false,
  previousDuration = 0,
  onDurationUpdate,
}) => {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [totalDuration, setTotalDuration] = useState(previousDuration);
  const [isRecordingSession, setIsRecordingSession] = useState(false);
  const recordingTimerInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Request microphone permissions on component mount
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert('Permission Denied', 'Please grant microphone access to use this app.');
      }

      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();

    // Cleanup on unmount
    return () => {
      stopRecordingCleanup();
    };
  }, []);

  // Pass recorder instance to parent when ready
  useEffect(() => {
    if (audioRecorder && onRecorderReady) {
      onRecorderReady(audioRecorder);
    }
  }, [audioRecorder, onRecorderReady]);

  // Update total duration when previous duration changes
  useEffect(() => {
    setTotalDuration(previousDuration);
  }, [previousDuration]);

  // Start timer when recording starts and not paused
  useEffect(() => {
    if (isRecordingSession && !isPaused && !recordingTimerInterval.current) {
      recordingTimerInterval.current = setInterval(() => {
        setRecordingDuration(prev => {
          const newDuration = prev + 1;
          const newTotalDuration = previousDuration + newDuration;
          setTotalDuration(newTotalDuration);
          return newDuration;
        });
      }, 1000);
    } else if ((!isRecordingSession || isPaused) && recordingTimerInterval.current) {
      clearInterval(recordingTimerInterval.current);
      recordingTimerInterval.current = null;
    }
  }, [isRecordingSession, isPaused, previousDuration]);

  // Separate effect to notify parent of duration updates
  useEffect(() => {
    if (onDurationUpdate && totalDuration > 0) {
      onDurationUpdate(totalDuration);
    }
  }, [totalDuration, onDurationUpdate]);

  const startRecording = async () => {
    try {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      
      if (!isAppending) {
        setRecordingDuration(0);
        setTotalDuration(0);
      } else {
        // In append mode, keep the current recording duration
        // but reset the new segment duration
        setRecordingDuration(0);
        setTotalDuration(previousDuration);
      }
      
      setIsRecordingSession(true);
      onRecordingStart();
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Recording Error', 'Could not start recording. Please try again.');
    }
  };

  const pauseRecording = async () => {
    try {
      audioRecorder.pause();
      onRecordingPause();
      console.log('Recording paused successfully');
    } catch (err) {
      console.error('Failed to pause recording', err);
      Alert.alert('Recording Error', 'Could not pause recording.');
    }
  };

  const resumeRecording = async () => {
    try {
      audioRecorder.record();
      onRecordingResume();
      console.log('Recording resumed successfully');
    } catch (err) {
      console.error('Failed to resume recording', err);
      Alert.alert('Recording Error', 'Could not resume recording.');
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorder.stop();
      const uri = audioRecorder.uri;
      
      if (uri) {
        onRecordingComplete(uri);
      }
      stopRecordingCleanup();
      onRecordingStop();

      console.log('Recording stopped and URI:', uri);
      Alert.alert('Recording Saved', `Audio saved at: ${uri}`);

    } catch (err) {
      console.error('Failed to stop recording', err);
      Alert.alert('Recording Error', 'Could not stop recording.');
      stopRecordingCleanup();
    }
  };

  const stopRecordingCleanup = () => {
    if (recordingTimerInterval.current) {
      clearInterval(recordingTimerInterval.current);
      recordingTimerInterval.current = null;
    }
    setRecordingDuration(0);
    setIsRecordingSession(false);
  };

  // Format display time based on mode
  const getDisplayTime = () => {
    if (isAppending) {
      // Show total time (previous + current) in append mode
      return formatTime(totalDuration);
    } else {
      // Show just current recording time in normal mode
      return formatTime(recordingDuration);
    }
  };

  // Get status text based on mode
  const getStatusText = () => {
    if (isAppending) {
      return `Appending to ${formatTime(previousDuration)} recording`;
    } else if (isRecordingSession) {
      return isPaused ? `Recording paused (${formatTime(recordingDuration)} recorded)` : 'Recording...';
    } else {
      return 'Ready to Record';
    }
  };

  return (
    <View style={styles.container}>
      {/* Real-time Waveform */}
      <RealTimeWaveform
        isRecording={isRecordingSession}
        isPaused={isPaused}
        duration={recordingDuration}
        onWaveformDataUpdate={onWaveformDataUpdate}
      />
      
      {/* Status Text */}
      <Text style={styles.statusText}>{getStatusText()}</Text>
      
      {/* Timer Display */}
      <Text style={styles.timer}>{getDisplayTime()}</Text>
      
      {/* Recording Controls */}
      <View style={styles.buttonRow}>
        {!isRecordingSession ? (
          <Button
            title={isAppending ? "🎤 Resume Recording" : "🎤 Start Recording"}
            onPress={startRecording}
            color="#00AEEF"
          />
        ) : (
          <>
            {isPaused ? (
              <Button
                title="▶️ Resume"
                onPress={resumeRecording}
                color="#34C759"
              />
            ) : (
              <Button
                title="⏸️ Pause"
                onPress={pauseRecording}
                color="#FF9500"
              />
            )}
            <Button
              title="⏹️ Stop"
              onPress={stopRecording}
              color="#FF3B30"
            />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
},
timer: {
  fontSize: 48,
  fontWeight: 'bold',
  color: '#00AEEF',
  marginVertical: 20,
},
statusText: {
  fontSize: 16,
  color: '#64748b',
  marginBottom: 10,
  textAlign: 'center',
},
buttonRow: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  width: '100%',
  marginTop: 20,
},
}); 