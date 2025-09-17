export type Buyer = {
  id: string;
  fullName: string;
  email?: string;
  phone: string;
  city: 'Chandigarh' | 'Mohali' | 'Zirakpur' | 'Panchkula' | 'Other';
  propertyType: 'Apartment' | 'Villa' | 'Plot' | 'Office' | 'Retail';
  bhk?: '1' | '2' | '3' | '4' | 'Studio';
  purpose: 'Buy' | 'Rent';
  budgetMin?: number;
  budgetMax?: number;
  timeline: '0-3m' | '3-6m' | '>6m' | 'Exploring';
  source: 'Website' | 'Referral' | 'Walk-in' | 'Call' | 'Other';
  status: 'New' | 'Qualified' | 'Contacted' | 'Visited' | 'Negotiation' | 'Converted' | 'Dropped';
  notes?: string;
  tags?: string[];
  updatedAt: string;
};


export type BuyerHistory = {
  id: string;
  buyerId: string;
  changedBy: string;
  changedAt: string;
  diff: Record<string, any>;
};
