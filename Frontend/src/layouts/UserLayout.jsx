import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Navbar from '../components/Navbar/Navbar';
import './UserLayout.css';

const UserLayout = () => {
  return (
    <div className="layout-wrapper">
      <Sidebar role="user" />
      <div className="layout-main-content">
        <Navbar searchPlaceholder="Search jobs, companies, skills..." />
        <main className="layout-page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
