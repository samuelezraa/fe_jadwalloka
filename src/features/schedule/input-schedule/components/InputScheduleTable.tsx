import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
} from '@tanstack/react-table';
import type { InputSchedulePeriodItem, SchedulePeriodSummary } from '../types/input-schedule.type';
import { DataPagination } from '../../../../components/DataPagination';
import { CalendarCheck, Settings, Calendar, AlertCircle, Building2, User, Hash } from 'lucide-react';
import toast from 'react-hot-toast';

// Reusable UI Components
import { TableToolbar } from '../../../../components/ui/TableToolbar';
import { TableFilterPopover } from '../../../../components/ui/TableFilterPopover';
import { 
  EditActionButton, 
  ImportIconButton, 
  ExportIconButton,
  MobileActionFabGroup 
} from '../../../../components/ui/ActionButtons';
import { DataTable } from '../../../../components/ui/data-table';
import { FormSelectSearch } from '../../../../components/ui/FormSelectSearch';

interface InputScheduleTableProps {
  data: InputSchedulePeriodItem[];
  summary?: SchedulePeriodSummary | null;
  meta?: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  onEdit?: (item: InputSchedulePeriodItem) => void;
  onSettingGlobal?: () => void;
  onImport?: () => void;
  onExport?: () => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  deptFilter: string;
  onDeptFilterChange: (val: string) => void;
  subDeptFilter: string;
  onSubDeptFilterChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  departemenList?: any[];
  subDepartemenList?: any[];
}

const PERIODE_OPTIONS = [
  { id: '2026-10', label: 'Oktober 2026 (2026-10-01 — 2026-10-31)' },
  { id: '2026-11', label: 'November 2026 (2026-11-01 — 2026-11-30)' },
];

