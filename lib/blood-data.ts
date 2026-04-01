// Blood group related constants and utilities
export const BLOOD_GROUPS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'] as const;
export type BloodGroup = typeof BLOOD_GROUPS[number];

export const BLOOD_GROUP_COLORS: Record<BloodGroup, string> = {
  'O+': 'bg-red-100 text-red-800 border-red-300',
  'O-': 'bg-orange-100 text-orange-800 border-orange-300',
  'A+': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'A-': 'bg-amber-100 text-amber-800 border-amber-300',
  'B+': 'bg-blue-100 text-blue-800 border-blue-300',
  'B-': 'bg-cyan-100 text-cyan-800 border-cyan-300',
  'AB+': 'bg-purple-100 text-purple-800 border-purple-300',
  'AB-': 'bg-pink-100 text-pink-800 border-pink-300',
};

export const AREAS = [
  'Surat',
  'Ahmedabad',
  'Vadodara',
  'Rajkot',
  'Bhavnagar',
  'Anand',
  'Vapi',
  'Navsari',
  'Valsad',
  'Gandhinagar',
] as const;

export const GENDERS = ['Male', 'Female', 'Other'] as const;

export interface Donor {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  phoneNumber: string;
  email: string;
  area: string;
  gender: string;
  dateOfBirth: string;
  lastDonationDate?: string;
  totalDonations: number;
  isAvailable: boolean;
  createdAt: string;
}

export interface DonationRecord {
  id: string;
  donorId: string;
  donationDate: string;
  bloodGroup: BloodGroup;
  volume: number;
  location: string;
  notes: string;
  recordedAt: string;
}

export interface ScheduledDonation {
  id: string;
  donorId: string;
  scheduledDate: string;
  bloodGroup: BloodGroup;
  status: 'pending' | 'completed' | 'cancelled';
  location: string;
  notes: string;
  createdAt: string;
}

// Sample seeded donors (15+ donors across all blood groups)
export const SAMPLE_DONORS: Donor[] = [];
