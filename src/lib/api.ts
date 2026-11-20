const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// User & Auth Types
export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'traveller' | 'custodian' | 'admin' | 'user';
  custodianId?: string;
  favorites?: string[];
  savedExperiences?: string[];
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

// Temple Types
export interface Temple {
  _id: string;
  id: string;
  name: string;
  location: string;
  deity: string;
  description: string;
  shortDescription: string;
  image: string;
  region: 'Mangalore' | 'Udupi' | 'Kundapura' | string;
  averageRating: number;
  totalReviews: number;
  openingHours?: { day: string; hours: string; isOpen?: boolean }[];
  faqs?: { question: string; answer: string }[];
  events?: { id: string; title: string; date: string; time: string; type: string; description: string }[];
}

// Review Types
export interface Review {
  _id: string;
  temple: string;
  user: {
    _id: string;
    name: string;
  };
  rating: number;
  comment: string;
  visitDate?: string;
  createdAt: string;
}

// Custodian Types
export interface Custodian {
  _id: string;
  userId?: string | User;
  name: string;
  email?: string;
  phone?: string;
  category: 'temple_custodian' | 'priest' | 'artisan' | 'folk_performer' | 'storyteller' | 'historian' | 'community_org' | 'knowledge_holder';
  culturalAffiliation: string;
  traditionPractice: string;
  verificationStatus: 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
  verificationNotes?: string;
  verifiedAt?: string;
  bio: string;
  experienceYears: number;
  languages: string[];
  location: {
    type: 'Point';
    coordinates: [number, number];
    address?: string;
    city: string;
    state: string;
    region: string;
  };
  profileImage?: string;
  totalEarnings?: number;
  rating?: number;
  totalReviews?: number;
  approvedKnowledge?: Knowledge[];
  experiences?: Experience[];
  createdAt: string;
}

// Knowledge Types
export interface Perspective {
  custodianId: string | Custodian;
  custodianName: string;
  community: string;
  interpretation: string;
  historicalContext?: string;
  recordedAt: string;
}

export interface Knowledge {
  _id: string;
  title: string;
  summary: string;
  content: string;
  language: string;
  originalLanguage: string;
  culturalCategory: 'temple_heritage' | 'ritual_tradition' | 'folk_art' | 'craft' | 'oral_history' | 'festival' | 'traditional_cuisine' | 'sacred_geography';
  custodianId: Custodian;
  sourceType: 'oral_lineage' | 'archival_manuscript' | 'living_practice' | 'temple_record';
  sourceDetails: string;
  mediaUrls: string[];
  verificationStatus: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  visibility: 'PUBLIC' | 'COMMUNITY' | 'RESTRICTED';
  perspectives: Perspective[];
  tags: string[];
  location?: {
    type: 'Point';
    coordinates: [number, number];
    region: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Experience Types
export interface Experience {
  _id: string;
  title: string;
  description: string;
  culturalContext: string;
  custodianId: Custodian;
  category: 'craft_workshop' | 'folk_performance' | 'heritage_walk' | 'storytelling' | 'temple_ritual' | 'traditional_cuisine' | 'community_gathering';
  durationMinutes: number;
  location: {
    type: 'Point';
    coordinates: [number, number];
    address: string;
    city: string;
    region: string;
  };
  capacity: number;
  price: number;
  languages: string[];
  availabilitySchedule: string[];
  culturalGuidelines: string[];
  preparationRequirements: string[];
  images: string[];
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'ACTIVE' | 'INACTIVE';
  rating: number;
  totalReviews: number;
  totalBookings: number;
  createdAt: string;
}

// Booking Types
export interface Booking {
  _id: string;
  bookingNumber: string;
  travellerId: string | User;
  experienceId: Experience;
  custodianId: Custodian;
  bookingDate: string;
  slotTime: string;
  numberOfPeople: number;
  unitPrice: number;
  totalAmount: number;
  commissionRate: number;
  platformCommission: number;
  custodianShare: number;
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  paymentStatus: 'PAID' | 'REFUNDED' | 'PENDING';
  paymentId?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  specialRequests?: string;
  createdAt: string;
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Auth API
export const authAPI = {
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Registration failed');
    }
    return res.json();
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Login failed');
    }
    return res.json();
  },

