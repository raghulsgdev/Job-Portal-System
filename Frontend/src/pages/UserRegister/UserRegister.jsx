import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiAward } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './UserRegister.css';

const UserRegister = () => {
  const navigate = useNavigate();
  const { loginCandidate } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
    headline: '',
    location: ''
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
      const res = await api.post('/user/register', formData);
      loginCandidate(res.data);
      navigate('/user/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {error && <div className="auth-error-banner">{error}</div>}

      <div className="auth-form-group">
        <label className="auth-label">Full Name</label>
        <div className="auth-input-wrapper">
          <FiUser className="auth-input-icon" />
          <input
            type="text"
            name="name"
            placeholder="Alex Rivera"
            value={formData.name}
            onChange={handleChange}
            required
            className="auth-input"
          />
        </div>
      </div>

      <div className="auth-form-group">
        <label className="auth-label">Email Address</label>
        <div className="auth-input-wrapper">
          <FiMail className="auth-input-icon" />
          <input
            type="email"
            name="email"
            placeholder="alex@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="auth-input"
          />
        </div>
      </div>

      <div className="register-grid">
        <div className="auth-form-group">
          <label className="auth-label">Phone Number</label>
          <div className="auth-input-wrapper">
            <FiPhone className="auth-input-icon" />
            <input
              type="text"
              name="phone"
              placeholder="+1 (555) 000-1111"
              value={formData.phone}
              onChange={handleChange}
              className="auth-input"
            />
          </div>
        </div>

        <div className="auth-form-group">
          <label className="auth-label">Location</label>
          <div className="auth-input-wrapper">
            <FiMapPin className="auth-input-icon" />
            <input
              type="text"
              name="location"
              placeholder="San Francisco, CA"
              value={formData.location}
              onChange={handleChange}
              className="auth-input"
            />
          </div>
        </div>
      </div>

      <div className="auth-form-group">
        <label className="auth-label">Professional Headline</label>
        <div className="auth-input-wrapper">
          <FiAward className="auth-input-icon" />
          <input
            type="text"
            name="headline"
            placeholder="Senior Full Stack Developer (React & Python)"
            value={formData.headline}
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

      <button type="submit" className="auth-submit-btn" disabled={loading}>
        {loading ? 'Creating Account...' : 'Register Candidate Account'}
      </button>

      <p className="auth-footer-text">
        Already registered?{' '}
        <Link to="/user/login" className="auth-link">Sign In</Link>
      </p>
    </form>
  );
};

export default UserRegister;
