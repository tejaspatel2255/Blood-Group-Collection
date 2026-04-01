
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useAppContext } from '../context/AppContext';
import { Users, Activity, Droplet } from 'lucide-react';

export default function HomeTab({ setTab }: { setTab: (t: string) => void }) {
  const { donors, donations } = useAppContext();

  // Metrics
  const totalDonors = donors.length;
  const currentYear = new Date().getFullYear();
  const donatedThisYear = donations.filter(d => new Date(d.date).getFullYear() === currentYear).length;

  // Pie chart aggregation
  const groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const pieData = groups.map(group => ({
    name: group,
    value: donors.filter(d => d.bloodGroup === group).length
  })).filter(d => d.value > 0);

  const colors: Record<string, string> = {
    'A+': '#3B82F6', 'A-': '#93C5FD', 'B+': '#F97316', 'B-': '#FDBA74',
    'AB+': '#8B5CF6', 'AB-': '#C4B5FD', 'O+': '#10B981', 'O-': '#6EE7B7'
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl text-gray-900 leading-tight">Dashboard</h1>
          <p className="text-gray-500 text-sm">Patel Samaj Community</p>
        </div>
        <div className="bg-red-100 p-2 rounded-full transform rotate-12 shadow-sm">
          <Droplet className="w-8 h-8 text-primary" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="premium-card p-5 flex flex-col items-center justify-center text-center">
          <div className="bg-red-50 p-3 rounded-full mb-3">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <span className="text-4xl font-heading font-black text-gray-900">{totalDonors}</span>
          <span className="text-xs text-gray-500 font-bold uppercase tracking-wide mt-1">Registered<br/>Donors</span>
        </div>
        <div className="premium-card p-5 flex flex-col items-center justify-center text-center">
          <div className="bg-green-50 p-3 rounded-full mb-3">
            <Activity className="w-8 h-8 text-green-500" />
          </div>
          <span className="text-4xl font-heading font-black text-gray-900">{donatedThisYear}</span>
          <span className="text-xs text-gray-500 font-bold uppercase tracking-wide mt-1">Donations<br/>this Year</span>
        </div>
      </div>

      <div className="premium-card p-6 mb-6">
        <h2 className="text-lg font-heading font-semibold mb-1">Blood Group Distribution</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[entry.name] || '#CBD5E1'} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontWeight: 600 }}
                itemStyle={{ color: '#1F2937' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          {groups.map(group => {
            const count = donors.filter(d => d.bloodGroup === group).length;
            if (count === 0) return null;
            return (
              <button 
                key={group} 
                className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm hover:scale-105 transition-transform"
                style={{ backgroundColor: colors[group] }}
                onClick={() => setTab('donors')}
              >
                {group} <span className="opacity-80 font-normal ml-1">({count})</span>
              </button>
            )
          })}
        </div>
      </div>

      <button 
        onClick={() => setTab('add')}
        className="w-full bg-primary text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-200 hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-300"
      >
        <Users className="w-5 h-5" /> Register New Donor
      </button>
    </div>
  );
}
