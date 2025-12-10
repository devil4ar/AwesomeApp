import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RootStackParamList } from '../navigation/types';
import { MOCK_LEADS } from '../utils/mockData';

type LeadDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LeadDetails'
>;

type LeadDetailsScreenRouteProp = RouteProp<RootStackParamList, 'LeadDetails'>;

interface Props {
  navigation: LeadDetailsScreenNavigationProp;
  route: LeadDetailsScreenRouteProp;
}

export const LeadDetailsScreen: React.FC<Props> = ({ route }) => {
  const leadId = route.params.leadId;
  const lead = MOCK_LEADS.find(l => l.id === leadId);

  if (!lead) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Lead not found</Text>
      </View>
    );
  }

  const handleCall = () => {
    if (lead.phone) {
      Linking.openURL(`tel:${lead.phone}`);
    }
  };

  const handleEmail = () => {
    if (lead.email) {
      Linking.openURL(`mailto:${lead.email}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {lead.name
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()}
          </Text>
        </View>

        <Text style={styles.name}>{lead.name}</Text>

        <View style={styles.locationContainer}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.location}>{lead.location}</Text>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Match Score</Text>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>{lead.matchScore}%</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          {lead.phone && (
            <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
              <Text style={styles.contactIcon}>📞</Text>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>{lead.phone}</Text>
              </View>
              <Text style={styles.contactAction}>Call</Text>
            </TouchableOpacity>
          )}

          {lead.email && (
            <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
              <Text style={styles.contactIcon}>📧</Text>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>{lead.email}</Text>
              </View>
              <Text style={styles.contactAction}>Send</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Description */}
        {lead.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{lead.description}</Text>
          </View>
        )}

        {/* Location Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Latitude:</Text>
            <Text style={styles.detailValue}>
              {lead.coordinates.latitude.toFixed(4)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Longitude:</Text>
            <Text style={styles.detailValue}>
              {lead.coordinates.longitude.toFixed(4)}
            </Text>
          </View>
        </View>

        {/* Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={[styles.statusBadge, styles.activeStatus]}>
            <Text style={styles.statusText}>● Active</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  location: {
    fontSize: 15,
    color: '#6B7280',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
    fontWeight: '600',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#3B82F6',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E40AF',
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  contactIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
  contactAction: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  description: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeStatus: {
    backgroundColor: '#D1FAE5',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
});
