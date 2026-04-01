import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User } from '../context/AuthContext';
import './Auth.css';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    bloodGroup: '',
    phone: '',
    area: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API call and register user
    const newUser: User = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      isAvailable: true,
      joinDate: new Date().toISOString()
    };
    
    login(newUser);
    navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="auth-container">
      <div className="glass-card auth-card animate-fade-in">
        <h2>Complete Profile</h2>
        <p className="auth-subtitle">We need a few details to set up your account.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input 
              required 
              type="text" 
              name="name" 
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Blood Group</label>
            <div className="blood-group-selector">
              {BLOOD_GROUPS.map(bg => (
                <button
                  type="button"
                  key={bg}
                  className={`bg-btn ${formData.bloodGroup === bg ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, bloodGroup: bg }))}
                >
                  {bg}
                </button>
              ))}
            </div>
            {/* Hidden required input for form validation */}
            <input 
              required 
              style={{opacity: 0, height: 0, padding: 0, position: 'absolute'}} 
              value={formData.bloodGroup} 
              onChange={() => {}}
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input 
              required 
              type="tel" 
              name="phone" 
              placeholder="+1 234 567 8900"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Area / City</label>
            <input 
              required 
              type="text" 
              name="area" 
              placeholder="New York, NY"
              value={formData.area}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="primary-btn">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
