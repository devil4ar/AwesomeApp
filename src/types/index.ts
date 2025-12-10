export interface Lead {
  id: string;
  name: string;
  location: string;
  matchScore: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  phone?: string;
  email?: string;
  description?: string;
  status?: 'active' | 'declined' | 'accepted';
  distance?: number;
}

export interface OCRResult {
  name: string;
  idNumber: string;
  dateOfBirth: string;
  confidence: {
    name: number;
    idNumber: number;
    dateOfBirth: number;
  };
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  createdAt: Date;
  user: {
    _id: number;
    name: string;
  };
  leads?: Lead[];
}

export interface NotificationData {
  leadId: string;
  leadName: string;
  location: string;
  matchScore: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export type SortOption = 'distance' | 'score';
export type FilterOption = 'all' | 'highScore';
