// Simple network utility without native dependencies
export interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: string;
}

/**
 * Simple network check using fetch
 */
export const checkNetworkConnectivity = async (): Promise<NetworkState> => {
  try {
    // Try to fetch a small resource to check connectivity
    const response = await fetch('https://www.google.com/favicon.ico', {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache',
    });
    
    return {
      isConnected: true,
      isInternetReachable: true,
      type: 'wifi',
    };
  } catch (error) {
    console.warn('Network check failed:', error);
    return {
      isConnected: false,
      isInternetReachable: false,
      type: 'unknown',
    };
  }
};

/**
 * Wait for network connection
 */
export const waitForNetworkConnection = async (timeout: number = 10000): Promise<boolean> => {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const networkState = await checkNetworkConnectivity();
    
    if (networkState.isConnected && networkState.isInternetReachable) {
      return true;
    }
    
    // Wait 1 second before checking again
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return false;
};

/**
 * Get network status message
 */
export const getNetworkStatusMessage = (networkState: NetworkState): string => {
  if (!networkState.isConnected) {
    return 'No network connection';
  }
  
  if (!networkState.isInternetReachable) {
    return 'No internet access';
  }
  
  return `Connected via ${networkState.type}`;
};

/**
 * Simple network change subscription (mock implementation)
 */
export const subscribeToNetworkChanges = (callback: (state: NetworkState) => void) => {
  // For now, just return a no-op function
  // In a real app, you might want to implement this with a different approach
  return () => {
    // Cleanup function
  };
}; 