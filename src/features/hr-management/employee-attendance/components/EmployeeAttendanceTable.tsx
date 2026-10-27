import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
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
}) => {
  const navigate = useNavigate();

  const [globalFilter, setGlobalFilter] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // State Filter Hanya Untuk Departemen dan Sub Departemen
  const [filterDept, setFilterDept] = useState('');
  const [filterSubDept, setFilterSubDept] = useState('');

  // 1. Generate Opsi Dynamic Filter dari Data Rekapitulasi
  const deptOptions = useMemo(() => {
    const list = Array.from(new Set(data.map((i) => i.departemen).filter(Boolean)));
    return [{ id: '', label: 'Semua Departemen' }, ...list.map((item) => ({ id: item, label: item }))];
  }, [data]);

  const subDeptOptions = useMemo(() => {
    const list = Array.from(
      new Set(
        data
          .filter((i) => !filterDept || i.departemen === filterDept)
          .map((i) => i.subDepartemen || i.subDept)
          .filter(Boolean)
      )
    );
    return [{ id: '', label: 'Semua Sub Departemen' }, ...list.map((item) => ({ id: item, label: item }))];
  }, [data, filterDept]);

  // Reset Filter
  const handleResetFilters = () => {
    setFilterDept('');
    setFilterSubDept('');
    setGlobalFilter('');
  };

  // 2. Filter Logika Berdasarkan Seleksi Departemen & Sub Departemen
  const filteredData = useMemo(() => {
    if (!selectedPeriode) return [];
    let result = data;

    if (filterDept) {
      result = result.filter((item) => item.departemen === filterDept);
    }
    if (filterSubDept) {
      result = result.filter(
        (item) => item.subDepartemen === filterSubDept || item.subDept === filterSubDept
      );
    }

    if (globalFilter) {
      result = result.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(globalFilter.toLowerCase())
        )
      );
    }
    return result;
  }, [data, selectedPeriode, globalFilter, filterDept, filterSubDept]);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    nip: true,
    nama: true,
    departemen: true,
    subDepartemen: true,
    subDept: true,
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
      { accessorKey: 'nip', header: 'NIP' },
      {
        accessorKey: 'nama',
        header: 'Nama',
        cell: (info) => (
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {String(info.getValue())}
          </span>
        ),
      },
      { accessorKey: 'departemen', header: 'Departemen' },
      { accessorKey: 'subDepartemen', header: 'Sub Departemen' },
      { accessorKey: 'subDept', header: 'Sub Dept' },
      { accessorKey: 'pos', header: 'POS' },
      { accessorKey: 'grade', header: 'Grade' },
      { accessorKey: 'skemaKerja', header: 'Skema Kerja' },
      { accessorKey: 'totalLibur', header: 'Total Libur' },
      { accessorKey: 'totalPH', header: 'Total PH' },
      { accessorKey: 'totalIzin', header: 'Total Izin' },
      { accessorKey: 'totalAlfa', header: 'Total Alfa' },
      { accessorKey: 'totalSakit', header: 'Total Sakit' },
      { accessorKey: 'totalCuti', header: 'Total Cuti' },
      { accessorKey: 'totalTerlambat', header: 'Total Terlambat' },
      {
        accessorKey: 'totalMasuk',
        header: 'Total Masuk',
        cell: (info) => (
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {String(info.getValue())}
          </span>
        ),
      },
      { accessorKey: 'totalHari', header: 'Total Hari' },
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
    data: filteredData,
    columns,
    state: {
      globalFilter,
      columnVisibility,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Selector Periode */}
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
          searchValue={globalFilter ?? ''}
          onSearchChange={setGlobalFilter}
          showFilterDropdown={showFilterDropdown}
          onToggleFilterDropdown={() => setShowFilterDropdown(!showFilterDropdown)}
          filterDropdownContent={
           <TableFilterPopover
            isOpen={showFilterDropdown}
            onClose={() => setShowFilterDropdown(false)}
            onReset={handleResetFilters}
            fields={[
              {
                key: 'departemen', // 👈 Tambahkan key di sini
                label: 'Departemen',
                render: () => (
                  <FormSelectSearch
                    value={filterDept}
                    onChange={(val) => {
                      setFilterDept(val);
                      setFilterSubDept(''); // Reset sub dept ketika departemen berubah
                    }}
                    placeholder="Semua Departemen"
                    options={deptOptions}
                  />
                ),
              },
              {
                key: 'subDepartemen', // 👈 Tambahkan key di sini
                label: 'Sub Departemen',
                render: () => (
                  <FormSelectSearch
                    value={filterSubDept}
                    onChange={(val) => setFilterSubDept(val)}
                    placeholder="Semua Sub Departemen"
                    options={subDeptOptions}
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

            {/* TAMPILAN DESKTOP */}
            <div className="hidden md:block">
              <DataTable table={table} columnsLength={columns.length} emptyMessage="Tidak ada data Absensi Karyawan ditemukan." />
            </div>

            {/* TAMPILAN MOBILE */}
            <div className="block md:hidden p-4 space-y-3">
              {filteredData.length === 0 ? (
                <p className="text-center text-xs text-gray-500 py-6">Tidak ada data Absensi Karyawan ditemukan.</p>
              ) : (
                filteredData.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 rounded-xl p-4 shadow-xs space-y-3 transition-all hover:border-amber-500/50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.nama}</h3>
                        <p className="font-mono text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">NIP: {item.nip}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono text-[10px] rounded-lg border border-gray-200 dark:border-gray-600">
                        {item.skemaKerja}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-700 text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-semibold block">Sub Dept</span>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{item.subDepartemen || item.subDept}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-semibold block">Total Masuk</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{item.totalMasuk} / {item.totalHari} Hari</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-end border-t border-gray-100 dark:border-gray-700">
                      <button
                        type="button"
                        onClick={() => navigate(`/hr-management/employee-attendance/edit/${item.id}`)}
                        className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline py-1 px-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200/60 dark:border-amber-900/60"
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