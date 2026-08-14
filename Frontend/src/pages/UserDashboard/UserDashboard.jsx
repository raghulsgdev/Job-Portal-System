import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFileText, FiBookmark, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard/StatCard';
import JobCard from '../../components/JobCard/JobCard';
import api from '../../services/api';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/dashboard/user');
      setStats(res.data);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = async (job) => {
    try {
      if (job.saved) {
        await api.delete(`/jobs/${job.id}/unsave`);
      } else {
        await api.post(`/jobs/${job.id}/save`);
      }
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading candidate dashboard...</div>;
  }

  const metrics = stats?.metrics || {};

  return (
    <div className="dashboard-container animate-fade">
      <div className="dashboard-hero-banner">
        <div>
          <h1 className="hero-title">Welcome back, {user?.name || 'Candidate'}!</h1>
          <p className="hero-subtitle">
            Explore thousands of tech jobs matching your developer skills and track your active applications.
          </p>
        </div>
        <button 
          onClick={() => navigate('/user/jobs')}
          style={{
            background: '#FFFFFF',
            color: 'var(--primary)',
            padding: '12px 24px',
            borderRadius: 'var(--radius-pill)',
            fontWeight: '800',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          Browse All Jobs
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Submitted Applications"
          value={metrics.total_applications || 0}
          icon={<FiFileText />}
          color="#4F46E5"
          bg="#EEF2FF"
        />
        <StatCard
          title="Saved Bookmarks"
          value={metrics.saved_jobs || 0}
          icon={<FiBookmark />}
          color="#9333EA"
          bg="#F3E8FF"
        />
        <StatCard
          title="Interviews Scheduled"
          value={metrics.interviews_scheduled || 0}
          icon={<FiCalendar />}
          color="#3B82F6"
          bg="#DBEAFE"
        />
        <StatCard
          title="Accepted Offers"
          value={metrics.accepted_offers || 0}
          icon={<FiCheckCircle />}
          color="#10B981"
          bg="#D1FAE5"
        />
      </div>

      <div className="dashboard-sections-grid">
        <div className="dashboard-card-section">
          <div className="section-header-row">
            <h2 className="section-title">Recent Application Status</h2>
            <button className="section-link" onClick={() => navigate('/user/applications')}>
              View Application History →
            </button>
          </div>

          {stats?.recent_applications?.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No recent applications found. Start applying today!</p>
          ) : (
            <div className="activity-list">
              {stats?.recent_applications?.map((item) => (
                <div key={item.id} className="activity-item">
                  <div>
                    <div className="activity-job-title">{item.job_title}</div>
                    <div className="activity-company">{item.company_name}</div>
                  </div>
                  <span className={`status-pill status-${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-card-section">
          <div className="section-header-row">
            <h2 className="section-title">Top Job Matches</h2>
            <button className="section-link" onClick={() => navigate('/user/jobs')}>
              Explore →
            </button>
          </div>

          <div className="recommended-jobs-stack">
            {stats?.recommended_jobs?.map((j) => (
              <div 
                key={j.id} 
                onClick={() => navigate(`/user/jobs/${j.id}`)}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-main)' }}>{j.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600', marginTop: '2px' }}>{j.company_name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                  {j.location} • {j.job_type}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
