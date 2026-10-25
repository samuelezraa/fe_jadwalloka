import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  type ColumnDef,
} from '@tanstack/react-table';
import type { FiveTwoWorkHourEmployee } from '../types/five-two-work-hour.type';
import { DataPagination } from '../../../../components/DataPagination';
import { Clock } from 'lucide-react';

// Reusable UI Components
import { TableToolbar } from '../../../../components/ui/TableToolbar';
import { 
  EditActionButton, 
  ImportIconButton, 
  ExportIconButton,
  MobileActionFabGroup
} from '../../../../components/ui/ActionButtons';
import { DataTable } from '../../../../components/ui/data-table';
import { TableFilterPopover } from '../../../../components/ui/TableFilterPopover';
import { ImportJadwalDialog } from '../../../../components/ui/ImportJadwalDialog';
import { FormSelectSearch } from '../../../../components/ui/FormSelectSearch';

interface FiveTwoWorkHourTableProps {
  data: FiveTwoWorkHourEmployee[];
  onEdit: (item: FiveTwoWorkHourEmployee) => void;
  onImport?: () => void;
  onExport?: () => void;
}

export const FiveTwoWorkHourTable: React.FC<FiveTwoWorkHourTableProps> = ({
  data = [],
  onEdit,
  onImport,
  onExport,
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [tipeFilter, setTipeFilter] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [isImportOpen, setIsImportOpen] = useState(false);

  const getWorkHourType = (item: FiveTwoWorkHourEmployee) => {
    return (
      item.schedule_schemes?.[0]?.work_schedule_scheme?.name ||
      item.work_hour_type ||
      'Skema 5-2'
    );
  };

  const uniqueTipe = useMemo(
    () => Array.from(new Set(data.map((item) => getWorkHourType(item)).filter(Boolean))),
    [data]
  );

  const filteredData = useMemo(() => {
    let result = data;
    if (tipeFilter) {
      result = result.filter((item) => getWorkHourType(item) === tipeFilter);
    }
    return result;
  }, [data, tipeFilter]);

  const isFiltered = Boolean(tipeFilter);

  const columns = useMemo<ColumnDef<FiveTwoWorkHourEmployee>[]>(
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
        id: 'schedule_id',
        header: 'ID Jadwal',
        cell: ({ row }) => (
          <span className="font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-xs">
            {String(row.original.id)}
          </span>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Nama Jadwal',
        cell: (info) => (
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {String(info.getValue() || '-')}
          </span>
        ),
      },
      {
        id: 'work_hour_type',
        header: 'Tipe Jam Kerja',
        cell: ({ row }) => {
          const typeName = getWorkHourType(row.original);
          return (
            <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-semibold">
              {typeName}
            </span>
          );
        },
      },
      {
        accessorKey: 'is_active',
        header: 'Status',
        cell: (info) => {
          const active = info.getValue() !== false;
          return (
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                active
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
              }`}
            >
              {active ? 'Aktif' : 'Nonaktif'}
            </span>
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
          title="Jam Kerja (Skema 5-2)"
          subtitle="Daftar pengaturan jam kerja karyawan LokaHR"
          icon={<Clock className="w-6 h-6" />}
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
              onReset={() => setTipeFilter('')}
              fields={[
                {
                  key: 'work_hour_type',
                  label: 'Tipe Jam Kerja',
                  render: () => (
                    <FormSelectSearch
                      value={tipeFilter}
                      onChange={setTipeFilter}
                      placeholder="Semua Tipe"
                      options={[
                        { id: '', label: 'Semua Tipe' },
                        ...uniqueTipe.map((t) => ({ id: t, label: t })),
                      ]}
                    />
                  ),
                },
              ]}
            />
          }
          actionButtons={
            <div className="hidden md:flex items-center gap-2">
              <ImportIconButton onClick={() => setIsImportOpen(true)} />
              <ExportIconButton onClick={onExport || (() => alert('Fitur Export Jadwal'))} />
            </div>
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
              const typeName = getWorkHourType(item);

              return (
                <div key={row.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                      ID: {item.id}
                    </span>
                    <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full text-[10px] font-semibold">
                      {typeName}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.name || '-'}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                    <EditActionButton onClick={() => onEdit(item)} />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-xs">
              Tidak ada data jam kerja ditemukan.
            </div>
          )}
        </div>

        {/* Desktop View DataTable */}
        <DataTable table={table} columnsLength={columns.length} emptyMessage="Tidak ada data jam kerja ditemukan." />
      </div>

      <MobileActionFabGroup
        onImport={() => setIsImportOpen(true)}
        onExport={onExport || (() => alert('Fitur Export Jadwal'))}
      />

      <ImportJadwalDialog
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={(_file) => {
          if (onImport) {
            onImport();
          } else {
            alert('File berhasil diimport!');
          }
        }}
      />
    </div>
  );
};