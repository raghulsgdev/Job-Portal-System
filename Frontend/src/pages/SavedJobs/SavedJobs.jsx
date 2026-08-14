import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JobCard from '../../components/JobCard/JobCard';
import api from '../../services/api';
import './SavedJobs.css';

const SavedJobs = () => {
  const navigate = useNavigate();
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const res = await api.get('/user/saved-jobs');
      setSavedItems(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (job) => {
    try {
      await api.delete(`/jobs/${job.id}/unsave`);
      setSavedItems(savedItems.filter(item => item.job.id !== job.id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading saved jobs...</div>;

  return (
    <div className="saved-jobs-container animate-fade">
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>Saved Jobs</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Keep track of positions you have bookmarked for future application.</p>
      </div>

      {savedItems.length === 0 ? (
        <div style={{ background: '#FFF', padding: '40px', borderRadius: 'var(--radius-xl)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
          <h3>No saved jobs found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Bookmark interesting jobs while searching to review them here.</p>
          <button 
            onClick={() => navigate('/user/jobs')}
            style={{ marginTop: '16px', background: 'var(--primary-gradient)', color: '#FFF', padding: '10px 24px', borderRadius: 'var(--radius-pill)', fontWeight: '700' }}
          >
            Explore Jobs
          </button>
        </div>
      ) : (
        <div className="saved-jobs-grid">
          {savedItems.map((item) => (
            <JobCard
              key={item.saved_id}
              job={{ ...item.job, saved: true }}
              onSaveToggle={handleUnsave}
              onApplyClick={(job) => navigate(`/user/jobs/${job.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
