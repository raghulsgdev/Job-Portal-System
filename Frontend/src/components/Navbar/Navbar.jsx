import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiBell, FiMenu } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Navbar.css';

const Navbar = ({ searchPlaceholder, onSearch, onToggleMobileMenu }) => {
  const { user, hr, role } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  const currentUser = role === 'hr' ? hr : user;
  const displayName = currentUser?.name || (role === 'hr' ? 'HR Recruiter' : 'Candidate');
  const roleLabel = role === 'hr' ? (hr?.company_name || 'HR Portal') : 'Candidate';

  useEffect(() => {
    fetchNotifications();
  }, [role]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <header className="navbar-container">
      <div className="navbar-left">
        {onToggleMobileMenu && (
          <button 
            className="mobile-menu-toggle-btn" 
            onClick={onToggleMobileMenu} 
            title="Toggle Menu"
            aria-label="Toggle menu"
          >
            <FiMenu />
          </button>
        )}
        <div className="navbar-search">
          <FiSearch className="navbar-search-icon" />
          <input
            type="text"
            placeholder={searchPlaceholder || "Search jobs, skills, candidates..."}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="navbar-right">
        <div className="notif-bell-wrapper">
          <button 
            className="notif-bell-btn" 
            onClick={() => setShowNotifs(!showNotifs)}
            title="Notifications"
          >
            <FiBell />
            {unreadCount > 0 && <span className="notif-badge" />}
          </button>

          {showNotifs && (
            <div className="notif-dropdown">
              <div className="notif-dropdown-header">
                <span>Notifications</span>
                <small style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => navigate(role === 'hr' ? '/hr/notifications' : '/user/notifications')}>View all</small>
              </div>
              {notifications.length === 0 ? (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '10px' }}>No new notifications</p>
              ) : (
                notifications.slice(0, 4).map((n) => (
                  <div key={n.id} className="notif-item" onClick={() => navigate(role === 'hr' ? '/hr/notifications' : '/user/notifications')}>
                    <div className="notif-item-title">{n.title}</div>
                    <div className="notif-item-desc">{n.message}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="user-profile-badge" onClick={() => navigate(role === 'hr' ? '/hr/profile' : '/user/profile')}>
          <div className="avatar-circle">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <span className="user-name">{displayName}</span>
            <span className="user-role-label">{roleLabel}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
