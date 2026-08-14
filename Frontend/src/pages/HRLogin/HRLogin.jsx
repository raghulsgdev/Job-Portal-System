import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './HRLogin.css';

const HRLogin = () => {
  const navigate = useNavigate();
  const { loginHR } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      const res = await api.post('/hr/login', formData);
      loginHR(res.data);
      navigate('/hr/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'HR Login failed. Check your recruiter credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="hr-login-banner">
        Recruiter & Talent Portal
      </div>

      {error && <div className="auth-error-banner">{error}</div>}

      <div className="auth-form-group">
        <label className="auth-label">HR / Corporate Email</label>
        <div className="auth-input-wrapper">
          <FiMail className="auth-input-icon" />
          <input
            type="email"
            name="email"
            placeholder="hr@techcorp.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="auth-input"
          />
        </div>
      </div>

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

      <div className="auth-extra-row">
        <span />
        <Link to="/hr/forgot-password" className="forgot-link">Forgot HR password?</Link>
      </div>

      <button 
        type="submit" 
        className="auth-submit-btn" 
        style={{ background: 'var(--secondary-gradient)' }}
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign In as HR Recruiter'}
      </button>

      <p className="auth-footer-text">
        Need an HR recruiter account?{' '}
        <Link to="/hr/register" className="auth-link" style={{ color: 'var(--secondary)' }}>Register Company HR</Link>
      </p>
    </form>
  );
};

export default HRLogin;
