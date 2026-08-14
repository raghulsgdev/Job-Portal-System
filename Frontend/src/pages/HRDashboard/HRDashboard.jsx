import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBriefcase, FiUsers, FiCalendar, FiUserCheck, FiPlus } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard/StatCard';
import api from '../../services/api';
import './HRDashboard.css';

const HRDashboard = () => {
  const { hr } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHRDashboard();
  }, []);

  const fetchHRDashboard = async () => {
    try {
      const res = await api.get('/dashboard/hr');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading HR dashboard...</div>;

  const metrics = stats?.metrics || {};

  return (
    <div className="hr-dashboard-container animate-fade">
      <div className="hr-hero-banner">
        <div>
          <h1 className="hero-title">Recruiter Dashboard, {hr?.name || 'HR Recruiter'}!</h1>
          <p className="hero-subtitle">
            Manage your open jobs, track candidate applications, schedule technical interviews, and assemble top engineering talent.
          </p>
        </div>
        <button 
          onClick={() => navigate('/hr/jobs/create')}
          style={{
            background: '#FFFFFF',
            color: 'var(--secondary)',
            padding: '12px 24px',
            borderRadius: 'var(--radius-pill)',
            fontWeight: '800',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FiPlus /> Post New Job
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Active Job Postings"
          value={metrics.active_jobs || 0}
          icon={<FiBriefcase />}
          color="#9333EA"
          bg="#F3E8FF"
        />
        <StatCard
          title="Total Applicants"
          value={metrics.total_candidates || 0}
          icon={<FiUsers />}
          color="#4F46E5"
          bg="#EEF2FF"
        />
        <StatCard
          title="Interviews Scheduled"
          value={metrics.interviews_scheduled || 0}
          icon={<FiCalendar />}
          color="#3B82F6"
          bg="#DBEAFE"
        />
        <StatCard
          title="Hired Employees"
          value={metrics.hired_candidates || 0}
          icon={<FiUserCheck />}
          color="#10B981"
          bg="#D1FAE5"
        />
      </div>

      <div className="dashboard-card-section">
        <div className="section-header-row">
          <h2 className="section-title">Recent Candidate Applications</h2>
          <button className="section-link" onClick={() => navigate('/hr/candidates')}>
            View All Applicants →
          </button>
        </div>

        {stats?.recent_candidates?.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', padding: '16px 0' }}>No candidate applications received yet.</p>
        ) : (
          <table className="candidates-table">
            <thead>
              <tr>
                <th>Candidate Name</th>
                <th>Applied Position</th>
                <th>Application Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recent_candidates?.map((c) => (
                <tr key={c.application_id}>
                  <td>
                    <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{c.candidate_name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{c.candidate_email}</div>
                  </td>
                  <td style={{ fontWeight: '600' }}>{c.job_title}</td>
                  <td>{new Date(c.applied_at).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-pill status-${c.status.toLowerCase()}`}>
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => navigate('/hr/candidates')}
                      style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '6px 14px', borderRadius: 'var(--radius-pill)', fontWeight: '700', fontSize: '12px' }}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HRDashboard;
