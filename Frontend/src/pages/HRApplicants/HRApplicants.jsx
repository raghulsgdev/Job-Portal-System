import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiFileText, FiCalendar, FiCheck, FiX, FiClock } from 'react-icons/fi';
import Modal from '../../components/Modal/Modal';
import api from '../../services/api';
import './HRApplicants.css';

const HRApplicants = () => {
  const [searchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || '';

  const [hrJobs, setHrJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [viewingCoverLetter, setViewingCoverLetter] = useState(null);
  const [schedulingApp, setSchedulingApp] = useState(null);
  const [interviewForm, setInterviewForm] = useState({
    scheduled_time: '',
    meeting_link: 'https://meet.google.com/abc-defg-hij',
    notes: ''
  });
  const [scheduling, setScheduling] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      fetchApplicants(selectedJobId);
    } else {
      setApplicants([]);
      setLoading(false);
    }
  }, [selectedJobId]);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/hr/jobs');
      setHrJobs(res.data || []);
      if (!selectedJobId && res.data.length > 0) {
        setSelectedJobId(res.data[0].id.toString());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchApplicants = async (jobId) => {
    setLoading(true);
    try {
      const res = await api.get(`/hr/applicants/${jobId}`);
      setApplicants(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await api.put(`/hr/applications/${appId}/status`, { status: newStatus });
      setApplicants(applicants.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    } catch (err) {
      console.error(err);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!schedulingApp) return;
    setScheduling(true);

    try {
      await api.post('/hr/interviews', {
        application_id: schedulingApp.id,
        scheduled_time: new Date(interviewForm.scheduled_time).toISOString(),
        meeting_link: interviewForm.meeting_link,
        notes: interviewForm.notes
      });
      setApplicants(applicants.map(a => a.id === schedulingApp.id ? { ...a, status: 'Interviewed' } : a));
      setSchedulingApp(null);
    } catch (err) {
      console.error(err);
    } finally {
      setScheduling(false);
    }
  };

  return (
    <div className="applicants-container animate-fade">
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>Candidate Applicant Pipeline</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Review candidate resumes, update status (Accept/Reject), and schedule interviews.</p>
      </div>

      <div className="applicants-filter-bar">
        <label style={{ fontWeight: '700', fontSize: '14px' }}>Filter by Job Posting:</label>
        <select 
          value={selectedJobId} 
          onChange={(e) => setSelectedJobId(e.target.value)}
          className="auth-input"
          style={{ paddingLeft: '16px', maxWidth: '350px' }}
        >
          <option value="">Select a Job Posting</option>
          {hrJobs.map((j) => (
            <option key={j.id} value={j.id}>{j.title} ({j.applicant_count} applicants)</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>Loading applicants...</div>
      ) : applicants.length === 0 ? (
        <div style={{ background: '#FFF', padding: '40px', borderRadius: 'var(--radius-xl)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
          <h3>No applications received for this job posting yet</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Candidates applying for this position will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
          {applicants.map((app) => {
            const cand = app.applicant || {};
            return (
              <div key={app.id} className="applicant-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <div className="avatar-circle">
                      {cand.name ? cand.name.charAt(0) : 'U'}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>{cand.name}</h3>
                      <div style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '600' }}>{cand.headline || 'Developer'}</div>
                    </div>
                  </div>
                  <span className={`status-pill status-${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>
                </div>

                <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div><FiMail style={{ marginRight: '6px' }} /> {cand.email}</div>
                  {cand.phone && <div><FiPhone style={{ marginRight: '6px' }} /> {cand.phone}</div>}
                  <div><FiClock style={{ marginRight: '6px' }} /> Applied: {new Date(app.applied_at).toLocaleDateString()}</div>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                  {cand.resume_url ? (
                    <a 
                      href={cand.resume_url} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '6px 14px', borderRadius: 'var(--radius-pill)', fontWeight: '700', fontSize: '12px' }}
                    >
                      View Resume
                    </a>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No Resume Uploaded</span>
                  )}

                  {app.cover_letter && (
                    <button 
                      onClick={() => setViewingCoverLetter(app.cover_letter)}
                      style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', padding: '6px 14px', borderRadius: 'var(--radius-pill)', fontWeight: '700', fontSize: '12px' }}
                    >
                      Cover Letter
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                  <button 
                    onClick={() => handleStatusUpdate(app.id, 'Accepted')}
                    style={{ flex: 1, background: 'var(--status-accepted-bg)', color: 'var(--status-accepted)', padding: '8px', borderRadius: 'var(--radius-pill)', fontWeight: '700', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  >
                    <FiCheck /> Accept
                  </button>

                  <button 
                    onClick={() => setSchedulingApp(app)}
                    style={{ flex: 1, background: 'var(--status-interview-bg)', color: 'var(--status-interview)', padding: '8px', borderRadius: 'var(--radius-pill)', fontWeight: '700', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  >
                    <FiCalendar /> Interview
                  </button>

                  <button 
                    onClick={() => handleStatusUpdate(app.id, 'Rejected')}
                    style={{ flex: 1, background: 'var(--status-rejected-bg)', color: 'var(--status-rejected)', padding: '8px', borderRadius: 'var(--radius-pill)', fontWeight: '700', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  >
                    <FiX /> Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cover Letter Modal */}
      <Modal isOpen={Boolean(viewingCoverLetter)} onClose={() => setViewingCoverLetter(null)} title="Candidate Cover Letter">
        <div style={{ whiteSpace: 'pre-line', fontSize: '15px', color: 'var(--text-main)', lineHeight: '1.7' }}>
          {viewingCoverLetter}
        </div>
      </Modal>

      {/* Schedule Interview Modal */}
      <Modal isOpen={Boolean(schedulingApp)} onClose={() => setSchedulingApp(null)} title={`Schedule Interview for ${schedulingApp?.applicant?.name}`}>
        <form onSubmit={handleScheduleSubmit}>
          <div className="auth-form-group">
            <label className="auth-label">Date & Time</label>
            <input 
              type="datetime-local" 
              value={interviewForm.scheduled_time}
              onChange={(e) => setInterviewForm({ ...interviewForm, scheduled_time: e.target.value })}
              required 
              className="auth-input" 
              style={{ paddingLeft: '16px' }}
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Video Meeting Link (Google Meet / Zoom)</label>
            <input 
              type="text" 
              value={interviewForm.meeting_link}
              onChange={(e) => setInterviewForm({ ...interviewForm, meeting_link: e.target.value })}
              required 
              className="auth-input" 
              style={{ paddingLeft: '16px' }}
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Interview Notes / Instructions</label>
            <textarea 
              rows="4" 
              placeholder="e.g. Technical System Design round focusing on React & FastAPI..."
              value={interviewForm.notes}
              onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
              className="auth-input" 
              style={{ padding: '12px' }}
            />
          </div>

          <button type="submit" className="auth-submit-btn" style={{ background: 'var(--secondary-gradient)' }} disabled={scheduling}>
            {scheduling ? 'Scheduling...' : 'Confirm & Schedule Interview'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default HRApplicants;
