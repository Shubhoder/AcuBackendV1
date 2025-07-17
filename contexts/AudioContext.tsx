import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WaveformData {
  amplitude: number;
  timestamp: number;
}

interface RecordingState {
  resumeMode: boolean;
  previousWaveformSamples: number[];
}

interface AudioContextType {
  addWaveformSample: (height: number) => void;
  currentRecording: RecordingState;
  getAllWaveformSamples: () => number[];
  setResumeMode: (resumeMode: boolean) => void;
  clearWaveformData: () => void;
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
  children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [waveformSamples, setWaveformSamples] = useState<number[]>([]);
  const [currentRecording, setCurrentRecording] = useState<RecordingState>({
    resumeMode: false,
    previousWaveformSamples: [],
  });

  const addWaveformSample = (height: number) => {
    setWaveformSamples(prev => [...prev, height]);
  };

  const getAllWaveformSamples = () => {
    return waveformSamples;
  };

  const setResumeMode = (resumeMode: boolean) => {
    setCurrentRecording(prev => ({
      ...prev,
      resumeMode,
      previousWaveformSamples: resumeMode ? [...waveformSamples] : [],
    }));
  };

  const clearWaveformData = () => {
    setWaveformSamples([]);
    setCurrentRecording({
      resumeMode: false,
      previousWaveformSamples: [],
    });
  };

  const value: AudioContextType = {
    addWaveformSample,
    currentRecording,
    getAllWaveformSamples,
    setResumeMode,
    clearWaveformData,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}; 