export const InputScheduleTable: React.FC<InputScheduleTableProps> = ({
  data = [],
  meta = { current_page: 1, last_page: 1, total: 0, per_page: 10 },
  setPage,
  setPageSize,
  selectedPeriod,
  onPeriodChange,
  onEdit,
  onSettingGlobal,
  onImport,
  onExport,
  searchQuery,
  onSearchChange,
  deptFilter,
  onDeptFilterChange,
  subDeptFilter,
  onSubDeptFilterChange,
  statusFilter,
  onStatusFilterChange,
  departemenList = [],
  subDepartemenList = [],
}) => {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});
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
  
  // Filter Sub Departemen secara presisi berdasarkan Departemen yang dipilih
  const filteredSubDepts = useMemo(() => {
    if (!deptFilter) return subDepartemenList;

    return subDepartemenList.filter((sub) => {
      const subDeptId = sub.department_id ?? sub.department?.id ?? sub.departmentId;
      return String(subDeptId) === String(deptFilter);
    });
  }, [subDepartemenList, deptFilter]);

  const isFiltered = Boolean(deptFilter || subDeptFilter || statusFilter);

  const columns = useMemo<ColumnDef<InputSchedulePeriodItem>[]>(
    () => [
      {
        id: 'number',
        header: '#',
        cell: (info) => (
          <span className="font-medium text-gray-500 dark:text-gray-400">
            {info.row.index + 1 + ((meta.current_page - 1) * meta.per_page)}
          </span>
        ),
      },
      {
        accessorKey: 'periodId',
        header: 'ID Periode',
        cell: (info) => (
          <span className="font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-xs">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'nip',
        header: 'ID Karyawan',
        cell: (info) => <span className="font-mono font-semibold text-gray-700 dark:text-gray-300 text-xs">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'name',
        header: 'Nama Karyawan',
        cell: (info) => <span className="font-bold text-gray-900 dark:text-gray-100">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'department',
        header: 'Departemen',
        cell: (info) => <span className="text-gray-700 dark:text-gray-300 font-medium">{info.getValue() ? String(info.getValue()) : '-'}</span>,
      },
      {
        accessorKey: 'subDept',
        header: 'Sub Departemen',
        cell: (info) => <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const val = String(info.getValue());
          const isAktif = val === 'Aktif';
          return (
            <div className="flex justify-center">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                  isAktif
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                }`}
              >
                {val}
              </span>
            </div>
          );
        },
      },
      {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => (
          <div className="flex justify-center">
            <EditActionButton onClick={() => checkPeriodeSelected(() => onEdit && onEdit(row.original))} />
          </div>
        ),
      },
    ],
    [onEdit, selectedPeriod, meta]
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
    onGlobalFilterChange: (val) => onSearchChange(typeof val === 'function' ? val(searchQuery) : val),
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

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
          title="Input Schedule (Periode)"
          subtitle="Kelola data jadwal kerja karyawan per periode LokaHR"
          icon={<CalendarCheck className="w-6 h-6" />}
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
                onStatusFilterChange('');
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
                      onChange={(val) => onSubDeptFilterChange(val)}
                      placeholder="Semua Sub Departemen"
                      options={[
                        { id: '', label: 'Semua Sub Departemen' },
                        ...filteredSubDepts.map((sd) => ({ id: String(sd.id), label: sd.name || sd.sub_department_name })),
                      ]}
                    />
                  ),
                },
                {
                  key: 'status',
                  label: 'Status',
                  render: () => (
                    <FormSelectSearch
                      value={statusFilter}
                      onChange={(val) => onStatusFilterChange(val)}
                      placeholder="Semua Status"
                      showSearch={false}
                      options={[
                        { id: '', label: 'Semua Status' },
                        { id: 'true', label: 'Aktif' },
                        { id: 'false', label: 'Nonaktif' },
                      ]}
                    />
                  ),
                },
              ]}
            />
          }
          actionButtons={
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={() => checkPeriodeSelected(onSettingGlobal)}
                className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-xl border border-blue-200 dark:border-blue-800 transition-colors shadow-xs"
                title="Setting Jam Mingguan (Semua Karyawan)"
              >
                <Settings className="w-4 h-4" />
              </button>
              <ImportIconButton onClick={() => checkPeriodeSelected(onImport)} />
              <ExportIconButton onClick={() => checkPeriodeSelected(onExport)} />
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
              Silakan pilih salah satu periode berjalan di bagian atas untuk menampilkan daftar jadwal kerja karyawan.
            </p>
          </div>
        ) : (
          <>
            <div className="px-5 py-2 bg-gray-50/50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 relative">
              <DataPagination table={table} />
            </div>

            {/* 🖥️ DESKTOP TABLE VIEW */}
            <div className="hidden md:block">
              <DataTable table={table} columnsLength={columns.length} emptyMessage="Tidak ada data jadwal periode ditemukan." />
            </div>

            {/* 📱 MOBILE CARD LIST VIEW */}
            <div className="block md:hidden p-4 space-y-3">
              {data.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-500 dark:text-gray-400">
                  Tidak ada data jadwal periode ditemukan.
                </div>
              ) : (
                data.map((item, idx) => {
                  const isAktif = item.status === 'Aktif';
                  return (
                    <div
                      key={item.id || idx}
                      className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xs space-y-3"
                    >
                      {/* Card Header: Nama & Status */}
                      <div className="flex items-start justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-2.5">
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-500 dark:text-gray-400">
                            <Hash className="w-3 h-3" />
                            <span>{item.nip}</span>
                          </div>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                            isAktif
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      {/* Card Body: Info Periode, Dept & Sub Dept */}
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-gray-400 dark:text-gray-500 block text-[10px] uppercase font-semibold">
                            Periode
                          </span>
                          <span className="font-mono text-gray-700 dark:text-gray-300 font-medium">
                            {item.periodId}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 dark:text-gray-500 block text-[10px] uppercase font-semibold">
                            Skema
                          </span>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {item.workScheme}
                          </span>
                        </div>
                        <div className="col-span-2 pt-1 border-t border-gray-50 dark:border-gray-800/60 flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                          <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">
                            {item.department || '-'} / <strong className="text-gray-700 dark:text-gray-300">{item.subDept}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Card Footer: Action Edit */}
                      <div className="flex items-center justify-end pt-2 border-t border-gray-100 dark:border-gray-800">
                        <EditActionButton onClick={() => checkPeriodeSelected(() => onEdit && onEdit(item))} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>

      <MobileActionFabGroup
        onSetting={() => checkPeriodeSelected(onSettingGlobal)}
        onImport={() => checkPeriodeSelected(onImport)}
        onExport={() => checkPeriodeSelected(onExport)}
      />
    </div>
  );
};