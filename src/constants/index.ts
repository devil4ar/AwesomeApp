// Theme Colors
export const COLORS = {
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  danger: '#DC2626',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  white: '#FFFFFF',
  black: '#000000',
};

// Location
export const LOCATION_CONFIG = {
  UPDATE_INTERVAL: 2 * 60 * 1000, // 2 minutes
  IDLE_INTERVAL: 5 * 60 * 1000, // 5 minutes
  DEFAULT_COORDINATES: {
    latitude: 37.7749,
    longitude: -122.4194,
  },
};

// OCR
export const OCR_CONFIG = {
  PROCESSING_DELAY: 2000, // 2 seconds
  MIN_CONFIDENCE_HIGH: 90,
  MIN_CONFIDENCE_MEDIUM: 70,
};

// Match Scores
export const MATCH_SCORE_THRESHOLDS = {
  HIGH: 80,
  FILTER: 70,
};

// UI
export const UI_CONFIG = {
  AUTO_DISMISS_TIMEOUT: 30000, // 30 seconds
  REFRESH_DELAY: 1000, // 1 second
};
