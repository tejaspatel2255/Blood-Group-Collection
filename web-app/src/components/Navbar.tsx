
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, Calendar, Clock, User, LogOut, Droplet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/onboarding');
  };

  return (
    <nav className="navbar glass">
      <div className="nav-brand">
        <Droplet className="nav-logo" size={24} color="var(--primary)" />
        <span className="nav-title">Blood Donor Companion</span>
      </div>
      
      <ul className="nav-links">
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <Home size={20} />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/record" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <PlusCircle size={20} />
            <span>Record</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/schedule" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <Calendar size={20} />
            <span>Schedule</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/history" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <Clock size={20} />
            <span>History</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <User size={20} />
            <span>Profile</span>
          </NavLink>
        </li>
      </ul>
      
      <button className="logout-btn" onClick={handleLogout} title="Logout">
        <LogOut size={20} />
      </button>
    </nav>
  );
};

export default Navbar;
