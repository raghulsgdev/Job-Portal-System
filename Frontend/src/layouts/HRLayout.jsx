import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Navbar from '../components/Navbar/Navbar';
import './HRLayout.css';

const HRLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="hr-layout-wrapper">
      <Sidebar 
        role="hr" 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      <div className="hr-layout-main">
        <Navbar 
          searchPlaceholder="Search applicants, postings, talent..." 
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <main className="hr-page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HRLayout;
