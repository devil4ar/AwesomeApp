import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RootStackParamList } from '../navigation/types';
import { generateMockNotification } from '../utils/mockData';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const handleSimulateNotification = () => {
    const notification = generateMockNotification();
    navigation.navigate('FullScreenNotification', {
      notification: {
        leadId: notification.id,
        leadName: notification.name,
        location: notification.location,
        matchScore: notification.matchScore,
        coordinates: notification.coordinates,
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lead Management System</Text>
        <Text style={styles.subtitle}>Select a feature to get started</Text>
      </View>

      <View style={styles.content}>
        {/* Task 1: OCR Capture */}
        <TouchableOpacity
          style={[styles.card, styles.ocrCard]}
          onPress={() => navigation.navigate('OCRCapture')}
        >
          <Text style={styles.cardIcon}>📷</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>OCR ID Scanner</Text>
            <Text style={styles.cardDescription}>
              Capture and extract information from ID cards
            </Text>
          </View>
          <Text style={styles.cardArrow}>›</Text>
        </TouchableOpacity>

        {/* Task 2: AI Chat */}
        <TouchableOpacity
          style={[styles.card, styles.chatCard]}
          onPress={() => navigation.navigate('LeadChat')}
        >
          <Text style={styles.cardIcon}>💬</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>AI Lead Assistant</Text>
            <Text style={styles.cardDescription}>
              Ask questions and get lead recommendations
            </Text>
          </View>
          <Text style={styles.cardArrow}>›</Text>
        </TouchableOpacity>

        {/* Task 3: Full Screen Notification */}
        <TouchableOpacity
          style={[styles.card, styles.notificationCard]}
          onPress={handleSimulateNotification}
        >
          <Text style={styles.cardIcon}>🔔</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Simulate Notification</Text>
            <Text style={styles.cardDescription}>
              Test full-screen lead notification
            </Text>
          </View>
          <Text style={styles.cardArrow}>›</Text>
        </TouchableOpacity>

        {/* Task 4: Location Map */}
        <TouchableOpacity
          style={[styles.card, styles.mapCard]}
          onPress={() => navigation.navigate('LocationMap')}
        >
          <Text style={styles.cardIcon}>🗺️</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Location Tracker</Text>
            <Text style={styles.cardDescription}>
              View nearby leads on a map with battery optimization
            </Text>
          </View>
          <Text style={styles.cardArrow}>›</Text>
        </TouchableOpacity>

        {/* Task 5: Lead Dashboard */}
        <TouchableOpacity
          style={[styles.card, styles.dashboardCard]}
          onPress={() => navigation.navigate('LeadDashboard')}
        >
          <Text style={styles.cardIcon}>📊</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Lead Dashboard</Text>
            <Text style={styles.cardDescription}>
              Browse, filter, and sort all available leads
            </Text>
          </View>
          <Text style={styles.cardArrow}>›</Text>
        </TouchableOpacity>

        {/* Declined Leads */}
        <TouchableOpacity
          style={[styles.card, styles.declinedCard]}
          onPress={() => navigation.navigate('DeclinedLeads')}
        >
          <Text style={styles.cardIcon}>🚫</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Declined Leads</Text>
            <Text style={styles.cardDescription}>
              View and manage declined lead notifications
            </Text>
          </View>
          <Text style={styles.cardArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Built with React Native • All features ready
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
  },
  content: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
  },
  ocrCard: {
    borderLeftColor: '#3B82F6',
  },
  chatCard: {
    borderLeftColor: '#8B5CF6',
  },
  notificationCard: {
    borderLeftColor: '#EF4444',
  },
  mapCard: {
    borderLeftColor: '#10B981',
  },
  dashboardCard: {
    borderLeftColor: '#F59E0B',
  },
  declinedCard: {
    borderLeftColor: '#DC2626',
  },
  cardIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  cardArrow: {
    fontSize: 28,
    color: '#D1D5DB',
    fontWeight: '300',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
