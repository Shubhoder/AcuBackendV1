import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { Recording } from '../contexts/OutboxContext';

export const useAudioActions = (
  recordings: Recording[],
  deleteRecording: (id: string) => Promise<void>,
  stopAllRecordings: () => Promise<void>
) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleToggleSelection = useCallback((id: string) => {
    setSelectedItemId(prev => prev === id ? null : id);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItemId(null);
  }, []);

  const handleDelete = useCallback((id: string) => {
    Alert.alert(
      'Delete Recording',
      'Are you sure you want to delete this recording?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await stopAllRecordings();
              await deleteRecording(id);
              setSelectedItemId(null);
            } catch (error) {
              console.error('Error deleting recording:', error);
              Alert.alert('Error', 'Failed to delete recording');
            }
          },
        },
      ]
    );
  }, [deleteRecording, stopAllRecordings]);

  const handleSend = useCallback((id: string) => {
    const recording = recordings.find(r => r.id === id);
    if (recording) {
      Alert.alert(
        'Send Recording',
        `Send "${recording.title}" to recipient?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Send',
            onPress: () => {
              // TODO: Implement send functionality
              console.log('Sending recording:', id);
              Alert.alert('Success', 'Recording sent successfully!');
            },
          },
        ]
      );
    }
  }, [recordings]);

  const handleShare = useCallback((id: string) => {
    const recording = recordings.find(r => r.id === id);
    if (recording) {
      Alert.alert(
        'Share Recording',
        `Share "${recording.title}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Share',
            onPress: () => {
              // TODO: Implement share functionality
              console.log('Sharing recording:', id);
              Alert.alert('Success', 'Recording shared successfully!');
            },
          },
        ]
      );
    }
  }, [recordings]);

  return {
    selectedItemId,
    handleToggleSelection,
    handleShare,
    handleSend,
    handleDelete,
    clearSelection,
  };
}; 