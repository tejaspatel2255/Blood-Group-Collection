
import { useAuth } from '../context/AuthContext';
import { useDonation } from '../context/DonationContext';
import { Droplet, Calendar, Award, Clock } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { pastDonations, scheduledDonations, getTotalVolume, getLastDonationDate } = useDonation();

  const totalVolume = getTotalVolume();
  const lastDonation = getLastDonationDate();
  
  // Calculate next eligible date (typically 56 days for whole blood)
  const getNextEligibleDate = () => {
    if (!lastDonation) return 'Available Now';
    const lastDate = new Date(lastDonation);
    const nextDate = new Date(lastDate.getTime() + 56 * 24 * 60 * 60 * 1000);
    const today = new Date();
    
    if (nextDate <= today) return 'Available Now';
    return nextDate.toLocaleDateString();
  };

  const nextEligible = getNextEligibleDate();
  const isEligible = nextEligible === 'Available Now';

  return (
    <div className="dashboard animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="page-subtitle">Here is your donation summary.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-icon-wrapper" style={{background: 'rgba(255, 75, 75, 0.1)'}}>
            <Droplet color="var(--primary)" size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Donations</h3>
            <p className="stat-value">{pastDonations.length}</p>
          </div>
        </div>
        
        <div className="stat-card glass-card">
          <div className="stat-icon-wrapper" style={{background: 'rgba(245, 158, 11, 0.1)'}}>
            <Award color="var(--warning)" size={24} />
          </div>
          <div className="stat-info">
            <h3>Volume Donated</h3>
            <p className="stat-value">{totalVolume} <span className="stat-unit">ml</span></p>
          </div>
        </div>

        <div className={`stat-card glass-card ${isEligible ? 'eligible' : ''}`}>
          <div className="stat-icon-wrapper" style={{background: isEligible ? 'rgba(16, 185, 129, 0.1)' : 'rgba(148, 163, 184, 0.1)'}}>
            <Clock color={isEligible ? "var(--success)" : "var(--text-muted)"} size={24} />
          </div>
          <div className="stat-info">
            <h3>Eligibility</h3>
            <p className={`stat-value-text ${isEligible ? 'text-success' : ''}`}>{nextEligible}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="glass-card section-card">
          <div className="section-header">
            <h2>Upcoming Schedule</h2>
            <Calendar size={20} color="var(--text-muted)" />
          </div>
          
          {scheduledDonations.length > 0 ? (
            <div className="schedule-list">
              {scheduledDonations.slice(0, 3).map(schedule => (
                <div key={schedule.id} className="schedule-item">
                  <div className="schedule-date">
                    <span className="day">{new Date(schedule.date).getDate()}</span>
                    <span className="month">{new Date(schedule.date).toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  <div className="schedule-details">
                    <h4>{schedule.location}</h4>
                    <p>{schedule.type} Donation</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Calendar size={48} color="var(--surface-light)" />
              <p>No upcoming donations scheduled.</p>
            </div>
          )}
        </div>

        <div className="glass-card user-card">
          <div className="blood-badge">
            {user?.bloodGroup}
          </div>
          <h3>{user?.name}</h3>
          <p>{user?.area}</p>
          <div className="status-badge" style={{ background: user?.isAvailable ? 'rgba(16, 185, 129, 0.1)' : 'rgba(230, 57, 70, 0.1)', color: user?.isAvailable ? 'var(--success)' : 'var(--primary)' }}>
            {user?.isAvailable ? 'Available to Donate' : 'Currently Unavailable'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
