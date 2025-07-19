import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { WaveformData } from '../services/audioService';

export interface Recording {
  id: string;
  title: string;
  filename: string;
  uri: string;
  duration: number;
  dateRecorded: string;
  timeRecorded: string;
  waveformData?: WaveformData[];
  patientName?: string;
}

interface OutboxContextType {
  recordings: Recording[];
  isLoading: boolean;
  getRecordingsByDate: () => Record<string, Recording[]>;
  addRecording: (recording: Omit<Recording, 'id'>) => Promise<void>;
  deleteRecording: (id: string) => Promise<void>;
  updateRecording: (id: string, updates: Partial<Recording>) => Promise<void>;
  
}

const OutboxContext = createContext<OutboxContextType | undefined>(undefined);

export const useOutboxContext = () => {
  const context = useContext(OutboxContext);
  if (!context) {
    throw new Error('useOutboxContext must be used within an OutboxProvider');
  }
  return context;
};

export const OutboxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load recordings from storage on mount
  useEffect(() => {
    loadRecordings();
  }, []);

  const loadRecordings = async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem('recordings');
      if (stored) {
        const loadedRecordings = JSON.parse(stored);
        
        // Validate that all audio files still exist
        const validatedRecordings = await validateRecordings(loadedRecordings);
        
        // If some recordings were invalid, save the cleaned list
        if (validatedRecordings.length !== loadedRecordings.length) {
          console.log(`🧹 Cleaned up ${loadedRecordings.length - validatedRecordings.length} invalid recordings`);
          await saveRecordings(validatedRecordings);
        }
        
        setRecordings(validatedRecordings);
      }
    } catch (error) {
      console.error('Error loading recordings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateRecordings = async (recordingsToValidate: Recording[]): Promise<Recording[]> => {
    const validRecordings: Recording[] = [];
    
    for (const recording of recordingsToValidate) {
      try {
        if (recording.uri) {
          const fileInfo = await FileSystem.getInfoAsync(recording.uri);
          if (fileInfo.exists && 'size' in fileInfo && fileInfo.size > 0) {
            validRecordings.push(recording);
          } else {
            console.log(`🗑️ Removing recording with missing file: ${recording.title} (${recording.uri})`);
          }
        } else {
          console.log(`🗑️ Removing recording without URI: ${recording.title}`);
        }
      } catch (error) {
        console.error(`❌ Error validating recording ${recording.title}:`, error);
        // Don't include recordings that can't be validated
      }
    }
    
    return validRecordings;
  };

  const saveRecordings = async (newRecordings: Recording[]) => {
    try {
      await AsyncStorage.setItem('recordings', JSON.stringify(newRecordings));
    } catch (error) {
      console.error('Error saving recordings:', error);
    }
  };

  const getRecordingsByDate = () => {
    const grouped: Record<string, Recording[]> = {};
    
    recordings.forEach(recording => {
      const date = recording.dateRecorded;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(recording);
    });

    // Sort dates and recordings within each date
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => b.timeRecorded.localeCompare(a.timeRecorded));
    });

    return grouped;
  };

  const addRecording = async (recording: Omit<Recording, 'id'>) => {
    const newRecording: Recording = {
      ...recording,
      id: Date.now().toString(),
    };
    
    const updatedRecordings = [newRecording, ...recordings];
    setRecordings(updatedRecordings);
    await saveRecordings(updatedRecordings);
  };

  const deleteRecording = async (id: string) => {
    const updatedRecordings = recordings.filter(r => r.id !== id);
    setRecordings(updatedRecordings);
    await saveRecordings(updatedRecordings);
  };

  const updateRecording = async (id: string, updates: Partial<Recording>) => {
    const updatedRecordings = recordings.map(r => 
      r.id === id ? { ...r, ...updates } : r
    );
    setRecordings(updatedRecordings);
    await saveRecordings(updatedRecordings);
  };

  

  const value: OutboxContextType = {
    recordings,
    isLoading,
    getRecordingsByDate,
    addRecording,
    deleteRecording,
    updateRecording,
    
  };

  return (
    <OutboxContext.Provider value={value}>
      {children}
    </OutboxContext.Provider>
  );
}; 