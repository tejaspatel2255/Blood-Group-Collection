import { createContext, useContext, useState, useEffect } from 'react';
import { DonationRecord } from './AuthContext';
import { useAuth } from './AuthContext';

interface DonationContextType {
  records: DonationRecord[];
  pastDonations: DonationRecord[];
  scheduledDonations: DonationRecord[];
  addRecord: (record: Omit<DonationRecord, 'id' | 'userId'>) => void;
  deleteRecord: (id: string) => void;
  getTotalVolume: () => number;
  getLastDonationDate: () => string | null;
}

const DonationContext = createContext<DonationContextType | undefined>(undefined);

export function DonationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  const [records, setRecords] = useState<DonationRecord[]>(() => {
    const saved = localStorage.getItem('bdc_donations');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('bdc_donations', JSON.stringify(records));
  }, [records]);

  // Filter for the current user
  const userRecords = records.filter(r => r.userId === user?.id);
  const userPastRecords = userRecords.filter(r => !r.isScheduled).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const userScheduledRecords = userRecords.filter(r => r.isScheduled).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const addRecord = (recordData: Omit<DonationRecord, 'id' | 'userId'>) => {
    if (!user) return;
    
    const newRecord: DonationRecord = {
      ...recordData,
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id
    };
    
    setRecords(prev => [...prev, newRecord]);
  };

  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };



  const getTotalVolume = () => {
    return userPastRecords.reduce((total, record) => total + Number(record.volumeAmount), 0);
  };

  const getLastDonationDate = () => {
    if (userPastRecords.length === 0) return null;
    return userPastRecords[0].date;
  };

  return (
    <DonationContext.Provider value={{
      records: userRecords,
      pastDonations: userPastRecords,
      scheduledDonations: userScheduledRecords,
      addRecord,
      deleteRecord,
      getTotalVolume,
      getLastDonationDate
    }}>
      {children}
    </DonationContext.Provider>
  );
}

export function useDonation() {
  const context = useContext(DonationContext);
  if (context === undefined) {
    throw new Error('useDonation must be used within a DonationProvider');
  }
  return context;
}
