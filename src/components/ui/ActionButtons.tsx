import React from "react"
import type { ButtonProps } from "./button"
import { Button } from "./button"
import { 
  Pencil, 
  Plus, 
  Filter, 
  Download, 
  Upload, 
  Menu, 
  Settings, 
  X, 
  SlidersHorizontal, 
  KeyRound, 
  Power, 
  ChevronDown, 
  FileSpreadsheet 
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { Table } from "@tanstack/react-table";

// 1. Tombol Utama / Konfirmasi (Background Hijau Emerald Solid)
export const PrimaryButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = "", ...props }, ref) => (
    <Button
      type="button"
      variant="default"
      className={`bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 font-semibold rounded-lg text-xs px-4 py-2 disabled:opacity-50 transition-colors shadow-sm ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </Button>
  )
)
PrimaryButton.displayName = "PrimaryButton"

// 2. Tombol Simpan
interface SaveButtonProps extends ButtonProps {
  isLoading?: boolean;
}

export const SaveButton = React.forwardRef<HTMLButtonElement, SaveButtonProps>(
  ({ isLoading, disabled, children = "Simpan", ...props }, ref) => (
    <PrimaryButton type="submit" disabled={isLoading || disabled} ref={ref} {...props}>
      {children} {/* 👈 Langsung tampilkan children ("Simpan"), tanpa kondisi "Menyimpan..." */}
    </PrimaryButton>
  )
);


// 3. Tombol Batal (Gunakan variant="destructive" dari button.tsx)
export const CancelButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children = "Batal", className = "", ...props }, ref) => (
    <Button 
      type="button" 
      variant="destructive"
      className={`rounded-lg text-xs px-4 py-2 font-semibold shadow-sm transition-colors ${className}`} 
      ref={ref} 
      {...props}
    >
      {children}
    </Button>
  )
)
CancelButton.displayName = "CancelButton"

// 4. Tombol Tambah Data Desktop (Rounded diubah ke rounded-full menyesuaikan tombol Setting)
export const AddButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children = "Tambah", className = "", ...props }, ref) => (
    <Button
      type="button"
      variant="default"
      className={`hidden md:flex items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 font-semibold rounded-full text-xs px-4 py-2 disabled:opacity-50 transition-colors shadow-sm ${className}`}
      ref={ref} 
      {...props}
    >
      <Plus className="w-4 h-4" />
      <span>{children}</span>
    </Button>
  )
)
AddButton.displayName = "AddButton"

// 5. Tombol File Picker / Secondary Outline
export const OutlineActionButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = "", ...props }, ref) => (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={`bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-xs font-semibold rounded-xl transition-colors shadow-sm ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </Button>
  )
)
OutlineActionButton.displayName = "OutlineActionButton"

// 6. Tombol Floating Action Button (FAB) Tambah Khusus Mobile (Hijau di paling bawah)
interface MobileAddFabProps {
  onClick: () => void;
  title?: string;
}
export const MobileAddFab: React.FC<MobileAddFabProps> = ({ onClick, title = "Tambah" }) => (
  <div className="fixed bottom-24 right-6 z-40 block md:hidden">
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center w-12 h-12 bg-emerald-600 dark:bg-emerald-500 text-white rounded-full shadow-2xl hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-transform active:scale-95 border-2 border-white dark:border-gray-900"
      title={title}
    >
      <Plus className="w-5 h-5" />
    </button>
  </div>
);

// 7. Tombol Aksi Tabel: Edit (Hanya Ikon)
export const EditActionButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ ...props }, ref) => (
    <Button type="button" variant="actionEdit" size="icon" title="Edit" ref={ref} {...props}>
      <Pencil className="w-3.5 h-3.5" />
    </Button>
  )
)
EditActionButton.displayName = "EditActionButton"



// 8. Tombol Filter (Diperkecil sedikit ukurannya)
interface FilterButtonProps extends ButtonProps {
  isActive?: boolean;
  isFiltered?: boolean;
}

export const FilterButton = React.forwardRef<HTMLButtonElement, FilterButtonProps>(
  ({ isActive, isFiltered, className = "", ...props }, ref) => (
    <div className="relative inline-block">
      <Button 
        type="button" 
        variant={isActive ? "amber" : "default"} 
        size="icon" 
        className={`rounded-full h-8 w-8 ${className}`} 
        title="Filter" 
        ref= {ref} 
        {...props}
      >
        <Filter className="w-3.5 h-3.5" />
      </Button>

      {/* Indikator Titik Merah Aktif */}
      {isFiltered && (
        <span className="absolute -top-0.5 -right-0.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
      )}
    </div>
  )
)
FilterButton.displayName = "FilterButton"





