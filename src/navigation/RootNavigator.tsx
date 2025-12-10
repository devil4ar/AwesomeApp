import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';

// Import screens
import { DeclinedLeadsScreen } from '../screens/DeclinedLeadsScreen';
import { FullScreenNotificationScreen } from '../screens/FullScreenNotificationScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LeadChatScreen } from '../screens/LeadChatScreen';
import { LeadDashboard } from '../screens/LeadDashboard';
import { LeadDetailsScreen } from '../screens/LeadDetailsScreen';
import { LocationMapScreen } from '../screens/LocationMapScreen';
import { OCRCaptureScreen } from '../screens/OCRCaptureScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#3B82F6',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Lead Management' }}
      />
      <Stack.Screen
        name="OCRCapture"
        component={OCRCaptureScreen}
        options={{ title: 'OCR ID Scanner' }}
      />
      <Stack.Screen
        name="LeadChat"
        component={LeadChatScreen}
        options={{ title: 'AI Assistant' }}
      />
      <Stack.Screen
        name="LocationMap"
        component={LocationMapScreen}
        options={{ title: 'Location Tracker' }}
      />
      <Stack.Screen
        name="LeadDashboard"
        component={LeadDashboard}
        options={{ title: 'Lead Dashboard' }}
      />
      <Stack.Screen
        name="FullScreenNotification"
        component={FullScreenNotificationScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="LeadDetails"
        component={LeadDetailsScreen}
        options={{ title: 'Lead Details' }}
      />
      <Stack.Screen
        name="DeclinedLeads"
        component={DeclinedLeadsScreen}
        options={{ title: 'Declined Leads' }}
      />
    </Stack.Navigator>
  );
};
