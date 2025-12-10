import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LeadCard } from '../components/LeadCard';
import { RootStackParamList } from '../navigation/types';
import { FilterOption, Lead, SortOption } from '../types';
import {
  calculateBestMatch,
  calculateDistance,
  formatDistance,
} from '../utils/location';
import { MOCK_LEADS } from '../utils/mockData';

type LeadDashboardNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LeadDashboard'
>;

interface Props {
  navigation: LeadDashboardNavigationProp;
}

export const LeadDashboard: React.FC<Props> = ({ navigation }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('distance');
  const [filter, setFilter] = useState<FilterOption>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [bestMatch, setBestMatch] = useState<Lead | null>(null);
  const [userLocation] = useState({
    latitude: 37.7749, // Default to San Francisco
    longitude: -122.4194,
  });

  useEffect(() => {
    loadLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, filter]);

  const loadLeads = () => {
    let filteredLeads = [...MOCK_LEADS];

    // Calculate distances for all leads
    filteredLeads = filteredLeads.map(lead => ({
      ...lead,
      distance: calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        lead.coordinates.latitude,
        lead.coordinates.longitude,
      ),
    }));

    // Apply filter
    if (filter === 'highScore') {
      filteredLeads = filteredLeads.filter(lead => lead.matchScore > 70);
    }

    // Sort leads
    if (sortBy === 'distance') {
      filteredLeads.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    } else {
      filteredLeads.sort((a, b) => b.matchScore - a.matchScore);
    }

    setLeads(filteredLeads);

    // Calculate best match
    const best = calculateBestMatch(
      userLocation.latitude,
      userLocation.longitude,
      filteredLeads,
    );
    setBestMatch(best);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call delay
    await new Promise<void>(resolve => setTimeout(resolve, 1000));
    loadLeads();
    setRefreshing(false);
  };

  const handleSortToggle = (option: SortOption) => {
    setSortBy(option);
  };

  const handleFilterToggle = () => {
    setFilter(filter === 'all' ? 'highScore' : 'all');
  };

  const renderLead = ({ item }: { item: Lead }) => {
    const isBestMatch = bestMatch?.id === item.id;

    return (
      <LeadCard
        lead={item}
        onPress={() => navigation.navigate('LeadDetails', { leadId: item.id })}
        isBestMatch={isBestMatch}
        showDistance={true}
      />
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyTitle}>No Leads Found</Text>
      <Text style={styles.emptyText}>
        {filter === 'highScore'
          ? 'No leads with 70%+ match score found.\nTry changing the filter.'
          : 'No leads available at the moment.'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Lead Dashboard</Text>
          <Text style={styles.subtitle}>
            {leads.length} lead{leads.length !== 1 ? 's' : ''} available
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.sortContainer}>
          <Text style={styles.controlLabel}>Sort by:</Text>
          <View style={styles.sortButtons}>
            <TouchableOpacity
              style={[
                styles.sortButton,
                sortBy === 'distance' && styles.sortButtonActive,
              ]}
              onPress={() => handleSortToggle('distance')}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  sortBy === 'distance' && styles.sortButtonTextActive,
                ]}
              >
                📍 Distance
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sortButton,
                sortBy === 'score' && styles.sortButtonActive,
              ]}
              onPress={() => handleSortToggle('score')}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  sortBy === 'score' && styles.sortButtonTextActive,
                ]}
              >
                ⭐ Score
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'highScore' && styles.filterButtonActive,
          ]}
          onPress={handleFilterToggle}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === 'highScore' && styles.filterButtonTextActive,
            ]}
          >
            {filter === 'highScore' ? '✓ 70%+ Only' : '🔍 All Leads'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats Bar */}
      {bestMatch && (
        <View style={styles.statsBar}>
          <Text style={styles.statsIcon}>🏆</Text>
          <View style={styles.statsContent}>
            <Text style={styles.statsTitle}>Best Match</Text>
            <Text style={styles.statsLead}>
              {bestMatch.name} • {bestMatch.matchScore}% •{' '}
              {bestMatch.distance ? formatDistance(bestMatch.distance) : 'N/A'}
            </Text>
          </View>
        </View>
      )}

      {/* Leads List */}
      <FlatList
        data={leads}
        renderItem={renderLead}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
  controls: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  sortButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  sortButtonActive: {
    backgroundColor: '#3B82F6',
  },
  sortButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  sortButtonTextActive: {
    color: '#FFFFFF',
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  filterButtonActive: {
    backgroundColor: '#DBEAFE',
    borderColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterButtonTextActive: {
    color: '#3B82F6',
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FEF3C7',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
    gap: 10,
  },
  statsIcon: {
    fontSize: 24,
  },
  statsContent: {
    flex: 1,
  },
  statsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 2,
  },
  statsLead: {
    fontSize: 13,
    color: '#78350F',
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
    lineHeight: 20,
  },
});
