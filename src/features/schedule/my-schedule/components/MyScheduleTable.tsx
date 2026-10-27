import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
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
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  onExport?: (period: string, selectedIds: string[]) => void; // Diubah agar menerima period juga
}

const PERIODE_OPTIONS = [
  { id: '2026-10', label: 'Oktober 2026 (2026-10-01 — 2026-10-31)' },
  { id: '2026-11', label: 'November 2026 (2026-11-01 — 2026-11-30)' },
];

export const MyScheduleTable: React.FC<MyScheduleTableProps> = ({
  data,
  selectedPeriod,
  onPeriodChange,
  onExport,
}) => {
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState('');
  const [subDeptFilter, setSubDeptFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const checkPeriodeSelected = (actionCallback?: () => void) => {
    if (!selectedPeriod) {
      toast.error('Silakan pilih periode terlebih dahulu!');
      return false;
    }
    if (actionCallback) actionCallback();
    return true;
  };

  // Dynamic unique options for Sub Department and Grade
  const uniqueSubDeptList = useMemo(() => {
    return Array.from(new Set(data.map((item: any) => item.sub_department)));
  }, [data]);

  const uniqueGradeList = useMemo(() => {
    return Array.from(new Set(data.map((item: any) => item.grade).filter(Boolean)));
  }, [data]);

  // Filter Data based on Selected Period, Sub Department, and Grade
  const filteredData = useMemo(() => {
    if (!selectedPeriod) return [];
    let result = data;
    if (subDeptFilter) {
      result = result.filter((item: any) => item.sub_department === subDeptFilter);
    }
    if (gradeFilter) {
      result = result.filter((item: any) => item.grade === gradeFilter);
    }
    return result;
  }, [data, selectedPeriod, subDeptFilter, gradeFilter]);

  const isFiltered = Boolean(subDeptFilter || gradeFilter);

  // Handle number click to redirect to Edit Schedule Page in Readonly mode
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
          <button
            onClick={() => handleNumberClick(row.original.id)}
            className="font-medium text-gray-900 dark:text-gray-100 hover:underline cursor-pointer"
          >
            {row.original.off_days}
          </button>
        ),
      },
      {
        accessorKey: 'ph_days',
        header: 'PH',
        cell: ({ row }) => (
          <button
            onClick={() => handleNumberClick(row.original.id)}
            className="font-medium text-gray-900 dark:text-gray-100 hover:underline cursor-pointer"
          >
            {row.original.ph_days}
          </button>
        ),
      },
      {
        accessorKey: 'permit_days',
        header: 'Izin',
        cell: ({ row }) => (
          <button
            onClick={() => handleNumberClick(row.original.id)}
            className="font-medium text-gray-900 dark:text-gray-100 hover:underline cursor-pointer"
          >
            {row.original.permit_days}
          </button>
        ),
      },
      {
        accessorKey: 'alpha_days',
        header: 'Alfa',
        cell: ({ row }) => (
          <button
            onClick={() => handleNumberClick(row.original.id)}
            className="font-medium text-gray-900 dark:text-gray-100 hover:underline cursor-pointer"
          >
            {row.original.alpha_days}
          </button>
        ),
      },
      {
        accessorKey: 'sick_days',
        header: 'Sakit',
        cell: ({ row }) => (
          <button
            onClick={() => handleNumberClick(row.original.id)}
            className="font-medium text-gray-900 dark:text-gray-100 hover:underline cursor-pointer"
          >
            {row.original.sick_days}
          </button>
        ),
      },
      {
        accessorKey: 'leave_days',
        header: 'Cuti',
        cell: ({ row }) => (
          <button
            onClick={() => handleNumberClick(row.original.id)}
            className="font-medium text-gray-900 dark:text-gray-100 hover:underline cursor-pointer"
          >
            {row.original.leave_days}
          </button>
        ),
      },
      {
        accessorKey: 'late_days',
        header: 'Terlambat',
        cell: ({ row }) => (
          <button
            onClick={() => handleNumberClick(row.original.id)}
            className="font-medium text-gray-900 dark:text-gray-100 hover:underline cursor-pointer"
          >
            {row.original.late_days}
          </button>
        ),
      },
      {
        accessorKey: 'work_days',
        header: 'Masuk',
        cell: ({ row }) => (
          <button
            onClick={() => handleNumberClick(row.original.id)}
            className="font-medium text-gray-900 dark:text-gray-100 hover:underline cursor-pointer"
          >
            {row.original.work_days}
          </button>
        ),
      },
      {
        accessorKey: 'total_days',
        header: 'Total Hari',
        cell: ({ row }) => (
          <button
            onClick={() => handleNumberClick(row.original.id)}
            className="font-bold text-gray-900 dark:text-gray-100 hover:underline cursor-pointer"
          >
            {row.original.total_days}
          </button>
        ),
      },
    ],
    [selectedPeriod]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      globalFilter,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
        
        {/* Header Toolbar */}
        <TableToolbar
          title="Jadwalku"
          subtitle="Ringkasan dan detail rekapitulasi jadwal kehadiran karyawan"
          icon={<CalendarDays className="w-6 h-6" />}
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
                setGradeFilter('');
              }}
              fields={[
                {
                  key: 'sub_department',
                  label: 'Sub Departemen',
                  render: () => (
                    <FormSelectSearch
                      value={subDeptFilter}
                      onChange={setSubDeptFilter}
                      placeholder="Semua Sub Dept"
                      options={[
                        { id: '', label: 'Semua Sub Dept' },
                        ...uniqueSubDeptList.map((sd: any) => ({ id: sd, label: sd })),
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
                      onChange={setGradeFilter}
                      placeholder="Semua Grade"
                      options={[
                        { id: '', label: 'Semua Grade' },
                        ...uniqueGradeList.map((g: any) => ({ id: g, label: g })),
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
            {/* Pagination */}
            <div className="px-5 py-2 bg-gray-50/50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 relative">
              <DataPagination table={table} />
            </div>

            {/* Mobile View: Cards */}
            <div className="block md:hidden p-4 space-y-3 bg-gray-50/50 dark:bg-gray-950/50">
              {rows.length > 0 ? (
                rows.map((row) => {
                  const item = row.original;
                  return (
                    <div
                      key={row.id}
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
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

                      <div className="grid grid-cols-4 gap-1.5 text-center bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-lg text-[10px] border border-gray-100 dark:border-gray-800">
                        <div>
                          <span className="block text-gray-400 uppercase">Libur</span>
                          <button onClick={() => handleNumberClick(item.id)} className="font-bold text-gray-900 dark:text-gray-100 hover:underline">{item.off_days}</button>
                        </div>
                        <div>
                          <span className="block text-gray-400 uppercase">PH</span>
                          <button onClick={() => handleNumberClick(item.id)} className="font-bold text-gray-900 dark:text-gray-100 hover:underline">{item.ph_days}</button>
                        </div>
                        <div>
                          <span className="block text-gray-400 uppercase">Izin</span>
                          <button onClick={() => handleNumberClick(item.id)} className="font-bold text-gray-900 dark:text-gray-100 hover:underline">{item.permit_days}</button>
                        </div>
                        <div>
                          <span className="block text-gray-400 uppercase">Alfa</span>
                          <button onClick={() => handleNumberClick(item.id)} className="font-bold text-gray-900 dark:text-gray-100 hover:underline">{item.alpha_days}</button>
                        </div>
                        <div>
                          <span className="block text-gray-400 uppercase">Sakit</span>
                          <button onClick={() => handleNumberClick(item.id)} className="font-bold text-gray-900 dark:text-gray-100 hover:underline">{item.sick_days}</button>
                        </div>
                        <div>
                          <span className="block text-gray-400 uppercase">Cuti</span>
                          <button onClick={() => handleNumberClick(item.id)} className="font-bold text-gray-900 dark:text-gray-100 hover:underline">{item.leave_days}</button>
                        </div>
                        <div>
                          <span className="block text-gray-400 uppercase">Telat</span>
                          <button onClick={() => handleNumberClick(item.id)} className="font-bold text-gray-900 dark:text-gray-100 hover:underline">{item.late_days}</button>
                        </div>
                        <div>
                          <span className="block text-gray-400 uppercase">Masuk</span>
                          <button onClick={() => handleNumberClick(item.id)} className="font-bold text-gray-900 dark:text-gray-100 hover:underline">{item.work_days}</button>
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

            {/* Desktop View: DataTable */}
            <DataTable table={table} columnsLength={columns.length} emptyMessage="Tidak ada data jadwal ditemukan." />
          </>
        )}
      </div>
    </div>
  );
};