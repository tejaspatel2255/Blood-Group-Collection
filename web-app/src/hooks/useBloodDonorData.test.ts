import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useBloodDonorData } from './useBloodDonorData';
import { Donor } from '../types';

const mockDonor: Donor = {
  id: '1',
  name: 'John Doe',
  bloodGroup: 'A+',
  phone: '1234567890',
  address: 'Test Address',
  lastDonationDate: null,
};

describe('useBloodDonorData', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with empty arrays when localStorage is empty', async () => {
    const { result } = renderHook(() => useBloodDonorData());
    
    // Wait for initial load
    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    expect(result.current.donors).toEqual([]);
    expect(result.current.donations).toEqual([]);
    expect(result.current.schedules).toEqual([]);
  });

  it('should load data from localStorage on initialization', async () => {
    const donors = [mockDonor];
    localStorage.setItem('v2_donors', JSON.stringify(donors));

    const { result } = renderHook(() => useBloodDonorData());
    
    await waitFor(() => expect(result.current.isLoaded).toBe(true));
    expect(result.current.donors).toEqual(donors);
  });

  it('should add a donor and persist to localStorage', async () => {
    const { result } = renderHook(() => useBloodDonorData());
    
    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.addDonor(mockDonor);
    });

    expect(result.current.donors).toContainEqual(mockDonor);
    
    // Check localStorage
    const stored = JSON.parse(localStorage.getItem('v2_donors') || '[]');
    expect(stored).toContainEqual(mockDonor);
  });

  it('should update a donor', async () => {
    const { result } = renderHook(() => useBloodDonorData());
    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.addDonor(mockDonor);
    });

    const updatedDonor = { ...mockDonor, name: 'Jane Doe' };
    act(() => {
      result.current.updateDonor(updatedDonor);
    });

    expect(result.current.donors[0].name).toBe('Jane Doe');
    const stored = JSON.parse(localStorage.getItem('v2_donors') || '[]');
    expect(stored[0].name).toBe('Jane Doe');
  });

  it('should delete a donor and update localStorage to empty array', async () => {
    const { result } = renderHook(() => useBloodDonorData());
    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    act(() => {
      result.current.addDonor(mockDonor);
    });

    act(() => {
      result.current.deleteDonor(mockDonor.id);
    });

    expect(result.current.donors).toHaveLength(0);
    const stored = JSON.parse(localStorage.getItem('v2_donors') || '[]');
    expect(stored).toHaveLength(0);
  });

  it('should handle JSON parse errors gracefully', async () => {
    localStorage.setItem('v2_donors', 'invalid json');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useBloodDonorData());
    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    expect(result.current.donors).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
