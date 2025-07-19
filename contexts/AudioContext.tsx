import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

interface AudioContextType {
  currentAudioId: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playAudio: (audioId: string, uri: string) => void;
  pauseAudio: () => void;
  seekTo: (time: number) => void;
  stopAudio: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioContext must be used within an AudioProvider');
  }
  return context;
};

interface AudioProviderProps {
  children: React.ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);
  const [currentUri, setCurrentUri] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Create player with current URI
  const player = useAudioPlayer(currentUri || '');
  const status = useAudioPlayerStatus(player);
  
  // Refs for better state management
  const playerRef = useRef(player);
  const isSeekingRef = useRef(false);
  const lastSeekTimeRef = useRef(0);
  const hasEndedRef = useRef(false);

  // Update player ref when player changes
  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  // Initialize audio mode once
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        await import('expo-audio').then(({ setAudioModeAsync }) => 
          setAudioModeAsync({
            playsInSilentMode: true,
            allowsRecording: false,
          })
        );
        setIsInitialized(true);
        console.log('✅ Audio mode initialized');
      } catch (error) {
        console.error('❌ Failed to initialize audio mode:', error);
      }
    };
    
    initializeAudio();
  }, []);

  // Handle player status updates - this is the main synchronization point
  useEffect(() => {
    if (!status || !currentUri || !isInitialized) return;

    try {
      const newCurrentTime = status.currentTime || 0;
      const newDuration = status.duration || 0;
      const newIsPlaying = status.playing || false;
      
      // Only update if not currently seeking and values have changed
      if (!isSeekingRef.current) {
        // Update current time with small threshold to prevent jitter
        if (Math.abs(newCurrentTime - currentTime) > 0.1) {
          setCurrentTime(newCurrentTime);
          lastSeekTimeRef.current = newCurrentTime;
        }
        
        // Update duration if it has changed significantly
        if (Math.abs(newDuration - duration) > 0.5) {
          setDuration(newDuration);
        }
      }
      
      // Update playing state
      if (newIsPlaying !== isPlaying) {
        setIsPlaying(newIsPlaying);
      }
      
      // Handle playback completion
      if (status.didJustFinish && !hasEndedRef.current) {
        console.log('🏁 Playback completed');
        hasEndedRef.current = true;
        setIsPlaying(false);
        setCurrentTime(0);
        lastSeekTimeRef.current = 0;
      }
      
      // Reset ended flag when starting new playback
      if (newIsPlaying && hasEndedRef.current) {
        hasEndedRef.current = false;
      }
      
    } catch (error) {
      console.error('❌ Error updating audio status:', error);
    }
  }, [status?.currentTime, status?.duration, status?.playing, status?.didJustFinish, currentUri, isInitialized, currentTime, duration, isPlaying]);

  // Reset state when URI changes
  useEffect(() => {
    if (!currentUri) {
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      hasEndedRef.current = false;
      isSeekingRef.current = false;
      lastSeekTimeRef.current = 0;
    }
  }, [currentUri]);

  const playAudio = useCallback(async (audioId: string, uri: string) => {
    try {
      if (!uri || !isInitialized) {
        console.error('❌ No URI provided or audio not initialized');
        return;
      }

      console.log('🎵 Attempting to play audio:', audioId, 'URI:', uri);

      // If same audio is already playing, just resume
      if (currentAudioId === audioId && currentUri === uri) {
        if (!isPlaying && playerRef.current) {
          console.log('▶️ Resuming current audio');
          hasEndedRef.current = false;
          await playerRef.current.play();
          setIsPlaying(true);
        }
        return;
      }
      
      // If different audio, stop current and start new
      if (playerRef.current && currentAudioId !== audioId && isPlaying) {
        console.log('⏹️ Stopping current audio to play new one');
        await playerRef.current.pause();
        setIsPlaying(false);
      }
      
      // Update state for new audio
      setCurrentAudioId(audioId);
      setCurrentUri(uri);
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      hasEndedRef.current = false;
      isSeekingRef.current = false;
      lastSeekTimeRef.current = 0;
      
      console.log('🎵 Audio state updated for new URI');
      
      // Start playing the new audio after a short delay to allow player to initialize
      setTimeout(async () => {
        if (playerRef.current) {
          try {
            console.log('▶️ Starting playback of new audio');
            hasEndedRef.current = false;
            await playerRef.current.play();
            setIsPlaying(true);
          } catch (error) {
            console.error('❌ Failed to start playback:', error);
            // Reset state on error
            setIsPlaying(false);
            setCurrentAudioId(null);
            setCurrentUri(null);
          }
        }
      }, 100);
      
    } catch (error) {
      console.error('❌ Failed to play audio:', error);
      // Reset state on error
      setIsPlaying(false);
      setCurrentAudioId(null);
      setCurrentUri(null);
    }
  }, [currentAudioId, currentUri, isPlaying, isInitialized]);

  const pauseAudio = useCallback(async () => {
    if (playerRef.current && currentUri && isInitialized) {
      try {
        console.log('⏸️ Pausing audio');
        await playerRef.current.pause();
        setIsPlaying(false);
      } catch (error) {
        console.error('❌ Failed to pause audio:', error);
      }
    }
  }, [currentUri, isInitialized]);

  const seekTo = useCallback(async (time: number) => {
    if (playerRef.current && currentUri && isInitialized) {
      try {
        const clampedTime = Math.max(0, Math.min(duration || 999999, time));
        console.log('⏰ Seeking to:', clampedTime.toFixed(2));
        
        // Set seeking flag to prevent status updates from interfering
        isSeekingRef.current = true;
        
        await playerRef.current.seekTo(clampedTime);
        setCurrentTime(clampedTime);
        lastSeekTimeRef.current = clampedTime;
        
        // Reset ended flag when seeking
        if (hasEndedRef.current) {
          hasEndedRef.current = false;
        }
        
        // Clear seeking flag after a short delay
        setTimeout(() => {
          isSeekingRef.current = false;
        }, 100);
        
      } catch (error) {
        console.error('❌ Failed to seek audio:', error);
        isSeekingRef.current = false;
      }
    }
  }, [currentUri, duration, isInitialized]);

  const stopAudio = useCallback(async () => {
    if (playerRef.current && currentUri && isInitialized) {
      try {
        console.log('⏹️ Stopping audio');
        await playerRef.current.pause();
        setIsPlaying(false);
        setCurrentTime(0);
        setCurrentAudioId(null);
        setCurrentUri(null);
        hasEndedRef.current = false;
        isSeekingRef.current = false;
        lastSeekTimeRef.current = 0;
      } catch (error) {
        console.error('❌ Failed to stop audio:', error);
      }
    }
  }, [currentUri, isInitialized]);

  const value = useMemo(() => ({
    currentAudioId,
    isPlaying,
    currentTime,
    duration,
    playAudio,
    pauseAudio,
    seekTo,
    stopAudio,
  }), [currentAudioId, isPlaying, currentTime, duration, playAudio, pauseAudio, seekTo, stopAudio]);

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}; 