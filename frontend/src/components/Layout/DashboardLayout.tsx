import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

/**
 * DashboardLayout
 *
 * Main application layout that combines:
 * - Sidebar (responsive: desktop always visible, mobile via hamburger)
 * - Topbar (sticky, with page title, language switcher, notifications, user profile)
 * - Main content area (renders child routes via <Outlet />)
 */
const DashboardLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onToggleMobile={toggleMobileSidebar}
      />

      {/* Main wrapper */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <Topbar />

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
