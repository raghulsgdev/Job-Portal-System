import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMapPin, FiClock, FiDollarSign, FiBookmark, FiGlobe, FiBriefcase } from 'react-icons/fi';
import Modal from '../../components/Modal/Modal';
import api from '../../services/api';
import './JobDetail.css';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    fetchJobDetail();
  }, [id]);

  const fetchJobDetail = async () => {
    try {
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = async () => {
    if (!job) return;
    try {
      if (job.saved) {
        await api.delete(`/jobs/${job.id}/unsave`);
      } else {
        await api.post(`/jobs/${job.id}/save`);
      }
      setJob({ ...job, saved: !job.saved });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!job) return;
    setApplying(true);

    try {
      await api.post(`/jobs/${job.id}/apply`, { cover_letter: coverLetter });
      setModalMessage('Application submitted successfully!');
      setJob({ ...job, applied: true });
      setTimeout(() => {
        setIsModalOpen(false);
      }, 1500);
    } catch (err) {
      setModalMessage(err.response?.data?.detail || 'Application failed.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading job details...</div>;
  if (!job) return <div style={{ padding: '40px', textAlign: 'center' }}>Job posting not found.</div>;

  return (
    <div className="job-detail-container animate-fade">
      <button 
        onClick={() => navigate(-1)} 
        style={{
          alignSelf: 'flex-start',
          background: 'none',
          color: 'var(--primary)',
          fontWeight: '700',
          fontSize: '14px'
        }}
      >
        ← Back to Jobs
      </button>

      <div className="job-detail-hero">
        <div className="job-detail-header">
          {job.company_logo ? (
            <img src={job.company_logo} alt={job.company_name} className="job-detail-logo" />
          ) : (
            <div className="job-detail-logo">{job.company_name?.charAt(0) || 'C'}</div>
          )}
          <div className="job-detail-title-box">
            <h1>{job.title}</h1>
            <div className="job-detail-company">{job.company_name}</div>
            <div className="job-detail-meta-row">
              <span><FiMapPin /> {job.location}</span>
              <span><FiClock /> {job.job_type}</span>
              <span><FiBriefcase /> {job.experience_level}</span>
              <span><FiDollarSign /> ${(job.salary_min / 1000).toFixed(0)}k - ${(job.salary_max / 1000).toFixed(0)}k</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={handleSaveToggle}
            style={{
              background: 'var(--bg-main)',
              border: '1px solid var(--border-color)',
              padding: '12px 18px',
              borderRadius: 'var(--radius-pill)',
              fontWeight: '700',
              color: job.saved ? 'var(--secondary)' : 'var(--text-main)'
            }}
          >
            <FiBookmark style={{ fill: job.saved ? 'currentColor' : 'none' }} /> {job.saved ? 'Saved' : 'Save'}
          </button>

          {job.applied ? (
            <button className="btn-applied" style={{ padding: '12px 24px' }} disabled>
              Applied
            </button>
          ) : (
            <button className="btn-apply" style={{ padding: '12px 28px' }} onClick={() => setIsModalOpen(true)}>
              Apply for Job
            </button>
          )}
        </div>
      </div>

      <div className="job-detail-grid">
        <div className="job-detail-card">
          <h2 className="detail-section-title">Job Description</h2>
          <div className="job-description-text">{job.description}</div>

          <h2 className="detail-section-title" style={{ marginTop: '32px' }}>Key Requirements & Qualifications</h2>
          <div className="job-description-text">{job.requirements}</div>
        </div>

        <div className="job-detail-card">
          <h2 className="detail-section-title">About the Company</h2>
          <div className="company-sidebar-box">
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>{job.company_name}</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              {job.company_description || 'Innovative organization creating impactful tech products and solutions.'}
            </p>
            {job.company_website && (
              <a href={job.company_website} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiGlobe /> Visit Company Website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Submit Application for ${job.title}`}
      >
        <form onSubmit={handleSubmitApplication}>
          {modalMessage && (
            <div className="auth-error-banner" style={{ background: modalMessage.includes('success') ? 'var(--status-accepted-bg)' : 'var(--status-rejected-bg)', color: modalMessage.includes('success') ? 'var(--status-accepted)' : 'var(--status-rejected)' }}>
              {modalMessage}
            </div>
          )}

          <div className="auth-form-group">
            <label className="auth-label">Cover Letter / Statement of Interest</label>
            <textarea
              rows="6"
              placeholder="Why are you interested in this position? Highlight key projects or skills..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="auth-input"
              style={{ padding: '12px', resize: 'vertical' }}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={applying}>
            {applying ? 'Submitting...' : 'Confirm Application'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default JobDetail;
