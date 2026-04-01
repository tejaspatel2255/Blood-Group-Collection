import { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Home, Users, Plus, Calendar, History, Info } from 'lucide-react';
import { Donor } from './types';

// Pages
import Onboarding from './pages/Onboarding';
import HomeTab from './pages/HomeTab';
import DonorsTab from './pages/DonorsTab';
import DonorFormTab from './pages/DonorFormTab';
import ScheduleTab from './pages/ScheduleTab';
import HistoryTab from './pages/HistoryTab';
import InfoTab from './pages/InfoTab';

function MainApp() {
  const { hasSeenOnboarding } = useAppContext();
  const [activeTab, setActiveTab] = useState('home');
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);

  if (!hasSeenOnboarding) {
    return <Onboarding />;
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'home': return <HomeTab setTab={setActiveTab} />;
      case 'donors': return <DonorsTab setTab={setActiveTab} setEditingDonor={setEditingDonor} />;
      case 'add': return <DonorFormTab setTab={setActiveTab} editingDonor={editingDonor} setEditingDonor={setEditingDonor} />;
      case 'schedule': return <ScheduleTab />;
      case 'history': return <HistoryTab setTab={setActiveTab} />;
      case 'info': return <InfoTab />;
      default: return <HomeTab setTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative font-sans">
      
      {/* Top Header */}
      <header className="bg-white px-5 py-4 shadow-sm flex items-center justify-between sticky top-0 z-40 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary shadow-md shadow-red-200 rounded-full flex items-center justify-center text-white font-bold font-heading">P</div>
          <span className="font-heading font-bold text-xl text-gray-900 tracking-tight">Patel Samaj</span>
        </div>
        <button 
          onClick={() => setActiveTab('info')}
          className={`p-2 rounded-full transition-colors ${activeTab === 'info' ? 'bg-red-50 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Info className="w-6 h-6" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full relative">
        {renderTab()}
      </main>

      {/* Bottom Navigation Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white px-6 py-2 pb-safe flex justify-between items-center z-50 border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center p-2 transition-all duration-300 ${activeTab === 'home' ? 'text-primary scale-110' : 'text-gray-400 hover:text-gray-600'}`}>
          <Home className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
        </button>
        
        <button onClick={() => setActiveTab('donors')} className={`flex flex-col items-center p-2 transition-all duration-300 ${activeTab === 'donors' ? 'text-primary scale-110' : 'text-gray-400 hover:text-gray-600'}`}>
          <Users className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Donors</span>
        </button>
        
        {/* Center FAB Button */}
        <div className="relative -top-6">
          <button 
            onClick={() => { setEditingDonor(null); setActiveTab('add'); }} 
            className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ${activeTab === 'add' ? 'bg-red-800 shadow-red-900/30 ring-4 ring-red-50' : 'bg-primary shadow-red-600/40 ring-4 ring-white'}`}
          >
            <Plus className="w-7 h-7" />
          </button>
        </div>

        <button onClick={() => setActiveTab('schedule')} className={`flex flex-col items-center p-2 transition-all duration-300 ${activeTab === 'schedule' ? 'text-primary scale-110' : 'text-gray-400 hover:text-gray-600'}`}>
          <Calendar className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Schedule</span>
        </button>
        
        <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center p-2 transition-all duration-300 ${activeTab === 'history' ? 'text-primary scale-110' : 'text-gray-400 hover:text-gray-600'}`}>
          <History className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-wider">History</span>
        </button>

      </nav>
      
      {/* Spacer to push content above fixed nav bar */}
      <div className="h-20 w-full" />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
