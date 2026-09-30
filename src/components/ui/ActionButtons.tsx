import React from "react"
import type { ButtonProps } from "./button"
import { Button } from "./button"
import { Pencil, Plus, Filter, Download, Upload, Menu, Settings, X, SlidersHorizontal } from "lucide-react";
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
      {isLoading ? "Menyimpan..." : children}
    </PrimaryButton>
  )
)
SaveButton.displayName = "SaveButton"


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

// 4. Tombol Tambah Data Desktop
export const AddButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children = "Tambah", className = "", ...props }, ref) => (
    <PrimaryButton 
      type="button" 
      className={`hidden md:flex items-center gap-2 ${className}`}
      ref={ref} 
      {...props}
    >
      <Plus className="w-4 h-4" />
      <span>{children}</span>
    </PrimaryButton>
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

// 6. Tombol Floating Action Button (FAB) Tambah Khusus Mobile
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
        // 👇 Ubah h-9 w-9 menjadi h-8 w-8
        className={`rounded-full h-8 w-8 ${className}`} 
        title="Filter" 
        ref= {ref} 
        {...props}
      >
        {/* 👇 Ubah ukuran ikon dari w-4 h-4 menjadi w-3.5 h-3.5 */}
        <Filter className="w-3.5 h-3.5" />
      </Button>

      {/* Indikator Titik Merah Aktif (disesuaikan posisinya dengan ukuran baru) */}
      {isFiltered && (
        <span className="absolute -top-0.5 -right-0.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
      )}
    </div>
  )
)
FilterButton.displayName = "FilterButton"



// 9. Tombol Import Ikon (Disamakan dengan Mobile - Warna Hijau)
export const ImportIconButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", ...props }, ref) => (
    <Button 
      type="button" 
      variant="default" 
      className={`rounded-full h-9 w-9 p-0 bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-sm transition-colors ${className}`}
      ref={ref} 
      title="Import"
      {...props}
    >
      <Upload className="w-4 h-4" />
    </Button>
  )
);
ImportIconButton.displayName = "ImportIconButton";

// 10. Tombol Export Ikon (Disamakan dengan Mobile - Warna Oranye/Kuning)
export const ExportIconButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", ...props }, ref) => (
    <Button 
      type="button" 
      variant="default" 
     className={`rounded-full h-9 w-9 p-0 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-sm ${className}`}
      ref={ref} 
      title="Export"
      {...props}
    >
      <Download className="w-4 h-4" />
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
      {/* 🔴 PASTIKAN BAGIAN INI ADA: Mengecek state isOpen untuk menampilkan X atau Menu */}
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

// 13. Group FAB Mobile
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
      {isOpen && (
        <div className="flex flex-col items-end gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
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

// 14. Rows Per Page Selector
interface RowsPerPageSelectorProps<T> {
  table: Table<T>;
  options?: number[];
}
export function RowsPerPageSelector<T>({ 
  table, 
  options = [25, 50, 75, 100, 125] 
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