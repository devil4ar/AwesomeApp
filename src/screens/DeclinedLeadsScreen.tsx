import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NotificationData } from '../types';

interface DeclinedLead extends NotificationData {
  declinedAt: string;
}

export const DeclinedLeadsScreen: React.FC = () => {
  const [declinedLeads, setDeclinedLeads] = useState<DeclinedLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDeclinedLeads = async () => {
    try {
      const data = await AsyncStorage.getItem('declinedLeads');
      if (data) {
        const leads = JSON.parse(data);
        setDeclinedLeads(leads.reverse()); // Show newest first
      } else {
        setDeclinedLeads([]);
      }
    } catch (error) {
      console.error('Error loading declined leads:', error);
      Alert.alert('Error', 'Failed to load declined leads');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDeclinedLeads();
    }, []),
  );

  useEffect(() => {
    loadDeclinedLeads();
  }, []);

  const handleClearAll = () => {
    Alert.alert(
      'Clear All',
      'Are you sure you want to clear all declined leads?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('declinedLeads');
              setDeclinedLeads([]);
              Alert.alert('Success', 'All declined leads cleared');
            } catch {
              Alert.alert('Error', 'Failed to clear declined leads');
            }
          },
        },
      ],
    );
  };

  const handleRemoveLead = (leadId: string) => {
    Alert.alert('Remove Lead', 'Remove this lead from declined list?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            const updatedLeads = declinedLeads.filter(
              lead => lead.leadId !== leadId,
            );
            await AsyncStorage.setItem(
              'declinedLeads',
              JSON.stringify(updatedLeads),
            );
            setDeclinedLeads(updatedLeads);
          } catch {
            Alert.alert('Error', 'Failed to remove lead');
          }
        },
      },
    ]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderLead = ({ item }: { item: DeclinedLead }) => (
    <View style={styles.leadCard}>
      <View style={styles.leadHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.leadName
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()}
          </Text>
        </View>
        <View style={styles.leadInfo}>
          <Text style={styles.leadName}>{item.leadName}</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.location}>{item.location}</Text>
          </View>
          <Text style={styles.declinedDate}>
            Declined: {formatDate(item.declinedAt)}
          </Text>
        </View>
        <View style={styles.scoreContainer}>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{item.matchScore}%</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveLead(item.leadId)}
      >
        <Text style={styles.removeButtonText}>✕ Remove</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyTitle}>No Declined Leads</Text>
      <Text style={styles.emptyText}>
        Leads you decline will appear here for review
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Declined Leads</Text>
          <Text style={styles.subtitle}>
            {declinedLeads.length} lead
            {declinedLeads.length !== 1 ? 's' : ''} declined
          </Text>
        </View>
        {declinedLeads.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={declinedLeads}
        renderItem={renderLead}
        keyExtractor={item => item.leadId}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  clearButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  leadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  leadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  leadInfo: {
    flex: 1,
  },
  leadName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
  },
  declinedDate: {
    fontSize: 12,
    color: '#991B1B',
    fontWeight: '500',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#991B1B',
  },
  removeButton: {
    backgroundColor: '#FEF2F2',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  removeButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
