import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FiBriefcase } from 'react-icons/fi';
import './AuthLayout.css';

const AuthLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHR = location.pathname.startsWith('/hr');

  return (
    <div className="auth-layout-container">
      <div className="auth-card-box">
        <div className="auth-header">
          <div className="auth-logo-badge">
            <FiBriefcase />
          </div>
          <h1 className="auth-title">CareerPulse</h1>
          <p className="auth-subtitle">
            {isHR ? 'Employer & Recruiter Portal' : 'Candidate & Job Seeker Portal'}
          </p>
        </div>

        <div className="auth-role-tabs">
          <div 
            className={`auth-role-tab ${!isHR ? 'active' : ''}`}
            onClick={() => navigate('/user/login')}
          >
            Candidate
          </div>
          <div 
            className={`auth-role-tab ${isHR ? 'active' : ''}`}
            onClick={() => navigate('/hr/login')}
          >
            Employer / HR
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