  getCurrentUser: async (): Promise<{ success: boolean; data: User }> => {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },
};

// Custodian API
export const custodianAPI = {
  getAll: async (params?: { category?: string; region?: string; search?: string }): Promise<{ success: boolean; count: number; data: Custodian[] }> => {
    const query = new URLSearchParams((params || {}) as Record<string, string>).toString();
    const res = await fetch(`${API_URL}/custodians${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch custodians');
    return res.json();
  },

  getById: async (id: string): Promise<{ success: boolean; data: Custodian }> => {
    const res = await fetch(`${API_URL}/custodians/${id}`);
    if (!res.ok) throw new Error('Failed to fetch custodian details');
    return res.json();
  },

  apply: async (data: any): Promise<{ success: boolean; message: string; custodian: Custodian }> => {
    const res = await fetch(`${API_URL}/custodians/apply`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to submit application');
    }
    return res.json();
  },

  getMyProfile: async (): Promise<{ success: boolean; data: Custodian }> => {
    const res = await fetch(`${API_URL}/custodians/me/profile`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch custodian profile');
    return res.json();
  },

  updateMyProfile: async (data: any): Promise<{ success: boolean; data: Custodian }> => {
    const res = await fetch(`${API_URL}/custodians/me/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update custodian profile');
    return res.json();
  },

  getDashboard: async (): Promise<{ success: boolean; data: any }> => {
    const res = await fetch(`${API_URL}/custodians/me/dashboard`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load custodian dashboard');
    return res.json();
  },
};

// Knowledge API
export const knowledgeAPI = {
  getAll: async (params?: { category?: string; region?: string; custodianId?: string; search?: string }): Promise<{ success: boolean; count: number; data: Knowledge[] }> => {
    const query = new URLSearchParams((params || {}) as Record<string, string>).toString();
    const res = await fetch(`${API_URL}/knowledge${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch cultural knowledge');
    return res.json();
  },

  getById: async (id: string): Promise<{ success: boolean; data: Knowledge }> => {
    const res = await fetch(`${API_URL}/knowledge/${id}`);
    if (!res.ok) throw new Error('Failed to fetch knowledge record');
    return res.json();
  },

  createDraft: async (data: any): Promise<{ success: boolean; data: Knowledge; message: string }> => {
    const res = await fetch(`${API_URL}/knowledge/draft`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create knowledge draft');
    }
    return res.json();
  },

  structureWithAI: async (rawNotes: string, categoryHint?: string): Promise<{ success: boolean; data: any }> => {
    const res = await fetch(`${API_URL}/knowledge/structure-ai`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ rawNotes, categoryHint }),
    });
    if (!res.ok) throw new Error('Failed to structure knowledge with AI');
    return res.json();
  },

  approve: async (id: string, notes?: string): Promise<{ success: boolean; data: Knowledge; message: string }> => {
    const res = await fetch(`${API_URL}/knowledge/${id}/approve`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ notes }),
    });
    if (!res.ok) throw new Error('Failed to approve knowledge');
    return res.json();
  },

  addPerspective: async (id: string, interpretation: string, historicalContext?: string): Promise<{ success: boolean; data: Knowledge }> => {
    const res = await fetch(`${API_URL}/knowledge/${id}/perspective`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ interpretation, historicalContext }),
    });
    if (!res.ok) throw new Error('Failed to add perspective');
    return res.json();
  },
};

// Experiences API
export const experienceAPI = {
  getAll: async (params?: { category?: string; region?: string; custodianId?: string; maxPrice?: number; search?: string }): Promise<{ success: boolean; count: number; data: Experience[] }> => {
    const query = new URLSearchParams((params || {}) as unknown as Record<string, string>).toString();
    const res = await fetch(`${API_URL}/experiences${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch experiences');
    return res.json();
  },

  getById: async (id: string): Promise<{ success: boolean; data: Experience }> => {
    const res = await fetch(`${API_URL}/experiences/${id}`);
    if (!res.ok) throw new Error('Failed to fetch experience details');
    return res.json();
  },

  create: async (data: any): Promise<{ success: boolean; data: Experience; message: string }> => {
    const res = await fetch(`${API_URL}/experiences`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create experience');
    }
    return res.json();
  },

  update: async (id: string, data: any): Promise<{ success: boolean; data: Experience }> => {
    const res = await fetch(`${API_URL}/experiences/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update experience');
    return res.json();
  },
};

// Bookings API
export const bookingAPI = {
  create: async (data: {
    experienceId: string;
    bookingDate: string;
    slotTime: string;
    numberOfPeople: number;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    specialRequests?: string;
  }): Promise<{ success: boolean; data: { booking: Booking; economicBreakdown: any }; message: string }> => {
    const res = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Booking failed');
    }
    return res.json();
  },

  getMyBookings: async (): Promise<{ success: boolean; count: number; data: Booking[] }> => {
    const res = await fetch(`${API_URL}/bookings/my-bookings`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  },

  cancel: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await fetch(`${API_URL}/bookings/${id}/cancel`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to cancel booking');
    return res.json();
  },
};

// AI Cultural Assistant API (Permission-gated RAG with provenance citation)
export interface RAGCitation {
  id: string;
  title: string;
  custodianName: string;
  culturalAffiliation: string;
  sourceProvenance: string;
  category: string;
  visibility: string;
  excerpt: string;
}

export interface RAGResponse {
  answer: string;
  grounded: boolean;
  citations: RAGCitation[];
  perspectives?: {
    custodianName: string;
    community: string;
    perspective: string;
  }[];
  fallbackNotice?: string;
}

export const aiAPI = {
  askCulturalAssistant: async (query: string): Promise<{ success: boolean; data: RAGResponse }> => {
    const res = await fetch(`${API_URL}/ai/ask`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ query }),
    });
    if (!res.ok) throw new Error('Cultural assistant request failed');
    return res.json();
  },
};

// Admin API
export const adminAPI = {
  getVerifications: async (status?: string): Promise<{ success: boolean; count: number; data: Custodian[] }> => {
    const res = await fetch(`${API_URL}/admin/verifications${status ? `?status=${status}` : ''}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch verification queue');
    return res.json();
  },

  updateVerification: async (id: string, status: string, notes?: string): Promise<{ success: boolean; message: string; data: Custodian }> => {
    const res = await fetch(`${API_URL}/admin/verify-custodian/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes }),
    });
    if (!res.ok) throw new Error('Failed to update verification');
    return res.json();
  },

  getOverview: async (): Promise<{ success: boolean; data: any }> => {
    const res = await fetch(`${API_URL}/admin/overview`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch platform overview');
    return res.json();
  },
};

// Ingestion & Candidate Review API
export interface KnowledgeCandidate {
  _id: string;
  title: string;
  sourceType: string;
  sourceName: string;
  sourceUrl: string;
  licenseAttribution: string;
  entityType: string;
  summary: string;
  rawContent: string;
  location?: {
    coordinates: [number, number];
    city?: string;
    region?: string;
  };
  tags: string[];
  reviewStatus: 'PENDING_REVIEW' | 'APPROVED_DISCOVERY' | 'REJECTED' | 'PROMOTED_TO_CUSTODIAN_KNOWLEDGE';
  reviewNotes?: string;
  assignedCustodianId?: Custodian;
  createdAt: string;
}

export const ingestionAPI = {
  fetchOSM: async (region?: string): Promise<{ success: boolean; message: string; data: any }> => {
    const res = await fetch(`${API_URL}/ingestion/fetch-osm`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ region }),
    });
    if (!res.ok) throw new Error('Failed to fetch from OpenStreetMap');
    return res.json();
  },

  fetchWikimedia: async (topic: string): Promise<{ success: boolean; message: string; data: KnowledgeCandidate }> => {
    const res = await fetch(`${API_URL}/ingestion/fetch-wikimedia`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ topic }),
    });
    if (!res.ok) throw new Error('Failed to fetch Wikimedia background summary');
    return res.json();
  },

  getCandidates: async (params?: { status?: string; sourceType?: string }): Promise<{ success: boolean; count: number; data: KnowledgeCandidate[] }> => {
    const query = new URLSearchParams((params || {}) as Record<string, string>).toString();
    const res = await fetch(`${API_URL}/ingestion/candidates${query ? `?${query}` : ''}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch discovery candidates');
    return res.json();
  },

  reviewCandidate: async (id: string, status: string, notes?: string): Promise<{ success: boolean; data: KnowledgeCandidate }> => {
    const res = await fetch(`${API_URL}/ingestion/candidates/${id}/review`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes }),
    });
    if (!res.ok) throw new Error('Failed to update candidate review status');
    return res.json();
  },

  promoteCandidate: async (id: string, custodianId: string, refinedContent?: string): Promise<{ success: boolean; message: string; data: any }> => {
    const res = await fetch(`${API_URL}/ingestion/candidates/${id}/promote`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ custodianId, refinedContent }),
    });
    if (!res.ok) throw new Error('Failed to promote candidate to knowledge corpus');
    return res.json();
  },
};

