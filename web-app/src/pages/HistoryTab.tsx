
import { useAppContext } from '../context/AppContext';
import { History, Droplet, Activity, ActivitySquare } from 'lucide-react';

export default function HistoryTab({ setTab }: { setTab: (t: string) => void }) {
  const { donations, donors } = useAppContext();
  
  const getDonorName = (id: string) => donors.find(d => d.id === id)?.name || 'Unknown';
  
  // Group by year
  const groupedDonations = donations.reduce((acc, donation) => {
    const year = new Date(donation.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(donation);
    return acc;
  }, {} as Record<number, typeof donations>);

  const years = Object.keys(groupedDonations).map(Number).sort((a,b) => b - a);

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-gray-900">Donation History</h1>
        <button 
          onClick={() => setTab('donors')}
          className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
        >
          Add Record +
        </button>
      </div>

      {donations.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <History className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-heading font-medium text-gray-900 mb-1">No Records Yet</h3>
          <p>You haven't recorded any past donations.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {years.map(year => (
            <div key={year}>
              <div className="inline-block px-4 py-1.5 rounded-full bg-red-100 text-primary font-bold text-sm mb-4">
                {year}
              </div>
              
              <div className="relative pl-4 border-l-2 border-red-100 space-y-6">
                {groupedDonations[year].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(d => (
                  <div key={d.id} className="relative">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 bg-primary rounded-full ring-4 ring-white shadow-sm" />
                    
                    <div className="premium-card p-5 hover:-translate-y-1 transition-transform duration-300">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-heading font-semibold text-gray-900">{getDonorName(d.donorId)}</h3>
                        <span className="text-sm text-gray-500 font-medium bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                          {new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 text-xs font-bold mt-3">
                        <span className="flex items-center gap-1 bg-red-50 text-primary border border-red-100 px-3 py-1.5 rounded-lg">
                          <Droplet className="w-3.5 h-3.5" /> {d.bloodType}
                        </span>
                        <span className="flex items-center gap-1 bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1.5 rounded-lg">
                          <Activity className="w-3.5 h-3.5" /> Hb: {d.hemoglobin}
                        </span>
                        <span className="flex items-center gap-1 bg-green-50 text-green-600 border border-green-100 px-3 py-1.5 rounded-lg">
                          <ActivitySquare className="w-3.5 h-3.5" /> {d.volume}ml
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
