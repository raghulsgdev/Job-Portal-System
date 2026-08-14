import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './UserLogin.css';

const UserLogin = () => {
  const navigate = useNavigate();
  const { loginCandidate } = useAuth();
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
      const res = await api.post('/user/login', formData);
      loginCandidate(res.data);
      navigate('/user/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {error && <div className="auth-error-banner">{error}</div>}

      <div className="auth-form-group">
        <label className="auth-label">Candidate Email</label>
        <div className="auth-input-wrapper">
          <FiMail className="auth-input-icon" />
          <input
            type="email"
            name="email"
            placeholder="candidate@example.com"
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
        <Link to="/user/forgot-password" className="forgot-link">Forgot password?</Link>
      </div>

      <button type="submit" className="auth-submit-btn" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In as Candidate'}
      </button>

      <p className="auth-footer-text">
        Don't have a candidate account?{' '}
        <Link to="/user/register" className="auth-link">Register now</Link>
      </p>
    </form>
  );
};

export default UserLogin;
