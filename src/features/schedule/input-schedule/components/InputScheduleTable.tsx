import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  type ColumnDef,
} from '@tanstack/react-table';
import type { InputSchedulePeriodItem, SchedulePeriodSummary } from '../types/input-schedule.type';
import { DataPagination } from '../../../../components/DataPagination';
import {
  CalendarCheck,
  Settings,
  Calendar,
  AlertCircle,
} from 'lucide-react';
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
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  onEdit?: (item: InputSchedulePeriodItem) => void;
  onSettingGlobal?: () => void;
  onImport?: () => void;
  onExport?: () => void;
}

const PERIODE_OPTIONS = [
  { id: '2026-10', label: 'Oktober 2026 (2026-10-01 — 2026-10-31)' },
  { id: '2026-11', label: 'November 2026 (2026-11-01 — 2026-11-30)' },
];

export const InputScheduleTable: React.FC<InputScheduleTableProps> = ({
  data,
  selectedPeriod,
  onPeriodChange,
  onEdit,
  onSettingGlobal,
  onImport,
  onExport,
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [subDeptFilter, setSubDeptFilter] = useState('');
  const [skemaFilter, setSkemaFilter] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});

  const checkPeriodeSelected = (actionCallback?: () => void) => {
    if (!selectedPeriod) {
      toast.error('Silakan pilih periode terlebih dahulu!');
      return false;
    }
    if (actionCallback) actionCallback();
    return true;
  };

  const filteredData = useMemo(() => {
    if (!selectedPeriod) return [];
    let result = data;
    if (subDeptFilter) {
      result = result.filter((item) => item.subDept === subDeptFilter);
    }
    if (skemaFilter) {
      result = result.filter((item) => item.workScheme === skemaFilter);
    }
    return result;
  }, [data, selectedPeriod, subDeptFilter, skemaFilter]);

  const uniqueSubDeptList = useMemo(() => Array.from(new Set(data.map((item) => item.subDept))), [data]);
  const uniqueSkemaList = useMemo(() => Array.from(new Set(data.map((item) => item.workScheme))), [data]);

  const isFiltered = Boolean(subDeptFilter || skemaFilter);

  const columns = useMemo<ColumnDef<InputSchedulePeriodItem>[]>(
    () => [
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
        header: 'NIP',
        cell: (info) => <span className="font-mono text-gray-700 dark:text-gray-300 text-xs">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'name',
        header: 'Nama',
        cell: (info) => <span className="font-bold text-gray-900 dark:text-gray-100">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'subDept',
        header: 'Sub Dept',
        cell: (info) => <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'workScheme',
        header: 'Skema Kerja',
        cell: (info) => <span className="font-mono text-xs text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'totalDays',
        header: 'Total Hari',
        cell: (info) => <span className="font-medium text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'workDays',
        header: 'Masuk',
        cell: (info) => <span className="font-medium text-emerald-600 dark:text-emerald-400">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'offDays',
        header: 'Total Libur',
        cell: (info) => <span className="font-medium text-amber-600 dark:text-amber-400">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'phDays',
        header: 'PH',
        cell: (info) => <span className="font-medium text-purple-600 dark:text-purple-400">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'leaveDays',
        header: 'Cuti',
        cell: (info) => <span className="font-medium text-blue-600 dark:text-blue-400">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'ref',
        header: 'Ref',
        cell: (info) => <span className="text-gray-500 dark:text-gray-400 text-xs">{info.getValue() ? String(info.getValue()) : '-'}</span>,
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
    [onEdit, selectedPeriod]
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
    <div className="relative space-y-4">
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
          searchValue={globalFilter ?? ''}
          onSearchChange={setGlobalFilter}
          showFilterDropdown={showFilterDropdown}
          onToggleFilterDropdown={() => setShowFilterDropdown(!showFilterDropdown)}
          isFiltered={isFiltered}
          filterDropdownContent={
            <TableFilterPopover
              isOpen={showFilterDropdown}
              onClose={() => setShowFilterDropdown(false)}
              isFiltered={isFiltered}
              onReset={() => {
                setSubDeptFilter('');
                setSkemaFilter('');
              }}
              fields={[
                {
                  key: 'subDept',
                  label: 'Sub Departemen',
                  render: () => (
                    <FormSelectSearch
                      value={subDeptFilter}
                      onChange={setSubDeptFilter}
                      placeholder="Semua Sub Dept"
                      options={[{ id: '', label: 'Semua Sub Dept' }, ...uniqueSubDeptList.map((sd) => ({ id: sd, label: sd }))]}
                    />
                  ),
                },
                {
                  key: 'workScheme',
                  label: 'Skema Hari Kerja',
                  render: () => (
                    <FormSelectSearch
                      value={skemaFilter}
                      onChange={setSkemaFilter}
                      placeholder="Semua Skema"
                      options={[{ id: '', label: 'Semua Skema' }, ...uniqueSkemaList.map((s) => ({ id: s, label: s }))]}
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
            <div className="hidden md:block">
              <DataTable table={table} columnsLength={columns.length} emptyMessage="Tidak ada data jadwal periode ditemukan." />
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