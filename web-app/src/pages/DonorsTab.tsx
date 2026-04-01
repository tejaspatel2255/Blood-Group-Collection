import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Search, Filter, Phone, MapPin, User, Edit2, Trash2, FileText } from 'lucide-react';
import { Donor, BloodGroup, Gender } from '../types';

export default function DonorsTab({ setTab, setEditingDonor }: { setTab: (t: string) => void, setEditingDonor: (d: Donor | null) => void }) {
  const { donors, deleteDonor } = useAppContext();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterBg, setFilterBg] = useState<BloodGroup | 'All'>('All');
  const [filterGender, setFilterGender] = useState<Gender | 'All'>('All');
  const [filterArea, setFilterArea] = useState<string>('');
  
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);

  const filteredDonors = useMemo(() => {
    return donors.filter(d => {
      const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || 
                          d.mobile.includes(search) || 
                          d.area.toLowerCase().includes(search.toLowerCase());
      const matchBg = filterBg === 'All' || d.bloodGroup === filterBg;
      const matchGender = filterGender === 'All' || d.gender === filterGender;
      const matchArea = !filterArea ? true : d.area.toLowerCase().includes(filterArea.toLowerCase());
      return matchSearch && matchBg && matchGender && matchArea;
    });
  }, [donors, search, filterBg, filterGender, filterArea]);

  const clearFilters = () => {
    setFilterBg('All');
    setFilterGender('All');
    setFilterArea('');
    setSearch('');
  };

  const getAge = (birthday: string) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const colors: Record<string, string> = {
    'A+': '#3B82F6', 'A-': '#93C5FD', 'B+': '#F97316', 'B-': '#FDBA74',
    'AB+': '#8B5CF6', 'AB-': '#C4B5FD', 'O+': '#10B981', 'O-': '#6EE7B7'
  };

  if (selectedDonor) {
    return (
      <div className="pb-24 pt-4 px-4 max-w-md mx-auto animate-fade-in">
        <button onClick={() => setSelectedDonor(null)} className="text-primary font-bold mb-4 flex items-center gap-1">
          &larr; Back to List
        </button>
        <div className="premium-card p-6 flex flex-col items-center">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md mb-4"
            style={{ backgroundColor: colors[selectedDonor.bloodGroup] || '#C0392B' }}
          >
            {selectedDonor.bloodGroup}
          </div>
          <h2 className="text-2xl font-heading font-bold">{selectedDonor.name}</h2>
          <p className="text-gray-500">{selectedDonor.gender}, {getAge(selectedDonor.birthday)} yrs</p>
          
          <div className="w-full mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <a href={`tel:${selectedDonor.mobile}`} className="text-lg font-medium text-primary hover:underline">{selectedDonor.mobile}</a>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="font-medium text-gray-900">{selectedDonor.area}</p>
                <p className="text-gray-500 text-sm">{selectedDonor.address}</p>
              </div>
            </div>
            {selectedDonor.notes && (
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-gray-400 mt-1" />
                <p className="text-gray-700 italic text-sm bg-gray-50 p-3 rounded-lg w-full">{selectedDonor.notes}</p>
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-8 w-full border-t border-gray-100 pt-6">
            <button 
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200"
              onClick={() => {
                setEditingDonor(selectedDonor);
                setTab('add');
              }}
            >
              <Edit2 className="w-4 h-4" /> Edit
            </button>
            <button 
              className="flex-1 py-3 bg-red-50 text-primary rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100"
              onClick={() => {
                if(window.confirm('Delete this donor profile?')) {
                  deleteDonor(selectedDonor.id);
                  setSelectedDonor(null);
                }
              }}
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto animate-fade-in relative">
      <h1 className="text-2xl font-heading font-bold text-gray-900 mb-4">Donors Directory</h1>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Name, number, area..." 
            className="w-full pl-10 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all text-gray-800 font-medium placeholder:font-normal"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button 
          className={`p-4 rounded-xl border transition-all duration-300 ${showFilters || filterBg !== 'All' || filterArea !== '' || filterGender !== 'All' ? 'bg-primary border-primary text-white shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm'}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {showFilters && (
        <div className="premium-card p-5 mb-6 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <span className="font-heading font-semibold text-sm text-gray-500 uppercase">Filter Details</span>
            <button onClick={clearFilters} className="text-xs font-bold text-primary hover:underline">Clear Filter</button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Blood Group</label>
              <div className="flex flex-wrap gap-2">
                {['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <button 
                    key={bg}
                    onClick={() => setFilterBg(bg as any)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${filterBg === bg ? 'bg-primary text-white border-primary shadow-md' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 block mb-2">Area / Village</label>
                <input 
                  type="text"
                  placeholder="Enter area..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  value={filterArea}
                  onChange={e => setFilterArea(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 block mb-2">Gender</label>
                <select 
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 text-sm rounded-lg focus:outline-none transition-all font-medium"
                  value={filterGender}
                  onChange={e => setFilterGender(e.target.value as any)}
                >
                  <option value="All">All</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
            
            <button 
              onClick={() => setShowFilters(false)}
              className="w-full py-2 bg-gray-900 text-white rounded-lg font-bold text-sm mt-2"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filteredDonors.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No donors found for selected filters.</p>
          </div>
        ) : (
          filteredDonors.map(donor => (
            <div 
              key={donor.id} 
              onClick={() => setSelectedDonor(donor)}
              className="premium-card p-4 flex items-center gap-4 cursor-pointer hover:border-gray-300 hover:ring-2 hover:ring-primary/10 transition-all duration-300"
            >
              <div 
                className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-lg shadow-inner"
                style={{ backgroundColor: colors[donor.bloodGroup] || '#C0392B' }}
              >
                {donor.bloodGroup}
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-semibold text-gray-900 group-hover:text-primary transition-colors">{donor.name}</h3>
                <p className="text-xs text-gray-500 font-medium">{donor.area} &bull; {donor.gender}</p>
              </div>
              <a 
                href={`tel:${donor.mobile}`} 
                onClick={(e) => e.stopPropagation()}
                className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-100 transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
