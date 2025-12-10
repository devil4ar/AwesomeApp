import { Lead } from '../types';

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

const toRad = (value: number): number => {
  return (value * Math.PI) / 180;
};

/**
 * Find the nearest lead from user's location
 */
export const findNearestLead = (
  userLat: number,
  userLon: number,
  leads: Lead[],
): Lead | null => {
  if (leads.length === 0) return null;

  let nearest = leads[0];
  let minDistance = calculateDistance(
    userLat,
    userLon,
    leads[0].coordinates.latitude,
    leads[0].coordinates.longitude,
  );

  leads.forEach(lead => {
    const distance = calculateDistance(
      userLat,
      userLon,
      lead.coordinates.latitude,
      lead.coordinates.longitude,
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearest = lead;
    }
  });

  return { ...nearest, distance: minDistance };
};

/**
 * Calculate best match based on combined score of distance and match score
 */
export const calculateBestMatch = (
  userLat: number,
  userLon: number,
  leads: Lead[],
): Lead | null => {
  if (leads.length === 0) return null;

  const leadsWithScores = leads.map(lead => {
    const distance = calculateDistance(
      userLat,
      userLon,
      lead.coordinates.latitude,
      lead.coordinates.longitude,
    );

    // Normalize distance (closer = higher score)
    // Assuming max relevant distance is 50km
    const distanceScore = Math.max(0, 100 - (distance / 50) * 100);

    // Combined score: 50% match score + 50% distance score
    const combinedScore = (lead.matchScore + distanceScore) / 2;

    return { ...lead, distance, combinedScore };
  });

  leadsWithScores.sort(
    (a, b) => (b.combinedScore || 0) - (a.combinedScore || 0),
  );

  return leadsWithScores[0];
};

/**
 * Format distance for display
 */
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

/**
 * Get confidence score color
 */
export const getConfidenceColor = (score: number): string => {
  if (score >= 90) return '#10B981'; // Green
  if (score >= 70) return '#F59E0B'; // Yellow
  return '#EF4444'; // Red
};

/**
 * Get confidence score label
 */
export const getConfidenceLabel = (score: number): string => {
  if (score >= 90) return 'High';
  if (score >= 70) return 'Medium';
  return 'Low';
};
