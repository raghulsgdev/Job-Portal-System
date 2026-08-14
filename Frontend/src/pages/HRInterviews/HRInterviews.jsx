import React, { useState, useEffect } from 'react';
import { FiCalendar, FiVideo, FiUser, FiClock } from 'react-icons/fi';
import api from '../../services/api';
import './HRInterviews.css';

const HRInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await api.get('/hr/interviews');
      setInterviews(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading scheduled interviews...</div>;

  return (
    <div className="interviews-container animate-fade">
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>Technical Interview Schedule</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Upcoming live video interviews and candidate evaluations.</p>
      </div>

      {interviews.length === 0 ? (
        <div style={{ background: '#FFF', padding: '40px', borderRadius: 'var(--radius-xl)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
          <h3>No interviews scheduled</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Schedule interviews directly from the Candidate Applicant Pipeline.</p>
        </div>
      ) : (
        interviews.map((item) => (
          <div key={item.id} className="interview-card">
            <div>
              <div style={{ fontWeight: '800', fontSize: '18px', color: 'var(--text-main)' }}>{item.job_title}</div>
              <div style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: '700', marginTop: '2px' }}>
                <FiUser style={{ marginRight: '6px' }} /> Candidate: {item.candidate_name} ({item.candidate_email})
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span><FiCalendar /> {new Date(item.scheduled_time).toLocaleString()}</span>
                <span className="status-pill status-interviewed">{item.status}</span>
              </div>
              {item.notes && <p style={{ fontSize: '13px', color: 'var(--text-main)', marginTop: '10px', background: 'var(--bg-main)', padding: '10px', borderRadius: '8px' }}>{item.notes}</p>}
            </div>

            {item.meeting_link && (
              <a 
                href={item.meeting_link} 
                target="_blank" 
                rel="noreferrer"
                style={{
                  background: 'var(--secondary-gradient)',
                  color: '#FFF',
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: '700',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <FiVideo /> Join Meeting
              </a>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default HRInterviews;
