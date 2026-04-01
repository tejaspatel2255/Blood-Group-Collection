import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDonation } from '../context/DonationContext';
import { Droplet, MapPin, Calendar, Clock } from 'lucide-react';
import './FormStyle.css';

const ScheduleDonation = () => {
  const navigate = useNavigate();
  const { addRecord } = useDonation();
  
  // Default to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    date: tomorrowStr,
    location: '',
    time: '09:00',
    type: 'Whole Blood'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRecord({
      date: formData.date,
      location: formData.location,
      volumeAmount: 0, // Scheduled, not donated yet
      type: formData.type,
      isScheduled: true
    });
    navigate('/');
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
        <h1 className="page-title">Schedule Appointment</h1>
        <p className="page-subtitle">Plan your next lifesaving blood donation.</p>
      </div>

      <div className="glass-card form-container">
        <form onSubmit={handleSubmit} className="action-form">
          <div className="form-row">
            <div className="form-group">
              <label><Calendar size={16}/> Date</label>
              <input 
                required 
                type="date" 
                name="date" 
                value={formData.date}
                min={new Date().toISOString().split('T')[0]} // Cannot schedule in past
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label><Clock size={16}/> Time</label>
              <input 
                required 
                type="time" 
                name="time" 
                value={formData.time}
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
              <label><MapPin size={16}/> Blood Bank / Location</label>
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

          <button type="submit" className="primary-btn submit-btn">
            Confirm Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleDonation;
