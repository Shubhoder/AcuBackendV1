import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService, API_MESSAGES, handleApiError, ApiService } from './apiService';

// User interface matching the backend response
export interface User {
  userID: string;
  emailID: string;
  name: string;
}

// Login response interface
export interface LoginResponse {
  token: string;
  user: User;
}

// Signup request interface
export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

// Change password request interface
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export class AuthService {
  private apiService = apiService;

  /**
   * Login user with email and password
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      // Validate inputs
      if (!email || !email.trim()) {
        throw new Error('Email is required');
      }
      if (!password || !password.trim()) {
        throw new Error('Password is required');
      }

      console.log('Attempting login with:', { email: email.trim() });

      // The backend expects userName parameter, not email
      const requestData = {
        userName: email.trim(),
        password: password.trim(),
      };

      console.log('Sending login request with data:', requestData);

      let response;
      try {
        response = await this.apiService.post('accounts/auth', requestData);
      } catch (firstError) {
        console.log('First login attempt failed, trying alternative base URL...');
        
        // Try with the original base URL as fallback
        const fallbackApiService = new ApiService('https://wcrecordreviews.com/api/');
        response = await fallbackApiService.post('accounts/auth', requestData);
      }

      console.log('Login response received:', JSON.stringify(response.data, null, 2));

      // Handle different response formats
      let result;
      
      if (response.data?.data?.message === API_MESSAGES.post.success) {
        // Expected format
        result = response.data.data.result;
      } else if (response.data?.message === API_MESSAGES.post.success) {
        // Alternative format
        result = response.data.result;
      } else if (response.data?.token) {
        // Direct token format
        result = {
          token: response.data.token,
          user: response.data.user || {
            userID: response.data.userID || 'unknown',
            emailID: email.trim(),
            name: response.data.name || 'User',
          },
        };
      } else {
        console.error('Unexpected response format:', response.data);
        throw new Error('Unexpected response format from server');
      }
      
      // Validate response structure
      if (!result || !result.token) {
        console.error('Missing token in response:', result);
        throw new Error('Invalid response from server - missing token');
      }
      
      if (!result.user) {
        console.error('Missing user data in response:', result);
        throw new Error('Invalid response from server - missing user data');
      }
      
      // Store the auth token
      await AsyncStorage.setItem('authToken', result.token);
      await AsyncStorage.setItem('userData', JSON.stringify(result.user));
      
      console.log('Login successful, token stored');
      return result;
    } catch (error) {
      console.error('Login error details:', error);
      
      // Handle specific backend errors
      if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
        if (error.message.includes('LoginValidateUser')) {
          throw new Error('Invalid email or password');
        }
        if (error.message.includes('Invalid credentials')) {
          throw new Error('Invalid email or password');
        }
      }
      

      
      throw handleApiError(error);
    }
  }

  /**
   * Sign up new user
   */
  async signUp(userData: SignupRequest): Promise<User> {
    try {
      // Validate inputs
      if (!userData.email || !userData.email.trim()) {
        throw new Error('Email is required');
      }
      if (!userData.password || !userData.password.trim()) {
        throw new Error('Password is required');
      }
      if (!userData.name || !userData.name.trim()) {
        throw new Error('Name is required');
      }
      if (userData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Prepare signup payload
      const payload = {
        email: userData.email.trim(),
        password: userData.password.trim(),
        name: userData.name.trim(),
      };

      console.log('Attempting signup with payload:', JSON.stringify(payload, null, 2));

      const response = await this.apiService.post('dictation-app/sign-up', payload);

      // Handle different response formats
      if (response.data?.data?.message === API_MESSAGES.post.success) {
        const result = response.data.data.result;
        
        // Validate response structure
        if (!result || !result.userID || !result.emailID || !result.name) {
          throw new Error('Invalid response from server');
        }
        
        return result;
      } else if (response.data?.message === API_MESSAGES.post.success) {
        const result = response.data.result;
        
        // Validate response structure
        if (!result || !result.userID || !result.emailID || !result.name) {
          throw new Error('Invalid response from server');
        }
        
        return result;
      } else if (response.data?.status === false && response.data?.message) {
        // Handle backend errors
        throw new Error(response.data.message);
      }
      
      throw new Error('Sign up failed - Invalid response');
    } catch (error) {
      console.error('Sign up error:', error);
      

      
      // Handle specific backend errors
      if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
        if (error.message.includes('already exists')) {
          throw new Error('An account with this email already exists');
        }
      }
      
      throw handleApiError(error);
    }
  }

  /**
   * Change user password
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<any> {
    try {
      const response = await this.apiService.patch('accounts/change-password/', {
        oldPassword,
        newPassword,
      });
      
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      throw handleApiError(error);
    }
  }

  /**
   * Delete user account
   */
  async deleteAccount(userID: string): Promise<any> {
    try {
      const response = await this.apiService.get(`dictation-app/delete-account/${userID}`);
      
      // Clear local storage after successful deletion
      await this.logout();
      
      return response.data;
    } catch (error) {
      console.error('Delete account error:', error);
      throw handleApiError(error);
    }
  }

  /**
   * Get user profile/prefix
   */
  async getUserProfile(userID: string): Promise<User> {
    try {
      const response = await this.apiService.get(`user-prefix/${userID}`);
      
      if (response.data?.data?.message === API_MESSAGES.get.success) {
        return response.data.data.result;
      }
      
      throw new Error('Failed to fetch user profile');
    } catch (error) {
      console.error('Get user profile error:', error);
      throw handleApiError(error);
    }
  }

  /**
   * Logout user and clear stored data
   */
  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return !!token;
    } catch (error) {
      console.error('Check authentication error:', error);
      return false;
    }
  }

  /**
   * Get stored user data
   */
  async getStoredUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Get stored user error:', error);
      return null;
    }
  }



  /**
   * Get stored auth token
   */
  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Get auth token error:', error);
      return null;
    }
  }
}

// Create default auth service instance
export const authService = new AuthService(); 