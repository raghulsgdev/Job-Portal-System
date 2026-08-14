import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, icon, color, bg }) => {
  return (
    <div className="stat-card-container">
      <div 
        className="stat-icon-wrapper" 
        style={{ color: color || 'var(--primary)', background: bg || 'var(--primary-light)' }}
      >
        {icon}
      </div>
      <div className="stat-info">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{title}</span>
      </div>
    </div>
  );
};

export default StatCard;
