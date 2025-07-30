# Backend API Documentation - Acu Dictation App

## Overview
This document provides a comprehensive overview of all backend APIs and endpoints integrated into the Acu Dictation App. The backend is deployed and actively used by the frontend application.

## Base URLs

### Production Environment
- **Primary Base URL**: `https://wcrecordreviews.com/api/`
- **Alternative Base URL**: `https://accutrans-uat.azurewebsites.net/api/`

### Development Environment
- **Development Base URL**: `https://accutrans-uat.azurewebsites.net/api/`

## API Version
All endpoints use version `v1`

## Authentication
The application uses JWT (JSON Web Token) authentication with Bearer token format:
```
Authorization: Bearer <token>
```

## API Endpoints

### 1. Authentication Endpoints

#### 1.1 User Login
- **Endpoint**: `v1/accounts/auth`
- **Method**: `POST`
- **Base URL**: `https://wcrecordreviews.com/api/`
- **Full URL**: `https://wcrecordreviews.com/api/v1/accounts/auth`
- **Headers**:
  ```json
  {
    "Accept": "application/json",
    "Content-Type": "application/json"
  }
  ```
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "userpassword"
  }
  ```
- **Response**:
  ```json
  {
    "data": {
      "message": "Data added successfully",
      "result": {
        "token": "jwt_token_here",
        "user": {
          "userID": "user_id",
          "emailID": "user@example.com",
          "name": "User Name"
        }
      }
    }
  }
  ```

#### 1.2 User Sign Up
- **Endpoint**: `v1/dictation-app/sign-up`
- **Method**: `POST`
- **Base URL**: `https://wcrecordreviews.com/api/`
- **Full URL**: `https://wcrecordreviews.com/api/v1/dictation-app/sign-up`
- **Headers**:
  ```json
  {
    "Accept": "application/json",
    "Content-Type": "multipart/form-data"
  }
  ```
- **Request Body** (FormData):
  ```json
  {
    "email": "user@example.com",
    "password": "userpassword",
    "name": "User Name",
    "profileImage": "file_upload" // Optional
  }
  ```
- **Response**:
  ```json
  {
    "data": {
      "message": "Data added successfully",
      "result": {
        "userID": "user_id",
        "emailID": "user@example.com",
        "name": "User Name"
      }
    }
  }
  ```

#### 1.3 Change Password
- **Endpoint**: `v1/accounts/change-password/`
- **Method**: `PATCH`
- **Base URL**: `https://wcrecordreviews.com/api/`
- **Full URL**: `https://wcrecordreviews.com/api/v1/accounts/change-password/`
- **Headers**:
  ```json
  {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": "Bearer <token>"
  }
  ```
- **Request Body**:
  ```json
  {
    "oldPassword": "oldpassword",
    "newPassword": "newpassword"
  }
  ```

#### 1.4 Delete Account
- **Endpoint**: `v1/dictation-app/delete-account/{userID}`
- **Method**: `GET`
- **Base URL**: `https://wcrecordreviews.com/api/`
- **Full URL**: `https://wcrecordreviews.com/api/v1/dictation-app/delete-account/{userID}`
- **Headers**:
  ```json
  {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": "Bearer <token>"
  }
  ```

### 2. User Management Endpoints

#### 2.1 Get User Prefix/Profile
- **Endpoint**: `v1/user-prefix/{userID}`
- **Method**: `GET`
- **Base URL**: `https://wcrecordreviews.com/api/`
- **Full URL**: `https://wcrecordreviews.com/api/v1/user-prefix/{userID}`
- **Headers**:
  ```json
  {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": "Bearer <token>"
  }
  ```

### 3. Audio Recording Endpoints

