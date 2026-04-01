import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Phone, MapPin, Activity, ShieldCheck, Edit3, Save } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    area: user?.area || '',
    isAvailable: user?.isAvailable ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  return (
    <div className="profile-page animate-fade-in">
      <div className="page-header profile-header">
        <div>
          <h1 className="page-title">User Profile</h1>
          <p className="page-subtitle">Manage your personal details and availability.</p>
        </div>
        
        <button 
          className={`action-btn ${isEditing ? 'btn-save' : 'btn-edit'}`}
          onClick={() => isEditing ? document.getElementById('profile-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })) : setIsEditing(true)}
        >
          {isEditing ? <><Save size={18}/> Save Changes</> : <><Edit3 size={18}/> Edit Profile</>}
        </button>
      </div>

      <div className="profile-grid">
        <div className="glass-card profile-card">
          <div className="profile-avatar">
            <User size={48} color="white" />
          </div>
          <h2>{user?.name}</h2>
          <div className="blood-badge-small">{user?.bloodGroup}</div>
          
          <div className="profile-status mt-4">
             <span className="status-label">Current Status:</span>
             <span className={`status-pill ${user?.isAvailable ? 'available' : 'unavailable'}`}>
               {user?.isAvailable ? 'Available to Donate' : 'Unavailable'}
             </span>
          </div>
          
          <div className="member-since">
            <ShieldCheck size={16} color="var(--success)" />
            Member since {user?.joinDate ? new Date(user.joinDate).getFullYear() : '2024'}
          </div>
        </div>

        <div className="glass-card details-card">
          <h3>Personal Information</h3>
          
          <form id="profile-form" onSubmit={handleSubmit} className="profile-form">
            <div className="detail-row">
              <div className="detail-icon"><User size={20} color="var(--primary)" /></div>
              <div className="detail-content">
                <label>Full Name</label>
                {isEditing ? (
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                ) : (
                  <p>{user?.name}</p>
                )}
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-icon"><Phone size={20} color="var(--primary)" /></div>
              <div className="detail-content">
                <label>Phone Number</label>
                {isEditing ? (
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                ) : (
                  <p>{user?.phone}</p>
                )}
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-icon"><MapPin size={20} color="var(--primary)" /></div>
              <div className="detail-content">
                <label>Area / City</label>
                {isEditing ? (
                  <input type="text" name="area" value={formData.area} onChange={handleChange} required />
                ) : (
                  <p>{user?.area}</p>
                )}
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-icon"><Activity size={20} color="var(--primary)" /></div>
              <div className="detail-content">
                <label>Donation Availability</label>
                {isEditing ? (
                  <div className="toggle-wrapper">
                    <input 
                      type="checkbox" 
                      id="isAvailable" 
                      name="isAvailable" 
                      checked={formData.isAvailable} 
                      onChange={handleChange} 
                      className="toggle-checkbox"
                    />
                    <label htmlFor="isAvailable" className="toggle-label">
                      {formData.isAvailable ? 'I am available to donate blood' : 'I am currently unavailable'}
                    </label>
                  </div>
                ) : (
                  <p>{user?.isAvailable ? 'Yes, available' : 'No, unavailable'}</p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
