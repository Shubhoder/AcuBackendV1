import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  mobile: string;
}

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
    // Simulate checking for existing session
    const timer = setTimeout(() => {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const mockUser: User = {
        id: '1',
        email,
        firstName: 'Dr.',
        lastName: 'Rajeev',
        username: 'drajeev',
        mobile: '9865453215',
      };

      setAuthState({
        user: mockUser,
        isLoading: false,
        isAuthenticated: true,
      });

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const signup = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
      };

      setAuthState({
        user: newUser,
        isLoading: false,
        isAuthenticated: true,
      });

      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  return {
    ...authState,
    login,
    signup,
    logout,
  };
};