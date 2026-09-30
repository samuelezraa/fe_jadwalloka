import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  CalendarDays, 
  FileText, // Icon untuk menu Laporan
  ChevronDown, 
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, isMobileOpen, onCloseMobile }) => {
  const [openMaster, setOpenMaster] = useState(false);
  const [openJadwal, setOpenJadwal] = useState(false);
  const [openLaporan, setOpenLaporan] = useState(false); // State dropdown Laporan
  
  const location = useLocation();

  // Mengecek apakah path saat ini berada di dalam grup Master Data, Jadwal, atau Laporan
  const isMasterActive = location.pathname.startsWith('/master-data');
  const isJadwalActive = location.pathname.startsWith('/jadwal');
  const isLaporanActive = location.pathname.startsWith('/laporan');

  return (
    <>
      {/* Backdrop Mobile */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[90] md:hidden"
        />
      )}

     <aside 
        className={`fixed top-0 left-0 bottom-0 z-[100] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col ${
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
        } ${
          isCollapsed ? 'md:w-24' : 'md:w-64'
        }`}
      >
        {/* Brand / Logo */}
        <div className="h-16 flex items-center px-4 border-b border-gray-100 dark:border-gray-800 justify-between md:justify-center">
          <img 
            src="/saloka-icon.png" 
            alt="Saloka Logo" 
            className={`w-auto object-contain mx-auto transition-all duration-300 ${
              isCollapsed && !isMobileOpen ? 'h-6 max-w-[60px]' : 'h-8 max-w-[150px]'
            }`}
          />
        </div>

       {/* Nav Menu */}
        <nav 
          className={`flex-1 py-4 flex flex-col gap-1 ${
            isCollapsed && !isMobileOpen ? 'overflow-visible' : 'overflow-y-auto'
          }`}
          style={{
            scrollbarWidth: 'none',  // Untuk Firefox
            msOverflowStyle: 'none',   // Untuk Internet Explorer & Edge
          }}
        >
          {/* Style internal khusus Chrome, Safari, dan Edge berbasis Chromium */}
          <style>{`
            nav::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {/* Dashboard */}
          <NavLink
            to="/dashboard"
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center py-3 text-sm font-medium transition-colors border-l-4 ${
                isActive 
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-500' 
                  : 'border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60'
              } ${
                isCollapsed && !isMobileOpen ? 'md:justify-center md:px-0' : 'justify-start px-6 gap-3'
              }`
            }
            title={isCollapsed && !isMobileOpen ? "Dashboard" : ""}
          >
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            {(!isCollapsed || isMobileOpen) && <span>Dashboard</span>}
          </NavLink>

          {/* Master Data Dropdown */}
          <div className="relative group">
            <div
              onClick={() => {
                if (!isCollapsed || isMobileOpen) {
                  setOpenMaster(!openMaster);
                }
              }}
              className={`w-full flex items-center py-3 text-sm font-medium transition-colors border-l-4 cursor-pointer ${
                isMasterActive 
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-500 font-semibold' 
                  : 'border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60'
              } ${
                isCollapsed && !isMobileOpen ? 'md:justify-center md:px-0' : 'justify-between px-6'
              }`}
            >
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 shrink-0" />
                {(!isCollapsed || isMobileOpen) && <span>Master Data</span>}
              </div>
              {(!isCollapsed || isMobileOpen) && (
                openMaster ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
              )}
            </div>

            {/* Submenu Master Data (Expanded Mode) */}
            {openMaster && (!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col py-1 bg-gray-50/50 dark:bg-gray-900/50">
                <NavLink to="/master-data/departemen" onClick={onCloseMobile} className={({ isActive }) => `flex items-center pl-14 pr-4 py-2 text-sm transition-colors border-l-4 ${isActive ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-500 font-medium' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  <span>Departemen</span>
                </NavLink>
                <NavLink to="/master-data/sub-departemen" onClick={onCloseMobile} className={({ isActive }) => `flex items-center pl-14 pr-4 py-2 text-sm transition-colors border-l-4 ${isActive ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-500 font-medium' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  <span>Sub Departemen</span>
                </NavLink>
                <NavLink to="/master-data/pos" onClick={onCloseMobile} className={({ isActive }) => `flex items-center pl-14 pr-4 py-2 text-sm transition-colors border-l-4 ${isActive ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-500 font-medium' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  <span>POS</span>
                </NavLink>
                <NavLink to="/master-data/grade" onClick={onCloseMobile} className={({ isActive }) => `flex items-center pl-14 pr-4 py-2 text-sm transition-colors border-l-4 ${isActive ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-500 font-medium' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  <span>Grade</span>
                </NavLink>
                <NavLink to="/master-data/skema-hari-kerja" onClick={onCloseMobile} className={({ isActive }) => `flex items-center pl-14 pr-4 py-2 text-sm transition-colors border-l-4 ${isActive ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-500 font-medium' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  <span>Skema Hari Kerja</span>
                </NavLink>
                <NavLink to="/master-data/event-tahunan" onClick={onCloseMobile} className={({ isActive }) => `flex items-center pl-14 pr-4 py-2 text-sm transition-colors border-l-4 ${isActive ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-500 font-medium' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  <span>Event Tahunan</span>
                </NavLink>
                <NavLink to="/master-data/data-karyawan" onClick={onCloseMobile} className={({ isActive }) => `flex items-center pl-14 pr-4 py-2 text-sm transition-colors border-l-4 ${isActive ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-500 font-medium' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  <span>Data Karyawan</span>
                </NavLink>
              </div>
            )}

            {/* Submenu Pop-up saat Sidebar Collapsed */}
            {isCollapsed && !isMobileOpen && (
              <div className="absolute left-full top-0 pl-2 w-56 z-50 hidden group-hover:block">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl py-2">
                  <div className="px-4 py-2 font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 mb-1">
                    Master Data
                  </div>
                  <div className="flex flex-col">
                    <NavLink to="/master-data/departemen" className={({ isActive }) => `px-4 py-2 text-sm transition-colors ${isActive ? 'text-amber-500 font-medium bg-amber-50 dark:bg-amber-950/40' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                      Departemen
                    </NavLink>
                    <NavLink to="/master-data/sub-departemen" className={({ isActive }) => `px-4 py-2 text-sm transition-colors ${isActive ? 'text-amber-500 font-medium bg-amber-50 dark:bg-amber-950/40' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                      Sub Departemen
                    </NavLink>
                    <NavLink to="/master-data/pos" className={({ isActive }) => `px-4 py-2 text-sm transition-colors ${isActive ? 'text-amber-500 font-medium bg-amber-50 dark:bg-amber-950/40' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                      POS
                    </NavLink>
                    <NavLink to="/master-data/grade" className={({ isActive }) => `px-4 py-2 text-sm transition-colors ${isActive ? 'text-amber-500 font-medium bg-amber-50 dark:bg-amber-950/40' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                      Grade
                    </NavLink>
                    <NavLink to="/master-data/skema-hari-kerja" className={({ isActive }) => `px-4 py-2 text-sm transition-colors ${isActive ? 'text-amber-500 font-medium bg-amber-50 dark:bg-amber-950/40' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                      Skema Hari Kerja
                    </NavLink>
                    <NavLink to="/master-data/event-tahunan" className={({ isActive }) => `px-4 py-2 text-sm transition-colors ${isActive ? 'text-amber-500 font-medium bg-amber-50 dark:bg-amber-950/40' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                      Event Tahunan
                    </NavLink>
                    <NavLink to="/master-data/data-karyawan" className={({ isActive }) => `px-4 py-2 text-sm transition-colors ${isActive ? 'text-amber-500 font-medium bg-amber-50 dark:bg-amber-950/40' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                      Data Karyawan
                    </NavLink>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Jadwal Dropdown */}
          <div className="relative group">
            <div
              onClick={() => {
                if (!isCollapsed || isMobileOpen) {
                  setOpenJadwal(!openJadwal);
                }
              }}
              className={`w-full flex items-center py-3 text-sm font-medium transition-colors border-l-4 cursor-pointer ${
                isJadwalActive 
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-500 font-semibold' 
                  : 'border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60'
              } ${
                isCollapsed && !isMobileOpen ? 'md:justify-center md:px-0' : 'justify-between px-6'
              }`}
            >
              <div className="flex items-center gap-3">
                <CalendarDays className="w-5 h-5 shrink-0" />
                {(!isCollapsed || isMobileOpen) && <span>Jadwal</span>}
              </div>
              {(!isCollapsed || isMobileOpen) && (
                openJadwal ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
              )}
            </div>

            {/* Submenu Jadwal (Expanded Mode) */}
            {openJadwal && (!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col py-1 bg-gray-50/50 dark:bg-gray-900/50">
                <NavLink to="/jadwal/jam-kerja" onClick={onCloseMobile} className={({ isActive }) => `flex items-center pl-14 pr-4 py-2 text-sm transition-colors border-l-4 ${isActive ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-500 font-medium' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  <span>Jam Kerja (Skema 52)</span>
                </NavLink>
                <NavLink to="/jadwal/input-jadwal" onClick={onCloseMobile} className={({ isActive }) => `flex items-center pl-14 pr-4 py-2 text-sm transition-colors border-l-4 ${isActive ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-500 font-medium' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  <span>Input Jadwal</span>
                </NavLink>
                <NavLink to="/jadwal/jadwalku" onClick={onCloseMobile} className={({ isActive }) => `flex items-center pl-14 pr-4 py-2 text-sm transition-colors border-l-4 ${isActive ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-500 font-medium' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  <span>Jadwalku</span>
                </NavLink>
              </div>
            )}

            {/* Submenu Pop-up saat Sidebar Collapsed */}
            {isCollapsed && !isMobileOpen && (
              <div className="absolute left-full top-0 pl-2 w-56 z-50 hidden group-hover:block">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl py-2">
                  <div className="px-4 py-2 font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 mb-1">
                    Jadwal
                  </div>
                  <div className="flex flex-col">
                    <NavLink to="/jadwal/jam-kerja" className={({ isActive }) => `px-4 py-2 text-sm transition-colors ${isActive ? 'text-amber-500 font-medium bg-amber-50 dark:bg-amber-950/40' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                      Jam Kerja (Skema 52)
                    </NavLink>
                    <NavLink to="/jadwal/input-jadwal" className={({ isActive }) => `px-4 py-2 text-sm transition-colors ${isActive ? 'text-amber-500 font-medium bg-amber-50 dark:bg-amber-950/40' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                      Input Jadwal
                    </NavLink>
                    <NavLink to="/jadwal/jadwalku" className={({ isActive }) => `px-4 py-2 text-sm transition-colors ${isActive ? 'text-amber-500 font-medium bg-amber-50 dark:bg-amber-950/40' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                      Jadwalku
                    </NavLink>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Laporan Dropdown */}
          <div className="relative group">
            <div
              onClick={() => {
                if (!isCollapsed || isMobileOpen) {
                  setOpenLaporan(!openLaporan);
                }
              }}
              className={`w-full flex items-center py-3 text-sm font-medium transition-colors border-l-4 cursor-pointer ${
                isLaporanActive 
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-500 font-semibold' 
                  : 'border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60'
              } ${
                isCollapsed && !isMobileOpen ? 'md:justify-center md:px-0' : 'justify-between px-6'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 shrink-0" />
                {(!isCollapsed || isMobileOpen) && <span>Laporan</span>}
              </div>
              {(!isCollapsed || isMobileOpen) && (
                openLaporan ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
              )}
            </div>

            {/* Submenu Laporan (Expanded Mode) */}
            {openLaporan && (!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col py-1 bg-gray-50/50 dark:bg-gray-900/50">
                <NavLink to="/laporan/pivot" onClick={onCloseMobile} className={({ isActive }) => `flex items-center pl-14 pr-4 py-2 text-sm transition-colors border-l-4 ${isActive ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-500 font-medium' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  <span>Pivot</span>
                </NavLink>
                <NavLink to="/laporan/komplimen" onClick={onCloseMobile} className={({ isActive }) => `flex items-center pl-14 pr-4 py-2 text-sm transition-colors border-l-4 ${isActive ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-500 font-medium' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  <span>Komplimen</span>
                </NavLink>
              </div>
            )}

            {/* Submenu Pop-up saat Sidebar Collapsed */}
            {isCollapsed && !isMobileOpen && (
              <div className="absolute left-full top-0 pl-2 w-56 z-50 hidden group-hover:block">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl py-2">
                  <div className="px-4 py-2 font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 mb-1">
                    Laporan
                  </div>
                  <div className="flex flex-col">
                    <NavLink to="/laporan/pivot" className={({ isActive }) => `px-4 py-2 text-sm transition-colors ${isActive ? 'text-amber-500 font-medium bg-amber-50 dark:bg-amber-950/40' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                      Pivot
                    </NavLink>
                    <NavLink to="/laporan/komplimen" className={({ isActive }) => `px-4 py-2 text-sm transition-colors ${isActive ? 'text-amber-500 font-medium bg-amber-50 dark:bg-amber-950/40' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                      Komplimen
                    </NavLink>
                  </div>
                </div>
              </div>
            )}
          </div>

        </nav>
      </aside>
    </>
  );
};