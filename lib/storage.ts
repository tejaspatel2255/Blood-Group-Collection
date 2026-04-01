import { Donor, DonationRecord, ScheduledDonation } from './blood-data';

const DONORS_KEY = 'blood_donors';
const DONATIONS_KEY = 'blood_donations';
const SCHEDULED_KEY = 'blood_scheduled';
const ONBOARDING_KEY = 'blood_onboarding_shown';

export const storageHelpers = {
  // Donors
  getDonors: (): Donor[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(DONORS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveDonors: (donors: Donor[]): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(DONORS_KEY, JSON.stringify(donors));
    } catch (e) {
      console.error('Failed to save donors', e);
    }
  },

  addDonor: (donor: Donor): void => {
    const donors = storageHelpers.getDonors();
    donors.push(donor);
    storageHelpers.saveDonors(donors);
  },

  updateDonor: (id: string, updates: Partial<Donor>): void => {
    const donors = storageHelpers.getDonors();
    const index = donors.findIndex(d => d.id === id);
    if (index !== -1) {
      donors[index] = { ...donors[index], ...updates };
      storageHelpers.saveDonors(donors);
    }
  },

  deleteDonor: (id: string): void => {
    const donors = storageHelpers.getDonors();
    storageHelpers.saveDonors(donors.filter(d => d.id !== id));
  },

  // Donation Records
  getDonationRecords: (): DonationRecord[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(DONATIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveDonationRecords: (records: DonationRecord[]): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(DONATIONS_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save donation records', e);
    }
  },

  addDonationRecord: (record: DonationRecord): void => {
    const records = storageHelpers.getDonationRecords();
    records.push(record);
    storageHelpers.saveDonationRecords(records);
  },

  deleteDonationRecord: (id: string): void => {
    const records = storageHelpers.getDonationRecords();
    storageHelpers.saveDonationRecords(records.filter(r => r.id !== id));
  },

  getDonorRecords: (donorId: string): DonationRecord[] => {
    const records = storageHelpers.getDonationRecords();
    return records.filter(r => r.donorId === donorId);
  },

  // Scheduled Donations
  getScheduledDonations: (): ScheduledDonation[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(SCHEDULED_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveScheduledDonations: (scheduled: ScheduledDonation[]): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(SCHEDULED_KEY, JSON.stringify(scheduled));
    } catch (e) {
      console.error('Failed to save scheduled donations', e);
    }
  },

  addScheduledDonation: (scheduled: ScheduledDonation): void => {
    const list = storageHelpers.getScheduledDonations();
    list.push(scheduled);
    storageHelpers.saveScheduledDonations(list);
  },

  updateScheduledDonation: (id: string, updates: Partial<ScheduledDonation>): void => {
    const list = storageHelpers.getScheduledDonations();
    const index = list.findIndex(s => s.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      storageHelpers.saveScheduledDonations(list);
    }
  },

  deleteScheduledDonation: (id: string): void => {
    const list = storageHelpers.getScheduledDonations();
    storageHelpers.saveScheduledDonations(list.filter(s => s.id !== id));
  },

  getDonorScheduled: (donorId: string): ScheduledDonation[] => {
    const scheduled = storageHelpers.getScheduledDonations();
    return scheduled.filter(s => s.donorId === donorId);
  },

  // Onboarding
  isOnboardingShown: (): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(ONBOARDING_KEY) === 'true';
    } catch (e) {
      return false;
    }
  },

  markOnboardingShown: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (e) {
      console.error('Failed to mark onboarding shown', e);
    }
  },
};
