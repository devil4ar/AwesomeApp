import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NotificationData } from '../types';

export type RootStackParamList = {
  Home: undefined;
  OCRCapture: undefined;
  LeadChat: undefined;
  LeadDashboard: undefined;
  LocationMap: undefined;
  FullScreenNotification: { notification: NotificationData };
  LeadDetails: { leadId: string };
  DeclinedLeads: undefined;
};

// Navigation prop types for each screen
export type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;
export type OCRCaptureScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'OCRCapture'
>;
export type LeadChatScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LeadChat'
>;
export type LeadDashboardNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LeadDashboard'
>;
export type LocationMapScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LocationMap'
>;
export type DeclinedLeadsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'DeclinedLeads'
>;

export type LeadDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LeadDetails'
>;
export type LeadDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  'LeadDetails'
>;

export type FullScreenNotificationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'FullScreenNotification'
>;
export type FullScreenNotificationScreenRouteProp = RouteProp<
  RootStackParamList,
  'FullScreenNotification'
>;
