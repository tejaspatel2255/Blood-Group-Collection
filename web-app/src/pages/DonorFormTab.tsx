import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Donor, BloodGroup, Gender } from '../types';
import { UserPlus, Save } from 'lucide-react';

export default function DonorFormTab({ setTab, editingDonor, setEditingDonor }: { setTab: (t: string) => void, editingDonor: Donor|null, setEditingDonor: (d: Donor|null) => void }) {
  const { addDonor, updateDonor } = useAppContext();
  
  const [formData, setFormData] = useState<Partial<Donor>>({
    name: '',
    gender: 'Male',
    birthday: '1990-01-01',
    bloodGroup: 'A+',
    mobile: '',
    area: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    if (editingDonor) setFormData(editingDonor);
  }, [editingDonor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDonor) {
      updateDonor({ ...editingDonor, ...formData, updatedAt: new Date().toISOString() } as Donor);
      alert('Donor updated!');
    } else {
      addDonor({
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Donor);
      alert('Donor saved!');
    }
    setEditingDonor(null);
    setTab('donors');
  };

  const handleCancel = () => {
    setEditingDonor(null);
    setTab('home');
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <UserPlus className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">{editingDonor ? 'Edit Donor' : 'Register Donor'}</h1>
          <p className="text-xs text-gray-500">Fill in the personal information below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="premium-card p-6 space-y-5">
          <div>
            <label className="text-sm font-bold text-gray-800 block mb-1">Full Name*</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all font-medium" placeholder="John Doe" />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-bold text-gray-800 block mb-1">Blood Group*</label>
              <select required value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value as BloodGroup})} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all font-medium">
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-bold text-gray-800 block mb-1">Gender*</label>
              <select required value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as Gender})} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all font-medium">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-800 block mb-1">Date of Birth*</label>
            <input required type="date" value={formData.birthday} max={new Date().toISOString().split('T')[0]} onChange={e => setFormData({...formData, birthday: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all font-medium" />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-800 block mb-1">Mobile Number*</label>
            <input required type="tel" pattern="[0-9]{10}" title="10 digit mobile number" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all font-medium" placeholder="9876543210" />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-800 block mb-1">Area / Village*</label>
            <input required type="text" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all font-medium" placeholder="e.g. Surat, Varachha" />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-800 block mb-1">Detailed Address</label>
            <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all font-medium" placeholder="House no, street" />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-800 block mb-1">Medical Notes (Optional)</label>
            <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all font-medium h-24 resize-none" placeholder="Any regular medications, rare conditions etc." />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="button" onClick={handleCancel} className="flex-1 py-4 bg-white border border-gray-200 text-gray-700 shadow-sm rounded-xl font-bold hover:bg-gray-50 transition-all">
            Cancel
          </button>
          <button type="submit" className="flex-1 py-4 bg-primary text-white rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg shadow-red-200 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <Save className="w-5 h-5" /> {editingDonor ? 'Update' : 'Save'} Donor
          </button>
        </div>
      </form>
    </div>
  );
}
