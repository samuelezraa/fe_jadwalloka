import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import type { LaporanAbsensi } from '../types/absensi.type';
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
import { DatePicker } from '@/components/ui/DatePicker';

interface AbsensiTableProps {
  data: LaporanAbsensi[];
  onExport?: () => void;
}

export const AbsensiTable: React.FC<AbsensiTableProps> = ({ data, onExport }) => {
  const [globalFilter, setGlobalFilter] = useState('');
  
  // State untuk tanggal awal dan tanggal akhir absensi
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});

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

  // Filter Data berdasarkan Tanggal Absensi Range
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (startDate && item.tanggalAbsen < startDate) return false;
      if (endDate && item.tanggalAbsen > endDate) return false;
      return true;
    });
  }, [data, startDate, endDate]);

  const isFiltered = Boolean(startDate || endDate);

  const columns = useMemo<ColumnDef<LaporanAbsensi>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: (info) => (
          <span className="font-medium text-gray-500 dark:text-gray-400">
            {String(info.getValue())}
          </span>
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
        header: 'Name',
        cell: (info) => <span className="font-bold text-gray-900 dark:text-gray-100">{String(info.getValue())}</span>,
      },
      { accessorKey: 'dept', header: 'Dept' },
      { accessorKey: 'subDept', header: 'Sub Dept' },
      { accessorKey: 'pos', header: 'POS' },
      { accessorKey: 'grade', header: 'Grade' },
      { accessorKey: 'idEnrollKaryawan', header: 'ID Enroll' },
      { accessorKey: 'verifikasiAbsen', header: 'Verifikasi Absen' },
      { accessorKey: 'verifikasiKehadiran', header: 'Verifikasi Kehadiran' },
      { accessorKey: 'jamAbsen', header: 'Jam Absen' },
      { accessorKey: 'tanggalAbsen', header: 'Tanggal Absen' },
      { accessorKey: 'waktuUploadData', header: 'Waktu Upload Data' },
      { accessorKey: 'idMesin', header: 'ID Mesin' },
      { accessorKey: 'ipMesin', header: 'IP Mesin' },
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
                  setStartDate('');
                  setEndDate('');
                }}
                fields={[
                  {
                    key: 'tanggalAwal',
                    label: 'Tanggal Awal Absensi',
                    render: () => (
                      <DatePicker
                        value={startDate}
                        onChange={setStartDate}
                        placeholder="DD-MM-YYYY"
                      />
                    ),
                  },
                  {
                    key: 'tanggalAkhir',
                    label: 'Tanggal Akhir Absensi',
                    render: () => (
                      <DatePicker
                        value={endDate}
                        onChange={setEndDate}
                        placeholder="DD-MM-YYYY"
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

        {/* Tampilan Desktop Table (Scroll Horizontal) */}
        <div 
          className="hidden md:block w-full overflow-x-auto rounded-b-2xl"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <Table className="w-full min-w-[1500px]">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="whitespace-nowrap px-3 py-3">
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
                      <TableCell key={cell.id} className="whitespace-nowrap px-3 py-3">
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
                      {item.jamAbsen}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.dept} • {item.pos}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between text-[11px] text-gray-500">
                    <span>Tgl: {item.tanggalAbsen}</span>
                    <span>IP Mesin: {item.ipMesin}</span>
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