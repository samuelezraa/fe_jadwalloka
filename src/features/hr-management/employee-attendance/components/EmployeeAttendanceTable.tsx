import React, { useState, useMemo, useEffect, useRef } from 'react';
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
import { api } from '@/lib/axios';

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

  // Penanda agar fetch awal tidak terkena jeda debounce 400ms yang tidak perlu
  const isInitialMount = useRef(true);

  const [periodeSearchQuery, setPeriodeSearchQuery] = useState('');
  const [periodeList, setPeriodeList] = useState<{ id: string; label: string }[]>([]);

  const [deptSearchQuery, setDeptSearchQuery] = useState('');
  const [deptOptions, setDeptOptions] = useState<any[]>([]);

  const [subDeptSearchQuery, setSubDeptSearchQuery] = useState('');
  const [subDeptOptions, setSubDeptOptions] = useState<any[]>([]);

  const filterActive = (arr: any[]) =>
    (arr || []).filter(
      (item: any) =>
        (item.isActive ?? item.is_active) === undefined ||
        (item.isActive ?? item.is_active) === true ||
        (item.isActive ?? item.is_active) === 1 ||
        (item.isActive ?? item.is_active) === '1'
    );

  // 1. Fetch Periode (Langsung jalan di awal tanpa delay 400ms, debounce hanya saat mengetik)
  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const res = await api.get('/periods', {
          params: {
            search: periodeSearchQuery,
            status: 'true',
            per_page: 50,
          },
        });
        const items = res.data?.data || res.data || [];

       const mapped = filterActive(Array.isArray(items) ? items : []).map((p: any) => {
          const periodCode = String(p.code ?? p.idPeriode ?? p.id ?? '').trim();
          const name = p.periode ?? p.name ?? periodCode;
          const startDate = p.tanggalAwal ?? p.start_date ?? '';
          const endDate = p.tanggalAkhir ?? p.end_date ?? '';

          const dateRange =
            startDate && endDate && startDate !== '-' && endDate !== '-'
              ? ` (${startDate} — ${endDate})`
              : '';

          return {
            id: periodCode,
            label: `${name}${dateRange}`,
          };
        });

        setPeriodeList(mapped);

        // Jika nilai tersimpan di sessionStorage sudah tidak valid (misal masih '2026-10'), reset ke kosong
        if (
          !periodeSearchQuery &&
          selectedPeriode &&
          mapped.length > 0 &&
          !mapped.some((item) => item.id === selectedPeriode)
        ) {
          onPeriodeChange('');
        }
      } catch (err) {
        console.error('Gagal memuat master periode:', err);
      }
    };

    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchPeriods();
      return;
    }

    const timer = setTimeout(fetchPeriods, 400);
    return () => clearTimeout(timer);
  }, [periodeSearchQuery]);

  // Ambil objek Departemen terpilih agar bisa mengirim code/id ke endpoint /sub-departments
  const selectedDeptObj = useMemo(() => {
    if (!filterDept) return null;
    return (deptOptions || []).find(
      (d) =>
        String(d.name || d).toLowerCase() === String(filterDept).toLowerCase() ||
        String(d.code || '') === String(filterDept) ||
        String(d.id || '') === String(filterDept)
    );
  }, [filterDept, deptOptions]);

  // 2. LAZY FETCH Departemen: Hanya dipanggil saat popover filter dibuka
  useEffect(() => {
    if (!showFilterDropdown) return;

    const timer = setTimeout(async () => {
      try {
        const res = await api.get('/departments', {
          params: {
            search: deptSearchQuery,
            per_page: 50,
          },
        });
        setDeptOptions(filterActive(res.data?.data || res.data));
      } catch (err) {
        console.error('Gagal memuat master departemen:', err);
      }
    }, deptSearchQuery ? 400 : 0);

    return () => clearTimeout(timer);
  }, [showFilterDropdown, deptSearchQuery]);

  // 3. LAZY FETCH Sub Departemen: Hanya dipanggil saat popover filter dibuka
  useEffect(() => {
    if (!showFilterDropdown) return;

    const timer = setTimeout(async () => {
      try {
        const deptParam = selectedDeptObj?.code || selectedDeptObj?.id || filterDept;
        const res = await api.get('/sub-departments', {
          params: {
            search: subDeptSearchQuery,
            department: deptParam,
            department_code: selectedDeptObj?.code || '',
            department_id: selectedDeptObj?.id || '',
            per_page: 50,
          },
        });
        setSubDeptOptions(filterActive(res.data?.data || res.data));
      } catch (err) {
        console.error('Gagal memuat master sub departemen:', err);
      }
    }, subDeptSearchQuery ? 400 : 0);

    return () => clearTimeout(timer);
  }, [showFilterDropdown, subDeptSearchQuery, filterDept, selectedDeptObj]);

  // Fallback filter Sub Departemen agar sesuai Departemen terpilih
  const displayedSubDeptOptions = useMemo(() => {
    if (!filterDept) return subDeptOptions || [];
    return (subDeptOptions || []).filter((sub) => {
      if (selectedDeptObj?.code && sub.department_code) {
        return (
          String(sub.department_code).toLowerCase() ===
          String(selectedDeptObj.code).toLowerCase()
        );
      }
      if (selectedDeptObj?.id !== undefined && sub.department_id !== undefined) {
        return String(sub.department_id) === String(selectedDeptObj.id);
      }
      const parentName = sub.department?.name || sub.department_name;
      if (parentName) {
        return String(parentName).toLowerCase() === String(filterDept).toLowerCase();
      }
      return true;
    });
  }, [subDeptOptions, filterDept, selectedDeptObj]);

  const handleResetFilters = () => {
    onDeptChange('');
    onSubDeptChange('');
    onSearchChange('');
    setDeptSearchQuery('');
    setSubDeptSearchQuery('');
    setPage(1);
  };

  const isFiltered = Boolean(filterDept || filterSubDept);

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
        accessorKey: 'name',
        header: 'Nama',
        cell: (info) => (
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {String(info.getValue() ?? '-')}
          </span>
        ),
      },
      { accessorKey: 'department', header: 'Departemen' },
      { accessorKey: 'subDepartment', header: 'Sub Departemen' },
      { accessorKey: 'pos', header: 'POS' },
      { accessorKey: 'grade', header: 'Grade' },
      { accessorKey: 'workScheme', header: 'Skema Kerja' },
      {
        accessorKey: 'totalWorkDays',
        header: 'Total Masuk',
        cell: (info) => (
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {String(info.getValue() ?? 0)} Hari
          </span>
        ),
      },
      { accessorKey: 'totalPeriodDays', header: 'Total Hari' },
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
        pageSize: meta.per_page ?? 25,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({
          pageIndex: (meta.current_page ?? 1) - 1,
          pageSize: meta.per_page ?? 25,
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
            onSearchChange={(query) => setPeriodeSearchQuery(query)}
            placeholder="-- Pilih Periode Berjalan --"
            options={[
              { id: '', label: '-- Pilih Periode Berjalan --' },
              ...periodeList,
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
          onSearchChange={(val) => {
            onSearchChange(val);
            setPage(1);
          }}
          showFilterDropdown={showFilterDropdown}
          onToggleFilterDropdown={() => setShowFilterDropdown(!showFilterDropdown)}
          isFiltered={isFiltered}
          filterDropdownContent={
            <TableFilterPopover
              isOpen={showFilterDropdown}
              onClose={() => setShowFilterDropdown(false)}
              isFiltered={isFiltered}
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
                        setSubDeptSearchQuery('');
                        setPage(1);
                      }}
                      onSearchChange={(query) => setDeptSearchQuery(query)}
                      placeholder="Semua Departemen"
                      options={[
                        { id: '', label: 'Semua Departemen' },
                        ...(deptOptions || []).map((d) => ({
                          id: String(d.name || d),
                          label: String(d.name || d),
                        })),
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
                      onChange={(val) => {
                        onSubDeptChange(val);
                        setPage(1);
                      }}
                      onSearchChange={(query) => setSubDeptSearchQuery(query)}
                      placeholder="Semua Sub Departemen"
                      options={[
                        { id: '', label: 'Semua Sub Departemen' },
                        ...(displayedSubDeptOptions || []).map((sd) => ({
                          id: String(sd.name || sd),
                          label: String(sd.name || sd),
                        })),
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
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.name}</h3>
                        <p className="font-mono text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">NIP: {item.nip} | ID: {item.employeeId}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono text-[10px] rounded-lg">
                        {item.workScheme}
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