// 9. Tombol Import Ikon & Teks (Mobile: Ikon Saja, Desktop: Ikon + Teks)
export const ImportIconButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", ...props }, ref) => (
    <Button
      type="button"
      variant="default"
      className={`rounded-full h-9 px-3 md:px-4 bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-sm transition-colors text-xs font-semibold flex items-center gap-2 ${className}`}
      ref={ref}
      title="Import"
      {...props}
    >
      <Upload className="w-4 h-4 shrink-0" />
      <span className="hidden md:inline">Import</span>
    </Button>
  )
);
ImportIconButton.displayName = "ImportIconButton";

// 10. Tombol Export Ikon & Teks (Mobile: Ikon Saja, Desktop: Ikon + Teks)
export const ExportIconButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", ...props }, ref) => (
    <Button
      type="button"
      variant="default"
      className={`rounded-full h-9 px-3 md:px-4 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-sm transition-colors text-xs font-semibold flex items-center gap-2 ${className}`}
      ref={ref}
      title="Export"
      {...props}
    >
      <Download className="w-4 h-4 shrink-0" />
      <span className="hidden md:inline">Export</span>
    </Button>
  )
);
ExportIconButton.displayName = "ExportIconButton";



// 11. Tombol Hamburger / Menu Mobile
interface MenuIconButtonProps extends ButtonProps {
  isOpen?: boolean;
}

