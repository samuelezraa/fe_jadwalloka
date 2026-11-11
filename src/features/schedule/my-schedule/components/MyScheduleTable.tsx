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

const PERIODE_OPTIONS = [
  { id: '2026-10', label: 'Oktober 2026 (2026-10-01 — 2026-10-31)' },
  { id: '2026-11', label: 'November 2026 (2026-11-01 — 2026-11-30)' },
];

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

  // Filter Sub Departemen berdasarkan Departemen yang dipilih
  const filteredSubDepts = useMemo(() => {
    if (!deptFilter) return subDepartemenList;
    return subDepartemenList.filter((sub) => {
      const subDeptId = sub.department_id ?? sub.department?.id;
      return String(subDeptId) === String(deptFilter);
    });
  }, [subDepartemenList, deptFilter]);

  const isFiltered = Boolean(deptFilter || subDeptFilter || gradeFilter);

  const handleNumberClick = (id: string) => {
    checkPeriodeSelected(() => {
      navigate(`/schedule/input-schedule/edit/${id}?readonly=true`);
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
        accessorKey: 'nip',
        header: 'NIP',
        cell: (info) => (
          <span className="font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-xs">
            {String(info.getValue())}
          </span>
        ),
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
    ],
    [selectedPeriod]
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
        pageSize: meta.per_page ?? 10,
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
          pageSize: meta.per_page ?? 10,
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
        <div className="w-full md:w-72">
          <FormSelectSearch
            value={selectedPeriod}
            onChange={(val) => {
              onPeriodChange(val);
              if (val) toast.success('Data periode berhasil dimuat.');
            }}
            placeholder="-- Pilih Periode Berjalan --"
            options={[{ id: '', label: '-- Pilih Periode Berjalan --' }, ...PERIODE_OPTIONS]}
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
                onDeptFilterChange('');
                onSubDeptFilterChange('');
                onGradeFilterChange('');
              }}
              fields={[
                {
                  key: 'department',
                  label: 'Departemen',
                  render: () => (
                    <FormSelectSearch
                      value={deptFilter}
                      onChange={(val) => {
                        onDeptFilterChange(val);
                        onSubDeptFilterChange('');
                      }}
                      placeholder="Semua Departemen"
                      options={[
                        { id: '', label: 'Semua Departemen' },
                        ...departemenList.map((d) => ({ id: String(d.id), label: d.name })),
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
                      placeholder="Semua Sub Dept"
                      options={[
                        { id: '', label: 'Semua Sub Dept' },
                        ...filteredSubDepts.map((sd) => ({ id: sd.name, label: sd.name })),
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
                      placeholder="Semua Grade"
                      options={[
                        { id: '', label: 'Semua Grade' },
                        ...gradeList.map((g) => ({ id: g.name || g, label: g.name || g })),
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