import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  CalendarDays, 
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

  return (
    <>
      {/* Backdrop Mobile */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 md:hidden"
        />
      )}

      <aside 
        className={`fixed top-0 left-0 bottom-0 z-50 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col ${
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
        <nav className="flex-1 overflow-y-auto scrollbar-hide py-4 flex flex-col gap-1">
          
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
          <div>
            <button
              type="button"
              onClick={() => setOpenMaster(!openMaster)}
              className={`w-full flex items-center py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors border-l-4 border-transparent ${
                isCollapsed && !isMobileOpen ? 'md:justify-center md:px-0' : 'justify-between px-6'
              }`}
              title={isCollapsed && !isMobileOpen ? "Master Data" : ""}
            >
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 shrink-0" />
                {(!isCollapsed || isMobileOpen) && <span>Master Data</span>}
              </div>
              {(!isCollapsed || isMobileOpen) && (
                openMaster ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {/* Submenu Master Data */}
            {openMaster && (!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col py-1 bg-gray-50/50 dark:bg-gray-900/50">
                <NavLink
                  to="/master-data/departemen"
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center pl-14 pr-4 py-2 text-sm transition-colors border-l-4 ${
                      isActive ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-500 font-medium' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  <span>Departemen</span>
                </NavLink>

                <NavLink
                  to="/master-data/sub-departemen"
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center pl-14 pr-4 py-2 text-sm transition-colors border-l-4 ${
                      isActive ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-500 font-medium' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  <span>Sub Departemen</span>
                </NavLink>

                <NavLink
                  to="/master-data/pos"
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center pl-14 pr-4 py-2 text-sm transition-colors border-l-4 ${
                      isActive ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-500 font-medium' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  <span>POS</span>
                </NavLink>

                <NavLink
                  to="/master-data/grade"
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center pl-14 pr-4 py-2 text-sm transition-colors border-l-4 ${
                      isActive ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-500 font-medium' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  <span>Grade</span>
                </NavLink>

                <NavLink
                  to="/master-data/skema-hari-kerja"
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center pl-14 pr-4 py-2 text-sm transition-colors border-l-4 ${
                      isActive ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-500 font-medium' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  <span>Skema Hari Kerja</span>
                </NavLink>

                <NavLink
                  to="/master-data/event-tahunan"
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center pl-14 pr-4 py-2 text-sm transition-colors border-l-4 ${
                      isActive ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-500 font-medium' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  <span>Event Tahunan</span>
                </NavLink>

                <NavLink
                  to="/master-data/data-karyawan"
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center pl-14 pr-4 py-2 text-sm transition-colors border-l-4 ${
                      isActive ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-500 font-medium' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  <span>Data Karyawan</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* Jadwal Dropdown */}
          <div>
            <button
              type="button"
              onClick={() => setOpenJadwal(!openJadwal)}
              className={`w-full flex items-center py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors border-l-4 border-transparent ${
                isCollapsed && !isMobileOpen ? 'md:justify-center md:px-0' : 'justify-between px-6'
              }`}
              title={isCollapsed && !isMobileOpen ? "Jadwal" : ""}
            >
              <div className="flex items-center gap-3">
                <CalendarDays className="w-5 h-5 shrink-0" />
                {(!isCollapsed || isMobileOpen) && <span>Jadwal</span>}
              </div>
              {(!isCollapsed || isMobileOpen) && (
                openJadwal ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {/* Submenu Jadwal */}
            {openJadwal && (!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col py-1 bg-gray-50/50 dark:bg-gray-900/50">
                <NavLink
                  to="/jadwal/jam-kerja"
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center pl-14 pr-4 py-2 text-sm transition-colors border-l-4 ${
                      isActive ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-500 font-medium' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  <span>Jam Kerja (Skema 52)</span>
                </NavLink>

                <NavLink
                  to="/jadwal/input-jadwal"
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center pl-14 pr-4 py-2 text-sm transition-colors border-l-4 ${
                      isActive ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-500 font-medium' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  <span>Input Jadwal</span>
                </NavLink>

                <NavLink
                  to="/jadwal/jadwalku"
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center pl-14 pr-4 py-2 text-sm transition-colors border-l-4 ${
                      isActive ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-500 font-medium' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  <span>Jadwalku</span>
                </NavLink>
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
};