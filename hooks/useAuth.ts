import { useState, useEffect } from 'react';
import { authService, User } from '../services/authService';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Check for existing authentication on app start
    checkExistingAuth();
  }, []);

  const checkExistingAuth = async () => {
    try {
      const isAuthenticated = await authService.isAuthenticated();
      if (isAuthenticated) {
        const user = await authService.getStoredUser();
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const result = await authService.login(email, password);
      
      setAuthState({
        user: result.user,
        isLoading: false,
        isAuthenticated: true,
      });

      return true;
    } catch (error: any) {
      console.error('Login failed:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      
      // Re-throw the error so the UI can handle it
      throw error;
    }
  };

  const signup = async (userData: { email: string; password: string; name: string; profileImage?: any }): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const result = await authService.signUp(userData);
      
      // After successful signup, we need to login to get the token
      const loginResult = await authService.login(userData.email, userData.password);
      
      setAuthState({
        user: loginResult.user,
        isLoading: false,
        isAuthenticated: true,
      });

      return true;
    } catch (error: any) {
      console.error('Signup failed:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      
      // Re-throw the error so the UI can handle it
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    try {
      await authService.changePassword(oldPassword, newPassword);
      return true;
    } catch (error: any) {
      console.error('Change password failed:', error);
      throw error;
    }
  };

  const deleteAccount = async (): Promise<boolean> => {
    try {
      if (!authState.user) {
        throw new Error('No user logged in');
      }
      
      await authService.deleteAccount(authState.user.userID);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      return true;
    } catch (error: any) {
      console.error('Delete account failed:', error);
      throw error;
    }
  };

  const getUserProfile = async (): Promise<User | null> => {
    try {
      if (!authState.user) {
        return null;
      }
      
      const profile = await authService.getUserProfile(authState.user.userID);
      setAuthState(prev => ({ ...prev, user: profile }));
      return profile;
    } catch (error: any) {
      console.error('Get user profile failed:', error);
      throw error;
    }
  };

  return {
    ...authState,
    login,
    signup,
    logout,
    changePassword,
    deleteAccount,
    getUserProfile,
  };
};