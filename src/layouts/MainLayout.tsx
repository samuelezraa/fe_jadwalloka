import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MenuIconButton } from '../components/ui/ActionButtons';

export const MainLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const toggleMobileSidebar = () => {
    // Saat sidebar mobile dibuka/ditutup, kita bisa reset state atau biarkan backdrop bekerja
    setIsMobileOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex transition-colors duration-200 relative overflow-x-hidden">
      
      {/* Backdrop Mobile: Ketika sidebar terbuka, lapisan hitam transparan ini akan menutupi seluruh konten */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-[95] block md:hidden transition-opacity backdrop-blur-xs"
        />
      )}

      {/* Sidebar Utama (Pastikan z-index nya di atas backdrop, misal z-[100]) */}
      <div className="relative z-[100]">
        <Sidebar 
          isCollapsed={isCollapsed} 
          isMobileOpen={isMobileOpen} 
          onCloseMobile={() => setIsMobileOpen(false)} 
        />
      </div>

      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ml-0 ${
          isCollapsed ? 'md:ml-24' : 'md:ml-64'
        }`}
      >
        <Header 
          onToggleSidebar={toggleSidebar} 
        />

        <main className="flex-1 p-4 md:p-6 overflow-x-auto bg-gray-50 dark:bg-gray-950">
          <Outlet />
        </main>
      </div>

      {/* Floating Action Button (FAB) Menu Hamburger Mobile */}
      <div className="fixed bottom-6 right-6 z-[110] block md:hidden">
        <MenuIconButton
          isOpen={isMobileOpen}
          onClick={toggleMobileSidebar}
          className="flex items-center justify-center w-12 h-12 bg-amber-500 dark:bg-amber-600 text-white rounded-full shadow-2xl hover:bg-amber-600 dark:hover:bg-amber-500 transition-transform active:scale-95 border-2 border-white dark:border-gray-900 p-0"
          title="Menu Utama"
        />
      </div>
    </div>
  );
};