#### 3.1 Upload Audio Recording
- **Endpoint**: `v1/audio-recording/post-recording`
- **Method**: `POST`
- **Base URL**: `https://wcrecordreviews.com/api/`
- **Full URL**: `https://wcrecordreviews.com/api/v1/audio-recording/post-recording`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <token>",
    "Content-Type": "multipart/form-data"
  }
  ```
- **Request Body** (FormData):
  ```json
  {
    "file": "audio_file.m4a",
    "DoctorId": "user_id",
    "EmailId": "user@example.com",
    "Duration": "recording_duration_in_seconds",
    "AcuTrans_FileName": {
      "uri": "file_path",
      "type": "audio/mpeg",
      "name": "dictation_id.m4a"
    },
    "PatientName": "patient_name"
  }
  ```
- **Response**:
  ```json
  {
    "status": 200,
    "message": "Recording uploaded successfully"
  }
  ```

## API Service Implementation

### Core API Service Structure

```typescript
// API Configuration
export const API_CONFIG = {
  baseUrl: 'https://wcrecordreviews.com/api/',
  version: 'v1',
  endpoints: {
    login: 'v1/accounts/auth',
    signUp: 'v1/dictation-app/sign-up',
    recordingPost: 'v1/audio-recording/post-recording',
    userPrefix: 'v1/user-prefix/',
    changePass: 'v1/accounts/change-password/',
    deleteAcc: 'v1/dictation-app/delete-account',
  }
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
};

// Response Messages
export const API_MESSAGES = {
  post: {
    success: 'Data added successfully',
    fail: 'Failed to add data',
    sameEntry: 'Same entry not allowed',
  },
  get: {
    success: 'Data fetched successfully',
    fail: 'Failed to fetch data',
    empty: 'Database empty',
    enough: 'Not Enough Data to Fetch',
  },
  put: {
    success: 'Data edited successfully',
    fail: 'Failed to edit data',
  },
  patch: {
    success: 'Data edited successfully',
    fail: 'Failed to edit data',
  },
  delete: {
    success: 'Data deleted successfully',
    fail: 'Failed to delete data',
  },
  error: 'Error',
  none: 'No such data',
};
```

### Reusable API Service Class

```typescript
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class ApiService {
  private apiClient: AxiosInstance;
  private baseUrl: string;
  private version: string;

  constructor(baseUrl: string, version: string = 'v1') {
    this.baseUrl = baseUrl;
    this.version = version;
    
    this.apiClient = axios.create({
      baseURL: `${baseUrl}${version}/`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.apiClient.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        const message = error.response?.data?.message || 'Something went wrong. Please try again.';
        return Promise.reject({ message });
      }
    );
  }

  // Generic HTTP methods
  async get(endpoint: string, params?: any): Promise<AxiosResponse> {
    return this.apiClient.get(endpoint, { params });
  }

  async post(endpoint: string, data?: any, headers?: any): Promise<AxiosResponse> {
    return this.apiClient.post(endpoint, data, { headers });
  }

  async put(endpoint: string, data?: any, headers?: any): Promise<AxiosResponse> {
    return this.apiClient.put(endpoint, data, { headers });
  }

  async patch(endpoint: string, data?: any, headers?: any): Promise<AxiosResponse> {
    return this.apiClient.patch(endpoint, data, { headers });
  }

  async delete(endpoint: string, headers?: any): Promise<AxiosResponse> {
    return this.apiClient.delete(endpoint, { headers });
  }

  // File upload method
  async uploadFile(endpoint: string, formData: FormData, headers?: any): Promise<AxiosResponse> {
    return this.apiClient.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...headers,
      },
    });
  }
}

