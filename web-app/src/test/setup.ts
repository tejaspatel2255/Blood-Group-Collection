import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';

// Use Vitest's mock system if needed
// For example, mocking global fetch or localStorage if jsdom is not enough
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});
