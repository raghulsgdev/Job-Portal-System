import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Navbar from '../components/Navbar/Navbar';
import './HRLayout.css';

const HRLayout = () => {
  return (
    <div className="hr-layout-wrapper">
      <Sidebar role="hr" />
      <div className="hr-layout-main">
        <Navbar searchPlaceholder="Search applicants, postings, talent..." />
        <main className="hr-page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HRLayout;
