import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import type { AttendanceReport } from '../types/attendance.type';
import { DataPagination } from '@/components/DataPagination';
import { FileText } from 'lucide-react';

// Reusable UI Components
import { TableToolbar } from '@/components/ui/TableToolbar';
import { ExportIconButton, MobileActionFabGroup } from '@/components/ui/ActionButtons';
import { TableFilterPopover } from '@/components/ui/TableFilterPopover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { FormSelectSearch } from '@/components/ui/FormSelectSearch';

interface AttendanceTableProps {
  data: AttendanceReport[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  dateRange: { startDate: string; endDate: string };
  onDateRangeChange: (range: { startDate: string; endDate: string }) => void;
  deptFilter: string;
  onDeptFilterChange: (val: string) => void;
  subDeptFilter: string;
  onSubDeptFilterChange: (val: string) => void;
  gradeFilter: string;
  onGradeFilterChange: (val: string) => void;
  departemenList?: any[];
  subDepartemenList?: any[];
  gradeList?: any[];
  onExport?: () => void;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  data = [],
  meta,
  setPage,
  setPageSize,
  searchQuery,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  deptFilter,
  onDeptFilterChange,
  subDeptFilter,
  onSubDeptFilterChange,
  gradeFilter,
  onGradeFilterChange,
  departemenList = [],
  subDepartemenList = [],
  gradeList = [],
  onExport,
}) => {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    attendanceVerification: false,
    presenceVerification: false,
    dataUploadTime: false,
    machineId: false,
    machineIp: false,
  });

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


  const filteredSubDepts = useMemo(() => {
    // 1. Jika belum memilih Departemen, tampilkan semua Sub Dept yang aktif
    if (!deptFilter) return subDepartemenList;

    // 2. Cari objek departemen terpilih berdasarkan ID atau Nama ("IT")
    const selectedDeptObj = departemenList.find((d) => {
      const dId = String(d.id);
      const dName = String(d.name || d);
      return dId === String(deptFilter) || dName === String(deptFilter);
    });

    // 3. Filter sub departemen berdasarkan department_id atau nama relasi departemen
    return subDepartemenList.filter((sub) => {
      // Cocokkan via ID Departemen (misal: sub.department_id === selectedDeptObj.id)
      if (selectedDeptObj?.id && sub.department_id !== undefined) {
        return String(sub.department_id) === String(selectedDeptObj.id);
      }
      // Fallback cocokkan via nama departemen relasi (misal: sub.department?.name === 'IT')
      const subDeptParentName = sub.department?.name || sub.department_name;
      if (subDeptParentName && selectedDeptObj?.name) {
        return String(subDeptParentName).toLowerCase() === String(selectedDeptObj.name).toLowerCase();
      }
      return true;
    });
  }, [subDepartemenList, departemenList, deptFilter]);

  const isFiltered = Boolean(
    dateRange.startDate || dateRange.endDate || deptFilter || subDeptFilter || gradeFilter
  );

  const columns = useMemo<ColumnDef<AttendanceReport>[]>(
    () => [
      {
        id: 'rowNumber',
        header: '#',
        size: 50,
        cell: ({ row }) => (
          <span className="font-medium text-gray-500 dark:text-gray-400">
            {row.index + 1 + (meta.current_page - 1) * meta.per_page}
          </span>
        ),
      },
      {
        accessorKey: 'nip',
        header: 'NIP',
        size: 110,
        cell: (info) => (
          <span className="font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-xs font-semibold">
            {String(info.getValue() || '-')}
          </span>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Name',
        size: 160,
        cell: (info) => (
          <span className="font-bold text-gray-900 dark:text-gray-100">{String(info.getValue() || '-')}</span>
        ),
      },
      { accessorKey: 'dept', header: 'Dept', size: 80 },
      { accessorKey: 'subDept', header: 'Sub Dept', size: 120 },
      { accessorKey: 'pos', header: 'POS', size: 130 },
      { accessorKey: 'grade', header: 'Grade', size: 80 },
      { accessorKey: 'attendanceEnrollId', header: 'ID Absen', size: 90 },
      { accessorKey: 'attendanceVerification', header: 'Verifikasi Absen', size: 110 },
      { accessorKey: 'presenceVerification', header: 'Verifikasi Kehadiran', size: 130 },
      { accessorKey: 'attendanceTime', header: 'Jam Absen', size: 90 },
      { accessorKey: 'attendanceDate', header: 'Tanggal Absen', size: 110 },
      { accessorKey: 'dataUploadTime', header: 'Waktu Upload Data', size: 140 },
      { accessorKey: 'machineId', header: 'ID Mesin', size: 70 },
      { accessorKey: 'machineIp', header: 'IP Mesin', size: 100 },
    ],
    [meta]
  );

  const table = useReactTable({
    data,
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

  const rows = table.getRowModel().rows;

  return (
    <div className="grid grid-cols-1 w-full relative">
      <div
        ref={filterWrapperRef}
        className="w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm mb-16 md:mb-0 flex flex-col relative"
      >
        <div className="w-full">
          <TableToolbar
            title="Laporan Absensi"
            subtitle="Daftar dan histori catatan absensi karyawan LokaHR"
            icon={<FileText className="w-6 h-6" />}
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
                  onDateRangeChange({ startDate: '', endDate: '' });
                  onDeptFilterChange('');
                  onSubDeptFilterChange('');
                  onGradeFilterChange('');
                }}
                fields={[
                  {
                    key: 'dateRange',
                    label: 'Periode Tanggal Absen',
                    render: () => (
                      <DateRangePicker
                        startDate={dateRange.startDate}
                        endDate={dateRange.endDate}
                        onChange={(start: string, end: string) => {
                          onDateRangeChange({ startDate: start || '', endDate: end || '' });
                        }}
                      />
                    ),
                  },
                  {
                    key: 'dept',
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
                          ...departemenList.map((d) => ({ id: d.name || d, label: d.name || d })),
                        ]}
                      />
                    ),
                  },
                  {
                    key: 'subDept',
                    label: 'Sub Departemen',
                    render: () => (
                      <FormSelectSearch
                        value={subDeptFilter}
                        onChange={onSubDeptFilterChange}
                        placeholder="Semua Sub Dept"
                        options={[
                          { id: '', label: 'Semua Sub Dept' },
                          ...filteredSubDepts.map((sd) => ({ id: sd.name || sd, label: sd.name || sd })),
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
              <div className="hidden md:flex items-center gap-2">
                <ExportIconButton onClick={onExport || (() => {})} />
              </div>
            }
          />
        </div>

        <div className="px-5 py-2 bg-gray-50/50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 w-full">
          <DataPagination table={table} />
        </div>

        <div
          className="hidden md:block w-full overflow-x-auto rounded-b-2xl"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <Table className="w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="whitespace-nowrap px-3 py-3"
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {rows?.length ? (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="whitespace-nowrap px-3 py-3 truncate"
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-gray-400">
                    Tidak ada data absensi ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="block md:hidden p-4 space-y-3 bg-gray-50/50 dark:bg-gray-950/50 rounded-b-2xl">
          {rows.length > 0 ? (
            rows.map((row) => {
              const item = row.original;
              return (
                <div key={row.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                      NIP: {item.nip}
                    </span>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {item.attendanceTime}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.dept} • {item.pos}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between text-[11px] text-gray-500">
                    <span>Tgl: {item.attendanceDate}</span>
                    <span>IP Mesin: {item.machineIp}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-xs">
              Tidak ada data absensi ditemukan.
            </div>
          )}
        </div>
      </div>

      <MobileActionFabGroup onExport={onExport || (() => {})} />
    </div>
  );
};