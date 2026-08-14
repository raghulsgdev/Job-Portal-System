import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiMapPin, FiFileText } from 'react-icons/fi';
import Modal from '../../components/Modal/Modal';
import api from '../../services/api';
import './ApplicationHistory.css';

const ApplicationHistory = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoverLetter, setSelectedCoverLetter] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/user/applications');
      setApplications(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading application history...</div>;

  return (
    <div className="history-container animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>My Application History</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Track real-time candidate status updates across all your job submissions.</p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div style={{ background: '#FFF', padding: '40px', borderRadius: 'var(--radius-xl)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
          <h3>No applications submitted yet</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Explore active postings and apply today.</p>
          <button 
            onClick={() => navigate('/user/jobs')}
            style={{ marginTop: '16px', background: 'var(--primary-gradient)', color: '#FFF', padding: '10px 24px', borderRadius: 'var(--radius-pill)', fontWeight: '700' }}
          >
            Browse Jobs
          </button>
        </div>
      ) : (
        applications.map((app) => (
          <div key={app.id} className="history-card">
            <div>
              <div className="history-job-title">{app.job?.title}</div>
              <div className="history-company">{app.job?.company_name}</div>
              <div className="history-meta-row">
                <span><FiMapPin /> {app.job?.location}</span>
                <span><FiClock /> Applied on {new Date(app.applied_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span className={`status-pill status-${app.status.toLowerCase()}`}>
                {app.status}
              </span>

              {app.cover_letter && (
                <button
                  onClick={() => setSelectedCoverLetter(app.cover_letter)}
                  style={{
                    background: 'var(--bg-main)',
                    border: '1px solid var(--border-color)',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <FiFileText /> Cover Letter
                </button>
              )}
            </div>
          </div>
        ))
      )}

      {/* Cover Letter Modal */}
      <Modal
        isOpen={Boolean(selectedCoverLetter)}
        onClose={() => setSelectedCoverLetter(null)}
        title="Submitted Cover Letter"
      >
        <div style={{ whiteSpace: 'pre-line', fontSize: '15px', color: 'var(--text-main)', lineHeight: '1.7' }}>
          {selectedCoverLetter}
        </div>
      </Modal>
    </div>
  );
};

export default ApplicationHistory;
