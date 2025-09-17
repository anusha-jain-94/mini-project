// src/lib/fakeDB.ts
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
export let buyers: Buyer[] = [
  {
    id: '1',
    fullName: 'Alice Smith',
    email: 'alice@example.com',
    phone: '9876543210',
    city: 'Chandigarh',
    propertyType: 'Apartment',
    bhk: '2',
    purpose: 'Buy',
    budgetMin: 5000000,
    budgetMax: 7000000,
    timeline: '0-3m',
    source: 'Website',
    status: 'New',
    notes: 'Looking for 2BHK with parking',
    tags: ['hot', 'priority'],
    updatedAt: new Date().toISOString(),
  },
];
