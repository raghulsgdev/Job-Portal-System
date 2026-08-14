import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import api from '../../services/api';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith('/admin');
  const isHR = location.pathname.startsWith('/hr') || isAdmin;

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const endpoint = isAdmin ? '/admin/forgot-password' : isHR ? '/hr/forgot-password' : '/user/forgot-password';

    try {
      const res = await api.post(endpoint, { email });
      setMessage(res.data.message);
      if (res.data.reset_token) {
        setResetToken(res.data.reset_token);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  const getResetPath = () => {
    if (isAdmin) return `/admin/reset-password?token=${resetToken}`;
    if (isHR) return `/hr/reset-password?token=${resetToken}`;
    return `/user/reset-password?token=${resetToken}`;
  };

  const getLoginPath = () => {
    if (isAdmin) return "/admin/login";
    if (isHR) return "/hr/login";
    return "/user/login";
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-main)' }}>
        Reset {isAdmin ? 'Admin' : isHR ? 'HR' : 'Candidate'} Password
      </h3>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
        Enter your registered email address and we will generate a secure reset token for you.
      </p>

      {error && <div className="auth-error-banner">{error}</div>}
      {message && (
        <div className="success-banner">
          <p>{message}</p>
          {resetToken && (
            <div style={{ marginTop: '10px' }}>
              <strong>Demo Token:</strong>
              <div style={{ fontSize: '11px', background: '#FFFFFF', padding: '6px', borderRadius: '4px', marginTop: '4px' }}>
                {resetToken}
              </div>
              <button
                type="button"
                onClick={() => navigate(getResetPath())}
                style={{
                  marginTop: '10px',
                  background: 'var(--primary)',
                  color: '#FFF',
                  padding: '6px 14px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '700'
                }}
              >
                Proceed to Reset Password
              </button>
            </div>
          )}
        </div>
      )}

      <div className="auth-form-group">
        <label className="auth-label">Email Address</label>
        <div className="auth-input-wrapper">
          <FiMail className="auth-input-icon" />
          <input
            type="email"
            placeholder={isHR ? "hr@company.com" : "candidate@example.com"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        {loading ? 'Sending Request...' : 'Send Password Reset Link'}
      </button>

      <p className="auth-footer-text">
        Remember your password?{' '}
        <Link to={getLoginPath()} className="auth-link">Back to Sign In</Link>
      </p>
    </form>
  );
};

export default ForgotPassword;
