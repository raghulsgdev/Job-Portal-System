import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Navbar from '../components/Navbar/Navbar';
import './UserLayout.css';

const UserLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="layout-wrapper">
      <Sidebar 
        role="user" 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      <div className="layout-main-content">
        <Navbar 
          searchPlaceholder="Search jobs, companies, skills..." 
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <main className="layout-page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
