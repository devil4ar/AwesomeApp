import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Lead } from '../types';
import { formatDistance } from '../utils/location';

interface LeadCardProps {
  lead: Lead;
  onPress?: () => void;
  isBestMatch?: boolean;
  showDistance?: boolean;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onPress,
  isBestMatch = false,
  showDistance = false,
}) => {
  const isHighScore = lead.matchScore > 80;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isBestMatch && styles.bestMatchCard,
        isHighScore && !isBestMatch && styles.highScoreCard,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {isBestMatch && (
        <View style={styles.bestMatchBadge}>
          <Text style={styles.bestMatchText}>⭐ Best Match</Text>
        </View>
      )}

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

        <View style={styles.info}>
          <Text style={styles.name}>{lead.name}</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.location}>{lead.location}</Text>
          </View>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Match</Text>
          <View
            style={[styles.scoreBadge, isHighScore && styles.highScoreBadge]}
          >
            <Text style={styles.scoreText}>{lead.matchScore}%</Text>
          </View>
        </View>
      </View>

      {showDistance && lead.distance !== undefined && (
        <View style={styles.distanceContainer}>
          <Text style={styles.distanceIcon}>🚗</Text>
          <Text style={styles.distanceText}>
            {formatDistance(lead.distance)} away
          </Text>
        </View>
      )}

      {lead.description && (
        <Text style={styles.description} numberOfLines={2}>
          {lead.description}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
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
    borderColor: '#E5E7EB',
  },
  bestMatchCard: {
    borderWidth: 2,
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
    shadowColor: '#F59E0B',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  highScoreCard: {
    borderColor: '#10B981',
  },
  bestMatchBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  bestMatchText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 4,
    fontWeight: '600',
  },
  scoreBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  highScoreBadge: {
    backgroundColor: '#D1FAE5',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  distanceIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  distanceText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
});
