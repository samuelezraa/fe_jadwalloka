import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  CalendarDays, 
  FileText,
  History,
  Users,
  ChevronDown, 
  ChevronRight,
  LogOut 
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, isMobileOpen, onCloseMobile }) => {
  const [openMaster, setOpenMaster] = useState(false);
  const [openJadwal, setOpenJadwal] = useState(false);
  const [openHrManagement, setOpenHrManagement] = useState(false);
  const [openLaporan, setOpenLaporan] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  const isMasterActive = location.pathname.startsWith('/master-data');
  const isJadwalActive = location.pathname.startsWith('/jadwal');
  const isHrManagementActive = location.pathname.startsWith('/hr-management');
  const isLaporanActive = location.pathname.startsWith('/laporan');

  const handleLogout = () => {
    onCloseMobile();
    navigate('/login');
  };

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
        className={`fixed top-0 left-0 bottom-0 z-[100] bg-white dark:bg-gray-900 transition-all duration-300 flex flex-col ${
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
        } ${
          isCollapsed ? 'md:w-24' : 'md:w-64'
        }`}
      >
        {/* Brand / Logo */}
        <div className="h-16 flex items-center px-4 justify-between md:justify-center">
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
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
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

            {openMaster && (!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col py-1 bg-white dark:bg-gray-900">
                <NavLink to="/master-data/departemen" onClick={onCloseMobile} className={({ isActive }) => `flex items-center pl-14 pr-4 py-2 text-sm transition-colors ${isActive ? 'text-amber-500 font-medium' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}>
                  <span>Departemen</span>
                </NavLink>
                <NavLink to="/master-data/sub-departemen" onClick={onCloseMobile} className={({ isActive }) => `flex items-center pl-14 pr-4 py-2 text-sm transition-colors ${isActive ? 'text-amber-500 font-medium' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}>
                  <span>Sub Departemen</span>
                </NavLink>
                <NavLink to="/master-data/pos" onClick={onCloseMobile} className={({ isActive }) => `flex items-center pl-14 pr-4 py-2 text-sm transition-colors ${isActive ? 'text-amber-500 font-medium' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}>
                  <span>POS</span>
                </NavLink>
                <NavLink to="/master-data/grade" onClick={onCloseMobile} className={({ isActive }) => `flex items-center pl-14 pr-4 py-2 text-sm transition-colors ${isActive ? 'text-amber-500 font-medium' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}>
                  <span>Grade</span>
                </NavLink>
                <NavLink to="/master-data/skema-hari-kerja" onClick={onCloseMobile} className={({ isActive }) => `flex items-center pl-14 pr-4 py-2 text-sm transition-colors ${isActive ? 'text-amber-500 font-medium' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}>
                  <span>Skema Hari Kerja</span>
                </NavLink>
                <NavLink to="/master-data/event-tahunan" onClick={onCloseMobile} className={({ isActive }) => `flex items-center pl-14 pr-4 py-2 text-sm transition-colors ${isActive ? 'text-amber-500 font-medium' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}>
                  <span>Event Tahunan</span>
                </NavLink>
                <NavLink to="/master-data/data-karyawan" onClick={onCloseMobile} className={({ isActive }) => `flex items-center pl-14 pr-4 py-2 text-sm transition-colors ${isActive ? 'text-amber-500 font-medium' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}>
                  <span>Data Karyawan</span>
                </NavLink>
                <NavLink to="/master-data/custom-jam-kerja" onClick={onCloseMobile} className={({ isActive }) => `flex items-center pl-14 pr-4 py-2 text-sm transition-colors ${isActive ? 'text-amber-500 font-medium' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}>
                  <span>Custom Jam Kerja</span>
                </NavLink>
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

            {openJadwal && (!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col py-1 bg-white dark:bg-gray-900">
                <NavLink to="/jadwal/jam-kerja" onClick={onCloseMobile} className={({ isActive }) => `flex items-center pl-14 pr-4 py-2 text-sm transition-colors ${isActive ? 'text-amber-500 font-medium' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}>
                  <span>Jam Kerja (Skema 52)</span>
                </NavLink>
                <NavLink to="/jadwal/input-jadwal" onClick={onCloseMobile} className={({ isActive }) => `flex items-center pl-14 pr-4 py-2 text-sm transition-colors ${isActive ? 'text-amber-500 font-medium' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}>
                  <span>Input Jadwal</span>
                </NavLink>
                <NavLink to="/jadwal/jadwalku" onClick={onCloseMobile} className={({ isActive }) => `flex items-center pl-14 pr-4 py-2 text-sm transition-colors ${isActive ? 'text-amber-500 font-medium' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}>
                  <span>Jadwalku</span>
                </NavLink>
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

            {openLaporan && (!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col py-1 bg-white dark:bg-gray-900">
                <NavLink to="/laporan/absensi" onClick={onCloseMobile} className={({ isActive }) => `flex items-center pl-14 pr-4 py-2 text-sm transition-colors ${isActive ? 'text-amber-500 font-medium' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}>
                  <span>Absensi</span>
                </NavLink>
                <NavLink to="/laporan/pivot" onClick={onCloseMobile} className={({ isActive }) => `flex items-center pl-14 pr-4 py-2 text-sm transition-colors ${isActive ? 'text-amber-500 font-medium' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}>
                  <span>Pivot</span>
                </NavLink>
                <NavLink to="/laporan/komplimen" onClick={onCloseMobile} className={({ isActive }) => `flex items-center pl-14 pr-4 py-2 text-sm transition-colors ${isActive ? 'text-amber-500 font-medium' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}>
                  <span>Komplimen</span>
                </NavLink>
                <NavLink to="/laporan/kehadiran-karyawan" onClick={onCloseMobile} className={({ isActive }) => `flex items-center pl-14 pr-4 py-2 text-sm transition-colors ${isActive ? 'text-amber-500 font-medium' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}>
                  <span>Kehadiran Karyawan</span>
                </NavLink>
              </div>
            )}
          </div>


 {/* HR Management Dropdown 🌟 */}
          <div className="relative group">
            <div
              onClick={() => {
                if (!isCollapsed || isMobileOpen) {
                  setOpenHrManagement(!openHrManagement);
                }
              }}
              className={`w-full flex items-center py-3 text-sm font-medium transition-colors border-l-4 cursor-pointer ${
                isHrManagementActive 
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-500 font-semibold' 
                  : 'border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60'
              } ${
                isCollapsed && !isMobileOpen ? 'md:justify-center md:px-0' : 'justify-between px-6'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 shrink-0" />
                {(!isCollapsed || isMobileOpen) && <span>HR Management</span>}
              </div>
              {(!isCollapsed || isMobileOpen) && (
                openHrManagement ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
              )}
            </div>

            {openHrManagement && (!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col py-1 bg-white dark:bg-gray-900">
                <NavLink to="/hr-management/periode" onClick={onCloseMobile} className={({ isActive }) => `flex items-center pl-14 pr-4 py-2 text-sm transition-colors ${isActive ? 'text-amber-500 font-medium' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}>
                  <span>Periode</span>
                </NavLink>
                <NavLink to="/hr-management/absensi-karyawan" onClick={onCloseMobile} className={({ isActive }) => `flex items-center pl-14 pr-4 py-2 text-sm transition-colors ${isActive ? 'text-amber-500 font-medium' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}>
                  <span>Absensi Karyawan</span>
                </NavLink>
              </div>
            )}
          </div>


          {/* Log History */}
          <NavLink
            to="/log-history"
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center py-3 text-sm font-medium transition-colors border-l-4 ${
                isActive 
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-500 font-semibold' 
                  : 'border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60'
              } ${
                isCollapsed && !isMobileOpen ? 'md:justify-center md:px-0' : 'justify-start px-6 gap-3'
              }`
            }
            title={isCollapsed && !isMobileOpen ? "Log History" : ""}
          >
            <History className="w-5 h-5 shrink-0" />
            {(!isCollapsed || isMobileOpen) && <span>Log History</span>}
          </NavLink>

        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            onClick={handleLogout}
            className={`w-full flex items-center py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors ${
              isCollapsed && !isMobileOpen ? 'justify-center px-0' : 'px-4 gap-3'
            }`}
            title={isCollapsed && !isMobileOpen ? "Logout" : ""}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {(!isCollapsed || isMobileOpen) && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};