import { useState, useRef, useCallback } from 'react';
import { Recording } from '../contexts/OutboxContext';

export const useOutboxPlayer = (recordings: Recording[]) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const isPlaying = useCallback((id: string) => {
    return playingId === id;
  }, [playingId]);

  const playRecording = useCallback(async (id: string) => {
    try {
      const recording = recordings.find(r => r.id === id);
      if (!recording) return;

      // For now, just set the playing state
      // In a real implementation, you would use expo-audio here
      setPlayingId(id);
      setDuration(recording.duration);
      setCurrentTime(0);
      
      console.log('Playing recording:', recording.title);
    } catch (error) {
      console.error('Error playing recording:', error);
    }
  }, [recordings]);

  const pauseRecording = useCallback(async (id: string) => {
    try {
      if (isPlaying(id)) {
        setPlayingId(null);
        console.log('Paused recording:', id);
      }
    } catch (error) {
      console.error('Error pausing recording:', error);
    }
  }, [isPlaying]);

  const stopAllRecordings = useCallback(async () => {
    try {
      setPlayingId(null);
      setCurrentTime(0);
      setDuration(0);
      console.log('Stopped all recordings');
    } catch (error) {
      console.error('Error stopping recordings:', error);
    }
  }, []);

  return {
    isPlaying,
    playRecording,
    pauseRecording,
    stopAllRecordings,
    currentTime,
    duration,
  };
}; 