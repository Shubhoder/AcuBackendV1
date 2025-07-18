import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WaveformData {
  amplitude: number;
  timestamp: number;
}

interface RecordingState {
  resumeMode: boolean;
  previousWaveformSamples: number[];
}

interface WaveformContextType {
  addWaveformSample: (height: number) => void;
  currentRecording: RecordingState;
  getAllWaveformSamples: () => number[];
  setResumeMode: (resumeMode: boolean) => void;
  clearWaveformData: () => void;
}

const WaveformContext = createContext<WaveformContextType | undefined>(undefined);

export const useWaveformContext = () => {
  const context = useContext(WaveformContext);
  if (!context) {
    throw new Error('useWaveformContext must be used within a WaveformProvider');
  }
  return context;
};

interface WaveformProviderProps {
  children: ReactNode;
}

export const WaveformProvider: React.FC<WaveformProviderProps> = ({ children }) => {
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

  const value: WaveformContextType = {
    addWaveformSample,
    currentRecording,
    getAllWaveformSamples,
    setResumeMode,
    clearWaveformData,
  };

  return (
    <WaveformContext.Provider value={value}>
      {children}
    </WaveformContext.Provider>
  );
}; 