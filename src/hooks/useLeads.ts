import { useEffect, useState } from 'react';
import { Lead, UserLocation } from '../types';
import { calculateDistance } from '../utils/location';
import { MOCK_LEADS } from '../utils/mockData';

export const useLeads = (userLocation?: UserLocation) => {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    if (!userLocation) {
      setLeads(MOCK_LEADS);
      return;
    }

    const leadsWithDistance = MOCK_LEADS.map(lead => ({
      ...lead,
      distance: calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        lead.coordinates.latitude,
        lead.coordinates.longitude,
      ),
    }));

    setLeads(leadsWithDistance);
  }, [userLocation]);

  return { leads };
};
