import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import type { DataKaryawan } from '../types/data-karyawan.type';
import { DataPagination } from '../../../../components/DataPagination';
import { Users, KeyRound, Power } from 'lucide-react';

// Reusable UI Components
import { TableToolbar } from '../../../../components/ui/TableToolbar';
import { AddButton, EditActionButton, MobileAddFab } from '../../../../components/ui/ActionButtons';
import { TableFilterPopover } from '../../../../components/ui/TableFilterPopover';
import { FormSelectSearch } from '../../../../components/ui/FormSelectSearch';
import { Badge } from '../../../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../components/ui/table';

interface DataKaryawanTableProps {
  data: DataKaryawan[];
  onEdit: (item: DataKaryawan) => void;
  onAdd: () => void;
  onToggleStatus: (id: string) => void;
  onResetPassword: (id: string) => void;
}

export const DataKaryawanTable: React.FC<DataKaryawanTableProps> = ({
  data,
  onEdit,
  onAdd,
  onToggleStatus,
  onResetPassword,
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  
  // State Filter Lengkap
  const [deptFilter, setDeptFilter] = useState('');
  const [subDeptFilter, setSubDeptFilter] = useState('');
  const [posFilter, setPosFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});

  // Ref untuk mendeteksi klik/touch di luar container filter
  const filterWrapperRef = useRef<HTMLDivElement>(null);

  // Auto-close filter popover
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

  // Opsi unik secara dinamis dari data
  const uniqueDepartemen = useMemo(() => Array.from(new Set(data.map((item) => item.departemen))), [data]);
  const uniqueSubDepartemen = useMemo(() => Array.from(new Set(data.map((item) => item.sub_departemen))), [data]);
  const uniquePos = useMemo(() => Array.from(new Set(data.map((item) => item.pos))), [data]);
  const uniqueGrade = useMemo(() => Array.from(new Set(data.map((item) => item.grade))), [data]);

  // Filter Berdasarkan Semua Kriteria
  const filteredData = useMemo(() => {
    let result = data;
    if (deptFilter) result = result.filter((item) => item.departemen === deptFilter);
    if (subDeptFilter) result = result.filter((item) => item.sub_departemen === subDeptFilter);
    if (posFilter) result = result.filter((item) => item.pos === posFilter);
    if (gradeFilter) result = result.filter((item) => item.grade === gradeFilter);
    if (statusFilter) result = result.filter((item) => item.status === statusFilter);
    return result;
  }, [data, deptFilter, subDeptFilter, posFilter, gradeFilter, statusFilter]);

  const isFiltered = Boolean(deptFilter || subDeptFilter || posFilter || gradeFilter || statusFilter);

  const columns = useMemo<ColumnDef<DataKaryawan>[]>(
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
        accessorKey: 'departemen',
        header: 'Departemen',
        cell: (info) => <span className="font-semibold text-gray-800 dark:text-gray-100">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'sub_departemen',
        header: 'Sub Departemen',
        cell: (info) => <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'pos',
        header: 'POS',
        cell: (info) => <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'grade',
        header: 'Grade',
        cell: (info) => <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'id_absen',
        header: 'ID Absen / Username',
        cell: (info) => (
          <span className="font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-xs">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'nik',
        header: 'NIK',
        cell: (info) => <span className="font-mono text-gray-700 dark:text-gray-300 text-xs">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'nama',
        header: 'Nama',
        cell: (info) => <span className="font-bold text-gray-900 dark:text-gray-100">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'skema_hari_kerja',
        header: 'Skema Hari Kerja',
        cell: (info) => <span className="text-gray-700 dark:text-gray-300 font-mono text-xs">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'tanggal_bergabung',
        header: 'Tanggal Bergabung',
        cell: (info) => <span className="text-gray-700 dark:text-gray-300 text-xs">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'tanggal_lahir',
        header: 'Tanggal Lahir',
        cell: (info) => <span className="text-gray-700 dark:text-gray-300 text-xs">{String(info.getValue())}</span>,
      },
      {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => {
          const item = row.original;
          const isAktif = item.status === 'Aktif';
          return (
            <div className="flex items-center justify-center gap-1.5">
              <EditActionButton onClick={() => onEdit(item)} />
              <button
                type="button"
                onClick={() => onToggleStatus(item.id)}
                className={`p-1.5 rounded-md transition-colors ${
                  isAktif
                    ? 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60'
                    : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                }`}
                title={isAktif ? 'Disable Karyawan' : 'Enable Karyawan'}
              >
                <Power className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onResetPassword(item.id)}
                className="p-1.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-md transition-colors"
                title="Reset Password"
              >
                <KeyRound className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        },
      },
    ],
    [onEdit, onToggleStatus, onResetPassword]
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
        className="w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm mb-16 md:mb-0 flex flex-col"
      >
        
        {/* HEADER TOOLBAR */}
        <div className="w-full">
          <TableToolbar
            title="Data Karyawan"
            subtitle="Daftar manajemen data karyawan LokaHR"
            icon={<Users className="w-6 h-6" />}
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
                  setDeptFilter(''); setSubDeptFilter(''); setPosFilter(''); setGradeFilter(''); setStatusFilter('');
                }}
                fields={[
                  { 
                    key: 'departemen', 
                    label: 'Departemen', 
                    render: () => (
                      <FormSelectSearch
                        value={deptFilter}
                        onChange={setDeptFilter}
                        placeholder="Semua Departemen"
                        options={[{ id: '', label: 'Semua Departemen' }, ...uniqueDepartemen.map(d => ({ id: d, label: d }))]}
                      />
                    ) 
                  },
                  { 
                    key: 'sub_departemen', 
                    label: 'Sub Departemen', 
                    render: () => (
                      <FormSelectSearch
                        value={subDeptFilter}
                        onChange={setSubDeptFilter}
                        placeholder="Semua Sub Departemen"
                        options={[{ id: '', label: 'Semua Sub Departemen' }, ...uniqueSubDepartemen.map(sd => ({ id: sd, label: sd }))]}
                      />
                    ) 
                  },
                  { 
                    key: 'pos', 
                    label: 'POS', 
                    render: () => (
                      <FormSelectSearch
                        value={posFilter}
                        onChange={setPosFilter}
                        placeholder="Semua POS"
                        options={[{ id: '', label: 'Semua POS' }, ...uniquePos.map(p => ({ id: p, label: p }))]}
                      />
                    ) 
                  },
                  { 
                    key: 'grade', 
                    label: 'Grade', 
                    render: () => (
                      <FormSelectSearch
                        value={gradeFilter}
                        onChange={setGradeFilter}
                        placeholder="Semua Grade"
                        options={[{ id: '', label: 'Semua Grade' }, ...uniqueGrade.map(g => ({ id: g, label: g }))]}
                      />
                    ) 
                  },
                  { 
                    key: 'status', 
                    label: 'Status', 
                    render: () => (
                      <FormSelectSearch
                        value={statusFilter}
                        onChange={setStatusFilter}
                        placeholder="Semua Status"
                        options={[
                          { id: '', label: 'Semua Status' },
                          { id: 'Aktif', label: 'Aktif' },
                          { id: 'Non Aktif', label: 'Non Aktif' }
                        ]}
                      />
                    ) 
                  },
                ]}
              />
            }
            actionButtons={<AddButton onClick={onAdd} />}
          />
        </div>

        {/* PAGINATION */}
        <div className="px-5 py-2 bg-gray-50/50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 w-full">
          <DataPagination table={table} />
        </div>

        {/* TAMPILAN DESKTOP */}
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

          <Table className="w-full min-w-[1200px]">
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
                    Tidak ada data karyawan ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* TAMPILAN MOBILE */}
        <div className="block md:hidden p-4 space-y-3 bg-gray-50/50 dark:bg-gray-950/50 rounded-b-2xl">
          {rows.length > 0 ? (
            rows.map((row) => {
              const item = row.original;
              const isAktif = item.status === 'Aktif';
              return (
                <div key={row.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                      ID Absen: {item.id_absen}
                    </span>
                    <Badge 
                      variant={isAktif ? 'outline' : 'destructive'} 
                      className={
                        isAktif 
                          ? 'rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 font-semibold px-3 py-0.5' 
                          : 'rounded-full px-3 py-0.5'
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.nama}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">NIK: {item.nik}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 block uppercase">Departemen</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{item.departemen}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 block uppercase">POS</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{item.pos}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-2">
                    <EditActionButton onClick={() => onEdit(item)} />
                    <button
                      type="button"
                      onClick={() => onToggleStatus(item.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                        isAktif ? 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60' : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{isAktif ? 'Disable' : 'Enable'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onResetPassword(item.id)}
                      className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-xs">
              Tidak ada data karyawan ditemukan.
            </div>
          )}
        </div>
      </div>

      {/* FLOATING ACTION BUTTON MOBILE */}
      <MobileAddFab onClick={onAdd} title="Tambah Karyawan" />
    </div>
  );
};