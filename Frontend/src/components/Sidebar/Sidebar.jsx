import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiGrid, FiBriefcase, FiFileText, FiBookmark, FiUser, 
  FiSettings, FiLogOut, FiUsers, FiCalendar, FiBriefcase as FiJobs,
  FiBell, FiX
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ role, isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onClose) onClose();
    logout();
    navigate(role === 'hr' ? '/hr/login' : '/user/login');
  };

  const candidateLinks = [
    { path: '/user/dashboard', label: 'Dashboard', icon: <FiGrid /> },
    { path: '/user/jobs', label: 'Jobs', icon: <FiBriefcase /> },
    { path: '/user/applications', label: 'Applications', icon: <FiFileText /> },
    { path: '/user/saved-jobs', label: 'Saved Jobs', icon: <FiBookmark /> },
    { path: '/user/profile', label: 'Profile', icon: <FiUser /> },
    { path: '/user/notifications', label: 'Notifications', icon: <FiBell /> },
    { path: '/user/settings', label: 'Settings', icon: <FiSettings /> },
  ];

  const hrLinks = [
    { path: '/hr/dashboard', label: 'Dashboard', icon: <FiGrid /> },
    { path: '/hr/jobs', label: 'Job Postings', icon: <FiJobs /> },
    { path: '/hr/candidates', label: 'Candidates', icon: <FiUsers /> },
    { path: '/hr/interviews', label: 'Interviews', icon: <FiCalendar /> },
    { path: '/hr/employees', label: 'Employees', icon: <FiUser /> },
    { path: '/hr/profile', label: 'Profile & Company', icon: <FiUser /> },
    { path: '/hr/notifications', label: 'Notifications', icon: <FiBell /> },
    { path: '/hr/settings', label: 'Settings', icon: <FiSettings /> },
  ];

  const links = role === 'hr' ? hrLinks : candidateLinks;

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar-container ${isOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-icon">
            <FiBriefcase />
          </div>
          <span className="sidebar-brand-name">CareerPulse</span>
          {onClose && (
            <button className="sidebar-close-btn" onClick={onClose} aria-label="Close menu">
              <FiX />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => onClose && onClose()}
            >
              <span className="sidebar-icon">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <FiLogOut className="sidebar-icon" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
