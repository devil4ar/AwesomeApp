import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RootStackParamList } from '../navigation/types';
import { NotificationData } from '../types';

type FullScreenNotificationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'FullScreenNotification'
>;

type FullScreenNotificationScreenRouteProp = RouteProp<
  RootStackParamList,
  'FullScreenNotification'
>;

interface Props {
  navigation: FullScreenNotificationScreenNavigationProp;
  route: FullScreenNotificationScreenRouteProp;
}

const { height } = Dimensions.get('window');

export const FullScreenNotificationScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const notification: NotificationData = route.params.notification;

  useEffect(() => {
    // Auto-dismiss after 30 seconds
    const timer = setTimeout(() => {
      navigation.goBack();
    }, 30000);

    return () => clearTimeout(timer);
  }, [navigation]);

  const handleAccept = () => {
    // Navigate to Lead Details
    navigation.replace('LeadDetails', { leadId: notification.leadId });
  };

  const handleReject = async () => {
    try {
      // Get existing declined leads
      const existingData = await AsyncStorage.getItem('declinedLeads');
      const declinedLeads = existingData ? JSON.parse(existingData) : [];

      // Add this lead to declined list
      const declinedLead = {
        ...notification,
        declinedAt: new Date().toISOString(),
      };

      declinedLeads.push(declinedLead);

      // Save back to storage
      await AsyncStorage.setItem(
        'declinedLeads',
        JSON.stringify(declinedLeads),
      );

      // Dismiss notification
      navigation.goBack();
    } catch (error) {
      console.error('Error saving declined lead:', error);
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <View style={styles.backgroundGradient} />

      <View style={styles.content}>
        {/* Lead Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {notification.leadName
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()}
            </Text>
          </View>
          <View style={styles.pulseRing} />
        </View>

        {/* Notification Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.badge}>🔔 New Lead</Text>
          <Text style={styles.leadName}>{notification.leadName}</Text>

          <View style={styles.locationContainer}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.location}>{notification.location}</Text>
          </View>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Match Score</Text>
            <View style={styles.scoreBar}>
              <View
                style={[
                  styles.scoreBarFill,
                  { width: `${notification.matchScore}%` },
                  notification.matchScore > 80 && styles.highScoreFill,
                ]}
              />
            </View>
            <Text style={styles.scoreText}>{notification.matchScore}%</Text>
          </View>

          {/* Map thumbnail placeholder */}
          <View style={styles.mapThumbnail}>
            <Text style={styles.mapText}>📍 Map Location</Text>
            <Text style={styles.mapCoordinates}>
              {notification.coordinates.latitude.toFixed(4)},{' '}
              {notification.coordinates.longitude.toFixed(4)}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
            <Text style={styles.rejectButtonText}>✕ Reject</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
            <Text style={styles.acceptButtonText}>✓ Accept Lead</Text>
          </TouchableOpacity>
        </View>

        {/* Auto-dismiss indicator */}
        <Text style={styles.autoDismissText}>Auto-dismiss in 30 seconds</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    backgroundColor: '#3B82F6',
    opacity: 0.3,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    zIndex: 2,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
  },
  pulseRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#3B82F6',
    opacity: 0.3,
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  badge: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  leadName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  location: {
    fontSize: 16,
    color: '#6B7280',
  },
  scoreContainer: {
    marginBottom: 20,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    fontWeight: '600',
  },
  scoreBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  highScoreFill: {
    backgroundColor: '#10B981',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'right',
  },
  mapThumbnail: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  mapText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 4,
  },
  mapCoordinates: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  acceptButton: {
    flex: 2,
    backgroundColor: '#10B981',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  autoDismissText: {
    marginTop: 16,
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
});
