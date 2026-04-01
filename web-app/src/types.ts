export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type Gender = 'Male' | 'Female' | 'Other';

export interface Donor {
  id: string;
  name: string;
  gender: Gender;
  birthday: string;
  bloodGroup: BloodGroup;
  mobile: string;
  area: string;
  address: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface DonationRecord {
  id: string;
  donorId: string;
  date: string;
  bloodType: string;
  hemoglobin: number;
  bloodPressure: string;
  pulse: number;
  weight: number;
  volume: number;
  notes: string;
}

export interface ScheduledDonation {
  id: string;
  donorId: string;
  scheduledDate: string;
  location: string;
  notes: string;
}
