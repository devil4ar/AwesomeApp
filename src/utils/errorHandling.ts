import { Alert } from 'react-native';

export const handleError = (error: unknown, userMessage?: string) => {
  console.error('Error:', error);

  const message = userMessage || 'An unexpected error occurred';
  Alert.alert('Error', message);
};

export const handleAsyncError = async <T>(
  operation: () => Promise<T>,
  errorMessage?: string,
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    handleError(error, errorMessage);
    return null;
  }
};
