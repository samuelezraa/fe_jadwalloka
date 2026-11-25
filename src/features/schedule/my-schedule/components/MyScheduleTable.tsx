import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
} from '@tanstack/react-table';
import type { MySchedule } from '../types/my-schedule.type';
import { DataPagination } from '../../../../components/DataPagination';
import { CalendarDays, Calendar, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../../lib/axios';

// Reusable UI Components
import { TableToolbar } from '../../../../components/ui/TableToolbar';
import { ExportIconButton } from '../../../../components/ui/ActionButtons';
import { DataTable } from '../../../../components/ui/data-table';
import { TableFilterPopover } from '../../../../components/ui/TableFilterPopover';
import { FormSelectSearch } from '../../../../components/ui/FormSelectSearch';

interface MyScheduleTableProps {
  data: MySchedule[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  onExport?: (period: string, selectedIds: string[]) => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  deptFilter: string;
  onDeptFilterChange: (val: string) => void;
  subDeptFilter: string;
  onSubDeptFilterChange: (val: string) => void;
  gradeFilter: string;
  onGradeFilterChange: (val: string) => void;
  departemenList?: any[];
  subDepartemenList?: any[];
  gradeList?: any[];
}

const LOCKED_ROLE_DEPT_MAP: Record<string, string> = {
  SALES: 'Sales',
  MANAGEMENT: 'Management',
  IT: 'IT',
};

const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const MyScheduleTable: React.FC<MyScheduleTableProps> = ({
  data,
  meta,
  setPage,
  setPageSize,
  selectedPeriod,
  onPeriodChange,
  onExport,
  searchQuery,
  onSearchChange,
  deptFilter,
  onDeptFilterChange,
  subDeptFilter,
  onSubDeptFilterChange,
  gradeFilter,
  onGradeFilterChange,
  departemenList = [],
  subDepartemenList = [],
  gradeList = [],
}) => {
  const navigate = useNavigate();
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const filterWrapperRef = useRef<HTMLDivElement>(null);

  const [periodOptions, setPeriodOptions] = useState<{ id: string; label: string }[]>([]);
  const [asyncDeptOptions, setAsyncDeptOptions] = useState<any[]>(departemenList);
  const [asyncSubDeptOptions, setAsyncSubDeptOptions] = useState<any[]>(subDepartemenList);
  const [asyncGradeOptions, setAsyncGradeOptions] = useState<any[]>(gradeList);

  const currentUser = useMemo(() => getStoredUser(), []);
  const roleUpper = String(currentUser?.role ?? '').trim().toUpperCase();
  const isDepartmentLocked = roleUpper in LOCKED_ROLE_DEPT_MAP;

  const lockedDeptId = useMemo(() => {
    if (!isDepartmentLocked) return '';

    const explicitDeptId =
      currentUser?.department_id ??
      (typeof currentUser?.department === 'object' ? currentUser?.department?.id : '');

    if (explicitDeptId !== undefined && explicitDeptId !== null && String(explicitDeptId) !== '') {
      return String(explicitDeptId);
    }

    const explicitDeptName =
      typeof currentUser?.department === 'string'
        ? currentUser.department.trim()
        : String(currentUser?.department?.name ?? '').trim();

    const targetName = (explicitDeptName || LOCKED_ROLE_DEPT_MAP[roleUpper] || '')
      .trim()
      .toLowerCase();

    const matchedDept = asyncDeptOptions.find((d) => {
      const dName = String(d.name || d.departemen || '').trim().toLowerCase();
      return targetName !== '' && (dName === targetName || dName.includes(targetName));
    });

    return matchedDept ? String(matchedDept.id) : '';
  }, [isDepartmentLocked, currentUser, roleUpper, asyncDeptOptions]);

  useEffect(() => {
    if (isDepartmentLocked && lockedDeptId && deptFilter !== lockedDeptId) {
      onDeptFilterChange(lockedDeptId);
    }
  }, [isDepartmentLocked, lockedDeptId, deptFilter, onDeptFilterChange]);

  const fetchPeriods = async (query = '') => {
    try {
      const res = await api.get('/periods', {
        params: { search: query, per_page: 25 },
      });
      const items = res.data?.data || res.data || [];

      const mapped = (Array.isArray(items) ? items : [])
        .filter((p: any) => (p.isActive ?? p.is_active) !== false)
        .map((p: any) => {
          const code = String(p.idPeriode ?? p.code ?? p.id ?? '');
          const name = p.periode ?? p.name ?? code;
          const startDate = p.tanggalAwal ?? p.start_date ?? '';
          const endDate = p.tanggalAkhir ?? p.end_date ?? '';

          const dateRange =
            startDate && endDate && startDate !== '-' && endDate !== '-'
              ? ` (${startDate} — ${endDate})`
              : '';

          return {
            id: code,
            label: `${name}${dateRange}`,
          };
        });

      setPeriodOptions(mapped);
    } catch (err) {
      console.error('Gagal memuat master periode:', err);
    }
  };

  useEffect(() => {
    fetchPeriods();
  }, []);

  useEffect(() => {
    setAsyncDeptOptions(departemenList);
  }, [departemenList]);

  useEffect(() => {
    setAsyncSubDeptOptions(subDepartemenList);
  }, [subDepartemenList]);

  useEffect(() => {
    setAsyncGradeOptions(gradeList);
  }, [gradeList]);

  const fetchFilterOptions = async (
    endpoint: string,
    query: string,
    setter: Function,
    extraParams = {}
  ) => {
    try {
      const res = await api.get(`/${endpoint}`, {
        params: { search: query, per_page: 25, status: 'true', ...extraParams },
      });
      const items = res.data?.data || res.data || [];
      setter(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error(`Gagal memuat opsi ${endpoint}`, err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (filterWrapperRef.current && !filterWrapperRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
    };
    if (showFilterDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showFilterDropdown]);

  const checkPeriodeSelected = (actionCallback?: () => void) => {
    if (!selectedPeriod) {
      toast.error('Silakan pilih periode terlebih dahulu!');
      return false;
    }
    if (actionCallback) actionCallback();
    return true;
  };

  const isFiltered = Boolean((!isDepartmentLocked && deptFilter) || subDeptFilter || gradeFilter);
  const activeDeptValue = isDepartmentLocked ? lockedDeptId || deptFilter : deptFilter;

  const handleNumberClick = (id: string) => {
    checkPeriodeSelected(() => {
      navigate(`/schedule/input-schedule/edit/${id}?readonly=true`);
    });
  };

  const [exportingId, setExportingId] = useState<string | null>(null);

  const handleExportSingleRow = async (item: MySchedule) => {
    checkPeriodeSelected(async () => {
      try {
        setExportingId(item.id);
        const toastId = toast.loading(`Mengekspor jadwal ${item.name}...`);

        const response = await api.get(`/schedule/jadwalku/${item.id}/export`, {
          params: { period: selectedPeriod },
          responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        const safeName = String(item.name || item.id).replace(/[^a-zA-Z0-9_-]/g, '_');
        link.href = url;
        link.setAttribute('download', `rekap-jadwal-${safeName}-${selectedPeriod}.csv`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success(`Jadwal ${item.name} berhasil diunduh.`, { id: toastId });
      } catch (err: any) {
        toast.error(err?.response?.data?.message || `Gagal mengekspor jadwal ${item.name}.`);
      } finally {
        setExportingId(null);
      }
    });
  };

  const columns = useMemo<ColumnDef<MySchedule>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
        ),
      },
      {
        id: 'employee_id',
        header: 'ID',
        cell: ({ row }) => {
          const item = row.original as any;
          const empId = item.employee_id || item.nip || '-';
          return (
            <span className="font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-xs">
              {String(empId)}
            </span>
          );
        },
      },
      {
        accessorKey: 'name',
        header: 'Nama',
        cell: (info) => (
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'department',
        header: 'Departemen',
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-300">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'sub_department',
        header: 'Sub Departemen',
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-300">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'off_days',
        header: 'Libur',
        cell: ({ row }) => (
          <button onClick={() => handleNumberClick(row.original.id)} className="font-medium hover:underline cursor-pointer">
            {row.original.off_days}
          </button>
        ),
      },
      {
        accessorKey: 'ph_days',
        header: 'PH',
        cell: ({ row }) => (
          <button onClick={() => handleNumberClick(row.original.id)} className="font-medium hover:underline cursor-pointer">
            {row.original.ph_days}
          </button>
        ),
      },
      {
        accessorKey: 'permit_days',
        header: 'Izin',
        cell: ({ row }) => (
          <button onClick={() => handleNumberClick(row.original.id)} className="font-medium hover:underline cursor-pointer">
            {row.original.permit_days}
          </button>
        ),
      },
      {
        accessorKey: 'alpha_days',
        header: 'Alfa',
        cell: ({ row }) => (
          <button onClick={() => handleNumberClick(row.original.id)} className="font-medium hover:underline cursor-pointer">
            {row.original.alpha_days}
          </button>
        ),
      },
      {
        accessorKey: 'sick_days',
        header: 'Sakit',
        cell: ({ row }) => (
          <button onClick={() => handleNumberClick(row.original.id)} className="font-medium hover:underline cursor-pointer">
            {row.original.sick_days}
          </button>
        ),
      },
      {
        accessorKey: 'leave_days',
        header: 'Cuti',
        cell: ({ row }) => (
          <button onClick={() => handleNumberClick(row.original.id)} className="font-medium hover:underline cursor-pointer">
            {row.original.leave_days}
          </button>
        ),
      },
      {
        accessorKey: 'late_days',
        header: 'Terlambat',
        cell: ({ row }) => (
          <button onClick={() => handleNumberClick(row.original.id)} className="font-medium hover:underline cursor-pointer">
            {row.original.late_days}
          </button>
        ),
      },
      {
        accessorKey: 'work_days',
        header: 'Masuk',
        cell: ({ row }) => (
          <button onClick={() => handleNumberClick(row.original.id)} className="font-medium hover:underline cursor-pointer">
            {row.original.work_days}
          </button>
        ),
      },
      {
        accessorKey: 'total_days',
        header: 'Total Hari',
        cell: ({ row }) => (
          <button onClick={() => handleNumberClick(row.original.id)} className="font-bold hover:underline cursor-pointer">
            {row.original.total_days}
          </button>
        ),
      },
      // 👇 KOLOM PALING KANAN (AKSI)
      {
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
          const item = row.original;
          const isExportingThis = exportingId === item.id;

          return (
            <div className="flex justify-center">
              <ExportIconButton
                disabled={isExportingThis}
                onClick={() => handleExportSingleRow(item)}
                title={isExportingThis ? `Mengekspor ${item.name}...` : `Export jadwal ${item.name}`}
                className="p-2"
              />
            </div>
          );
        },
      },
    ],
    [selectedPeriod, exportingId]
  );

  const table = useReactTable({
    data: data,
    columns,
    pageCount: meta.last_page,
    manualPagination: true,
    state: {
      globalFilter: searchQuery,
      pagination: {
        pageIndex: (meta.current_page ?? 1) - 1,
        pageSize: meta.per_page ?? 25,
      },
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
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
    onGlobalFilterChange: (val) => onSearchChange(typeof val === 'function' ? val(searchQuery) : val),
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;

  const handleExportClick = () => {
    checkPeriodeSelected(() => {
      const selectedRows = table.getSelectedRowModel().rows;
      const selectedIds = selectedRows.map((r: any) => r.original.id);
      if (onExport) {
        onExport(selectedPeriod, selectedIds);
      }
    });
  };

  return (
    <div className="relative space-y-4" ref={filterWrapperRef}>
      {/* FILTER PERIODE UTAMA */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider">
            Pilih Periode Jadwal:
          </span>
        </div>
        <div className="w-full md:w-80">
          <FormSelectSearch
            value={selectedPeriod}
            onChange={(val) => {
              onPeriodChange(val);
              if (val) toast.success('Data periode berhasil dimuat.');
            }}
            onSearchChange={(query) => fetchPeriods(query)}
            placeholder="-- Pilih Periode Berjalan --"
            options={[{ id: '', label: '-- Pilih Periode Berjalan --' }, ...periodOptions]}
          />
        </div>
      </div>

      {/* TABLE DATA UTAMA */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-visible mb-16 md:mb-0 transition-colors duration-200">
        
        <TableToolbar
          title="Jadwalku"
          subtitle="Ringkasan dan detail rekapitulasi jadwal kehadiran karyawan"
          icon={<CalendarDays className="w-6 h-6" />}
          searchValue={searchQuery ?? ''}
          onSearchChange={onSearchChange}
          showFilterDropdown={showFilterDropdown}
          onToggleFilterDropdown={() => setShowFilterDropdown(!showFilterDropdown)}
          isFiltered={isFiltered}
          filterDropdownContent={
            <TableFilterPopover
              isOpen={showFilterDropdown}
              onClose={() => setShowFilterDropdown(false)}
              isFiltered={isFiltered}
              onReset={() => {
                if (!isDepartmentLocked) {
                  onDeptFilterChange('');
                }
                onSubDeptFilterChange('');
                onGradeFilterChange('');
              }}
              fields={[
                {
                  key: 'department',
                  label: 'Departemen',
                  render: () => (
                    <FormSelectSearch
                      value={activeDeptValue}
                      disabled={isDepartmentLocked}
                      onChange={(val) => {
                        if (isDepartmentLocked) return;
                        onDeptFilterChange(val);
                        onSubDeptFilterChange('');
                        fetchFilterOptions('sub-departments', '', setAsyncSubDeptOptions, {
                          department_id: val,
                        });
                      }}
                      onSearchChange={(query) =>
                        fetchFilterOptions('departments', query, setAsyncDeptOptions)
                      }
                      placeholder="Semua Departemen"
                      options={[
                        { id: '', label: 'Semua Departemen' },
                        ...asyncDeptOptions
                          .filter((d) => d.is_active !== false)
                          .map((d) => ({
                            id: String(d.id),
                            label: d.name || d.departemen || '-',
                          })),
                      ]}
                    />
                  ),
                },
                {
                  key: 'sub_department',
                  label: 'Sub Departemen',
                  render: () => (
                    <FormSelectSearch
                      value={subDeptFilter}
                      onChange={onSubDeptFilterChange}
                      onSearchChange={(query) =>
                        fetchFilterOptions('sub-departments', query, setAsyncSubDeptOptions, {
                          department_id: activeDeptValue,
                        })
                      }
                      placeholder={activeDeptValue ? 'Semua Sub Dept' : 'Pilih Departemen dahulu'}
                      disabled={!activeDeptValue}
                      options={[
                        { id: '', label: 'Semua Sub Dept' },
                        ...asyncSubDeptOptions
                          .filter((sub) => {
                            const isActive =
                              sub.is_active === undefined ||
                              sub.is_active === null ||
                              sub.is_active === true ||
                              sub.is_active === 1;
                            if (!isActive) return false;
                            if (!activeDeptValue) return false;

                            const rawDeptId =
                              sub.department_id ??
                              sub.departemen_id ??
                              sub.department?.id ??
                              sub.departemen?.id ??
                              sub.departmentId;

                            if (rawDeptId === undefined || rawDeptId === null || rawDeptId === '') {
                              return true;
                            }

                            const selectedDept = asyncDeptOptions.find(
                              (d) => String(d.id) === String(activeDeptValue)
                            );
                            const selectedDeptCode = selectedDept?.code
                              ? String(selectedDept.code)
                              : '';

                            return (
                              String(rawDeptId) === String(activeDeptValue) ||
                              (selectedDeptCode !== '' && String(rawDeptId) === selectedDeptCode)
                            );
                          })
                          .map((sd) => {
                            const subName = sd.name || sd.sub_department_name || sd.sub_departemen || '-';
                            return { id: subName, label: subName };
                          }),
                      ]}
                    />
                  ),
                },
                {
                  key: 'grade',
                  label: 'Grade',
                  render: () => (
                    <FormSelectSearch
                      value={gradeFilter}
                      onChange={onGradeFilterChange}
                      onSearchChange={(query) =>
                        fetchFilterOptions('grades', query, setAsyncGradeOptions)
                      }
                      placeholder="Semua Grade"
                      options={[
                        { id: '', label: 'Semua Grade' },
                        ...asyncGradeOptions
                          .filter((g) => typeof g === 'string' || g.is_active !== false)
                          .map((g) => {
                            const gradeLabel = typeof g === 'string' ? g : (g.name || g.grade || '-');
                            return { id: gradeLabel, label: gradeLabel };
                          }),
                      ]}
                    />
                  ),
                },
              ]}
            />
          }
          actionButtons={
            <div className="hidden md:block">
              <ExportIconButton onClick={handleExportClick} title="Export Terpilih" />
            </div>
          }
        />

        {!selectedPeriod ? (
          <div className="py-16 px-4 text-center flex flex-col items-center justify-center space-y-3">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/50 rounded-full text-amber-500 border border-amber-200 dark:border-amber-800">
              <AlertCircle className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Periode Belum Dipilih</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm">
              Silakan pilih salah satu periode berjalan di bagian atas untuk menampilkan rekapitulasi jadwal kehadiran karyawan.
            </p>
          </div>
        ) : (
          <>
            <div className="px-5 py-2 bg-gray-50/50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 relative">
              <DataPagination table={table} />
            </div>

            {/* 📱 MOBILE VIEW: CARDS (Hanya Muncul di Layar Kecil) */}
            <div className="block md:hidden p-4 space-y-3 bg-gray-50/50 dark:bg-gray-950/50">
              {rows.length > 0 ? (
                rows.map((row) => {
                  const item = row.original;
                  return (
                    <div
                      key={row.id}
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                        <span className="font-mono text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                          NIP: {item.nip}
                        </span>
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          Total: {item.total_days} Hari
                        </span>
                      </div>

                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.department} • {item.sub_department}
                        </p>
                      </div>

                      <div className="grid grid-cols-4 gap-1.5 text-center bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-xl text-[10px] border border-gray-100 dark:border-gray-800">
                        <div>
                          <span className="block text-gray-400 uppercase font-semibold">Libur</span>
                          <button onClick={() => handleNumberClick(item.id)} className="font-bold text-gray-900 dark:text-gray-100 hover:underline cursor-pointer">{item.off_days}</button>
                        </div>
                        <div>
                          <span className="block text-gray-400 uppercase font-semibold">PH</span>
                          <button onClick={() => handleNumberClick(item.id)} className="font-bold text-gray-900 dark:text-gray-100 hover:underline cursor-pointer">{item.ph_days}</button>
                        </div>
                        <div>
                          <span className="block text-gray-400 uppercase font-semibold">Izin</span>
                          <button onClick={() => handleNumberClick(item.id)} className="font-bold text-gray-900 dark:text-gray-100 hover:underline cursor-pointer">{item.permit_days}</button>
                        </div>
                        <div>
                          <span className="block text-gray-400 uppercase font-semibold">Alfa</span>
                          <button onClick={() => handleNumberClick(item.id)} className="font-bold text-gray-900 dark:text-gray-100 hover:underline cursor-pointer">{item.alpha_days}</button>
                        </div>
                        <div>
                          <span className="block text-gray-400 uppercase font-semibold">Sakit</span>
                          <button onClick={() => handleNumberClick(item.id)} className="font-bold text-gray-900 dark:text-gray-100 hover:underline cursor-pointer">{item.sick_days}</button>
                        </div>
                        <div>
                          <span className="block text-gray-400 uppercase font-semibold">Cuti</span>
                          <button onClick={() => handleNumberClick(item.id)} className="font-bold text-gray-900 dark:text-gray-100 hover:underline cursor-pointer">{item.leave_days}</button>
                        </div>
                        <div>
                          <span className="block text-gray-400 uppercase font-semibold">Telat</span>
                          <button onClick={() => handleNumberClick(item.id)} className="font-bold text-gray-900 dark:text-gray-100 hover:underline cursor-pointer">{item.late_days}</button>
                        </div>
                        <div>
                          <span className="block text-gray-400 uppercase font-semibold">Masuk</span>
                          <button onClick={() => handleNumberClick(item.id)} className="font-bold text-gray-900 dark:text-gray-100 hover:underline cursor-pointer">{item.work_days}</button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-xs">
                  Tidak ada data jadwal ditemukan.
                </div>
              )}
            </div>

            {/* 💻 DESKTOP VIEW: DATATABLE */}
            <DataTable table={table} columnsLength={columns.length} emptyMessage="Tidak ada data jadwal ditemukan." />
          </>
        )}
      </div>
    </div>
  );
};