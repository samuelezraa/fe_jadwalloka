import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import type { KomplimenData } from '../types/komplimen.type';
import { DataPagination } from '../../../../components/DataPagination';
import { FileText } from 'lucide-react';

// Reusable UI Components
import { TableToolbar } from '../../../../components/ui/TableToolbar';
import { ExportIconButton, AddButton } from '../../../../components/ui/ActionButtons';
import { TableFilterPopover } from '../../../../components/ui/TableFilterPopover';
import { Badge } from '../../../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../components/ui/table';

interface KomplimenTableProps {
  data: KomplimenData[];
  onAdd?: () => void;
  onExport?: () => void;
}

export const KomplimenTable: React.FC<KomplimenTableProps> = ({ data, onAdd, onExport }) => {
  const [globalFilter, setGlobalFilter] = useState('');
  
  // State Filter Status / Kategori
  const [statusFilter, setStatusFilter] = useState('');
  
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});

  const filterWrapperRef = useRef<HTMLDivElement>(null);

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

  // Filter Data
  const filteredData = useMemo(() => {
    let result = data;
    if (statusFilter) {
      result = result.filter((item) => item.status === statusFilter);
    }
    return result;
  }, [data, statusFilter]);

  const isFiltered = Boolean(statusFilter);

  const columns = useMemo<ColumnDef<KomplimenData>[]>(
    () => [
      {
        id: 'number',
        header: '#',
        cell: (info) => (
          <span className="font-medium text-gray-500 dark:text-gray-400">
            {info.row.index + 1 + info.table.getState().pagination.pageIndex * info.table.getState().pagination.pageSize}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const val = String(info.getValue());
          const isApproved = val === 'Approved';
          const isPending = val === 'Pending';
          return (
            <div className="flex justify-center">
              <Badge 
                variant="outline" 
                className={
                  isApproved 
                    ? 'rounded-full bg-emerald-50 text-emerald-600 border-emerald-200 font-semibold px-3'
                    : isPending
                    ? 'rounded-full bg-amber-50 text-amber-600 border-amber-200 font-semibold px-3'
                    : 'rounded-full bg-red-50 text-red-600 border-red-200 font-semibold px-3'
                }
              >
                {val}
              </Badge>
            </div>
          );
        },
      },
      {
        accessorKey: 'nip',
        header: 'NIP',
        cell: (info) => <span className="font-mono text-gray-800 dark:text-gray-100">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'nama',
        header: 'Nama',
        cell: (info) => <span className="font-bold text-gray-900 dark:text-gray-100">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'departemen',
        header: 'Departemen',
        cell: (info) => <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'tanggal',
        header: 'Tanggal',
        cell: (info) => <span className="text-gray-700 dark:text-gray-300 text-xs">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'kategori',
        header: 'Kategori',
        cell: (info) => <span className="text-gray-700 dark:text-gray-300 font-medium">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'keterangan',
        header: 'Keterangan',
        cell: (info) => <span className="text-gray-600 dark:text-gray-400 text-xs">{String(info.getValue())}</span>,
      },
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
            title="Komplimen"
            subtitle="Daftar pengajuan komplimen dan koreksi kehadiran karyawan"
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
                onReset={() => setStatusFilter('')}
                fields={[
                  {
                    key: 'status',
                    label: 'Status',
                    value: statusFilter,
                    onChange: setStatusFilter,
                    options: [
                      { value: '', label: 'Semua Status' },
                      { value: 'Pending', label: 'Pending' },
                      { value: 'Approved', label: 'Approved' },
                      { value: 'Rejected', label: 'Rejected' },
                    ],
                  },
                ]}
              />
            }
            actionButtons={
              <div className="flex items-center gap-2">
                {onAdd && <AddButton onClick={onAdd}>Tambah</AddButton>}
                <ExportIconButton onClick={onExport} title="Export Komplimen" />
              </div>
            }
          />
        </div>

        {/* Pagination */}
        <div className="px-5 py-2 bg-gray-50/50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 w-full">
          <DataPagination table={table} />
        </div>

        {/* Tampilan Desktop Tabel */}
        <div className="hidden md:block w-full overflow-x-auto rounded-b-2xl scrollbar-thin">
          <Table className="w-full min-w-[1100px]">
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
                    Tidak ada data komplimen ditemukan.
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
              const isApproved = item.status === 'Approved';
              const isPending = item.status === 'Pending';
              return (
                <div key={row.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                      NIP: {item.nip}
                    </span>
                    <Badge 
                      variant="outline" 
                      className={
                        isApproved 
                          ? 'rounded-full bg-emerald-50 text-emerald-600 border-emerald-200 font-semibold px-3'
                          : isPending
                          ? 'rounded-full bg-amber-50 text-amber-600 border-amber-200 font-semibold px-3'
                          : 'rounded-full bg-red-50 text-red-600 border-red-200 font-semibold px-3'
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.nama}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.kategori} - {item.tanggal}</p>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                    {item.keterangan}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-xs">
              Tidak ada data komplimen ditemukan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};