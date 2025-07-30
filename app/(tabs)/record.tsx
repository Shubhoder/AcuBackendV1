import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AudioRecorder } from '../../components';
import { PlaybackWaveform } from '../../components/PlaybackWaveform';
import { setAudioModeAsync } from 'expo-audio';

import { PhotoUploadModal } from '../../components/PhotoUploadModal';
import { PatientAddModal } from '../../components/PatientAddModal';
import { useOutboxContext } from '../../contexts/OutboxContext';
import { useWaveformContext } from '../../contexts/WaveformContext';
import { AudioService, WaveformData, AudioSegment } from '../../services/audioService';
import { AudioWaveformService } from '../../services/audioWaveformService';
import { audioRecordingService } from '../../services/audioRecordingService';
import { useAuthContext } from '../../contexts/AuthContext';
import { ErrorHandler } from '../../utils/errorUtils';

// const { width, height } = Dimensions.get('window');
const RECORDING_COUNTER_KEY = 'RECORDING_COUNTER_KEY';

export default function RecordScreen() {
  // --- State for App Flow ---
  const [appMode, setAppMode] = useState<'initial' | 'recording' | 'playback'>('initial');
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [recordedSegments, setRecordedSegments] = useState<AudioSegment[]>([]);
  const [isRecordingPaused, setIsRecordingPaused] = useState(false);
  const [isAppending, setIsAppending] = useState(false);
  const [totalRecordingDuration, setTotalRecordingDuration] = useState(0);
  const [currentSegmentDuration, setCurrentSegmentDuration] = useState(0);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [recordingCounter, setRecordingCounter] = useState(1);
  const [patientModalVisible, setPatientModalVisible] = useState(false);
  const [patientName, setPatientName] = useState<string | null>(null);
  const [waveformData, setWaveformData] = useState<WaveformData[]>([]);
  const [audioRecorder, setAudioRecorder] = useState<any>(null); // Used by AudioRecorder component
  const [isGeneratingWaveform, setIsGeneratingWaveform] = useState(false);
  const [isConcatenating, setIsConcatenating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const recordingStartTime = useRef<number>(0);
  
  // --- Audio Player State (replicating AudioCard behavior) ---
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [localIsPlaying, setLocalIsPlaying] = useState(false);
  const [localCurrentTime, setLocalCurrentTime] = useState(0);
  const [localDuration, setLocalDuration] = useState(0);
  const waveformRef = useRef<any>(null);
  
  // --- Session Management for Edit & Append ---
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [segmentIndex, setSegmentIndex] = useState(0);
  
  // Outbox context
  const outboxContext = useOutboxContext();
  const addRecording = outboxContext.addRecording;
  const deleteRecording = outboxContext.deleteRecording;
  
  // Waveform context for waveform data
  const waveformContext = useWaveformContext();
  const setResumeMode = waveformContext.setResumeMode;
  const clearWaveformData = waveformContext.clearWaveformData;

  // Auth context
  const authContext = useAuthContext();
  const user = authContext.user;

  // --- Load and persist recording counter ---
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(RECORDING_COUNTER_KEY);
      if (stored && !isNaN(Number(stored))) {
        setRecordingCounter(Number(stored));
      }
    })();
  }, []);

  // --- Set audio mode for speaker output ---
  useEffect(() => {
    (async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: false,
        });
        console.log('✅ Audio mode set for speaker output');
      } catch (error) {
        console.error('❌ Error setting audio mode:', error);
      }
    })();
  }, []);

  const incrementRecordingCounter = async () => {
    const next = recordingCounter + 1;
    setRecordingCounter(next);
    await AsyncStorage.setItem(RECORDING_COUNTER_KEY, String(next));
  };

  // --- Recording Handlers ---
  const handleRecordingStart = () => {
    setAppMode('recording');
    setIsRecordingPaused(false);
    if (!isAppending) {
      // Start new session
      const sessionId = `session_${Date.now()}_${recordingCounter}`;
      setCurrentSessionId(sessionId);
      setSegmentIndex(0);
      recordingStartTime.current = Date.now();
      setTotalRecordingDuration(0);
      setCurrentSegmentDuration(0);
      clearWaveformData(); // Clear previous waveform data
      console.log('Starting new recording session:', sessionId);
    } else {
      // Continue existing session
      setSegmentIndex(prev => prev + 1);
      console.log('Appending to existing recording... Session:', currentSessionId, 'Segment:', segmentIndex + 1);
      setResumeMode(true); // Enable resume mode for waveform
    }
  };

  const handleRecordingStop = () => {
    setAppMode('playback');
    setIsRecordingPaused(false);
    setIsAppending(false);
    setResumeMode(false); // Disable resume mode
  };

  const handleRecordingPause = () => {
    setIsRecordingPaused(true);
    console.log('Recording paused - UI state updated');
  };

  const handleRecordingResume = () => {
    setIsRecordingPaused(false);
    console.log('Recording resumed - UI state updated');
  };

  const handleWaveformDataUpdate = (data: WaveformData[]) => {
    setWaveformData(data);
  };

  const handleDurationUpdate = useCallback((duration: number) => {
    setTotalRecordingDuration(duration);
    // Calculate current segment duration
    const previousTotal = recordedSegments.reduce((sum, segment) => sum + segment.duration, 0);
    setCurrentSegmentDuration(duration - previousTotal);
  }, [recordedSegments]);

  const handleRecordingComplete = async (uri: string) => {
    try {
      // Create audio segment for this recording
      const segment: AudioSegment = {
        uri,
        duration: currentSegmentDuration,
        waveformData: [...waveformData],
      };

      if (isAppending) {
        // Add new segment to existing segments
        const updatedSegments = [...recordedSegments, segment];
        setRecordedSegments(updatedSegments);
        console.log('New segment added. Total segments:', updatedSegments.length);
        
        // Concatenate all segments with file management
        setIsConcatenating(true);
        const concatenatedResult = await AudioService.concatenateAudioSegmentsWithFileManagement(
          updatedSegments, 
          currentSessionId!
        );
        
        setRecordedUri(concatenatedResult.uri);
        setTotalRecordingDuration(concatenatedResult.duration);
        setWaveformData(concatenatedResult.waveformData);
        
        console.log('Segments concatenated successfully with file management');
      } else {
        // First recording - just use this segment
        setRecordedSegments([segment]);
        setRecordedUri(uri);
        setTotalRecordingDuration(currentSegmentDuration);
      }

      setAppMode('playback');
      setIsAppending(false);
      setCurrentSegmentDuration(0);

      // Generate real waveform from the final audio file
      setIsGeneratingWaveform(true);
      try {
        const finalUri = isAppending ? recordedUri : uri;
        const finalDuration = isAppending ? totalRecordingDuration : currentSegmentDuration;
        
        const realWaveformData = await AudioWaveformService.generateWaveformFromAudio(
          finalUri!, 
          finalDuration
        );
        
        // Convert to the format expected by the app
        const convertedWaveformData: WaveformData[] = realWaveformData.map(data => ({
          amplitude: data.amplitude,
          timestamp: data.timestamp,
        }));

        setWaveformData(convertedWaveformData);

        // Save recording to outbox with real waveform data
        const now = new Date();
        const dateRecorded = now.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        const timeRecorded = now.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        });

        await addRecording({
          title: `Dict #${recordingCounter}`,
          filename: `recording_${recordingCounter}.m4a`,
          uri: finalUri!,
          duration: finalDuration,
          dateRecorded,
          timeRecorded,
          patientName: patientName || undefined,
          waveformData: convertedWaveformData,
        });

        console.log('Recording saved to outbox with real waveform data');
      } catch (error) {
        console.error('Error generating waveform:', error);
        // Fallback to synthetic waveform
        const fallbackWaveform = AudioService.generateWaveformData(totalRecordingDuration);
        setWaveformData(fallbackWaveform);
      } finally {
        setIsGeneratingWaveform(false);
        setIsConcatenating(false);
      }
    } catch (error) {
      console.error('Error handling recording completion:', error);
      Alert.alert('Error', 'Failed to process recording. Please try again.');
      setIsConcatenating(false);
    }
  };

  // --- Playback Handlers ---
  // --- Audio Player Handlers (replicating AudioCard behavior) ---
  const handlePlayPause = useCallback(async () => {
    if (!recordedUri) {
      console.error('❌ No URI available for audio playback');
      return;
    }
    
    console.log(`🎵 Play/Pause clicked - Current State: ${localIsPlaying ? 'Playing' : 'Paused'}`);
    
    // Immediate visual feedback
    setIsButtonPressed(true);
    
    try {
      // Ensure audio mode is set for speaker output when starting playback
      if (!localIsPlaying) {
        await setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: false,
        });
        console.log('✅ Audio mode set for speaker output');
      }
      
      if (waveformRef.current) {
        if (localIsPlaying) {
          // Pause current audio
          console.log('⏸️ Pausing audio');
          waveformRef.current.pausePlayer();
          setLocalIsPlaying(false);
        } else {
          // Play this audio
          console.log('▶️ Playing audio, URI:', recordedUri);
          waveformRef.current.startPlayer();
          setLocalIsPlaying(true);
        }
      } else {
        console.log('⚠️ Waveform ref not available yet, setting local state');
        // If waveform isn't ready yet, just update local state
        // The waveform will sync when it becomes available
        setLocalIsPlaying(!localIsPlaying);
      }
    } catch (error) {
      console.error('❌ Error in handlePlayPause:', error);
      // Reset state on error
      setLocalIsPlaying(false);
    } finally {
      // Reset button state after a short delay
      setTimeout(() => {
        setIsButtonPressed(false);
      }, 150);
    }
  }, [recordedUri, localIsPlaying]);

  const handleSeek = useCallback(async (time: number) => {
    if (waveformRef.current && recordedUri) {
      try {
        console.log('🎯 Seeking to:', time.toFixed(2));
        setLocalCurrentTime(time);
      } catch (error) {
        console.error('❌ Error seeking:', error);
      }
    }
  }, [recordedUri]);

  const handlePlayerStateChange = useCallback((playerState: any) => {
    console.log('🎵 Player State:', playerState);
    
    if (playerState.currentTime !== undefined) {
      setLocalCurrentTime(playerState.currentTime);
    }
    
    if (playerState.duration !== undefined) {
      setLocalDuration(playerState.duration);
    }
    
    // Update playing state based on waveform player
    if (playerState.isPlaying !== undefined) {
      setLocalIsPlaying(playerState.isPlaying);
    }
  }, []);

  const handlePanStateChange = useCallback((isMoving: boolean) => {
    console.log('👆 Pan State:', isMoving);
  }, []);

  const handlePlaybackComplete = () => {
    console.log('Playback completed');
    setLocalIsPlaying(false);
  };

  const handleEditResume = () => {
    setIsAppending(true);
    setAppMode('recording');
    setResumeMode(true); // Enable resume mode
    setCurrentSegmentDuration(0); // Reset current segment duration
    console.log('Edit/Resume: Starting new recording session to append');
  };

  // --- Navigation Handlers ---
  const handleStartNewRecording = async () => {
    // Clean up temporary files for current session if exists
    if (currentSessionId) {
      try {
        await AudioService.cleanupTempFiles(currentSessionId);
        console.log('Cleaned up temp files for session:', currentSessionId);
      } catch (error) {
        console.error('Error cleaning up temp files:', error);
      }
    }
    
    // Reset all state
    setRecordedUri(null);
    setRecordedSegments([]);
    setIsAppending(false);
    setTotalRecordingDuration(0);
    setCurrentSegmentDuration(0);
    setWaveformData([]);
    setAppMode('initial');
    setPatientName(null);
    setCurrentSessionId(null);
    setSegmentIndex(0);
    clearWaveformData(); // Clear waveform data
    
    // Reset audio player state
    setLocalIsPlaying(false);
    setLocalCurrentTime(0);
    setLocalDuration(0);
    setIsButtonPressed(false);
    
    await incrementRecordingCounter();
    
    console.log('Started new recording session');
  };

  // --- Discard Recording Handler ---
  const handleDiscardRecording = async () => {
    Alert.alert(
      'Discard Recording',
      'Are you sure you want to discard this recording? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Discarding current recording...');
              
              // Find the recording in outbox to delete it
              const now = new Date();
              const dateRecorded = now.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              });
              const timeRecorded = now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              });
              
              // Find the recording by matching title and time
              const recordings = await AsyncStorage.getItem('recordings');
              if (recordings) {
                const parsedRecordings = JSON.parse(recordings);
                const recordingToDelete = parsedRecordings.find((r: any) => 
                  r.title === `Dict #${recordingCounter}` && 
                  r.dateRecorded === dateRecorded &&
                  r.timeRecorded === timeRecorded
                );
                
                if (recordingToDelete) {
                  await deleteRecording(recordingToDelete.id);
                  console.log('Deleted recording from outbox:', recordingToDelete.id);
                }
              }
              
              // Clean up temporary files for current session if exists
              if (currentSessionId) {
                try {
                  await AudioService.cleanupTempFiles(currentSessionId);
                  console.log('Cleaned up temp files for session:', currentSessionId);
                } catch (error) {
                  console.error('Error cleaning up temp files:', error);
                }
              }
              
              // Clean up recorded URI file if it exists
              if (recordedUri) {
                try {
                  const { deleteAsync } = await import('expo-file-system');
                  await deleteAsync(recordedUri);
                  console.log('Deleted recorded URI file:', recordedUri);
                } catch (error) {
                  console.error('Error deleting recorded URI file:', error);
                }
              }
              
              // Reset all state and start new recording
              setRecordedUri(null);
              setRecordedSegments([]);
              setIsAppending(false);
              setTotalRecordingDuration(0);
              setCurrentSegmentDuration(0);
              setWaveformData([]);
              setAppMode('initial');
              setPatientName(null);
              setCurrentSessionId(null);
              setSegmentIndex(0);
              clearWaveformData(); // Clear waveform data
              
              // Reset audio player state
              setLocalIsPlaying(false);
              setLocalCurrentTime(0);
              setLocalDuration(0);
              setIsButtonPressed(false);
              
              await incrementRecordingCounter();
              
              console.log('Recording discarded and new session started');
              
            } catch (error) {
              console.error('Error discarding recording:', error);
              Alert.alert('Error', 'Failed to discard recording. Please try again.');
            }
          },
        },
      ]
    );
  };

  // --- Patient Modal Handlers ---
  const handlePatientSave = (name: string) => {
    setPatientName(name);
    setPatientModalVisible(false);
  };

  // --- Photo Upload Handlers ---
  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Camera permission is needed.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedPhotos(prev => [...prev, result.assets[0].uri]);
    }
  };

  const handleChoosePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Gallery permission is needed.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const newPhotos = result.assets.map((a) => a.uri);
      setSelectedPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const handleRemovePhoto = (uri: string) => {
    setSelectedPhotos(prev => prev.filter(photo => photo !== uri));
  };

  const handleAddPhotos = () => {
    setUploadModalVisible(false);
    setSelectedPhotos([]);
  };

  const handleSendRecording = async () => {
    if (!recordedUri) {
      ErrorHandler.showErrorAlert({
        message: 'No recording to send',
      });
      return;
    }

    if (!user) {
      ErrorHandler.showErrorAlert({
        message: 'Please log in to send recordings',
        isAuthError: true,
      });
      return;
    }

    setIsSending(true);
    setUploadProgress(0);
    
    try {
      // Check authentication first
      const isAuthenticated = await audioRecordingService.checkAuthentication();
      if (!isAuthenticated) {
        ErrorHandler.showErrorAlert({
          message: 'Please log in again to send recordings',
          isAuthError: true,
        });
        return;
      }

      // Generate unique dictation ID
      const dictationId = audioRecordingService.generateDictationId();
      
      // Prepare recording data
      const recordingData = audioRecordingService.prepareRecordingData(
        recordedUri,
        totalRecordingDuration,
        dictationId,
        patientName || undefined
      );

      // Upload to backend with progress tracking
      const result = await audioRecordingService.uploadRecordingWithUserData(
        recordingData,
        (progress) => {
          setUploadProgress(progress);
          console.log(`Upload progress: ${progress}%`);
        }
      );
      
      ErrorHandler.showSuccessAlert(
        'Recording sent successfully!',
        () => handleStartNewRecording()
      );
      
      console.log('Recording uploaded successfully:', result);
    } catch (error: any) {
      console.error('Send recording error:', error);
      
      const appError = ErrorHandler.handleApiError(error);
      ErrorHandler.showErrorAlert(appError, () => handleSendRecording());
      
      ErrorHandler.logError(error, 'Send Recording');
    } finally {
      setIsSending(false);
      setUploadProgress(0);
    }
  };

  // --- Waveform Generation ---
  // const generateWaveform = () => {
  //   const heights = [15, 30, 10, 35, 20, 40, 15, 30, 10, 35, 20, 40, 15, 20];
  //   return heights.map((height, i) => (
  //     <View
  //       key={i}
  //       style={{
  //         width: 4,
  //         height,
  //         backgroundColor: "#00AEEF",
  //         marginHorizontal: 1,
  //         borderRadius: 2,
  //       }}
  //     />
  //   ));
  // };

  // --- Render Logic based on appMode ---
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{`Dict #${recordingCounter}`}</Text>
          <TouchableOpacity
            onPress={() => setPatientModalVisible(true)}
            style={styles.personAddButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="person-add-outline" size={24} color="#00AEEF" />
          </TouchableOpacity>
        </View>
        {patientName && (
          <View style={styles.patientRow}>
            <View style={styles.patientBadge}>
              <Ionicons name="person" size={16} color="#00AEEF" style={{ marginRight: 6 }} />
              <Text style={styles.patientName}>{patientName}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  const renderInitialScreen = () => (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.gradientBackground}>
        {renderHeader()}
        <View style={styles.content}>
          <TouchableOpacity
            onPress={() => setAppMode('recording')}
            style={styles.recordButton}
            activeOpacity={0.8}
          >
            <View style={styles.recordButtonInner}>
              <Ionicons name="mic" size={50} color="#fff" />
            </View>
          </TouchableOpacity>
          
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#00AEEF" />
              <Text style={styles.featureText}>High-quality audio recording</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#00AEEF" />
              <Text style={styles.featureText}>Automatic save to outbox</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#00AEEF" />
              <Text style={styles.featureText}>Patient assignment</Text>
            </View>
            {/* <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#00AEEF" />
              <Text style={styles.featureText}>Edit & append functionality</Text>
            </View> */}
          </View>
        </View>
      </View>
    </View>
  );

  const renderRecordingUI = () => (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.gradientBackground}>
        {renderHeader()}
        
        <View style={styles.recordingContainer}>
          <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
            onRecordingStart={handleRecordingStart}
            onRecordingStop={handleRecordingStop}
            onRecordingPause={handleRecordingPause}
            onRecordingResume={handleRecordingResume}
            isPaused={isRecordingPaused}
            onWaveformDataUpdate={handleWaveformDataUpdate}
            onRecorderReady={setAudioRecorder}
            isAppending={isAppending}
            previousDuration={totalRecordingDuration - currentSegmentDuration}
            onDurationUpdate={handleDurationUpdate}
          />
        </View>
      </View>
    </View>
  );

  const renderPlaybackUI = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.gradientBackground}>
        {renderHeader()}
        
        <View style={styles.playbackContainer}>
          <View style={styles.audioCard}>
            <View style={styles.audioHeader}>
              <Ionicons name="musical-notes" size={24} color="#00AEEF" />
              <Text style={styles.audioTitle}>Recording Preview</Text>
              {recordedSegments.length > 1 && (
                <View style={styles.segmentsBadge}>
                  <Text style={styles.segmentsText}>{recordedSegments.length} segments</Text>
                </View>
              )}
            </View>
            
            {(isGeneratingWaveform || isConcatenating) && (
              <View style={styles.waveformLoadingContainer}>
                <Text style={styles.waveformLoadingText}>
                  {isConcatenating ? 'Merging recordings...' : 'Generating waveform...'}
                </Text>
              </View>
            )}
            
            {recordedUri && !isGeneratingWaveform && !isConcatenating && (
              <View style={styles.audioPlayerContainer}>
                <PlaybackWaveform
                  ref={waveformRef}
                  audioPath={recordedUri}
                  isPlaying={localIsPlaying}
                  currentTime={localCurrentTime}
                  duration={totalRecordingDuration}
                  onSeek={handleSeek}
                  onPlayerStateChange={handlePlayerStateChange}
                  onPanStateChange={handlePanStateChange}
                />
                
                {/* Play/Pause Button - exactly like AudioCard */}
                <TouchableOpacity
                  onPress={handlePlayPause}
                  style={[
                    styles.playButton,
                    { backgroundColor: (localIsPlaying || isButtonPressed) ? '#00AEEF' : '#E5E7EB' },
                    isButtonPressed && styles.playButtonPressed
                  ]}
                  activeOpacity={0.7}
                >
                  {(localIsPlaying || isButtonPressed) ? (
                    <View style={styles.pauseIcon}>
                      <View style={styles.pauseBar} />
                      <View style={styles.pauseBar} />
                    </View>
                  ) : (
                    <Ionicons name="play" size={20} color="#666" />
                  )}
                </TouchableOpacity>
                
                {/* Edit/Resume Button */}
                {/* <TouchableOpacity
                  style={styles.editResumeButton}
                  onPress={handleEditResume}
                  activeOpacity={0.8}
                >
                  <View style={styles.editResumeButtonContent}>
                    <Ionicons name="mic" size={24} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.editResumeButtonText}>Edit & Append</Text>
                  </View>
                  <Text style={styles.editResumeButtonSubtext}>Add more audio to this recording</Text>
                </TouchableOpacity> */}
              </View>
            )}
          </View>
          
          <View style={styles.actionsCard}>
            <View style={styles.actionRow}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleDiscardRecording}
              >
                <View style={styles.actionIconContainer}>
                  <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
                </View>
                <Text style={styles.actionText}>Discard</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, isSending && styles.actionButtonDisabled]}
                onPress={handleSendRecording}
                disabled={isSending}
              >
                <View style={styles.actionIconContainer}>
                  {isSending ? (
                    <ActivityIndicator size="small" color="#00AEEF" />
                  ) : (
                    <Ionicons name="arrow-up" size={24} color="#00AEEF" />
                  )}
                </View>
                <Text style={styles.actionText}>
                  {isSending ? `Sending... ${uploadProgress}%` : 'Send'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <View style={styles.actionIconContainer}>
                  <Ionicons name="copy-outline" size={24} color="#00AEEF" />
                </View>
                <Text style={styles.actionText}>Draft</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setUploadModalVisible(true)}
              >
                <View style={styles.actionIconContainer}>
                  <Ionicons name="camera-outline" size={24} color="#00AEEF" />
                </View>
                <Text style={styles.actionText}>Upload</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.newRecordingButton}
            onPress={handleStartNewRecording}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle" size={24} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.newRecordingText}>New Recording</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {appMode === 'initial' && renderInitialScreen()}
      {appMode === 'recording' && renderRecordingUI()}
      {appMode === 'playback' && renderPlaybackUI()}
      <PhotoUploadModal
        visible={uploadModalVisible}
        onClose={() => setUploadModalVisible(false)}
        onTakePhoto={handleTakePhoto}
        onChoosePhoto={handleChoosePhoto}
        selectedPhotos={selectedPhotos}
        onRemovePhoto={handleRemovePhoto}
        onAdd={handleAddPhotos}
      />
      <PatientAddModal
        visible={patientModalVisible}
        onClose={() => setPatientModalVisible(false)}
        onSave={handlePatientSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  gradientBackground: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  headerContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { 
    fontSize: 20, 
    fontWeight: "700", 
    color: "#1e293b",
    letterSpacing: -0.5,
  },
  personAddButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientRow: {
    marginTop: 8,
  },
  patientBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  patientName: {
    fontSize: 12,
    color: '#00AEEF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  recordButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#00AEEF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    shadowColor: "#00AEEF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  recordButtonInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#00AEEF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  featuresContainer: {
    width: '100%',
    maxWidth: 280,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  featureText: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 10,
    fontWeight: '500',
  },
  recordingContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  playbackContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  audioCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden', // Prevent content overflow
  },
  audioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  audioTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 12,
    flex: 1,
  },
  segmentsBadge: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  segmentsText: {
    fontSize: 12,
    color: '#00AEEF',
    fontWeight: '600',
  },
  waveformLoadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  waveformLoadingText: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
  },
  actionsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 12,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: { 
    alignItems: "center",
    flex: 1,
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: { 
    color: "#64748b", 
    fontSize: 12, 
    fontWeight: '500',
  },
  newRecordingButton: {
    backgroundColor: '#00AEEF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#00AEEF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  newRecordingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  audioPlayerContainer: {
    flex: 1,
    paddingVertical: 20,
  },
  editResumeButton: {
    backgroundColor: '#00AEEF',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: "#00AEEF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  editResumeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  editResumeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  editResumeButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: 'center',
    marginTop: 16,
  },
  playButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  pauseIcon: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  pauseBar: {
    width: 3,
    height: 16,
    backgroundColor: "#fff",
    marginHorizontal: 1,
  },
  actionButtonDisabled: {
    opacity: 0.7,
  },
});
