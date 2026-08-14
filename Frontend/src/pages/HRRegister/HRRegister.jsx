import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiBriefcase, FiAward } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './HRRegister.css';

const HRRegister = () => {
  const navigate = useNavigate();
  const { loginHR } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
    company_name: '',
    company_role: 'Head of Talent'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/hr/register', formData);
      loginHR(res.data);
      navigate('/hr/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'HR Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {error && <div className="auth-error-banner">{error}</div>}

      <div className="auth-form-group">
        <label className="auth-label">Full Recruiter Name</label>
        <div className="auth-input-wrapper">
          <FiUser className="auth-input-icon" />
          <input
            type="text"
            name="name"
            placeholder="Elena Rostova"
            value={formData.name}
            onChange={handleChange}
            required
            className="auth-input"
          />
        </div>
      </div>

      <div className="auth-form-group">
        <label className="auth-label">Corporate Email</label>
        <div className="auth-input-wrapper">
          <FiMail className="auth-input-icon" />
          <input
            type="email"
            name="email"
            placeholder="elena@techcorp.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="auth-input"
          />
        </div>
      </div>

      <div className="register-grid">
        <div className="auth-form-group">
          <label className="auth-label">Company Name</label>
          <div className="auth-input-wrapper">
            <FiBriefcase className="auth-input-icon" />
            <input
              type="text"
              name="company_name"
              placeholder="TechCorp Systems"
              value={formData.company_name}
              onChange={handleChange}
              required
              className="auth-input"
            />
          </div>
        </div>

        <div className="auth-form-group">
          <label className="auth-label">HR Role Title</label>
          <div className="auth-input-wrapper">
            <FiAward className="auth-input-icon" />
            <input
              type="text"
              name="company_role"
              placeholder="Head of Talent Acquisition"
              value={formData.company_role}
              onChange={handleChange}
              className="auth-input"
            />
          </div>
        </div>
      </div>

      <div className="auth-form-group">
        <label className="auth-label">Phone Number</label>
        <div className="auth-input-wrapper">
          <FiPhone className="auth-input-icon" />
          <input
            type="text"
            name="phone"
            placeholder="+1 (555) 999-1122"
            value={formData.phone}
            onChange={handleChange}
            className="auth-input"
          />
        </div>
      </div>

      <div className="register-grid">
        <div className="auth-form-group">
          <label className="auth-label">Password</label>
          <div className="auth-input-wrapper">
            <FiLock className="auth-input-icon" />
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="auth-input"
            />
          </div>
        </div>

        <div className="auth-form-group">
          <label className="auth-label">Confirm Password</label>
          <div className="auth-input-wrapper">
            <FiLock className="auth-input-icon" />
            <input
              type="password"
              name="confirm_password"
              placeholder="••••••••"
              value={formData.confirm_password}
              onChange={handleChange}
              required
              className="auth-input"
            />
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        className="auth-submit-btn"
        style={{ background: 'var(--secondary-gradient)' }}
        disabled={loading}
      >
        {loading ? 'Creating HR Account...' : 'Register HR Recruiter Account'}
      </button>

      <p className="auth-footer-text">
        Already registered?{' '}
        <Link to="/hr/login" className="auth-link" style={{ color: 'var(--secondary)' }}>Sign In</Link>
      </p>
    </form>
  );
};

export default HRRegister;