export const MenuIconButton = React.forwardRef<HTMLButtonElement, MenuIconButtonProps>(
  ({ className = "", isOpen = false, ...props }, ref) => (
    <Button 
      type="button" 
      variant="outline" 
      className={`p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm transition-colors ${className}`}
      ref={ref} 
      title={isOpen ? "Tutup Menu" : "Menu"}
      {...props}
    >
      {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </Button>
  )
);
MenuIconButton.displayName = "MenuIconButton";



// 12. Dropdown Visibility Kolom
interface ColumnVisibilityDropdownProps<T> {
  table: Table<T>;
}
export function ColumnVisibilityDropdown<T>({ table }: ColumnVisibilityDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        <span>Kolom</span>
      </Button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-50 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-2 space-y-1">
          <div className="max-h-48 overflow-y-auto space-y-0.5">
           {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => {
              return (
                <label
                  key={column.id}
                  className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                  />
                  <span className="capitalize">
                    {typeof column.columnDef.header === "string"
                      ? column.columnDef.header
                      : column.id}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


// 13. Group FAB Mobile (Standar Global LokaHR)
interface MobileActionFabGroupProps {
  onSetting?: () => void;
  onDownloadSample?: () => void;
  onImport?: () => void;
  onExport?: () => void;
}

export const MobileActionFabGroup: React.FC<MobileActionFabGroupProps> = ({
  onSetting,
  onDownloadSample,
  onImport,
  onExport,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-6 z-[9999] block md:hidden">
      <div className="flex flex-col-reverse items-end gap-2.5">
        {/* Tombol Pemicu Hitam Utama */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-12 h-12 bg-gray-900 dark:bg-gray-800 text-white rounded-full shadow-2xl hover:bg-black active:scale-95 border-2 border-white dark:border-gray-900 shrink-0"
          title="Menu Aksi"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
        </button>

        {/* Tombol-Tombol Melayang Mekar ke Atas */}
        {isOpen && (
          <div className="flex flex-col-reverse items-end gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Export Data (Amber) */}
            {onExport && (
              <button
                type="button"
                onClick={() => { onExport(); setIsOpen(false); }}
                className="flex items-center justify-center w-11 h-11 bg-amber-500 text-white rounded-full shadow-2xl hover:bg-amber-600 active:scale-95 border-2 border-white dark:border-gray-900"
                title="Export Data"
              >
                <Download className="w-5 h-5" />
              </button>
            )}

            {/* Import Data (Emerald) */}
            {onImport && (
              <button
                type="button"
                onClick={() => { onImport(); setIsOpen(false); }}
                className="flex items-center justify-center w-11 h-11 bg-emerald-600 text-white rounded-full shadow-2xl hover:bg-emerald-700 active:scale-95 border-2 border-white dark:border-gray-900"
                title="Import Data"
              >
                <Upload className="w-5 h-5" />
              </button>
            )}

            {/* Download Sample (Teal) */}
            {onDownloadSample && (
              <button
                type="button"
                onClick={() => { onDownloadSample(); setIsOpen(false); }}
                className="flex items-center justify-center w-11 h-11 bg-teal-600 text-white rounded-full shadow-2xl hover:bg-teal-700 active:scale-95 border-2 border-white dark:border-gray-900"
                title="Download Sample"
              >
                <FileSpreadsheet className="w-5 h-5" />
              </button>
            )}

            {/* Setting (Biru) jika ada */}
            {onSetting && (
              <button
                type="button"
                onClick={() => { onSetting(); setIsOpen(false); }}
                className="flex items-center justify-center w-11 h-11 bg-blue-600 text-white rounded-full shadow-2xl hover:bg-blue-700 active:scale-95 border-2 border-white dark:border-gray-900"
                title="Setting"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


// 14. Rows Per Page Selector
interface RowsPerPageSelectorProps<T> {
  table: Table<T>;
  options?: number[];
}

export function RowsPerPageSelector<T>({ 
  table, 
  options = [25, 50, 75, 100] 
}: RowsPerPageSelectorProps<T>) {
  const pageSize = table.getState().pagination.pageSize;

  return (
    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
      <span>Rows per page</span>
      <select
        value={pageSize}
        onChange={(e) => table.setPageSize(Number(e.target.value))}
        className="bg-white dark:bg-gray-800 rounded px-2 py-1 text-xs focus:outline-none"
      >
        {options.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
}

// 1. Tombol Reset Password (Rounded diubah ke rounded-full menyesuaikan tombol Setting)
interface ResetPasswordButtonProps extends ButtonProps {
  selectedCount?: number;
}
export const ResetPasswordButton = React.forwardRef<HTMLButtonElement, ResetPasswordButtonProps>(
  ({ selectedCount = 0, className = '', ...props }, ref) => (
    <Button
      type="button"
      variant="default"
      disabled={selectedCount === 0}
      className={`h-9 px-3 rounded-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 text-white disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed transition-colors shadow-xs flex items-center gap-1.5 ${className}`}
      ref={ref}
      {...props}
    >
      <KeyRound className="w-3.5 h-3.5" />
      <span>Reset ({selectedCount})</span>
    </Button>
  )
);
ResetPasswordButton.displayName = 'ResetPasswordButton';

// 2. Tombol Toggle Status (Enable/Disable)
interface PowerActionButtonProps extends ButtonProps {
  isAktif: boolean;
}
export const PowerActionButton = React.forwardRef<HTMLButtonElement, PowerActionButtonProps>(
  ({ isAktif, className = '', ...props }, ref) => (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={`h-7 w-7 p-1 rounded-md transition-colors ${
        isAktif
          ? 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60'
          : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
      } ${className}`}
      title={isAktif ? 'Disable Karyawan' : 'Enable Karyawan'}
      ref={ref}
      {...props}
    >
      <Power className="w-3.5 h-3.5" />
    </Button>
  )
);
PowerActionButton.displayName = 'PowerActionButton';

// 3. Tombol Setting Dropdown Trigger (Diperbesar ukurannya dari h-8 px-3 menjadi h-9 px-4)
export const SettingDropdownTrigger = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', children = 'Setting', ...props }, ref) => (
    <Button
      type="button"
      variant="default"
      className={`h-9 px-4 rounded-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs flex items-center gap-1.5 ${className}`}
      ref={ref}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown className="w-3.5 h-3.5" />
    </Button>
  )
);
SettingDropdownTrigger.displayName = 'SettingDropdownTrigger';




// Tombol Ubah Status (Enable/Disable) Massal / Kolektif (Warna Merah)
interface BulkStatusButtonProps extends ButtonProps {
  selectedCount?: number;
}
export const BulkStatusButton = React.forwardRef<HTMLButtonElement, BulkStatusButtonProps>(
  ({ selectedCount = 0, className = '', ...props }, ref) => (
    <Button
      type="button"
      variant="default"
      disabled={selectedCount === 0}
      className={`h-9 px-4 rounded-full text-xs font-semibold bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 text-white disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed transition-colors shadow-xs flex items-center gap-1.5 ${className}`}
      ref={ref}
      {...props}
    >
      <Power className="w-3.5 h-3.5" />
      <span>Status({selectedCount})</span>
    </Button>
  )
);
BulkStatusButton.displayName = 'BulkStatusButton';