// Usage example
const apiService = new ApiService('https://wcrecordreviews.com/api/');
```

### Authentication Service

```typescript
export class AuthService {
  private apiService: ApiService;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  async login(email: string, password: string) {
    try {
      const response = await this.apiService.post('accounts/auth', {
        email,
        password,
      });

      if (response.data?.data?.message === API_MESSAGES.post.success) {
        const result = response.data.data.result;
        await AsyncStorage.setItem('authToken', result.token);
        return result;
      }
      throw new Error('Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async signUp(userData: any) {
    try {
      const formData = new FormData();
      Object.keys(userData).forEach(key => {
        formData.append(key, userData[key]);
      });

      const response = await this.apiService.post('dictation-app/sign-up', formData, {
        'Content-Type': 'multipart/form-data'
      });

      if (response.data?.data?.message === API_MESSAGES.post.success) {
        return response.data.data.result;
      }
      throw new Error('Sign up failed');
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async changePassword(oldPassword: string, newPassword: string) {
    try {
      const response = await this.apiService.patch('accounts/change-password/', {
        oldPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  async deleteAccount(userID: string) {
    try {
      const response = await this.apiService.get(`dictation-app/delete-account/${userID}`);
      return response.data;
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  }

  async logout() {
    await AsyncStorage.removeItem('authToken');
  }
}
```

### Audio Recording Service

```typescript
export class AudioRecordingService {
  private apiService: ApiService;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  async uploadRecording(recordingData: {
    file: any;
    doctorId: string;
    emailId: string;
    duration: number;
    patientName: string;
    dictationId: string;
  }) {
    try {
      const formData = new FormData();
      
      formData.append('file', {
        uri: recordingData.file.uri,
        type: 'audio/mpeg',
        name: `${recordingData.dictationId}.m4a`,
      });
      
      formData.append('DoctorId', recordingData.doctorId);
      formData.append('EmailId', recordingData.emailId);
      formData.append('Duration', recordingData.duration.toString());
      formData.append('PatientName', recordingData.patientName);
      formData.append('AcuTrans_FileName', JSON.stringify({
        uri: recordingData.file.uri,
        type: 'audio/mpeg',
        name: `${recordingData.dictationId}.m4a`,
      }));

      const response = await this.apiService.uploadFile(
        'audio-recording/post-recording',
        formData
      );

      return response.data;
    } catch (error) {
      console.error('Upload recording error:', error);
      throw error;
    }
  }
}
```

## Error Handling

### Standard Error Response Format
```typescript
interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

// Error handling utility
export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    return {
      message: error.response.data?.message || 'Server error',
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    return {
      message: 'Network error - no response received',
    };
  } else {
    return {
      message: error.message || 'Unknown error occurred',
    };
  }
};
```

## Network Configuration

### Axios Configuration
```typescript
import axios from 'axios';

const axiosConfig = {
  timeout: 30000, // 30 seconds
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
};

// Create axios instance
const apiClient = axios.create(axiosConfig);

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';
    return Promise.reject({ message });
  }
);
```

## Usage Examples

### Complete Implementation Example
```typescript
// Initialize services
const apiService = new ApiService('https://wcrecordreviews.com/api/');
const authService = new AuthService(apiService);
const recordingService = new AudioRecordingService(apiService);

// Login example
try {
  const user = await authService.login('user@example.com', 'password');
  console.log('Login successful:', user);
} catch (error) {
  console.error('Login failed:', error.message);
}

// Upload recording example
try {
  const uploadResult = await recordingService.uploadRecording({
    file: { uri: 'file://path/to/recording.m4a' },
    doctorId: 'user123',
    emailId: 'user@example.com',
    duration: 120,
    patientName: 'John Doe',
    dictationId: 'dict123',
  });
  console.log('Upload successful:', uploadResult);
} catch (error) {
  console.error('Upload failed:', error.message);
}
```

## Notes

1. **Token Management**: The application uses JWT tokens stored in AsyncStorage for authentication
2. **File Uploads**: Audio recordings are uploaded using multipart/form-data format
3. **Error Handling**: All API calls include comprehensive error handling
4. **Platform Compatibility**: The implementation supports both iOS and Android platforms
5. **Offline Support**: The app includes local storage (Realm database) for offline functionality
6. **Background Processing**: Includes outbox functionality for handling failed uploads

This documentation provides a complete reference for implementing the same backend functionality in other projects while maintaining the existing deployment integration. 