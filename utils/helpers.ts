import * as FileSystem from 'expo-file-system';

/**
 * Utility functions for debugging and validation
 */

export const debugAudioFile = async (uri: string): Promise<void> => {
  try {
    console.log('🔍 Debugging audio file:', uri);
    
    const fileInfo = await FileSystem.getInfoAsync(uri);
    console.log('📁 File info:', fileInfo);
    
    if (fileInfo.exists) {
      const fileSize = 'size' in fileInfo ? (fileInfo.size || 0) : 0;
      console.log('📏 File size:', fileSize, 'bytes');
      
      if (fileSize === 0) {
        console.error('❌ File exists but is empty');
      } else if (fileSize < 1000) {
        console.warn('⚠️ File is very small, may be corrupted');
      } else {
        console.log('✅ File appears to be valid');
      }
    } else {
      console.error('❌ File does not exist');
    }
  } catch (error) {
    console.error('❌ Error debugging file:', error);
  }
};

export const validateAudioFile = async (uri: string): Promise<boolean> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    const isValid = fileInfo.exists && 'size' in fileInfo && (fileInfo.size || 0) > 1000; // At least 1KB
    
    if (!isValid) {
      console.error('❌ Audio file validation failed:', {
        exists: fileInfo.exists,
        size: 'size' in fileInfo ? fileInfo.size : 'unknown',
        uri
      });
    }
    
    return isValid;
  } catch (error) {
    console.error('❌ Error validating audio file:', error);
    return false;
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}; 