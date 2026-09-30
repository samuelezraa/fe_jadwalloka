import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { FilterButton } from './ActionButtons';

interface TableToolbarProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  searchValue: string;
  onSearchChange: (value: string) => void;
  showFilterDropdown?: boolean;
  onToggleFilterDropdown?: () => void;
  isFiltered?: boolean;
  filterDropdownContent?: React.ReactNode;
  actionButtons?: React.ReactNode;
}

export const TableToolbar: React.FC<TableToolbarProps> = ({
  title,
  subtitle,
  icon,
  searchValue,
  onSearchChange,
  showFilterDropdown,
  onToggleFilterDropdown,
  isFiltered,
  filterDropdownContent,
  actionButtons,
}) => {
  const filterRef = useRef<HTMLDivElement>(null);

  // Efek otomatis menutup filter jika pengguna mengklik di luar area filter (termasuk saat membuka sidebar)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        if (showFilterDropdown && onToggleFilterDropdown) {
          onToggleFilterDropdown(); // Tutup dropdown
        }
      }
    };

    if (showFilterDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilterDropdown, onToggleFilterDropdown]);

  return (
    <div className="p-4 md:p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative" ref={filterRef}>
      
      {/* Bagian Kiri: Judul dan Subtitle */}
      <div className="flex items-start gap-3">
        {icon && <div className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">{icon}</div>}
        <div className="flex flex-col">
          <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">{title}</h2>
          {subtitle && <p className="text-[11px] md:text-xs text-gray-400 dark:text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      {/* Bagian Kanan: Kolom Pencarian dan Tombol Aksi */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        <div className="relative flex items-center w-full md:w-80">
          <span className="absolute left-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchValue ?? ''}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari data disini..."
            className="w-full pl-10 pr-12 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full text-xs text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-gray-50 dark:focus:bg-gray-800 transition-all shadow-sm"
          />

          {/* Tombol Filter Bulat */}
          {onToggleFilterDropdown && (
            <div className="absolute right-1 flex items-center">
              <FilterButton 
                onClick={onToggleFilterDropdown}
                isActive={showFilterDropdown}
                isFiltered={isFiltered}
              />
            </div>
          )}

          {/* Dropdown Menu Filter */}
          {/* Dropdown Menu Filter */}
          {showFilterDropdown && filterDropdownContent && (
            <div className="absolute right-0 top-full mt-2 z-30 w-72 sm:w-80 p-3 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-visible">
              {filterDropdownContent}
            </div>
          )}
        </div>

        {/* Tombol Aksi / Tambah di Desktop */}
        {actionButtons && (
          <div className="shrink-0">
            {actionButtons}
          </div>
        )}
      </div>

    </div>
  );
};