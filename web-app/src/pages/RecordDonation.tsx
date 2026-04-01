import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDonation } from '../context/DonationContext';
import { Droplet, MapPin, Calendar, Beaker } from 'lucide-react';
import './FormStyle.css';

const RecordDonation = () => {
  const navigate = useNavigate();
  const { addRecord } = useDonation();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    location: '',
    volumeAmount: 450,
    type: 'Whole Blood'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRecord({
      ...formData,
      isScheduled: false
    });
    navigate('/history');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="form-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Record Donation</h1>
        <p className="page-subtitle">Log a past blood donation to keep your history updated.</p>
      </div>

      <div className="glass-card form-container">
        <form onSubmit={handleSubmit} className="action-form">
          <div className="form-row">
            <div className="form-group">
              <label><Calendar size={16}/> Date of Donation</label>
              <input 
                required 
                type="date" 
                name="date" 
                value={formData.date}
                max={new Date().toISOString().split('T')[0]}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label><MapPin size={16}/> Location Details</label>
              <input 
                required 
                type="text" 
                name="location" 
                placeholder="Hospital/Camp Name"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label><Droplet size={16}/> Donation Type</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="Whole Blood">Whole Blood</option>
                <option value="Platelets">Platelets</option>
                <option value="Plasma">Plasma</option>
                <option value="Power Red">Power Red</option>
              </select>
            </div>

            <div className="form-group">
              <label><Beaker size={16}/> Volume Amount (ml)</label>
              <input 
                required 
                type="number" 
                name="volumeAmount" 
                min="100"
                max="1000"
                value={formData.volumeAmount}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="primary-btn submit-btn">
            Save Record
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecordDonation;