// Legacy Temple API (Preserved for compatibility)
export const templeAPI = {
  getAll: async (params?: { region?: string; sort?: string; search?: string }): Promise<{ success: boolean; count: number; data: Temple[] }> => {
    const query = new URLSearchParams((params || {}) as unknown as Record<string, string>).toString();
    const res = await fetch(`${API_URL}/temples${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch temples');
    return res.json();
  },

  getById: async (id: string): Promise<{ success: boolean; data: Temple }> => {
    const res = await fetch(`${API_URL}/temples/${id}`);
    if (!res.ok) throw new Error('Failed to fetch temple');
    return res.json();
  },

  addToFavorites: async (templeId: string): Promise<{ success: boolean; data: string[] }> => {
    const res = await fetch(`${API_URL}/temples/${templeId}/favorite`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to add to favorites');
    return res.json();
  },

  removeFromFavorites: async (templeId: string): Promise<{ success: boolean; data: string[] }> => {
    const res = await fetch(`${API_URL}/temples/${templeId}/favorite`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to remove from favorites');
    return res.json();
  },
};

// Review API
export const reviewAPI = {
  getByTemple: async (templeId: string): Promise<{ success: boolean; count: number; data: Review[] }> => {
    const res = await fetch(`${API_URL}/temples/${templeId}/reviews`);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return res.json();
  },

  create: async (templeId: string, formData: FormData): Promise<{ success: boolean; data: Review }> => {
    const headers = getAuthHeaders();
    delete (headers as any)['Content-Type'];

    const res = await fetch(`${API_URL}/temples/${templeId}/reviews`, {
      method: 'POST',
      headers,
      body: formData,
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to create review');
    }
    return res.json();
  },

  delete: async (reviewId: string): Promise<{ success: boolean }> => {
    const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete review');
    return res.json();
  },
};

// Chat API compatibility export
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const chatAPI = {
  sendMessage: async (message: string, apiKey?: string): Promise<string> => {
    try {
      const res = await aiAPI.askCulturalAssistant(message);
      if (res.success && res.data) {
        return res.data.answer;
      }
      return "I couldn't retrieve verified information about this in the available cultural sources.";
    } catch (err: any) {
      console.error('Chat API Error:', err);
      return "I couldn't retrieve verified information at this moment.";
    }
  }
};

// ==========================================
// Cultural Knowledge Graph API (Living Culture)
// ==========================================
export interface CulturalOverview {
  summary: {
    regionsCount: number;
    placesCount: number;
    templesCount: number;
    traditionsCount: number;
    ritualsCount: number;
    festivalsCount: number;
    performingArtsCount: number;
    craftsCount: number;
    storiesCount: number;
    communitiesCount: number;
    ecologyCount: number;
    termsCount: number;
  };
  featuredTraditions: any[];
  featuredArts: any[];
  featuredStories: any[];
  featuredRituals: any[];
  featuredFestivals: any[];
  featuredEcology: any[];
  wordOfTheDay: any;
}

export interface CulturalRitual {
  id: string;
  name: string;
  vernacularName?: string;
  vernacular_name?: string;
  category: string;
  epistemicStatus?: string;
  epistemic_status?: string;
  shortDescription?: string;
  fullDescription?: string;
  summary?: string;
  region?: string;
  associatedPlaces?: string[];
  associatedTraditions?: string[];
  communities?: string[];
  custodians?: string[];
  ritualSpecialists?: string[];
  objectsMaterials?: string[];
  calendarTiming?: string;
  seasonal_timing?: string;
  culturalContext?: string;
  relatedFestivals?: string[];
  relatedPlaces?: string[];
  relatedCulturalTerms?: string[];
  source?: string;
  verificationStatus?: string;
}

export const culturalAPI = {
  getOverview: async (): Promise<{ success: boolean; data: CulturalOverview }> => {
    const res = await fetch(`${API_URL}/cultural/overview`);
    if (!res.ok) throw new Error('Failed to fetch cultural overview');
    return res.json();
  },

  getRituals: async (params?: { category?: string; search?: string; epistemic_status?: string; community?: string }): Promise<{ success: boolean; count: number; data: CulturalRitual[] }> => {
    const query = new URLSearchParams((params || {}) as Record<string, string>).toString();
    const res = await fetch(`${API_URL}/cultural/rituals${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch rituals');
    return res.json();
  },

  getFestivals: async (): Promise<{ success: boolean; count: number; data: any[] }> => {
    const res = await fetch(`${API_URL}/cultural/festivals`);
    if (!res.ok) throw new Error('Failed to fetch festivals');
    return res.json();
  },

  getArtsAndCrafts: async (): Promise<{ success: boolean; data: { performingArts: any[]; crafts: any[] } }> => {
    const res = await fetch(`${API_URL}/cultural/arts`);
    if (!res.ok) throw new Error('Failed to fetch arts and crafts');
    return res.json();
  },

  getStories: async (): Promise<{ success: boolean; count: number; data: any[] }> => {
    const res = await fetch(`${API_URL}/cultural/stories`);
    if (!res.ok) throw new Error('Failed to fetch oral stories');
    return res.json();
  },

  getPlacesAndEcology: async (): Promise<{ success: boolean; data: { places: any[]; sacredEcology: any[]; temples: any[] } }> => {
    const res = await fetch(`${API_URL}/cultural/places`);
    if (!res.ok) throw new Error('Failed to fetch sacred geography');
    return res.json();
  },

  getTerms: async (): Promise<{ success: boolean; count: number; data: any[] }> => {
    const res = await fetch(`${API_URL}/cultural/terms`);
    if (!res.ok) throw new Error('Failed to fetch cultural terms');
    return res.json();
  },

  getGraph: async (): Promise<{ success: boolean; data: { nodes: any[]; edges: any[] } }> => {
    const res = await fetch(`${API_URL}/cultural/graph`);
    if (!res.ok) throw new Error('Failed to fetch cultural graph');
    return res.json();
  }
};

