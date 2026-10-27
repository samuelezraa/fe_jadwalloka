import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
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
  onExport?: () => void;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({ data, onExport }) => {
  const [globalFilter, setGlobalFilter] = useState('');
  
  // Filter states
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string }>({
    startDate: '',
    endDate: '',
  });
  const [deptFilter, setDeptFilter] = useState('');
  const [subDeptFilter, setSubDeptFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');

  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  // Mengatur kolom yang secara default disembunyikan (false) dengan tipe Record<string, boolean>
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    attendanceVerification: false,
    presenceVerification: false,
    dataUploadTime: false,
    machineId: false,
    machineIp: false,
  });

  const filterWrapperRef = useRef<HTMLDivElement>(null);

  // Auto-close filter popover saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        filterWrapperRef.current &&
        !filterWrapperRef.current.contains(event.target as Node)
      ) {
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

  // Dynamic unique options for filters
  const uniqueDeptList = useMemo(() => Array.from(new Set(data.map((item) => item.dept))), [data]);
  const uniqueSubDeptList = useMemo(() => Array.from(new Set(data.map((item) => item.subDept))), [data]);
  const uniqueGradeList = useMemo(() => Array.from(new Set(data.map((item) => item.grade).filter(Boolean))), [data]);

  // Filter Data berdasarkan DateRange, Dept, SubDept, & Grade
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (dateRange.startDate && item.attendanceDate < dateRange.startDate) return false;
      if (dateRange.endDate && item.attendanceDate > dateRange.endDate) return false;
      if (deptFilter && item.dept !== deptFilter) return false;
      if (subDeptFilter && item.subDept !== subDeptFilter) return false;
      if (gradeFilter && item.grade !== gradeFilter) return false;
      return true;
    });
  }, [data, dateRange, deptFilter, subDeptFilter, gradeFilter]);

  const isFiltered = Boolean(dateRange.startDate || dateRange.endDate || deptFilter || subDeptFilter || gradeFilter);

 const columns = useMemo<ColumnDef<AttendanceReport>[]>(
    () => [
      {
        id: 'rowNumber', // Kolom khusus untuk nomor urut
        header: '#',
        size: 50,
        cell: ({ row, table }) => {
          // Menghitung nomor urut berdasarkan indeks baris + halaman aktif
          const paginationState = table.getState().pagination;
          const rowNumber = paginationState.pageIndex * paginationState.pageSize + row.index + 1;
          return (
            <span className="font-medium text-gray-500 dark:text-gray-400">
              {rowNumber}
            </span>
          );
        },
      },
      {
        accessorKey: 'nip',
        header: 'NIP',
        size: 110,
        cell: (info) => (
          <span className="font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-xs">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Name',
        size: 160,
        cell: (info) => <span className="font-bold text-gray-900 dark:text-gray-100">{String(info.getValue())}</span>,
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
    []
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

  const rows = table.getRowModel().rows;

  return (
    <div className="grid grid-cols-1 w-full relative">
      <div 
        ref={filterWrapperRef}
        className="w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm mb-16 md:mb-0 flex flex-col relative"
      >
        {/* Header Toolbar */}
        <div className="w-full">
          <TableToolbar
            title="Laporan Absensi"
            subtitle="Daftar dan histori catatan absensi karyawan LokaHR"
            icon={<FileText className="w-6 h-6" />}
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
                  setDateRange({ startDate: '', endDate: '' });
                  setDeptFilter('');
                  setSubDeptFilter('');
                  setGradeFilter('');
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
                          setDateRange({ startDate: start || '', endDate: end || '' });
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
                        onChange={setDeptFilter}
                        placeholder="Semua Departemen"
                        options={[
                          { id: '', label: 'Semua Departemen' },
                          ...uniqueDeptList.map((d) => ({ id: d, label: d })),
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
                        onChange={setSubDeptFilter}
                        placeholder="Semua Sub Dept"
                        options={[
                          { id: '', label: 'Semua Sub Dept' },
                          ...uniqueSubDeptList.map((sd) => ({ id: sd, label: sd })),
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
                          ...uniqueGradeList.map((g) => ({ id: g, label: g })),
                        ]}
                      />
                    ),
                  },
                ]}
              />
            }
            actionButtons={
              <div className="hidden md:flex items-center gap-2">
                <ExportIconButton onClick={onExport || (() => alert('Fitur Export Absensi'))} />
              </div>
            }
          />
        </div>

        {/* Pagination */}
        <div className="px-5 py-2 bg-gray-50/50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 w-full">
          <DataPagination table={table} />
        </div>

        {/* Tampilan Desktop Table */}
        <div 
          className="hidden md:block w-full overflow-x-auto rounded-b-2xl"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>

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

        {/* Tampilan Mobile Card */}
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

      <MobileActionFabGroup
        onExport={onExport || (() => alert('Fitur Export Absensi'))}
      />
    </div>
  );
};