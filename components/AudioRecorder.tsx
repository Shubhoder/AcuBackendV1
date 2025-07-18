import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View, AppState, AppStateStatus } from 'react-native';
import { formatTime } from '../utils/helpers';
import { RealTimeWaveform } from './RealTimeWaveform';
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
  
  // New state for interruption handling
  const [wasInterrupted, setWasInterrupted] = useState(false);
  const [interruptionType, setInterruptionType] = useState<'background' | 'audio' | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);

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

  // App state change handler for background/foreground transitions
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      console.log('📱 App state changed:', appState.current, '->', nextAppState);
      
      if (isRecordingSession && !isPaused) {
        if (nextAppState === 'background' || nextAppState === 'inactive') {
          // App going to background - pause recording
          console.log('⏸️ App going to background, pausing recording automatically');
          setWasInterrupted(true);
          setInterruptionType('background');
          pauseRecording();
          showInterruptionNotification('Recording paused - App went to background');
        } else if (nextAppState === 'active' && wasInterrupted && interruptionType === 'background') {
          // App coming back to foreground after background interruption
          console.log('▶️ App returned from background, resuming recording automatically');
          setWasInterrupted(false);
          setInterruptionType(null);
          resumeRecording();
          showInterruptionNotification('Recording resumed - Welcome back!');
        }
      }
      
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecordingSession, isPaused, wasInterrupted, interruptionType]);

  // Audio interruption handler using audio session monitoring
  useEffect(() => {
    const handleAudioSessionInterruption = async () => {
      // Monitor audio session state changes
      if (audioRecorder && isRecordingSession) {
        try {
          // Check if audio session is interrupted by monitoring recorder state
          const currentState = recorderState;
          console.log('🎵 Current recorder state:', currentState);
          
          // Enhanced detection: Check for audio session interruptions
          const isCurrentlyRecording = currentState?.isRecording === true;
          const shouldBeRecording = isRecordingSession && !isPaused;
          
          // If we should be recording but the recorder is not recording,
          // it might be interrupted by a call or other audio
          if (shouldBeRecording && !isCurrentlyRecording && !wasInterrupted) {
            console.log('⏸️ Audio session interruption detected (call/notification), pausing recording automatically');
            setWasInterrupted(true);
            setInterruptionType('audio');
            onRecordingPause(); // Update parent state
            showInterruptionNotification('Recording paused - Call/notification detected');
          }
          
          // If we were interrupted by audio and now the recorder is back to recording,
          // resume automatically
          if (isCurrentlyRecording && wasInterrupted && interruptionType === 'audio') {
            console.log('▶️ Audio session restored (call ended), resuming recording automatically');
            setWasInterrupted(false);
            setInterruptionType(null);
            onRecordingResume(); // Update parent state
            showInterruptionNotification('Recording resumed - Call ended');
          }
          
          // Additional check: If we're in an interrupted state but the recorder is recording,
          // clear the interruption state
          if (isCurrentlyRecording && wasInterrupted && interruptionType === 'audio') {
            console.log('🔄 Clearing audio interruption state - recorder is active');
            setWasInterrupted(false);
            setInterruptionType(null);
          }
          
        } catch (error) {
          console.log('⚠️ Error monitoring audio session:', error);
        }
      }
    };

    // Set up periodic monitoring of audio session with faster polling for better responsiveness
    const audioSessionInterval = setInterval(handleAudioSessionInterruption, 500); // Check every 500ms

    return () => {
      clearInterval(audioSessionInterval);
    };
  }, [audioRecorder, recorderState, isRecordingSession, isPaused, wasInterrupted, interruptionType, onRecordingPause, onRecordingResume]);

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
      setWasInterrupted(false);
      setInterruptionType(null);
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
      
      // Clear interruption state when manually resumed
      if (wasInterrupted) {
        setWasInterrupted(false);
        setInterruptionType(null);
        showInterruptionNotification('Recording resumed manually');
      }
      
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
    setWasInterrupted(false);
    setInterruptionType(null);
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

  // Get status text based on mode and interruption state
  const getStatusText = () => {
    if (isAppending) {
      return `Appending to ${formatTime(previousDuration)} recording`;
    } else if (isRecordingSession) {
      if (wasInterrupted) {
        const interruptionMsg = interruptionType === 'background' 
          ? 'App in background' 
          
          : 'Call/notification';
        return `Recording paused - ${interruptionMsg} (${formatTime(recordingDuration)} recorded)`;
      } else if (isPaused) {
        return `Recording paused (${formatTime(recordingDuration)} recorded)`;
      } else {
        return 'Recording...';
      }
    } else {
      return 'Ready to Record';
    }
  };

  // Show notification for interruption events
  const showInterruptionNotification = (message: string) => {
    // For now, we'll use console.log, but you could implement a toast notification here
    console.log('🔔', message);
    // You could add a toast notification library like react-native-toast-message
    // Toast.show({
    //   type: 'info',
    //   text1: 'Recording Interruption',
    //   text2: message,
    //   position: 'top',
    //   visibilityTime: 3000,
    // });
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
      
      {/* Interruption Notification */}
      {wasInterrupted && (
        <View style={styles.interruptionNotification}>
          <Text style={styles.interruptionText}>
            {interruptionType === 'background' 
              ? '📱 Recording paused - App went to background' 
              : '📞 Recording paused - Call/notification detected'}
          </Text>
          <Text style={styles.interruptionSubtext}>
            {interruptionType === 'background' 
              ? 'Return to app to resume recording automatically'
              : 'Call will end automatically and recording will resume'}
          </Text>
        </View>
      )}
      
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
interruptionNotification: {
  backgroundColor: '#FFE082', // A light yellow background
  padding: 10,
  borderRadius: 8,
  marginTop: 10,
  alignSelf: 'center',
  width: '80%',
  borderLeftWidth: 5,
  borderLeftColor: '#FF9800', // Orange border
},
interruptionText: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#FF9800', // Orange text
  marginBottom: 2,
},
interruptionSubtext: {
  fontSize: 12,
  color: '#64748b',
},
}); 