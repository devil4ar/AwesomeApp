import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { RootStackParamList } from '../navigation/types';
import { Lead, UserLocation } from '../types';
import { findNearestLead, formatDistance } from '../utils/location';
import { MOCK_LEADS } from '../utils/mockData';

const UPDATE_INTERVAL = 2 * 60 * 1000; // 2 minutes
const IDLE_INTERVAL = 5 * 60 * 1000; // 5 minutes

type LocationMapScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LocationMap'
>;

interface Props {
  navigation: LocationMapScreenNavigationProp;
}

export const LocationMapScreen: React.FC<Props> = ({ navigation }) => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [nearestLead, setNearestLead] = useState<Lead | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);
  const updateIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    requestLocationPermission();

    return () => {
      stopTracking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs access to your location for lead tracking.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
          startTracking();
        } else {
          console.log('Location permission denied');
          Alert.alert(
            'Permission Required',
            'Location permission is required for this feature. Please enable it in app settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Open Settings',
                onPress: () => {
                  // On Android, you can guide users to settings
                  Alert.alert(
                    'Enable Location',
                    'Go to Settings > Apps > AwesomeApp > Permissions > Location',
                  );
                },
              },
            ],
          );
        }
      } else {
        // iOS - request permission through Geolocation
        const result = await Geolocation.requestAuthorization('whenInUse');
        console.log('iOS location authorization result:', result);
        if (result === 'granted') {
          startTracking();
        } else {
          Alert.alert(
            'Permission Required',
            'Location permission is required. Please enable it in Settings.',
          );
        }
      }
    } catch (err) {
      console.error('Permission error:', err);
      Alert.alert('Error', 'Failed to request location permission');
    }
  };

  const startTracking = () => {
    console.log('Starting location tracking...');

    // Prevent starting if already tracking
    if (isTracking && updateIntervalRef.current !== null) {
      console.log('Already tracking, skipping start');
      return;
    }

    // Clean up any existing interval before starting new one
    if (updateIntervalRef.current !== null) {
      console.log('Cleaning up existing interval before starting new one');
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }

    setIsTracking(true);
    setLocationError(null);

    // Get initial location immediately
    getCurrentLocation();

    // Set up interval for periodic updates (2 min or 5 min based on idle state)
    const interval = isIdle ? IDLE_INTERVAL : UPDATE_INTERVAL;
    console.log(`Setting update interval to ${interval / 1000 / 60} minutes`);

    updateIntervalRef.current = setInterval(() => {
      console.log('Interval triggered, fetching location...');
      getCurrentLocation();
    }, interval);
  };

  const stopTracking = () => {
    console.log('Stopping location tracking...');
    setIsTracking(false);
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }
  };

  const handleLocationError = (error: any) => {
    console.error('Location error:', error);
    let errorMessage = 'Failed to get current location.';

    switch (error.code) {
      case 1:
        errorMessage =
          'Location permission denied. Please enable location access in settings.';
        break;
      case 2:
        errorMessage =
          'Location unavailable. Please check your device settings and ensure GPS is enabled.';
        break;
      case 3:
        errorMessage = 'Location request timed out. Please try again.';
        break;
      case 5:
        errorMessage =
          'Location services are disabled. Please enable them in settings.';
        break;
    }

    setLocationError(errorMessage);
    Alert.alert('Location Error', errorMessage, [
      { text: 'OK', onPress: () => setIsTracking(false) },
    ]);
  };

  const getCurrentLocation = () => {
    console.log('Getting current location...');

    Geolocation.getCurrentPosition(
      position => {
        console.log('Got current position:', position.coords);
        const location: UserLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };

        setUserLocation(location);
        setLastUpdate(new Date());
        setLocationError(null);

        // Find nearest lead
        const nearest = findNearestLead(
          location.latitude,
          location.longitude,
          MOCK_LEADS,
        );

        setNearestLead(nearest);

        // Center map on user location (only on first load)
        if (mapRef.current && !userLocation) {
          mapRef.current.animateToRegion(
            {
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.5,
              longitudeDelta: 0.5,
            },
            1000,
          );
        }
      },
      error => {
        console.error('Location error:', error);
        handleLocationError(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 10000,
        showLocationDialog: true,
      },
    );
  };

  const toggleTracking = () => {
    console.log('Toggle tracking called, current state:', isTracking);
    if (isTracking) {
      stopTracking();
    } else {
      // Check if permission was granted before
      if (Platform.OS === 'android') {
        PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ).then(hasPermission => {
          if (hasPermission) {
            startTracking();
          } else {
            requestLocationPermission();
          }
        });
      } else {
        startTracking();
      }
    }
  };

  const toggleIdleMode = () => {
    setIsIdle(!isIdle);
    if (isTracking) {
      // Restart tracking with new interval
      stopTracking();
      setTimeout(() => startTracking(), 100);
    }
  };

  if (!userLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>
          {locationError || 'Getting your location...'}
        </Text>
        {locationError && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setLocationError(null);
              requestLocationPermission();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        {/* User Location Marker */}
        <Marker
          coordinate={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          }}
          title="You are here"
          pinColor="#3B82F6"
        />

        {/* Nearest Lead Marker */}
        {nearestLead && (
          <Marker
            coordinate={nearestLead.coordinates}
            title={nearestLead.name}
            description={`${nearestLead.location} • ${nearestLead.matchScore}% match`}
            pinColor="#10B981"
            onPress={() =>
              navigation.navigate('LeadDetails', { leadId: nearestLead.id })
            }
          >
            <View style={styles.leadMarker}>
              <Text style={styles.leadMarkerText}>⭐</Text>
            </View>
          </Marker>
        )}

        {/* Other Leads */}
        {MOCK_LEADS.filter(lead => lead.id !== nearestLead?.id).map(lead => (
          <Marker
            key={lead.id}
            coordinate={lead.coordinates}
            title={lead.name}
            description={`${lead.location} • ${lead.matchScore}% match`}
            pinColor="#9CA3AF"
            onPress={() =>
              navigation.navigate('LeadDetails', { leadId: lead.id })
            }
          />
        ))}
      </MapView>

      {/* Info Panel */}
      <View style={styles.infoPanel}>
        <View style={styles.infoPanelHeader}>
          <Text style={styles.infoPanelTitle}>Nearest Lead</Text>
          <View
            style={[
              styles.statusBadge,
              isTracking ? styles.activeStatus : styles.inactiveStatus,
            ]}
          >
            <Text style={styles.statusText}>
              {isTracking ? '● Tracking' : '○ Paused'}
            </Text>
          </View>
        </View>

        {nearestLead ? (
          <View style={styles.leadInfo}>
            <View style={styles.leadHeader}>
              <View style={styles.leadAvatar}>
                <Text style={styles.leadAvatarText}>
                  {nearestLead.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </Text>
              </View>
              <View style={styles.leadDetails}>
                <Text style={styles.leadName}>{nearestLead.name}</Text>
                <Text style={styles.leadLocation}>
                  📍 {nearestLead.location}
                </Text>
              </View>
            </View>

            <View style={styles.leadStats}>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Distance</Text>
                <Text style={styles.statValue}>
                  {nearestLead.distance
                    ? formatDistance(nearestLead.distance)
                    : 'N/A'}
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Match Score</Text>
                <Text style={[styles.statValue, styles.matchScore]}>
                  {nearestLead.matchScore}%
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <Text style={styles.noLeadText}>No leads found nearby</Text>
        )}

        {lastUpdate && (
          <Text style={styles.lastUpdateText}>
            Last updated: {lastUpdate.toLocaleTimeString()}
          </Text>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.trackingButton]}
          onPress={toggleTracking}
        >
          <Text style={styles.controlButtonText}>
            {isTracking ? '⏸ Pause Tracking' : '▶ Start Tracking'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton,
            styles.idleButton,
            isIdle && styles.idleButtonActive,
          ]}
          onPress={toggleIdleMode}
        >
          <Text
            style={[
              styles.controlButtonText,
              isIdle && styles.idleButtonTextActive,
            ]}
          >
            {isIdle ? '🔋 Battery Saver ON' : '⚡ Normal Mode'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  map: {
    flex: 1,
  },
  leadMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  leadMarkerText: {
    fontSize: 20,
  },
  infoPanel: {
    position: 'absolute',
    top: 20,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  infoPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoPanelTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeStatus: {
    backgroundColor: '#D1FAE5',
  },
  inactiveStatus: {
    backgroundColor: '#F3F4F6',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  leadInfo: {
    gap: 12,
  },
  leadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  leadAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leadAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  leadDetails: {
    flex: 1,
  },
  leadName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  leadLocation: {
    fontSize: 13,
    color: '#6B7280',
  },
  leadStats: {
    flexDirection: 'row',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  matchScore: {
    color: '#10B981',
  },
  noLeadText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 12,
  },
  lastUpdateText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    gap: 8,
  },
  controlButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  trackingButton: {
    backgroundColor: '#3B82F6',
  },
  idleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  idleButtonActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  controlButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  idleButtonTextActive: {
    color: '#92400E',
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
