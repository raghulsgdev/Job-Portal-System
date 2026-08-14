import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './EditJob.css';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchJobDetail();
  }, [id]);

  const fetchJobDetail = async () => {
    try {
      const res = await api.get(`/jobs/${id}`);
      setFormData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUpdating(true);

    try {
      await api.put(`/hr/update-job/${id}`, formData);
      navigate('/hr/jobs');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update job posting.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading job data...</div>;
  if (!formData) return <div style={{ padding: '40px', textAlign: 'center' }}>Job posting not found.</div>;

  return (
    <div className="edit-job-box animate-fade">
      <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Edit Job Posting</h1>
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '28px' }}>Update requirements, status, or salary range.</p>

      {error && <div className="auth-error-banner">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="auth-form-group">
          <label className="auth-label">Job Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required className="auth-input" style={{ paddingLeft: '16px' }} />
        </div>

        <div className="form-row-2">
          <div className="auth-form-group">
            <label className="auth-label">Posting Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="auth-input" style={{ paddingLeft: '16px' }}>
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

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
        </div>

        <div className="form-row-2">
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

          <div className="auth-form-group">
            <label className="auth-label">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required className="auth-input" style={{ paddingLeft: '16px' }} />
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
          <textarea rows="6" name="description" value={formData.description} onChange={handleChange} required className="auth-input" style={{ padding: '12px', resize: 'vertical' }} />
        </div>

        <div className="auth-form-group">
          <label className="auth-label">Requirements</label>
          <textarea rows="6" name="requirements" value={formData.requirements} onChange={handleChange} required className="auth-input" style={{ padding: '12px', resize: 'vertical' }} />
        </div>

        <button type="submit" className="auth-submit-btn" style={{ background: 'var(--secondary-gradient)' }} disabled={updating}>
          {updating ? 'Saving...' : 'Save Job Posting Updates'}
        </button>
      </form>
    </div>
  );
};

export default EditJob;
