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
import { Users, Download, Upload, FileSpreadsheet } from 'lucide-react';

// Reusable UI Components
import { TableToolbar } from '../../../../components/ui/TableToolbar';
import {
  AddButton,
  EditActionButton,
  MobileAddFab,
  ResetPasswordButton,
  PowerActionButton,
  SettingDropdownTrigger,
} from '../../../../components/ui/ActionButtons';
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
  onBulkResetPassword: (selectedIds: string[]) => void;
  onDownloadSample?: () => void;
  onImportData?: () => void;
  onExportData?: () => void;
}

export const DataKaryawanTable: React.FC<DataKaryawanTableProps> = ({
  data,
  onEdit,
  onAdd,
  onToggleStatus,
  onBulkResetPassword,
  onDownloadSample,
  onImportData,
  onExportData,
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  
  // State Multiple Selection (Checkbox)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // State Dropdown Setting
  const [showSettingDropdown, setShowSettingDropdown] = useState(false);
  const settingDropdownRef = useRef<HTMLDivElement>(null);

  // State Filter
  const [deptFilter, setDeptFilter] = useState('');
  const [subDeptFilter, setSubDeptFilter] = useState('');
  const [posFilter, setPosFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [skemaHariKerjaFilter, setSkemaHariKerjaFilter] = useState(''); // 🌟 State Filter Skema Hari Kerja
  
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});

  const filterWrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown setting ketika klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingDropdownRef.current && !settingDropdownRef.current.contains(event.target as Node)) {
        setShowSettingDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Opsi unik dinamis
  const uniqueDepartemen = useMemo(() => Array.from(new Set(data.map((item) => item.departemen))), [data]);
  const uniqueSubDepartemen = useMemo(() => Array.from(new Set(data.map((item) => item.sub_departemen))), [data]);
  const uniquePos = useMemo(() => Array.from(new Set(data.map((item) => item.pos))), [data]);
  const uniqueGrade = useMemo(() => Array.from(new Set(data.map((item) => item.grade))), [data]);
  const uniqueSkemaHariKerja = useMemo(
    () => Array.from(new Set(data.map((item) => item.skema_hari_kerja).filter(Boolean))),
    [data]
  ); // 🌟 Opsi Unik Skema Hari Kerja

  // Filter Berdasarkan Semua Kriteria
  const filteredData = useMemo(() => {
    let result = data;
    if (deptFilter) result = result.filter((item) => item.departemen === deptFilter);
    if (subDeptFilter) result = result.filter((item) => item.sub_departemen === subDeptFilter);
    if (posFilter) result = result.filter((item) => item.pos === posFilter);
    if (gradeFilter) result = result.filter((item) => item.grade === gradeFilter);
    if (statusFilter) result = result.filter((item) => item.status === statusFilter);
    if (skemaHariKerjaFilter) result = result.filter((item) => item.skema_hari_kerja === skemaHariKerjaFilter); // 🌟 Logika Filter
    return result;
  }, [data, deptFilter, subDeptFilter, posFilter, gradeFilter, statusFilter, skemaHariKerjaFilter]);

  const isFiltered = Boolean(
    deptFilter || subDeptFilter || posFilter || gradeFilter || statusFilter || skemaHariKerjaFilter
  );

  // Logika Checkbox Select All & Individual
  const isAllSelected = useMemo(() => {
    if (filteredData.length === 0) return false;
    return filteredData.every((item) => selectedIds.includes(item.id));
  }, [filteredData, selectedIds]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredData.map((item) => item.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const columns = useMemo<ColumnDef<DataKaryawan>[]>(
    () => [
      {
        id: 'select',
        header: () => (
          <div className="flex justify-center items-center">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center items-center">
            <input
              type="checkbox"
              checked={selectedIds.includes(row.original.id)}
              onChange={(e) => handleSelectRow(row.original.id, e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'STATUS',
        cell: (info) => {
          const val = String(info.getValue());
          const isAktif = val === 'Aktif';
          return (
            <div className="flex justify-center">
              <Badge 
                variant={isAktif ? 'outline' : 'destructive'} 
                className={
                  isAktif 
                    ? 'rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 font-semibold px-2.5 py-0.5 text-[11px]' 
                    : 'rounded-full px-2.5 py-0.5 text-[11px]'
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
        header: 'DEPARTEMEN',
        cell: (info) => <span className="font-semibold text-gray-800 dark:text-gray-100">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'sub_departemen',
        header: () => <span className="block leading-tight">SUB<br/>DEPARTEMEN</span>,
        cell: (info) => <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'pos',
        header: 'POS',
        cell: (info) => <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'grade',
        header: 'GRADE',
        cell: (info) => <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'id_absen',
        header: () => <span className="block leading-tight">ID ABSEN /<br/>USERNAME</span>,
        cell: (info) => (
          <span className="font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-[11px]">
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
        header: 'NAMA',
        cell: (info) => <span className="font-bold text-gray-900 dark:text-gray-100">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'skema_hari_kerja',
        header: () => <span className="block leading-tight">SKEMA HARI<br/>KERJA</span>,
        cell: (info) => <span className="text-gray-700 dark:text-gray-300 font-mono text-xs">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'tanggal_bergabung',
        header: () => <span className="block leading-tight">TANGGAL<br/>BERGABUNG</span>,
        cell: (info) => <span className="text-gray-700 dark:text-gray-300 text-xs whitespace-nowrap">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'tanggal_lahir',
        header: () => <span className="block leading-tight">TANGGAL<br/>LAHIR</span>,
        cell: (info) => <span className="text-gray-700 dark:text-gray-300 text-xs whitespace-nowrap">{String(info.getValue())}</span>,
      },
      {
        id: 'action',
        header: 'ACTION',
        cell: ({ row }) => {
          const item = row.original;
          const isAktif = item.status === 'Aktif';
          return (
            <div className="flex items-center justify-center gap-1">
              <EditActionButton onClick={() => onEdit(item)} />
              <PowerActionButton
                isAktif={isAktif}
                onClick={() => onToggleStatus(item.id)}
              />
            </div>
          );
        },
      },
    ],
    [onEdit, onToggleStatus, selectedIds, isAllSelected, filteredData]
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
                  setDeptFilter('');
                  setSubDeptFilter('');
                  setPosFilter('');
                  setGradeFilter('');
                  setStatusFilter('');
                  setSkemaHariKerjaFilter(''); // 🌟 Reset filter skema
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
                    key: 'skema_hari_kerja', 
                    label: 'Skema Hari Kerja', 
                    render: () => (
                      <FormSelectSearch
                        value={skemaHariKerjaFilter}
                        onChange={setSkemaHariKerjaFilter}
                        placeholder="Semua Skema"
                        options={[
                          { id: '', label: 'Semua Skema' },
                          ...uniqueSkemaHariKerja.map(s => ({ id: s, label: s }))
                        ]}
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
            actionButtons={
              <div className="flex items-center gap-2">
                {/* 1. Tombol Tambah */}
                <AddButton onClick={onAdd} />

                {/* 2. Tombol Reset Password Kolektif Reusable */}
                <ResetPasswordButton
                  selectedCount={selectedIds.length}
                  onClick={() => onBulkResetPassword(selectedIds)}
                />

                {/* 3. Dropdown Setting Reusable Trigger */}
                <div className="relative inline-block text-left" ref={settingDropdownRef}>
                  <SettingDropdownTrigger
                    onClick={() => setShowSettingDropdown(!showSettingDropdown)}
                  />

                  {showSettingDropdown && (
                    <div className="absolute right-0 top-full mt-1.5 z-50 w-48 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl py-1">
                      <button
                        type="button"
                        onClick={() => {
                          onDownloadSample?.();
                          setShowSettingDropdown(false);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-2.5 transition-colors"
                      >
                        <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Download Sample</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onExportData?.();
                          setShowSettingDropdown(false);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-2.5 transition-colors"
                      >
                        <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Export Data</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onImportData?.();
                          setShowSettingDropdown(false);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-2.5 transition-colors"
                      >
                        <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Import Data</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            }
          />
        </div>

        {/* PAGINATION */}
        <div className="px-5 py-2 bg-gray-50/50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 w-full">
          <DataPagination table={table} />
        </div>

        {/* TAMPILAN DESKTOP (NO HORIZONTAL SCROLL) */}
        <div className="hidden md:block w-full rounded-b-2xl overflow-hidden">
          <Table className="w-full table-fixed text-[11px]">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead 
                      key={header.id} 
                      className="px-2 py-2.5 text-center align-middle font-bold text-gray-700 dark:text-gray-300 text-[10px] tracking-tight uppercase whitespace-normal break-words"
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
                      <TableCell key={cell.id} className="px-2 py-2 text-center align-middle whitespace-normal break-words">
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
              const isSelected = selectedIds.includes(item.id);
              return (
                <div key={row.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectRow(item.id, e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                        ID Absen: {item.id_absen}
                      </span>
                    </div>
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
                    <PowerActionButton
                      isAktif={isAktif}
                      onClick={() => onToggleStatus(item.id)}
                    />
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

      <MobileAddFab onClick={onAdd} title="Tambah Karyawan" />
    </div>
  );
};