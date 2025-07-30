import { apiService, handleApiError } from './apiService';
import { authService } from './authService';
import * as FileSystem from 'expo-file-system';

// Audio recording upload interface
export interface AudioRecordingData {
  file: {
    uri: string;
    type: string;
    name: string;
  };
  doctorId: string;
  emailId: string;
  duration: number;
  patientName?: string;
  dictationId: string;
}

// Upload response interface
export interface UploadResponse {
  status: number;
  message: string;
}

// Upload progress callback
export type UploadProgressCallback = (progress: number) => void;

export class AudioRecordingService {
  private apiService = apiService;

  /**
   * Validate audio file before upload
   */
  private async validateAudioFile(fileUri: string): Promise<boolean> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      
      if (!fileInfo.exists) {
        throw new Error('Audio file does not exist');
      }
      
      if (fileInfo.size === 0) {
        throw new Error('Audio file is empty');
      }
      
      // Check if file size is reasonable (max 100MB)
      if (fileInfo.size > 100 * 1024 * 1024) {
        throw new Error('Audio file is too large (max 100MB)');
      }
      
      return true;
    } catch (error) {
      console.error('File validation error:', error);
      throw new Error(`Invalid audio file: ${error && typeof error === 'object' && 'message' in error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Upload audio recording to backend
   */
  async uploadRecording(
    recordingData: AudioRecordingData, 
    onProgress?: UploadProgressCallback
  ): Promise<UploadResponse> {
    try {
      // Validate the audio file first
      await this.validateAudioFile(recordingData.file.uri);
      
      const formData = new FormData();
      
      // Add the audio file
      formData.append('file', {
        uri: recordingData.file.uri,
        type: recordingData.file.type || 'audio/mpeg',
        name: recordingData.file.name,
      } as any);
      
      // Add metadata
      formData.append('DoctorId', recordingData.doctorId);
      formData.append('EmailId', recordingData.emailId);
      formData.append('Duration', recordingData.duration.toString());
      
      // Add patient name if provided
      if (recordingData.patientName) {
        formData.append('PatientName', recordingData.patientName);
      }
      
      // Add AcuTrans filename metadata
      formData.append('AcuTrans_FileName', JSON.stringify({
        uri: recordingData.file.uri,
        type: recordingData.file.type || 'audio/mpeg',
        name: `${recordingData.dictationId}.m4a`,
      }));

      const response = await this.apiService.uploadFile(
        'audio-recording/post-recording',
        formData,
        undefined,
        onProgress
      );

      return response.data;
    } catch (error) {
      console.error('Upload recording error:', error);
      throw handleApiError(error);
    }
  }

  /**
   * Upload recording with automatic user data retrieval
   */
  async uploadRecordingWithUserData(
    recordingData: Omit<AudioRecordingData, 'doctorId' | 'emailId'>,
    onProgress?: UploadProgressCallback
  ): Promise<UploadResponse> {
    try {
      // Get current user data
      const user = await authService.getStoredUser();
      if (!user) {
        throw new Error('User not authenticated. Please log in again.');
      }

      const fullRecordingData: AudioRecordingData = {
        ...recordingData,
        doctorId: user.userID,
        emailId: user.emailID,
      };

      return await this.uploadRecording(fullRecordingData, onProgress);
    } catch (error) {
      console.error('Upload recording with user data error:', error);
      throw handleApiError(error);
    }
  }

  /**
   * Prepare recording data for upload
   */
  prepareRecordingData(
    fileUri: string,
    duration: number,
    dictationId: string,
    patientName?: string
  ): Omit<AudioRecordingData, 'doctorId' | 'emailId'> {
    return {
      file: {
        uri: fileUri,
        type: 'audio/mpeg',
        name: `${dictationId}.m4a`,
      },
      duration,
      patientName,
      dictationId,
    };
  }

  /**
   * Generate unique dictation ID
   */
  generateDictationId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `dict_${timestamp}_${random}`;
  }

  /**
   * Check if user is authenticated before upload
   */
  async checkAuthentication(): Promise<boolean> {
    try {
      return await authService.isAuthenticated();
    } catch (error) {
      console.error('Authentication check error:', error);
      return false;
    }
  }

  /**
   * Get file size in human readable format
   */
  async getFileSize(fileUri: string): Promise<string> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        return '0 B';
      }
      
      const bytes = fileInfo.size;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    } catch (error) {
      console.error('Get file size error:', error);
      return 'Unknown';
    }
  }
}

// Create default audio recording service instance
export const audioRecordingService = new AudioRecordingService(); 