import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkNetworkConnectivity } from '../utils/networkUtils';

// API Configuration
export const API_CONFIG = {
  baseUrl: 'https://wcrecordreviews.com/api/', // Using working URL
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

// Error handling interface
export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

// Error handling utility
export const handleApiError = (error: any): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    if (axiosError.response) {
      // Server responded with error status
      const status = axiosError.response.status;
      const data = axiosError.response.data as any;
      
      return {
        message: data?.message || data?.error || `Server error (${status})`,
        status,
        data,
      };
    } else if (axiosError.request) {
      // Request was made but no response received
      return {
        message: 'Network error - no response received. Please check your internet connection.',
      };
    } else {
      // Something else happened
      return {
        message: axiosError.message || 'Unknown error occurred',
      };
    }
  } else {
    // Non-axios error
    return {
      message: error.message || 'Unknown error occurred',
    };
  }
};

// Core API Service Class
export class ApiService {
  private apiClient: AxiosInstance;
  private baseUrl: string;
  private version: string;
  private retryCount = 0;
  private maxRetries = 2;

  constructor(baseUrl: string = API_CONFIG.baseUrl, version: string = API_CONFIG.version) {
    this.baseUrl = baseUrl;
    this.version = version;
    
    console.log('Initializing API Service with:', { baseUrl, version });
    
    this.apiClient = axios.create({
      baseURL: `${baseUrl}${version}/`,
      timeout: 30000, // 30 seconds
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token and check network
    this.apiClient.interceptors.request.use(
      async (config) => {
        try {
          // Check network connectivity first
          const networkState = await checkNetworkConnectivity();
          if (!networkState.isConnected || !networkState.isInternetReachable) {
            throw new Error('No internet connection. Please check your network settings.');
          }

          const token = await AsyncStorage.getItem('authToken');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.warn('Request interceptor error:', error);
          return Promise.reject(error);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.apiClient.interceptors.response.use(
      (response) => {
        // Reset retry count on successful response
        this.retryCount = 0;
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        
        // Handle 401 errors and retry with token refresh if needed
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          // Clear invalid token
          try {
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('userData');
          } catch (storageError) {
            console.warn('Failed to clear auth data:', storageError);
          }
          
          // Don't retry auth requests to avoid infinite loops
          if (!originalRequest.url?.includes('auth')) {
            return Promise.reject(handleApiError(error));
          }
        }
        
        // Handle network errors with retry logic
        if (!error.response && this.retryCount < this.maxRetries) {
          this.retryCount++;
          console.log(`Retrying request (${this.retryCount}/${this.maxRetries})`);
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * this.retryCount));
          
          return this.apiClient(originalRequest);
        }
        
        return Promise.reject(handleApiError(error));
      }
    );
  }

  // Generic HTTP methods with better error handling
  async get(endpoint: string, params?: any): Promise<AxiosResponse> {
    try {
      console.log(`GET ${endpoint}`, { params });
      const response = await this.apiClient.get(endpoint, { params });
      console.log(`GET ${endpoint} response:`, response.status, response.data);
      return response;
    } catch (error) {
      console.error(`GET ${endpoint} error:`, error);
      throw handleApiError(error);
    }
  }

  async post(endpoint: string, data?: any, headers?: any): Promise<AxiosResponse> {
    try {
      console.log(`POST ${endpoint}`, { data, headers });
      const response = await this.apiClient.post(endpoint, data, { headers });
      console.log(`POST ${endpoint} response:`, response.status, response.data);
      return response;
    } catch (error) {
      console.error(`POST ${endpoint} error:`, error);
      throw handleApiError(error);
    }
  }

  async put(endpoint: string, data?: any, headers?: any): Promise<AxiosResponse> {
    try {
      return await this.apiClient.put(endpoint, data, { headers });
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async patch(endpoint: string, data?: any, headers?: any): Promise<AxiosResponse> {
    try {
      return await this.apiClient.patch(endpoint, data, { headers });
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async delete(endpoint: string, headers?: any): Promise<AxiosResponse> {
    try {
      return await this.apiClient.delete(endpoint, { headers });
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // File upload method with progress tracking
  async uploadFile(endpoint: string, formData: FormData, headers?: any, onProgress?: (progress: number) => void): Promise<AxiosResponse> {
    try {
      return await this.apiClient.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...headers,
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      await this.apiClient.get('health', { timeout: 5000 });
      return true;
    } catch (error) {
      console.warn('Health check failed:', error);
      return false;
    }
  }


}

// Create default API service instance
export const apiService = new ApiService(); 