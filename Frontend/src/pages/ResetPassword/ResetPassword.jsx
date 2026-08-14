import React, { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { FiLock, FiKey } from 'react-icons/fi';
import api from '../../services/api';
import './ResetPassword.css';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAdmin = location.pathname.startsWith('/admin');
  const isHR = location.pathname.startsWith('/hr') || isAdmin;

  const [token, setToken] = useState(searchParams.get('token') || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getLoginPath = () => {
    if (isAdmin) return "/admin/login";
    if (isHR) return "/hr/login";
    return "/user/login";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setMessage('');
    setLoading(true);

    const endpoint = isAdmin ? '/admin/reset-password' : isHR ? '/hr/reset-password' : '/user/reset-password';

    try {
      const res = await api.post(endpoint, {
        token,
        new_password: newPassword,
        confirm_password: confirmPassword
      });
      setMessage(res.data.message);
      setTimeout(() => {
        navigate(getLoginPath());
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h3 className="reset-title">
        Set New {isAdmin ? 'Admin' : isHR ? 'HR' : 'Candidate'} Password
      </h3>

      {error && <div className="auth-error-banner">{error}</div>}
      {message && <div className="success-banner">{message} Redirecting to login...</div>}

      <div className="auth-form-group">
        <label className="auth-label">Reset Token</label>
        <div className="auth-input-wrapper">
          <FiKey className="auth-input-icon" />
          <input
            type="text"
            placeholder="Paste reset token here"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            className="auth-input"
          />
        </div>
      </div>

      <div className="auth-form-group">
        <label className="auth-label">New Password</label>
        <div className="auth-input-wrapper">
          <FiLock className="auth-input-icon" />
          <input
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="auth-input"
          />
        </div>
      </div>

      <div className="auth-form-group">
        <label className="auth-label">Confirm New Password</label>
        <div className="auth-input-wrapper">
          <FiLock className="auth-input-icon" />
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="auth-input"
          />
        </div>
      </div>

      <button 
        type="submit" 
        className="auth-submit-btn" 
        style={isHR ? { background: 'var(--secondary-gradient)' } : {}}
        disabled={loading}
      >
        {loading ? 'Updating Password...' : 'Reset Password'}
      </button>

      <p className="auth-footer-text">
        <Link to={getLoginPath()} className="auth-link">Back to Sign In</Link>
      </p>
    </form>
  );
};

export default ResetPassword;
