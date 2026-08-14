import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './CreateJob.css';

const CreateJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Engineering',
    job_type: 'Full-time',
    experience_level: 'Mid-level',
    location: '',
    salary_min: 80000,
    salary_max: 130000,
    description: '',
    requirements: '',
    status: 'Active'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/hr/create-job', formData);
      navigate('/hr/jobs');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create job posting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card-container animate-fade">
      <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Post a New Job Opportunity</h1>
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '28px' }}>Fill out the job spec, compensation package, and key qualifications.</p>

      {error && <div className="auth-error-banner">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="auth-form-group">
          <label className="auth-label">Job Title</label>
          <input type="text" name="title" placeholder="e.g. Senior Full Stack Engineer" value={formData.title} onChange={handleChange} required className="auth-input" style={{ paddingLeft: '16px' }} />
        </div>

        <div className="form-row-2">
          <div className="auth-form-group">
            <label className="auth-label">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="auth-input" style={{ paddingLeft: '16px' }}>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="DevOps">DevOps</option>
              <option value="Marketing">Marketing</option>
              <option value="Product">Product Management</option>
            </select>
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Job Type</label>
            <select name="job_type" value={formData.job_type} onChange={handleChange} className="auth-input" style={{ paddingLeft: '16px' }}>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>

        <div className="form-row-2">
          <div className="auth-form-group">
            <label className="auth-label">Experience Level</label>
            <select name="experience_level" value={formData.experience_level} onChange={handleChange} className="auth-input" style={{ paddingLeft: '16px' }}>
              <option value="Entry-level">Entry-level</option>
              <option value="Mid-level">Mid-level</option>
              <option value="Senior-level">Senior-level</option>
              <option value="Lead / Executive">Lead / Executive</option>
            </select>
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Location</label>
            <input type="text" name="location" placeholder="e.g. San Francisco, CA or Remote" value={formData.location} onChange={handleChange} required className="auth-input" style={{ paddingLeft: '16px' }} />
          </div>
        </div>

        <div className="form-row-2">
          <div className="auth-form-group">
            <label className="auth-label">Min Salary ($/yr)</label>
            <input type="number" name="salary_min" value={formData.salary_min} onChange={handleChange} required className="auth-input" style={{ paddingLeft: '16px' }} />
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Max Salary ($/yr)</label>
            <input type="number" name="salary_max" value={formData.salary_max} onChange={handleChange} required className="auth-input" style={{ paddingLeft: '16px' }} />
          </div>
        </div>

        <div className="auth-form-group">
          <label className="auth-label">Job Description</label>
          <textarea rows="6" name="description" placeholder="Describe the role responsibilities, team structure, and projects..." value={formData.description} onChange={handleChange} required className="auth-input" style={{ padding: '12px', resize: 'vertical' }} />
        </div>

        <div className="auth-form-group">
          <label className="auth-label">Requirements & Qualifications</label>
          <textarea rows="6" name="requirements" placeholder="List required skills, technologies, years of experience, and degrees..." value={formData.requirements} onChange={handleChange} required className="auth-input" style={{ padding: '12px', resize: 'vertical' }} />
        </div>

        <button type="submit" className="auth-submit-btn" style={{ background: 'var(--secondary-gradient)' }} disabled={loading}>
          {loading ? 'Publishing...' : 'Publish Job Posting'}
        </button>
      </form>
    </div>
  );
};

export default CreateJob;
