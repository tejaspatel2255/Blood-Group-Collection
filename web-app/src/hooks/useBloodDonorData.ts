import { useState, useEffect, useCallback } from 'react';
import { Donor, DonationRecord, ScheduledDonation } from '../types';

export function useBloodDonorData() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [schedules, setSchedules] = useState<ScheduledDonation[]>([]);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const storedDonors = localStorage.getItem('v2_donors');
        const storedDonations = localStorage.getItem('v2_donations');
        const storedSchedules = localStorage.getItem('v2_schedules');
        const onboarding = localStorage.getItem('v2_onboarding');

        if (storedDonors) setDonors(JSON.parse(storedDonors));
        if (storedDonations) setDonations(JSON.parse(storedDonations));
        if (storedSchedules) setSchedules(JSON.parse(storedSchedules));
        if (onboarding) setHasSeenOnboarding(true);
      } catch (error) {
        console.error('Failed to load data from localStorage:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, []);

  // Save to local storage whenever state changes, but only AFTER initial load
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('v2_donors', JSON.stringify(donors));
  }, [donors, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('v2_donations', JSON.stringify(donations));
  }, [donations, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('v2_schedules', JSON.stringify(schedules));
  }, [schedules, isLoaded]);

  const markOnboardingSeen = useCallback(() => {
    localStorage.setItem('v2_onboarding', 'true');
    setHasSeenOnboarding(true);
  }, []);

  // CRUD Donors
  const addDonor = useCallback((donor: Donor) => {
    setDonors(prev => [...prev, donor]);
  }, []);

  const updateDonor = useCallback((updated: Donor) => {
    setDonors(prev => prev.map(d => d.id === updated.id ? updated : d));
  }, []);

  const deleteDonor = useCallback((id: string) => {
    setDonors(prev => prev.filter(d => d.id !== id));
  }, []);

  // CRUD Donations
  const addDonation = useCallback((record: DonationRecord) => {
    setDonations(prev => [...prev, record]);
  }, []);

  const updateDonation = useCallback((updated: DonationRecord) => {
    setDonations(prev => prev.map(d => d.id === updated.id ? updated : d));
  }, []);

  const deleteDonation = useCallback((id: string) => {
    setDonations(prev => prev.filter(d => d.id !== id));
  }, []);

  // CRUD Schedules
  const addSchedule = useCallback((schedule: ScheduledDonation) => {
    setSchedules(prev => [...prev, schedule]);
  }, []);

  const deleteSchedule = useCallback((id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  }, []);

  return {
    donors, donations, schedules, hasSeenOnboarding, markOnboardingSeen,
    addDonor, updateDonor, deleteDonor,
    addDonation, updateDonation, deleteDonation,
    addSchedule, deleteSchedule, isLoaded
  };
}
