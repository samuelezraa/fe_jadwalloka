import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  type ColumnDef,
} from '@tanstack/react-table';
import type { AnnualEvent } from '../types/annual-event.type';
import { DataPagination } from '../../../../components/DataPagination';
import { Calendar } from 'lucide-react';

// Reusable UI Components
import { TableToolbar } from '../../../../components/ui/TableToolbar';
import { AddButton, EditActionButton, MobileAddFab } from '../../../../components/ui/ActionButtons';
import { DataTable } from '../../../../components/ui/data-table';
import { TableFilterPopover } from '../../../../components/ui/TableFilterPopover';
import { FormSelectSearch } from '../../../../components/ui/FormSelectSearch';
import { DateRangePicker } from '../../../../components/ui/DateRangePicker';
import { Badge } from '../../../../components/ui/badge';

interface AnnualEventTableProps {
  data: AnnualEvent[];
  onEdit: (item: AnnualEvent) => void;
  onAdd: () => void;
}

const parseDateMs = (dateStr: string) => {
  if (!dateStr) return 0;
  const cleanStr = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
  const parts = cleanStr.split('-');
  if (parts.length === 3 && parts[0].length === 2 && parts[2].length === 4) {
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime();
  }
  return new Date(cleanStr).getTime();
};

export const AnnualEventTable: React.FC<AnnualEventTableProps> = ({
  data = [],
  onEdit,
  onAdd,
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(''); // '' | 'true' | 'false'
  const [categoryFilter, setCategoryFilter] = useState<string>(''); // '' | 'true' | 'false'
  const [startDateFilter, setStartDateFilter] = useState<string>('');
  const [endDateFilter, setEndDateFilter] = useState<string>('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});

  // Filter gabungan: Status, Kategori, dan Rentang Tanggal
  const filteredData = useMemo(() => {
    let result = data;

    // Filter Status
    if (statusFilter) {
      const isFilterActive = statusFilter === 'true';
      result = result.filter((item) => {
        const rawActive = (item as any).is_active ?? (item as any).status;
        const isActive = Boolean(rawActive === true || rawActive === 1 || rawActive === 'Aktif');
        return isActive === isFilterActive;
      });
    }

    // Filter Kategori (Nasional / Perusahaan)
    if (categoryFilter) {
      const isFilterHoliday = categoryFilter === 'true';
      result = result.filter((item) => {
        const rawHoliday = (item as any).is_national_holiday;
        return Boolean(rawHoliday) === isFilterHoliday;
      });
    }

    // Filter Rentang Tanggal
    if (startDateFilter || endDateFilter) {
      const filterStartMs = parseDateMs(startDateFilter);
      const filterEndMs = parseDateMs(endDateFilter);

      result = result.filter((item) => {
        const itemStart = item.start_date || (item as any).event_date || (item as any).tanggal || '';
        const itemEnd = item.end_date || itemStart;

        const itemStartMs = parseDateMs(itemStart);
        const itemEndMs = parseDateMs(itemEnd);

        if (startDateFilter && endDateFilter) {
          // Irisan rentang tanggal
          return itemStartMs <= filterEndMs && itemEndMs >= filterStartMs;
        }
        if (startDateFilter) {
          return itemEndMs >= filterStartMs;
        }
        if (endDateFilter) {
          return itemStartMs <= filterEndMs;
        }
        return true;
      });
    }

    return result;
  }, [data, statusFilter, categoryFilter, startDateFilter, endDateFilter]);

  const isFiltered = Boolean(statusFilter || categoryFilter || startDateFilter || endDateFilter);

  const handleResetFilter = () => {
    setStatusFilter('');
    setCategoryFilter('');
    setStartDateFilter('');
    setEndDateFilter('');
  };

  const columns = useMemo<ColumnDef<AnnualEvent>[]>(
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
        accessorKey: 'start_date',
        header: 'Tanggal',
        cell: ({ row }) => {
          const item = row.original;
          let start = item.start_date || (item as any).event_date || (item as any).tanggal || '';
          let end = item.end_date || '';

          if (start.includes('T')) start = start.split('T')[0];
          if (end && end.includes('T')) end = end.split('T')[0];

          const displayDate = end && end !== start ? `${start} - ${end}` : start;

          return (
            <span className="text-gray-700 dark:text-gray-300 font-medium font-mono text-xs">
              {displayDate || '-'}
            </span>
          );
        },
      },
      {
        accessorKey: 'title',
        header: 'Nama Event',
        cell: (info) => {
          const val = info.getValue() || (info.row.original as any).event;
          return (
            <span className="font-semibold text-gray-800 dark:text-gray-100">
              {String(val || '-')}
            </span>
          );
        },
      },
      {
        accessorKey: 'is_national_holiday',
        header: 'Kategori',
        cell: (info) => {
          const isHoliday = Boolean(info.getValue());
          return (
            <span className="text-gray-700 dark:text-gray-300 font-medium text-xs">
              {isHoliday ? 'Nasional' : 'Perusahaan'}
            </span>
          );
        },
      },
      {
        accessorKey: 'description',
        header: 'Keterangan',
        cell: (info) => {
          const val = info.getValue() || (info.row.original as any).keterangan;
          return (
            <span className="text-gray-700 dark:text-gray-300 text-xs">
              {String(val || '-')}
            </span>
          );
        },
      },
      {
        accessorKey: 'is_active',
        header: 'Status',
        cell: (info) => {
          const rawActive = (info.row.original as any).is_active ?? (info.row.original as any).status;
          const isAktif = Boolean(rawActive === true || rawActive === 1 || rawActive === 'Aktif');
          return (
            <div className="flex justify-center">
              <Badge 
                variant="outline"
                className={
                  isAktif 
                    ? 'rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 font-semibold px-3 py-0.5 text-[11px]' 
                    : 'rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 font-semibold px-3 py-0.5 text-[11px]'
                }
              >
                {isAktif ? 'Aktif' : 'Non Aktif'}
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
              isFiltered={isFiltered}
              onReset={handleResetFilter}
              fields={[
                {
                  key: 'dateRange',
                  label: 'Rentang Tanggal',
                  render: () => (
                    <DateRangePicker
                      startDate={startDateFilter}
                      endDate={endDateFilter}
                      onChange={(start, end) => {
                        setStartDateFilter(start);
                        setEndDateFilter(end);
                      }}
                      placeholder="Pilih Rentang Tanggal..."
                    />
                  ),
                },
                {
                  key: 'category',
                  label: 'Kategori',
                  render: () => (
                    <FormSelectSearch
                      value={categoryFilter}
                      onChange={(val) => setCategoryFilter(val)}
                      placeholder="Semua Kategori"
                      showSearch={false}
                      options={[
                        { id: '', label: 'Semua Kategori' },
                        { id: 'true', label: 'Nasional' },
                        { id: 'false', label: 'Perusahaan' },
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
                      onChange={(val) => setStatusFilter(val)}
                      placeholder="Semua Status"
                      showSearch={false}
                      options={[
                        { id: '', label: 'Semua Status' },
                        { id: 'true', label: 'Aktif' },
                        { id: 'false', label: 'Non Aktif' },
                      ]}
                    />
                  ),
                },
              ]}
            />
          }
          actionButtons={<AddButton onClick={onAdd} />}
        />

        <div className="px-5 py-2 bg-gray-50/50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 relative">
          <DataPagination table={table} />
        </div>

        {/* Mobile View */}
        <div className="block md:hidden p-4 space-y-3 bg-gray-50/50 dark:bg-gray-950/50">
          {rows.length > 0 ? (
            rows.map((row) => {
              const item = row.original;
              const rawActive = (item as any).is_active ?? (item as any).status;
              const isAktif = Boolean(rawActive === true || rawActive === 1 || rawActive === 'Aktif');
              const titleVal = item.title || (item as any).event;

              const startVal = item.start_date || (item as any).event_date || (item as any).tanggal || '';
              const endVal = item.end_date || '';
              const cleanStart = startVal.includes('T') ? startVal.split('T')[0] : startVal;
              const cleanEnd = endVal.includes('T') ? endVal.split('T')[0] : endVal;
              const dateVal = cleanEnd && cleanEnd !== cleanStart ? `${cleanStart} - ${cleanEnd}` : cleanStart;

              return (
                <div key={row.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                      {dateVal}
                    </span>
                    <Badge 
                      variant="outline"
                      className={
                        isAktif 
                          ? 'rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 font-semibold px-3 py-0.5 text-[11px]' 
                          : 'rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 font-semibold px-3 py-0.5 text-[11px]'
                      }
                    >
                      {isAktif ? 'Aktif' : 'Non Aktif'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Nama Event</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mt-0.5">{titleVal}</p>
                  </div>
                  {item.description && (
                    <div>
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Keterangan</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{item.description}</p>
                    </div>
                  )}
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