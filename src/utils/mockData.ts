import { Lead } from '../types';

/**
 * Hardcoded dataset of leads for testing
 */
export const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    name: 'John Anderson',
    location: 'Downtown, San Francisco',
    matchScore: 92,
    coordinates: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    phone: '+1 555-0101',
    email: 'john.anderson@email.com',
    description: 'High-value commercial client',
    status: 'active',
  },
  {
    id: '2',
    name: 'Sarah Mitchell',
    location: 'Mission District, SF',
    matchScore: 85,
    coordinates: {
      latitude: 37.7599,
      longitude: -122.4148,
    },
    phone: '+1 555-0102',
    email: 'sarah.mitchell@email.com',
    description: 'Residential property lead',
    status: 'active',
  },
  {
    id: '3',
    name: 'Michael Chen',
    location: 'Palo Alto',
    matchScore: 78,
    coordinates: {
      latitude: 37.4419,
      longitude: -122.143,
    },
    phone: '+1 555-0103',
    email: 'michael.chen@email.com',
    description: 'Tech startup founder',
    status: 'active',
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    location: 'Oakland',
    matchScore: 88,
    coordinates: {
      latitude: 37.8044,
      longitude: -122.2712,
    },
    phone: '+1 555-0104',
    email: 'emily.rodriguez@email.com',
    description: 'Investment opportunity',
    status: 'active',
  },
  {
    id: '5',
    name: 'David Thompson',
    location: 'San Jose',
    matchScore: 72,
    coordinates: {
      latitude: 37.3382,
      longitude: -121.8863,
    },
    phone: '+1 555-0105',
    email: 'david.thompson@email.com',
    description: 'Corporate client',
    status: 'active',
  },
  {
    id: '6',
    name: 'Jennifer Lee',
    location: 'Berkeley',
    matchScore: 95,
    coordinates: {
      latitude: 37.8715,
      longitude: -122.273,
    },
    phone: '+1 555-0106',
    email: 'jennifer.lee@email.com',
    description: 'Premium real estate',
    status: 'active',
  },
  {
    id: '7',
    name: 'Robert Wilson',
    location: 'Fremont',
    matchScore: 68,
    coordinates: {
      latitude: 37.5485,
      longitude: -121.9886,
    },
    phone: '+1 555-0107',
    email: 'robert.wilson@email.com',
    description: 'Standard client',
    status: 'active',
  },
  {
    id: '8',
    name: 'Lisa Garcia',
    location: 'Sunnyvale',
    matchScore: 82,
    coordinates: {
      latitude: 37.3688,
      longitude: -122.0363,
    },
    phone: '+1 555-0108',
    email: 'lisa.garcia@email.com',
    description: 'High potential lead',
    status: 'active',
  },
  {
    id: '9',
    name: 'James Brown',
    location: 'Daly City',
    matchScore: 76,
    coordinates: {
      latitude: 37.6879,
      longitude: -122.4702,
    },
    phone: '+1 555-0109',
    email: 'james.brown@email.com',
    description: 'Returning customer',
    status: 'active',
  },
  {
    id: '10',
    name: 'Maria Martinez',
    location: 'Redwood City',
    matchScore: 91,
    coordinates: {
      latitude: 37.4852,
      longitude: -122.2364,
    },
    phone: '+1 555-0110',
    email: 'maria.martinez@email.com',
    description: 'VIP prospect',
    status: 'active',
  },
];

/**
 * Mock AI API to process lead queries
 */
export const mockAIQuery = async (query: string): Promise<Lead[]> => {
  // Simulate API delay
  await new Promise<void>(resolve => setTimeout(resolve, 1000));

  const lowerQuery = query.toLowerCase();

  // Filter leads based on query keywords
  if (lowerQuery.includes('nearby') || lowerQuery.includes('near')) {
    // Return leads sorted by location (simulate nearby)
    return MOCK_LEADS.slice(0, 5);
  }

  if (lowerQuery.includes('high score') || lowerQuery.includes('best')) {
    return MOCK_LEADS.filter(lead => lead.matchScore > 80).sort(
      (a, b) => b.matchScore - a.matchScore,
    );
  }

  if (lowerQuery.includes('san francisco') || lowerQuery.includes('sf')) {
    return MOCK_LEADS.filter(
      lead =>
        lead.location.toLowerCase().includes('san francisco') ||
        lead.location.toLowerCase().includes('sf'),
    );
  }

  if (lowerQuery.includes('all') || lowerQuery.includes('show')) {
    return MOCK_LEADS;
  }

  // Default: return top 5 leads by match score
  return [...MOCK_LEADS]
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);
};

/**
 * Generate a random notification lead
 */
export const generateMockNotification = (): Lead => {
  const randomIndex = Math.floor(Math.random() * MOCK_LEADS.length);
  return MOCK_LEADS[randomIndex];
};
