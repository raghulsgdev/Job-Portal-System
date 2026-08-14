import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiClock, FiBookmark, FiDollarSign } from 'react-icons/fi';
import './JobCard.css';

const JobCard = ({ job, onSaveToggle, onApplyClick }) => {
  const navigate = useNavigate();

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary Undisclosed';
    return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k / yr`;
  };

  return (
    <div className="job-card-container animate-fade">
      <div>
        <div className="job-card-header">
          {job.company_logo ? (
            <img src={job.company_logo} alt={job.company_name} className="job-company-logo" />
          ) : (
            <div className="job-company-logo">
              {job.company_name ? job.company_name.charAt(0) : 'C'}
            </div>
          )}

          <div className="job-card-header-info">
            <h3 className="job-title" onClick={() => navigate(`/user/jobs/${job.id}`)} style={{ cursor: 'pointer' }}>
              {job.title}
            </h3>
            <p className="job-company-name">{job.company_name}</p>
          </div>

          <button 
            className={`job-bookmark-btn ${job.saved ? 'saved' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (onSaveToggle) onSaveToggle(job);
            }}
            title={job.saved ? "Unsave Job" : "Save Job"}
          >
            <FiBookmark style={{ fill: job.saved ? 'currentColor' : 'none' }} />
          </button>
        </div>

        <div className="job-tags-row">
          <span className="job-tag primary">
            <FiClock /> {job.job_type}
          </span>
          <span className="job-tag">
            <FiMapPin /> {job.location}
          </span>
          <span className="job-tag">
            {job.experience_level}
          </span>
          <span className="job-tag">
            {job.category}
          </span>
        </div>
      </div>

      <div className="job-card-footer">
        <div className="job-salary">
          {formatSalary(job.salary_min, job.salary_max)}
        </div>

        <div className="job-actions">
          <button className="btn-detail" onClick={() => navigate(`/user/jobs/${job.id}`)}>
            Details
          </button>

          {job.applied ? (
            <button className="btn-applied" disabled>
              Applied
            </button>
          ) : (
            <button className="btn-apply" onClick={() => onApplyClick ? onApplyClick(job) : navigate(`/user/jobs/${job.id}`)}>
              Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
