import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  type VisibilityState,
} from '@tanstack/react-table';
import { Users, Calendar, AlertCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import type { HrManagementItem } from '../types/employee-attendance.type';
import { DataPagination } from '@/components/DataPagination';
import { TableToolbar } from '@/components/ui/TableToolbar';
import { TableFilterPopover } from '@/components/ui/TableFilterPopover';
import { EditActionButton } from '@/components/ui/ActionButtons';
import { DataTable } from '@/components/ui/data-table';
import { FormSelectSearch } from '@/components/ui/FormSelectSearch';

interface EmployeeAttendanceTableProps {
  data: HrManagementItem[];
  selectedPeriode: string;
  onPeriodeChange: (period: string) => void;
  isLoading?: boolean;
  meta: { current_page: number; last_page: number; total: number; per_page: number };
  page: number;
  setPage: (p: number) => void;
  setPageSize: (size: number) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filterDept: string;
  onDeptChange: (d: string) => void;
  filterSubDept: string;
  onSubDeptChange: (sd: string) => void;
}

const PERIODE_OPTIONS = [
  { id: '2026-10', label: 'Oktober 2026 (2026-10-01 — 2026-10-31)' },
  { id: '2026-11', label: 'November 2026 (2026-11-01 — 2026-11-30)' },
];

export const EmployeeAttendanceTable: React.FC<EmployeeAttendanceTableProps> = ({
  data,
  selectedPeriode,
  onPeriodeChange,
  isLoading = false,
  meta,
  setPage,
  setPageSize,
  searchQuery,
  onSearchChange,
  filterDept,
  onDeptChange,
  filterSubDept,
  onSubDeptChange,
}) => {
  const navigate = useNavigate();
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const handleResetFilters = () => {
    onDeptChange('');
    onSubDeptChange('');
    onSearchChange('');
  };

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    employeeId: true,
    nip: true,
    nama: true,
    departemen: true,
    subDepartemen: true,
    subDept: false,
    pos: false,
    grade: false,
    skemaKerja: true,
    totalLibur: false,
    totalPH: false,
    totalIzin: false,
    totalAlfa: false,
    totalSakit: false,
    totalCuti: false,
    totalTerlambat: false,
    totalMasuk: true,
    totalHari: true,
    action: true,
  });

 const columns = useMemo<ColumnDef<HrManagementItem>[]>(
    () => [
      { accessorKey: 'employeeId', header: 'ID Karyawan' },
      { accessorKey: 'nip', header: 'NIP' },
      {
        accessorKey: 'name', // 🟢 Ubah dari 'nama' menjadi 'name'
        header: 'Nama',
        cell: (info) => (
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {String(info.getValue() ?? '-')}
          </span>
        ),
      },
      { accessorKey: 'department', header: 'Departemen' }, // 🟢 Pastikan ini juga 'department' jika sebelumnya 'departemen'
      { accessorKey: 'subDepartment', header: 'Sub Departemen' },
      { accessorKey: 'pos', header: 'POS' },
      { accessorKey: 'grade', header: 'Grade' },
      { accessorKey: 'workScheme', header: 'Skema Kerja' }, // 🟢 Pastikan ini 'workScheme'
      {
        accessorKey: 'totalWorkDays', // 🟢 Ubah dari 'totalMasuk' menjadi 'totalWorkDays'
        header: 'Total Masuk',
        cell: (info) => (
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {String(info.getValue() ?? 0)} Hari
          </span>
        ),
      },
      { accessorKey: 'totalPeriodDays', header: 'Total Hari' }, // 🟢 Ubah dari 'totalHari' menjadi 'totalPeriodDays'
      {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => (
          <div className="flex justify-center">
            <EditActionButton
              onClick={() => navigate(`/hr-management/employee-attendance/edit/${row.original.id}`)}
            />
          </div>
        ),
      },
    ],
    [navigate]
  );
  
  const table = useReactTable({
    data,
    columns,
    pageCount: meta.last_page,
    manualPagination: true,
    state: {
      globalFilter: searchQuery,
      columnVisibility,
      pagination: {
        pageIndex: (meta.current_page ?? 1) - 1,
        pageSize: meta.per_page ?? 10,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({
          pageIndex: (meta.current_page ?? 1) - 1,
          pageSize: meta.per_page ?? 10,
        });
        setPage(newState.pageIndex + 1);
        setPageSize(newState.pageSize);
      }
    },
    onGlobalFilterChange: (val) =>
      onSearchChange(typeof val === 'function' ? val(searchQuery) : val),
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider">
            Pilih Periode HR:
          </span>
        </div>
        <div className="w-full md:w-80">
          <FormSelectSearch
            value={selectedPeriode}
            onChange={(val) => onPeriodeChange(val)}
            placeholder="-- Pilih Periode Berjalan --"
            options={[
              { id: '', label: '-- Pilih Periode Berjalan --' },
              ...PERIODE_OPTIONS,
            ]}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-visible">
        <TableToolbar
          title="Absensi Karyawan"
          subtitle="Kelola rincian data kehadiran & jadwal HR LokaHR"
          icon={<Users className="w-6 h-6" />}
          searchValue={searchQuery ?? ''}
          onSearchChange={onSearchChange}
          showFilterDropdown={showFilterDropdown}
          onToggleFilterDropdown={() => setShowFilterDropdown(!showFilterDropdown)}
          filterDropdownContent={
            <TableFilterPopover
              isOpen={showFilterDropdown}
              onClose={() => setShowFilterDropdown(false)}
              onReset={handleResetFilters}
              fields={[
                {
                  key: 'departemen',
                  label: 'Departemen',
                  render: () => (
                    <FormSelectSearch
                      value={filterDept}
                      onChange={(val) => {
                        onDeptChange(val);
                        onSubDeptChange('');
                      }}
                      placeholder="Semua Departemen"
                      options={[
                        { id: '', label: 'Semua Departemen' },
                        { id: 'IT', label: 'IT' },
                        { id: 'HRD', label: 'HRD' },
                        { id: 'Operasional', label: 'Operasional' },
                      ]}
                    />
                  ),
                },
                {
                  key: 'subDepartemen',
                  label: 'Sub Departemen',
                  render: () => (
                    <FormSelectSearch
                      value={filterSubDept}
                      onChange={(val) => onSubDeptChange(val)}
                      placeholder="Semua Sub Departemen"
                      options={[
                        { id: '', label: 'Semua Sub Departemen' },
                        { id: 'Frontend Engineering', label: 'Frontend Engineering' },
                        { id: 'Backend Engineering', label: 'Backend Engineering' },
                      ]}
                    />
                  ),
                },
              ]}
            />
          }
        />

        {!selectedPeriode ? (
          <div className="py-20 px-4 text-center flex flex-col items-center justify-center space-y-3">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/50 rounded-full text-amber-500 border border-amber-200 dark:border-amber-800">
              <AlertCircle className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
              Periode Belum Dipilih
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm">
              Silakan pilih salah satu periode berjalan di bagian atas untuk menampilkan daftar rincian data kehadiran & jadwal HR.
            </p>
          </div>
        ) : isLoading ? (
          <div className="py-20 text-center text-xs text-gray-500 animate-pulse">
            Memuat data absensi karyawan...
          </div>
        ) : (
          <>
            <div className="px-5 py-2 bg-gray-50/50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800">
              <DataPagination table={table} />
            </div>

            <div className="hidden md:block">
              <DataTable table={table} columnsLength={columns.length} emptyMessage="Tidak ada data Absensi Karyawan ditemukan." />
            </div>

           {/* TAMPILAN MOBILE */}
            <div className="block md:hidden p-4 space-y-3">
              {data.length === 0 ? (
                <p className="text-center text-xs text-gray-500 py-6">Tidak ada data Absensi Karyawan ditemukan.</p>
              ) : (
                data.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 rounded-xl p-4 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.name}</h3> {/* 🟢 item.name */}
                        <p className="font-mono text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">NIP: {item.nip} | ID: {item.employeeId}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono text-[10px] rounded-lg">
                        {item.workScheme} {/* 🟢 item.workScheme */}
                      </span>
                    </div>

                    <div className="pt-2 flex items-center justify-end border-t border-gray-100 dark:border-gray-700">
                      <button
                        type="button"
                        onClick={() => navigate(`/hr-management/employee-attendance/edit/${item.id}`)}
                        className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline py-1 px-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-lg"
                      >
                        <span>Edit Rincian</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};