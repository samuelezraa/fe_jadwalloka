import React from 'react';
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
  return (
    <div className="p-4 md:p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      
      {/* Bagian Kiri: Judul dan Subtitle */}
      <div className="flex items-start gap-3">
        {icon && <div className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">{icon}</div>}
        <div className="flex flex-col">
          <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">{title}</h2>
          {subtitle && <p className="text-[11px] md:text-xs text-gray-400 dark:text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      {/* Bagian Kanan: Kolom Pencarian dan Tombol Aksi (Otomatis ke kanan di desktop, full width di mobile) */}
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
                isActive={isFiltered} 
                className="h-7 w-7 rounded-full p-0 flex items-center justify-center shadow-none hover:shadow-none"
              />
            </div>
          )}

          {/* Dropdown Menu Filter */}
          {showFilterDropdown && filterDropdownContent && (
            <div className="absolute right-0 top-12 z-50 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-4 animate-in fade-in zoom-in-95 duration-100">
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