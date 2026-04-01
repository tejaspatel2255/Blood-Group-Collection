
import { useDonation } from '../context/DonationContext';
import { Clock, Droplet, MapPin, Search } from 'lucide-react';
import './History.css';

const History = () => {
  const { pastDonations } = useDonation();
  
  // Group by year
  const groupedDonations = pastDonations.reduce((acc, donation) => {
    const year = new Date(donation.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(donation);
    return acc;
  }, {} as Record<number, typeof pastDonations>);

  const years = Object.keys(groupedDonations).map(Number).sort((a,b) => b - a);

  return (
    <div className="history-page animate-fade-in">
      <div className="page-header history-header">
        <div>
          <h1 className="page-title">Donation History</h1>
          <p className="page-subtitle">A timeline of your life-saving contributions.</p>
        </div>
        
        {pastDonations.length > 0 && (
          <div className="history-search glass">
            <Search size={18} color="var(--text-muted)" />
            <input type="text" placeholder="Search by location..." />
          </div>
        )}
      </div>

      {pastDonations.length === 0 ? (
        <div className="glass-card empty-history">
          <Clock size={64} color="var(--surface-light)" />
          <h3>No History Found</h3>
          <p>You haven't recorded any past donations yet.</p>
        </div>
      ) : (
        <div className="timeline-container">
          {years.map(year => (
            <div key={year} className="timeline-year-group">
              <div className="year-badge glass">{year}</div>
              
              <div className="timeline">
                {groupedDonations[year].map(donation => (
                  <div key={donation.id} className="timeline-item glass-card slide-in-bottom">
                    <div className="timeline-date">
                      <span className="month">{new Date(donation.date).toLocaleString('default', { month: 'short' })}</span>
                      <span className="day">{new Date(donation.date).getDate()}</span>
                    </div>
                    
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <h3>{donation.location}</h3>
                        <span className="volume-badge">{donation.volumeAmount} ml</span>
                      </div>
                      
                      <div className="timeline-details">
                        <span className="detail-tag">
                          <Droplet size={14} color="var(--primary)" />
                          {donation.type}
                        </span>
                        <span className="detail-tag">
                          <MapPin size={14} color="var(--text-muted)" />
                          Logged
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
};

export default History;
