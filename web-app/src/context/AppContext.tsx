import { createContext, useContext, ReactNode } from 'react';
import { useBloodDonorData } from '../hooks/useBloodDonorData';

type AppContextType = ReturnType<typeof useBloodDonorData>;

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const data = useBloodDonorData();
  return <AppContext.Provider value={data}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
