import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';

import { Sidebar } from '@/widgets/sidebar';
import { Header } from '@/widgets/header';

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <button
            type="button"
            className="fixed inset-0 bg-black/60"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          />
          {/* Sidebar panel */}
          <div className="relative z-50 h-full w-60">
            <Sidebar onClose={closeSidebar} />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={openSidebar} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
