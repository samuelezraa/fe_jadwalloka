import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import type { JamKerjaKaryawan } from '../types/jam-kerja.type';
import { DataPagination } from '../../../../components/DataPagination';
import { Clock } from 'lucide-react';

// Reusable UI Components
import { TableToolbar } from '../../../../components/ui/TableToolbar';
import { 
  EditActionButton, 
  ImportIconButton, 
  ExportIconButton,
  MobileActionFabGroup // <-- Import komponen MobileActionFabGroup
} from '../../../../components/ui/ActionButtons';
import { DataTable } from '../../../../components/ui/data-table';
import { TableFilterPopover } from '../../../../components/ui/TableFilterPopover';
import { ImportJadwalDialog } from '../../../../components/ui/ImportJadwalDialog';

interface JamKerjaTableProps {
  data: JamKerjaKaryawan[];
  onEdit: (item: JamKerjaKaryawan) => void;
  onImport?: () => void;
  onExport?: () => void;
}

export const JamKerjaTable: React.FC<JamKerjaTableProps> = ({
  data,
  onEdit,
  onImport,
  onExport,
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [subDeptFilter, setSubDeptFilter] = useState('');
  const [tipeFilter, setTipeFilter] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Opsi unik untuk filter dinamis
  const uniqueSubDept = useMemo(() => Array.from(new Set(data.map((item) => item.sub_departemen))), [data]);
  const uniqueTipe = useMemo(() => Array.from(new Set(data.map((item) => item.tipe_jam_kerja))), [data]);

  // Filter Data berdasarkan Sub Departemen & Tipe Jam Kerja
  const filteredData = useMemo(() => {
    let result = data;
    if (subDeptFilter) {
      result = result.filter((item) => item.sub_departemen === subDeptFilter);
    }
    if (tipeFilter) {
      result = result.filter((item) => item.tipe_jam_kerja === tipeFilter);
    }
    return result;
  }, [data, subDeptFilter, tipeFilter]);

  const isFiltered = Boolean(subDeptFilter || tipeFilter);

  const columns = useMemo<ColumnDef<JamKerjaKaryawan>[]>(
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
        accessorKey: 'id_karyawan',
        header: 'ID Karyawan',
        cell: (info) => (
          <span className="font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-xs">
            {String(info.getValue())}
          </span>
        ),
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
        accessorKey: 'sub_departemen',
        header: 'Sub Departemen',
        cell: (info) => <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'tipe_jam_kerja',
        header: 'Tipe Jam Kerja',
        cell: (info) => (
          <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-semibold">
            {String(info.getValue())}
          </span>
        ),
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
        
        {/* Header Toolbar dengan TableFilterPopover & Reusable Import/Export Icon Button */}
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
              onReset={() => {
                setSubDeptFilter('');
                setTipeFilter('');
              }}
              fields={[
                {
                  key: 'sub_departemen',
                  label: 'Sub Departemen',
                  value: subDeptFilter,
                  onChange: setSubDeptFilter,
                  options: [
                    { value: '', label: 'Semua Sub Departemen' },
                    ...uniqueSubDept.map((sd) => ({ value: sd, label: sd })),
                  ],
                },
                {
                  key: 'tipe_jam_kerja',
                  label: 'Tipe Jam Kerja',
                  value: tipeFilter,
                  onChange: setTipeFilter,
                  options: [
                    { value: '', label: 'Semua Tipe' },
                    ...uniqueTipe.map((t) => ({ value: t, label: t })),
                  ],
                },
              ]}
            />
          }
          actionButtons={
            /* Sembunyikan tombol desktop pada perangkat mobile (hidden md:flex) */
            <div className="hidden md:flex items-center gap-2">
              <ImportIconButton onClick={() => setIsImportOpen(true)} />
              <ExportIconButton onClick={onExport || (() => alert('Fitur Export Jadwal'))} />
            </div>
          }
        />

        {/* Pagination */}
        <div className="px-5 py-2 bg-gray-50/50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 relative">
          <DataPagination table={table} />
        </div>

        {/* Tampilan Mobile Card */}
        <div className="block md:hidden p-4 space-y-3 bg-gray-50/50 dark:bg-gray-950/50">
          {rows.length > 0 ? (
            rows.map((row) => {
              const item = row.original;
              return (
                <div key={row.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                      ID: {item.id_karyawan}
                    </span>
                    <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full text-[10px] font-semibold">
                      {item.tipe_jam_kerja}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.nama}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.departemen} • {item.sub_departemen}</p>
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

        {/* Tampilan Desktop DataTable */}
        <DataTable table={table} columnsLength={columns.length} emptyMessage="Tidak ada data jam kerja ditemukan." />
      </div>

      {/* Floating Action Menu Khusus Mobile */}
      <MobileActionFabGroup
        onImport={() => setIsImportOpen(true)}
        onExport={onExport || (() => alert('Fitur Export Jadwal'))}
      />

      {/* Dialog Import Jadwal */}
      <ImportJadwalDialog
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={(file) => {
          if (onImport) {
            onImport();
          } else {
            console.log('File diimport:', file);
            alert('File berhasil diimport!');
          }
        }}
      />
    </div>
  );
};