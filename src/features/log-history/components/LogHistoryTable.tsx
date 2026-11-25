import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import type { LogHistory } from '../types/log-history.type';
import { DataPagination } from '@/components/DataPagination';
import { History, Eye } from 'lucide-react';
import { LogHistoryDetailDialog } from './LogHistoryDetailDialog';

import { TableToolbar } from '@/components/ui/TableToolbar';
import { TableFilterPopover } from '@/components/ui/TableFilterPopover';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface LogHistoryTableProps {
  data: LogHistory[];
  loading?: boolean;
  page?: number;
  pageSize?: number;
  totalItems?: number;
  lastPage?: number;
  onPageChange?: (nextPage: number) => void;
  onPageSizeChange?: (nextSize: number) => void;
  onFilterChange?: (filters: {
    search?: string;
    startDate?: string;
    endDate?: string;
  }) => void;
}

export const LogHistoryTable: React.FC<LogHistoryTableProps> = ({
  data,
  loading = false,
  page = 1,
  pageSize = 25,
  totalItems = data.length,
  lastPage = 1,
  onPageChange,
  onPageSizeChange,
  onFilterChange,
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogHistory | null>(null);

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

  // Debounce pencarian server-side agar tidak spam request saat mengetik
  useEffect(() => {
    if (!onFilterChange) return;
    const timer = setTimeout(() => {
      onFilterChange({
        search: globalFilter,
        startDate,
        endDate,
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [globalFilter, startDate, endDate, onFilterChange]);

  const isFiltered = Boolean(startDate || endDate);

  const columns = useMemo<ColumnDef<LogHistory>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: (info) => (
          <span className="font-mono text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: (info) => {
          const val = String(info.getValue());
          const badgeClass =
            val === 'Create'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
              : val === 'Delete'
              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800'
              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';

          return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClass}`}>
              {val}
            </span>
          );
        },
      },
      {
        accessorKey: 'menu',
        header: 'Menu',
        cell: (info) => (
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'subMenu',
        header: 'Sub Menu',
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>
        ),
      },
      {
        accessorKey: 'pic',
        header: 'PIC',
        cell: (info) => (
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: (info) => {
          const parts = String(info.getValue()).split('-');
          const formatted =
            parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : String(info.getValue());
          return <span className="text-gray-700 dark:text-gray-300">{formatted}</span>;
        },
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: (info) => {
          const text = String(info.getValue());
          return (
            <span
              title={text}
              className="text-gray-600 dark:text-gray-400 max-w-[230px] truncate block"
            >
              {text}
            </span>
          );
        },
      },
      {
        id: 'detail',
        header: 'Detail',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => setSelectedLog(row.original)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Detail</span>
          </button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    manualFiltering: true,
    pageCount: Math.max(1, lastPage),
    rowCount: totalItems,
    state: {
      pagination: {
        pageIndex: Math.max(0, page - 1),
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const current = { pageIndex: Math.max(0, page - 1), pageSize };
      const next = typeof updater === 'function' ? updater(current) : updater;
      if (next.pageSize !== pageSize && onPageSizeChange) {
        onPageSizeChange(next.pageSize);
      }
      if (next.pageIndex !== current.pageIndex && onPageChange) {
        onPageChange(next.pageIndex + 1);
      }
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;

  return (
    <div className="grid grid-cols-1 w-full relative">
      <div
        ref={filterWrapperRef}
        className="w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col relative"
      >
        {/* Header Toolbar */}
        <div className="w-full">
          <TableToolbar
            title="Log History"
            subtitle="List of system activity history and data changes"
            icon={<History className="w-6 h-6" />}
            searchValue={globalFilter}
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
                    key: 'date',
                    label: 'Date',
                    render: () => (
                      <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(start, end) => {
                          setStartDate(start);
                          setEndDate(end);
                        }}
                      />
                    ),
                  },
                ]}
              />
            }
          />
        </div>

        {/* Pagination */}
        <div className="px-5 py-2 bg-gray-50/50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 w-full">
          <DataPagination table={table} />
        </div>

        {/* Desktop Table View */}
        <div
          className="hidden md:block w-full overflow-x-auto rounded-b-2xl"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <Table className="w-full min-w-[960px]">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="whitespace-nowrap px-4 py-3">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-gray-400">
                    Memuat data log history...
                  </TableCell>
                </TableRow>
              ) : rows?.length ? (
                rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-gray-400">
                    No log history found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden p-4 space-y-3 bg-gray-50/50 dark:bg-gray-950/50 rounded-b-2xl">
          {loading ? (
            <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-xs">
              Memuat data log history...
            </div>
          ) : rows.length > 0 ? (
            rows.map((row) => {
              const item = row.original;
              const badgeMobileClass =
                item.type === 'Create'
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : item.type === 'Delete'
                  ? 'text-rose-700 bg-rose-50 border-rose-200'
                  : 'text-amber-700 bg-amber-50 border-amber-200';

              return (
                <div
                  key={row.id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                      {item.id}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badgeMobileClass}`}>
                      {item.action_label || item.type}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">
                      {item.menu} • {item.subMenu}
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                      {item.description}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
                    <span>
                      PIC: {item.pic} • {item.date}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedLog(item)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detail</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-xs">
              No log history found.
            </div>
          )}
        </div>
      </div>

      {/* Dialog Detail Perubahan Before vs After */}
      <LogHistoryDetailDialog
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
};