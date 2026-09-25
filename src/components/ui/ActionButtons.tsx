import React from "react"
import type { ButtonProps } from "./button"
import { Button } from "./button"
import { Save, Pencil, Plus, Filter, Download, Upload, Menu, Settings, X } from "lucide-react";

import { SlidersHorizontal } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { Table } from "@tanstack/react-table";




// 1. Tombol Simpan
interface SaveButtonProps extends ButtonProps {
  isLoading?: boolean;
}
export const SaveButton = React.forwardRef<HTMLButtonElement, SaveButtonProps>(
  ({ isLoading, disabled, ...props }, ref) => (
    <Button type="submit" variant="default" disabled={isLoading || disabled} ref={ref} {...props}>
      {isLoading ? "Menyimpan..." : "Simpan"}
    </Button>
  )
)
SaveButton.displayName = "SaveButton"

// 2. Tombol Batal (Background Merah, Teks Putih)
export const CancelButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", ...props }, ref) => (
    <Button 
      type="button" 
      variant="default" 
      className={`bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 ${className}`} 
      ref={ref} 
      {...props}
    >
      Batal
    </Button>
  )
)
CancelButton.displayName = "CancelButton"


// 3. Tombol Tambah Data (Hanya tampil di Desktop, disembunyikan di Mobile)
export const AddButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children = "Tambah", className = "", ...props }, ref) => (
    <Button 
      type="button" 
      variant="default" 
      className={`hidden md:flex items-center gap-2 ${className}`}
      ref={ref} 
      {...props}
    >
      <Plus className="w-4 h-4" />
      <span>{children}</span>
    </Button>
  )
)
AddButton.displayName = "AddButton"


// 4. Tombol Floating Action Button (FAB) Tambah Khusus Mobile
interface MobileAddFabProps {
  onClick: () => void;
  title?: string;
}
export const MobileAddFab: React.FC<MobileAddFabProps> = ({ onClick, title = "Tambah" }) => (
  <div className="fixed bottom-24 right-6 z-50 block md:hidden">
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center w-12 h-12 bg-emerald-600 dark:bg-emerald-500 text-white rounded-full shadow-2xl hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-transform active:scale-95 border-2 border-white dark:border-gray-900"
      title={title}
    >
      <Plus className="w-5 h-5" />
    </button>
  </div>
)


// 5. Tombol Aksi Tabel: Edit (Hanya Ikon)
export const EditActionButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ ...props }, ref) => (
    <Button type="button" variant="actionEdit" size="icon" title="Edit" ref={ref} {...props}>
      <Pencil className="w-3.5 h-3.5" />
    </Button>
  )
)
EditActionButton.displayName = "EditActionButton"

// 6. Tombol Filter
interface FilterButtonProps extends ButtonProps {
  isActive?: boolean;
}


// 7. Tombol Import
export const ImportIconButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", ...props }, ref) => (
    <Button 
      type="button" 
      variant="outline" 
      className={`p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm transition-colors ${className}`}
      ref={ref} 
      title="Import Jadwal"
      {...props}
    >
      <Upload className="w-4 h-4" />
    </Button>
  )
);
ImportIconButton.displayName = "ImportIconButton";

// 8. Tombol Export
export const ExportIconButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", ...props }, ref) => (
    <Button 
      type="button" 
      variant="outline" 
      className={`p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm transition-colors ${className}`}
      ref={ref} 
      title="Export Jadwal"
      {...props}
    >
      <Download className="w-4 h-4" />
    </Button>
  )
);
ExportIconButton.displayName = "ExportIconButton";




export const FilterButton = React.forwardRef<HTMLButtonElement, FilterButtonProps>(
  ({ isActive, ...props }, ref) => (
    <Button 
      type="button" 
      variant={isActive ? "amber" : "default"} 
      size="icon" 
      className="rounded-full h-9 w-9" 
      title="Filter" 
      ref={ref} 
      {...props}
    >
      <Filter className="w-4 h-4" />
    </Button>
  )
)
FilterButton.displayName = "FilterButton"



// Tombol Hamburger / Menu Mobile (Reusable)
export const MenuIconButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", ...props }, ref) => (
    <Button 
      type="button" 
      variant="outline" 
      className={`p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm transition-colors ${className}`}
      ref={ref} 
      title="Menu"
      {...props}
    >
      <Menu className="w-5 h-5" />
    </Button>
  )
);
MenuIconButton.displayName = "MenuIconButton";





// Komponen Tombol & Dropdown Visibility Kolom (Reusable)
interface ColumnVisibilityDropdownProps<T> {
  table: Table<T>;
}

export function ColumnVisibilityDropdown<T>({ table }: ColumnVisibilityDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown saat klik di luar
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
        // Diubah dari bottom-full mb-2 menjadi top-full mt-2 agar ke bawah
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
                  // Menggunakan gap-2 dan menempatkan input di sebelah kiri teks
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




interface MobileActionFabGroupProps {
  onSetting?: () => void;
  onImport?: () => void;
  onExport?: () => void;
}

export const MobileActionFabGroup: React.FC<MobileActionFabGroupProps> = ({
  onSetting,
  onImport,
  onExport,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-6 z-50 block md:hidden flex flex-col items-end gap-2">
      {/* Daftar Sub-Tombol yang muncul saat terbuka */}
      {isOpen && (
        <div className="flex flex-col items-end gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Tombol Setting */}
          {onSetting && (
            <button
              type="button"
              onClick={() => { onSetting(); setIsOpen(false); }}
              className="flex items-center justify-center w-11 h-11 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-transform active:scale-95 border-2 border-white dark:border-gray-900"
              title="Setting"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}

          {/* Tombol Import */}
          {onImport && (
            <button
              type="button"
              onClick={() => { onImport(); setIsOpen(false); }}
              className="flex items-center justify-center w-11 h-11 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-transform active:scale-95 border-2 border-white dark:border-gray-900"
              title="Import"
            >
              <Upload className="w-5 h-5" />
            </button>
          )}

          {/* Tombol Export */}
          {onExport && (
            <button
              type="button"
              onClick={() => { onExport(); setIsOpen(false); }}
              className="flex items-center justify-center w-11 h-11 bg-amber-500 text-white rounded-full shadow-lg hover:bg-amber-600 transition-transform active:scale-95 border-2 border-white dark:border-gray-900"
              title="Export"
            >
              <Download className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Tombol Utama Trigger (Pengganti / Pembuka Menu) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-12 h-12 bg-gray-800 dark:bg-gray-700 text-white rounded-full shadow-2xl hover:bg-gray-900 transition-transform active:scale-95 border-2 border-white dark:border-gray-900"
        title="Menu Aksi"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
      </button>
    </div>
  );
};