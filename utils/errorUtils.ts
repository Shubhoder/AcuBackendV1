import { Alert } from 'react-native';

export interface AppError {
  message: string;
  code?: string;
  status?: number;
  isNetworkError?: boolean;
  isAuthError?: boolean;
}

/**
 * Centralized error handler for the app
 */
export class ErrorHandler {
  /**
   * Handle API errors and show appropriate messages
   */
  static handleApiError(error: any): AppError {
    if (error && typeof error === 'object') {
      // Network errors
      if (error.message?.includes('Network error') || error.message?.includes('internet connection')) {
        return {
          message: 'No internet connection. Please check your network settings and try again.',
          isNetworkError: true,
        };
      }

      // Authentication errors
      if (error.status === 401 || error.message?.includes('authentication') || error.message?.includes('Invalid credentials')) {
        return {
          message: 'Invalid email or password. Please check your credentials and try again.',
          status: 401,
          isAuthError: true,
        };
      }

      // Login-specific errors
      if (error.message?.includes('Login failed') || error.message?.includes('Invalid response')) {
        return {
          message: 'Login failed. Please check your credentials and try again.',
          status: error.status || 400,
          isAuthError: true,
        };
      }

      // Server errors
      if (error.status >= 500) {
        return {
          message: 'Server error. Please try again later.',
          status: error.status,
        };
      }

      // File upload errors
      if (error.status === 413) {
        return {
          message: 'File is too large. Please try a smaller file.',
          status: 413,
        };
      }

      // Validation errors
      if (error.status === 400) {
        return {
          message: error.message || 'Invalid request. Please check your input.',
          status: 400,
        };
      }

      // Custom error messages
      if (error.message) {
        return {
          message: error.message,
          status: error.status,
        };
      }
    }

    // Default error
    return {
      message: 'An unexpected error occurred. Please try again.',
    };
  }

  /**
   * Show error alert with retry option
   */
  static showErrorAlert(error: AppError, onRetry?: () => void, onCancel?: () => void) {
    const buttons = [
      {
        text: 'OK',
        onPress: onCancel,
      },
    ];

    if (onRetry) {
      buttons.unshift({
        text: 'Retry',
        onPress: onRetry,
      });
    }

    Alert.alert('Error', error.message, buttons);
  }

  /**
   * Show success alert
   */
  static showSuccessAlert(message: string, onPress?: () => void) {
    Alert.alert('Success', message, [
      {
        text: 'OK',
        onPress,
      },
    ]);
  }

  /**
   * Show confirmation dialog
   */
  static showConfirmationAlert(
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) {
    Alert.alert(title, message, [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: 'Confirm',
        style: 'destructive',
        onPress: onConfirm,
      },
    ]);
  }

  /**
   * Log error for debugging
   */
  static logError(error: any, context?: string) {
    const errorInfo = {
      message: error?.message || 'Unknown error',
      status: error?.status,
      code: error?.code,
      context,
      timestamp: new Date().toISOString(),
    };

    console.error('App Error:', errorInfo);
    
    // In production, you might want to send this to a logging service
    // like Sentry, Crashlytics, etc.
  }

  /**
   * Check if error is retryable
   */
  static isRetryableError(error: AppError): boolean {
    return (
      error.isNetworkError ||
      error.status === 500 ||
      error.status === 502 ||
      error.status === 503 ||
      error.status === 504
    );
  }

  /**
   * Get user-friendly error message
   */
  static getUserFriendlyMessage(error: any): string {
    const appError = this.handleApiError(error);
    return appError.message;
  }
} 