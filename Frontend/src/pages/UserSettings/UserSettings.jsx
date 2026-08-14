import React, { useState } from 'react';
import { FiLock, FiCheck, FiAlertCircle } from 'react-icons/fi';
import api from '../../services/api';
import './UserSettings.css';

const UserSettings = () => {
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (passwords.new !== passwords.confirm) {
      setError('New passwords do not match');
      return;
    }

    if (passwords.new.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await api.post('/user/change-password', {
        current_password: passwords.current,
        new_password: passwords.new,
        confirm_password: passwords.confirm
      });
      setMessage('Password updated successfully!');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container animate-fade">
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>Account Settings</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Manage your account security and password.</p>
      </div>

      <div className="settings-card">
        <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FiLock style={{ color: 'var(--primary)' }} /> Change Password
        </h2>

        {message && (
          <div className="auth-error-banner" style={{ background: 'var(--status-accepted-bg)', color: 'var(--status-accepted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiCheck /> {message}
          </div>
        )}

        {error && (
          <div className="auth-error-banner" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiAlertCircle /> {error}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit}>
          <div className="auth-form-group">
            <label className="auth-label">Current Password</label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              required
              className="auth-input"
              style={{ paddingLeft: '16px' }}
              placeholder="Enter current password"
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label">New Password</label>
            <input
              type="password"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              required
              className="auth-input"
              style={{ paddingLeft: '16px' }}
              placeholder="Minimum 6 characters"
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Confirm New Password</label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              required
              className="auth-input"
              style={{ paddingLeft: '16px' }}
              placeholder="Re-enter new password"
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserSettings;
