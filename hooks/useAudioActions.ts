import { useCallback } from 'react';
import { useAudioContext } from '../contexts/AudioContext';

export const useAudioActions = () => {
  const { playAudio, pauseAudio, seekTo, stopAudio, currentAudioId, isPlaying } = useAudioContext();

  const handlePlayPause = useCallback((audioId: string, uri: string) => {
    if (currentAudioId === audioId && isPlaying) {
      pauseAudio();
    } else {
      playAudio(audioId, uri);
    }
  }, [currentAudioId, isPlaying, playAudio, pauseAudio]);

  const handleSeek = useCallback((time: number) => {
    seekTo(time);
  }, [seekTo]);

  const handleStop = useCallback(() => {
    stopAudio();
  }, [stopAudio]);

  return {
    handlePlayPause,
    handleSeek,
    handleStop,
    currentAudioId,
    isPlaying,
  };
}; 