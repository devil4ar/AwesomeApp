import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getConfidenceColor, getConfidenceLabel } from '../utils/location';

interface ConfidenceScoreProps {
  score: number;
  label?: string;
}

export const ConfidenceScore: React.FC<ConfidenceScoreProps> = ({
  score,
  label,
}) => {
  const color = getConfidenceColor(score);
  const confidenceLabel = getConfidenceLabel(score);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={styles.scoreText}>{score}%</Text>
      </View>
      <Text style={[styles.confidenceLabel, { color }]}>{confidenceLabel}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  confidenceLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
