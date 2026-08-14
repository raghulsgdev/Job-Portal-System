import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [hr, setHr] = useState(null);
  const [role, setRole] = useState(localStorage.getItem('active_role') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const activeRole = localStorage.getItem('active_role');
      const userToken = localStorage.getItem('user_access_token');
      const hrToken = localStorage.getItem('hr_access_token');

      try {
        if (activeRole === 'user' && userToken) {
          const res = await api.get('/user/profile');
          setUser(res.data);
          setRole('user');
        } else if (activeRole === 'hr' && hrToken) {
          const res = await api.get('/hr/profile');
          setHr(res.data);
          setRole('hr');
        } else if (userToken) {
          const res = await api.get('/user/profile');
          setUser(res.data);
          setRole('user');
          localStorage.setItem('active_role', 'user');
        } else if (hrToken) {
          const res = await api.get('/hr/profile');
          setHr(res.data);
          setRole('hr');
          localStorage.setItem('active_role', 'hr');
        }
      } catch (err) {
        console.error("Auth init error:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const loginCandidate = (authData) => {
    localStorage.setItem('user_access_token', authData.access_token);
    localStorage.setItem('user_refresh_token', authData.refresh_token);
    localStorage.setItem('active_role', 'user');
    setUser(authData.user);
    setHr(null);
    setRole('user');
  };

  const loginHR = (authData) => {
    localStorage.setItem('hr_access_token', authData.access_token);
    localStorage.setItem('hr_refresh_token', authData.refresh_token);
    localStorage.setItem('active_role', 'hr');
    setHr(authData.user);
    setUser(null);
    setRole('hr');
  };

  const refreshUserProfile = async () => {
    try {
      const res = await api.get('/user/profile');
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const refreshHRProfile = async () => {
    try {
      const res = await api.get('/hr/profile');
      setHr(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem('user_access_token');
    localStorage.removeItem('user_refresh_token');
    localStorage.removeItem('hr_access_token');
    localStorage.removeItem('hr_refresh_token');
    localStorage.removeItem('active_role');
    setUser(null);
    setHr(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        hr,
        role,
        loading,
        loginCandidate,
        loginHR,
        logout,
        refreshUserProfile,
        refreshHRProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
