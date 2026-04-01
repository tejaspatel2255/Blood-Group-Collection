import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Calendar, MapPin, Trash2, Clock } from 'lucide-react';
import { ScheduledDonation } from '../types';

export default function ScheduleTab() {
  const { schedules, donors, addSchedule, deleteSchedule } = useAppContext();
  
  const [formData, setFormData] = useState<Partial<ScheduledDonation>>({
    donorId: '',
    scheduledDate: '',
    location: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.donorId) return alert('Select a donor');
    addSchedule({
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
    } as ScheduledDonation);
    // Reset
    setFormData({ donorId: '', scheduledDate: '', location: '', notes: '' });
  };

  const getDonorName = (id: string) => donors.find(d => d.id === id)?.name || 'Unknown';
  const getDonorBg = (id: string) => donors.find(d => d.id === id)?.bloodGroup || 'O+';

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto animate-fade-in">
      <h1 className="text-2xl font-heading font-bold text-gray-900 mb-6">Upcoming Donations</h1>

      <div className="premium-card p-6 mb-8">
        <h2 className="text-lg font-heading font-semibold mb-3 flex items-center gap-2 text-gray-900 border-b border-gray-100 pb-3">
          <Calendar className="w-5 h-5 text-primary" /> Schedule a Donation
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-sm font-bold text-gray-800 block mb-1">Select Donor*</label>
            <select required value={formData.donorId} onChange={e => setFormData({...formData, donorId: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all font-medium">
              <option value="" disabled>Choose a donor...</option>
              {donors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.bloodGroup})</option>)}
            </select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-bold text-gray-800 block mb-1">Date & Time*</label>
              <input required type="datetime-local" value={formData.scheduledDate} min={new Date().toISOString().slice(0, 16)} onChange={e => setFormData({...formData, scheduledDate: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all font-medium" />
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-gray-800 block mb-1">Location*</label>
            <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all font-medium" placeholder="Hospital or Camp" />
          </div>
          <button type="submit" className="w-full py-4 mt-2 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            Confirm Appointment
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {schedules.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Nothing scheduled for now...</p>
          </div>
        ) : (
          schedules.sort((a,b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()).map(s => {
            const dateObj = new Date(s.scheduledDate);
            return (
              <div key={s.id} className="premium-card p-5 relative pr-12 animate-fade-in group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-heading font-semibold text-gray-900">{getDonorName(s.donorId)}</h3>
                  <span className="text-xs font-bold text-primary bg-red-50 px-2.5 py-1 rounded-full shadow-sm">{getDonorBg(s.donorId)}</span>
                </div>
                <div className="text-sm text-gray-700 flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-primary" />
                  {dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} at {dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </div>
                <div className="text-sm text-gray-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  {s.location}
                </div>
                <button 
                  onClick={() => deleteSchedule(s.id)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-full transition-all duration-300 opacity-80 group-hover:opacity-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
