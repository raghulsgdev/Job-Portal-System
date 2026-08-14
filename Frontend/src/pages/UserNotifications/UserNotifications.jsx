import React, { useState, useEffect } from 'react';
import { FiBell, FiCheckCircle } from 'react-icons/fi';
import api from '../../services/api';
import './UserNotifications.css';

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading notifications...</div>;

  return (
    <div className="notif-page-container animate-fade">
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>Notifications</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Updates on your applications, interviews, and recruiter messages.</p>
      </div>

      {notifications.length === 0 ? (
        <div style={{ background: '#FFF', padding: '40px', borderRadius: 'var(--radius-xl)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
          <h3>No notifications</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>You're all caught up!</p>
        </div>
      ) : (
        notifications.map((n) => (
          <div key={n.id} className={`notif-card ${!n.is_read ? 'unread' : ''}`}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-main)' }}>{n.title}</div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>{n.message}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '6px' }}>{new Date(n.created_at).toLocaleString()}</div>
            </div>

            {!n.is_read && (
              <button
                onClick={() => handleMarkRead(n.id)}
                style={{
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: '700',
                  fontSize: '12px'
                }}
              >
                Mark Read
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default UserNotifications;
