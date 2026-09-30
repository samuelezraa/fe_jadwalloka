import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  type ColumnDef,
} from '@tanstack/react-table';
import type { EventTahunan } from '../types/event-tahunan.type';
import { DataPagination } from '../../../../components/DataPagination';
import { Calendar } from 'lucide-react';

// Reusable UI Components
import { TableToolbar } from '../../../../components/ui/TableToolbar';
import { AddButton, EditActionButton, MobileAddFab } from '../../../../components/ui/ActionButtons';
import { DataTable } from '../../../../components/ui/data-table';
import { DatePicker } from '../../../../components/ui/DatePicker';
import { TableFilterPopover, type FilterField } from '../../../../components/ui/TableFilterPopover';
import { Badge } from '../../../../components/ui/badge';

interface EventTahunanTableProps {
  data: EventTahunan[];
  onEdit: (item: EventTahunan) => void;
  onAdd: () => void;
}

const parseDateMs = (dateStr: string) => {
  if (!dateStr) return 0;
  const parts = dateStr.split('-');
  if (parts.length === 3 && parts[0].length === 2 && parts[2].length === 4) {
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime();
  }
  return new Date(dateStr).getTime();
};

export const EventTahunanTable: React.FC<EventTahunanTableProps> = ({
  data,
  onEdit,
  onAdd,
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [startDateFilter, setStartDateFilter] = useState<string>('');
  const [endDateFilter, setEndDateFilter] = useState<string>('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});

  const filteredData = useMemo(() => {
    let result = data;
    if (statusFilter) {
      result = result.filter((item) => item.status === statusFilter);
    }
    if (startDateFilter || endDateFilter) {
      const startMs = parseDateMs(startDateFilter);
      const endMs = parseDateMs(endDateFilter);
      
      result = result.filter((item) => {
        const itemMs = parseDateMs(item.tanggal);
        if (startDateFilter && endDateFilter) return itemMs >= startMs && itemMs <= endMs;
        if (startDateFilter) return itemMs >= startMs;
        if (endDateFilter) return itemMs <= endMs;
        return true;
      });
    }
    return result;
  }, [data, statusFilter, startDateFilter, endDateFilter]);

  const isFiltered = Boolean(statusFilter || startDateFilter || endDateFilter);

  // Konfigurasi Field Filter untuk TableFilterPopover Reusable
  const filterFields: FilterField[] = [
    {
      key: 'startDate',
      label: 'Dari Tanggal',
      render: () => (
        <DatePicker
          value={startDateFilter}
          onChange={setStartDateFilter}
          placeholder="Pilih Tanggal Mulai..."
        />
      ),
    },
    {
      key: 'endDate',
      label: 'Sampai Tanggal',
      render: () => (
        <DatePicker
          value={endDateFilter}
          onChange={setEndDateFilter}
          placeholder="Pilih Tanggal Selesai..."
        />
      ),
    },
    {
      key: 'status',
      label: 'Status Event',
      value: statusFilter,
      onChange: (val) => setStatusFilter(val),
      options: [
        { value: '', label: 'Semua Status' },
        { value: 'Aktif', label: 'Aktif' },
        { value: 'Non Aktif', label: 'Non Aktif' },
      ],
    },
  ];

  const handleResetFilter = () => {
    setStartDateFilter('');
    setEndDateFilter('');
    setStatusFilter('');
  };

  const columns = useMemo<ColumnDef<EventTahunan>[]>(
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
        accessorKey: 'id',
        header: 'ID Event',
        cell: (info) => (
          <span className="font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-xs">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'tanggal',
        header: 'Tanggal',
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-300 font-medium">{String(info.getValue())}</span>
        ),
      },
      {
        accessorKey: 'event',
        header: 'Event',
        cell: (info) => (
          <span className="font-semibold text-gray-800 dark:text-gray-100">{String(info.getValue())}</span>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: (info) => (
          <span className="text-gray-600 dark:text-gray-400 font-mono text-[11px]">{String(info.getValue())}</span>
        ),
      },
      {
        accessorKey: 'keterangan',
        header: 'Keterangan',
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const val = String(info.getValue());
          const isAktif = val === 'Aktif';
          return (
            <div className="flex justify-center">
              <Badge 
                variant={isAktif ? 'outline' : 'destructive'} 
                className={
                  isAktif 
                    ? 'rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 font-semibold px-3' 
                    : 'rounded-full'
                }
              >
                {val}
              </Badge>
            </div>
          );
        },
      },
      {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => (
          <div className="flex justify-center">
            <EditActionButton onClick={() => onEdit(row.original)} />
          </div>
        ),
      },
    ],
    [onEdit]
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
    <div className="relative">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-visible mb-16 md:mb-0 transition-colors duration-200">
        
        <TableToolbar
          title="Event Tahunan"
          subtitle="Daftar kelola event tahunan LokaHR"
          icon={<Calendar className="w-6 h-6" />}
          searchValue={globalFilter ?? ''}
          onSearchChange={setGlobalFilter}
          showFilterDropdown={showFilterDropdown}
          onToggleFilterDropdown={() => setShowFilterDropdown(!showFilterDropdown)}
          isFiltered={isFiltered}
          
          filterDropdownContent={
            <TableFilterPopover
              isOpen={showFilterDropdown}
              onClose={() => setShowFilterDropdown(false)}
              fields={filterFields}
              onReset={handleResetFilter}
              isFiltered={isFiltered}
            />
          }
          
          actionButtons={
            <AddButton onClick={onAdd} />
          }
        />

        <div className="px-5 py-2 bg-gray-50/50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 relative">
          <DataPagination table={table} />
        </div>

        {/* Mobile View */}
        <div className="block md:hidden p-4 space-y-3 bg-gray-50/50 dark:bg-gray-950/50">
          {rows.length > 0 ? (
            rows.map((row) => {
              const item = row.original;
              const isAktif = item.status === 'Aktif';
              return (
                <div key={row.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                      {item.id}
                    </span>
                   <Badge 
                      variant={isAktif ? 'default' : 'destructive'}
                      className={isAktif ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : ''}
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Event & Tanggal</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mt-0.5">{item.event}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.tanggal} • <span className="font-mono">{item.type}</span></p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Keterangan</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">{item.keterangan}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                    <EditActionButton onClick={() => onEdit(item)} />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-xs">
              Tidak ada data event tahunan ditemukan.
            </div>
          )}
        </div>

        <DataTable table={table} columnsLength={columns.length} emptyMessage="Tidak ada data event tahunan ditemukan." />
      </div>

      <MobileAddFab onClick={onAdd} title="Tambah Event" />
    </div>
  );
};