import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
} from '@tanstack/react-table';
import type { Employee } from '../types/employee.type';
import { DataPagination } from '../../../../components/DataPagination';
import { Users, Download, Upload, KeyRound, ToggleLeft } from 'lucide-react';
import toast from 'react-hot-toast';

// Reusable UI Components
import { TableToolbar } from '../../../../components/ui/TableToolbar';
import {
  AddButton,
  EditActionButton,
  MobileAddFab,
} from '../../../../components/ui/ActionButtons';
import { DataTable } from '../../../../components/ui/data-table';
import { TableFilterPopover } from '../../../../components/ui/TableFilterPopover';
import { FormSelectSearch } from '../../../../components/ui/FormSelectSearch';
import { ConfirmAlertDialog } from '../../../../components/ui/ConfirmAlertDialog';
import { Badge } from '../../../../components/ui/badge';
import { SettingDropdown } from '../../../../components/ui/SettingDropdown';

interface EmployeeTableProps {
  data: Employee[];
  meta?: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from?: number | null;
    to?: number | null;
  };
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  onEdit: (item: Employee) => void;
  onAdd: () => void;
  onToggleStatus: (ids: (string | number)[]) => void;
  onBulkResetPassword: (selectedIds: (string | number)[]) => void;
  onDownloadSample?: () => void;
  onImportData?: () => void;
  onExportData?: (selectedIds?: (string | number)[]) => void; // 👈 Menerima parameter selectedIds
  
  // Props Master Data untuk Filter
  departemenList?: any[];
  subDepartemenList?: any[];
  posList?: any[];
  gradeList?: any[];

  searchQuery: string;
  onSearchChange: (val: string) => void;
  deptFilter: string;
  onDeptFilterChange: (val: string) => void;
  subDeptFilter: string;
  onSubDeptFilterChange: (val: string) => void;
  posFilter: string;
  onPosFilterChange: (val: string) => void;
  gradeFilter: string;
  onGradeFilterChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  data,
  meta = { current_page: 1, last_page: 1, total: 0, per_page: 10, from: null, to: null },
  setPage,
  setPageSize,
  onEdit,
  onAdd,
  onToggleStatus,
  onBulkResetPassword,
  onImportData,
  onExportData,
  departemenList = [],
  subDepartemenList = [],
  posList = [],
  gradeList = [],
  searchQuery,
  onSearchChange,
  deptFilter,
  onDeptFilterChange,
  subDeptFilter,
  onSubDeptFilterChange,
  posFilter,
  onPosFilterChange,
  gradeFilter,
  onGradeFilterChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    'No. Telepon': false,
    'Skema Hari Kerja': false,
    'Tanggal Bergabung': false,
    'Tanggal Lahir': false,
  });

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

  const isFiltered = Boolean(
    deptFilter || subDeptFilter || posFilter || gradeFilter || statusFilter
  );

  const isAllSelected = useMemo(() => {
    if (data.length === 0) return false;
    return data.every((item) => item.id && selectedIds.includes(item.id));
  }, [data, selectedIds]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = data.map((item) => item.id!).filter(Boolean);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string | number, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        id: 'select',
        size: 40,
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
              checked={selectedIds.includes(row.original.id!)}
              onChange={(e) => handleSelectRow(row.original.id!, e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>
        ),
      },
      {
        accessorKey: 'department',
        id: 'Departemen',
        header: 'Departemen',
        size: 90,
        cell: ({ row }) => {
          const item = row.original;
          const val = item.department?.name || (item as any).departemen || '-';
          return <span className="font-semibold text-gray-800 dark:text-gray-100 text-xs truncate block">{val}</span>;
        },
      },
      {
        accessorKey: 'sub_department',
        id: 'Sub Departemen',
        header: () => <span className="block leading-tight text-center text-xs">Sub<br/>Departemen</span>,
        size: 130,
        cell: ({ row }) => {
          const item = row.original;
          const val = item.sub_department?.name || (item as any).sub_departemen || '-';
          return <span className="text-gray-700 dark:text-gray-300 text-xs truncate block">{val}</span>;
        },
      },
      {
        accessorKey: 'position',
        id: 'POS',
        header: 'POS',
        size: 130,
        cell: ({ row }) => {
          const item = row.original;
          const val = item.position?.title || item.position?.name || (item as any).pos || '-';
          return <span className="text-gray-700 dark:text-gray-300 text-xs truncate block">{val}</span>;
        },
      },
      {
        accessorKey: 'grade',
        id: 'Grade',
        header: 'Grade',
        size: 100,
        cell: ({ row }) => {
          const item = row.original;
          const val = item.grade?.name || (item as any).grade || '-';
          return <span className="text-gray-700 dark:text-gray-300 text-xs truncate block">{val}</span>;
        },
      },
      {
        accessorKey: 'nip',
        id: 'NIP',
        header: 'NIP',
        size: 85,
        cell: ({ row }) => {
          const item = row.original;
          const val = item.nip || '-';
          return <span className="font-mono text-gray-700 dark:text-gray-300 text-xs whitespace-nowrap">{String(val)}</span>;
        },
      },
      {
        accessorKey: 'name',
        id: 'Nama',
        header: 'Nama',
        size: 130,
        cell: ({ row }) => {
          const item = row.original;
          const val = item.full_name || item.name || (item as any).nama || '-';
          return <span className="font-bold text-gray-900 dark:text-gray-100 text-xs truncate block">{String(val)}</span>;
        },
      },
      {
        accessorKey: 'phone',
        id: 'No. Telepon',
        header: 'No. Telepon',
        size: 110,
        cell: ({ row }) => <span className="text-gray-700 dark:text-gray-300 text-xs">{String(row.original.phone || '-')}</span>,
      },
      {
        accessorKey: 'birth_date',
        id: 'Tanggal Lahir',
        header: () => <span className="block leading-tight text-center text-xs">Tanggal<br/>Lahir</span>,
        size: 95,
        cell: ({ row }) => <span className="text-gray-700 dark:text-gray-300 text-xs text-center block">{row.original.birth_date || '-'}</span>,
      },
      {
        accessorKey: 'age_years',
        id: 'Umur',
        header: () => <span className="block leading-tight text-center text-xs">Umur<br/>(Thn)</span>,
        size: 75,
        cell: ({ row }) => <span className="text-gray-700 dark:text-gray-300 text-xs text-center block font-mono">{row.original.age_years ?? '-'}</span>,
      },
      {
        accessorKey: 'work_duration_months',
        id: 'Lama Bekerja',
        header: () => <span className="block leading-tight text-center text-xs">Lama Kerja<br/>(Bln)</span>,
        size: 85,
        cell: ({ row }) => <span className="text-gray-700 dark:text-gray-300 text-xs text-center block font-mono">{row.original.work_duration_months ?? '-'}</span>,
      },
      {
        accessorKey: 'is_active',
        id: 'Status',
        header: 'Status',
        size: 85,
        cell: (info) => {
          const isAktif = Boolean(info.getValue());
          return (
            <div className="flex justify-center">
              <Badge 
                variant={isAktif ? 'outline' : 'destructive'} 
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
        size: 65,
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <EditActionButton onClick={() => onEdit(row.original)} />
          </div>
        ),
      },
    ],
    [onEdit, selectedIds, isAllSelected, data]
  );

  const table = useReactTable({
    data: data,
    columns,
    pageCount: meta.last_page,
    manualPagination: true,
    state: {
      globalFilter: searchQuery,
      pagination: {
        pageIndex: (meta.current_page ?? 1) - 1,
        pageSize: meta.per_page ?? 10,
      },
      columnVisibility,
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({
          pageIndex: (meta.current_page ?? 1) - 1,
          pageSize: meta.per_page ?? 10,
        });
        setPage(newState.pageIndex + 1);
        setPageSize(newState.pageSize);
      }
    },
    onGlobalFilterChange: (val) => onSearchChange(typeof val === 'function' ? val(searchQuery) : val),
    onColumnVisibilityChange: setColumnVisibility as any,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="grid grid-cols-1 w-full relative">
      <div 
        ref={filterWrapperRef}
        className="w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm mb-16 md:mb-0 flex flex-col overflow-visible"
      >
        <div className="w-full">
          <TableToolbar
            title="Data Karyawan"
            subtitle="Daftar manajemen data karyawan LokaHR"
            icon={<Users className="w-6 h-6" />}
            searchValue={searchQuery ?? ''}
            onSearchChange={onSearchChange}
            showFilterDropdown={showFilterDropdown}
            onToggleFilterDropdown={() => setShowFilterDropdown(!showFilterDropdown)}
            isFiltered={isFiltered}
            filterDropdownContent={
              <TableFilterPopover
                isOpen={showFilterDropdown}
                onClose={() => setShowFilterDropdown(false)}
                isFiltered={isFiltered}
                onReset={() => {
                  onDeptFilterChange('');
                  onSubDeptFilterChange('');
                  onPosFilterChange('');
                  onGradeFilterChange('');
                  onStatusFilterChange('');
                }}
                fields={[
                  { 
                    key: 'departemen', 
                    label: 'Departemen', 
                    render: () => (
                      <FormSelectSearch
                        value={deptFilter}
                        onChange={(val) => {
                          onDeptFilterChange(val);
                          onSubDeptFilterChange('');
                        }}
                        placeholder="Semua Departemen"
                        options={[
                          { id: '', label: 'Semua Departemen' },
                          ...departemenList.filter(d => d.is_active).map(d => ({
                            id: String(d.id),
                            label: d.name || d.departemen
                          }))
                        ]}
                      />
                    ) 
                  },
                  { 
                    key: 'sub_departemen', 
                    label: 'Sub Departemen', 
                    render: () => (
                      <FormSelectSearch
                        value={subDeptFilter}
                        onChange={onSubDeptFilterChange}
                        placeholder="Semua Sub Departemen"
                        options={[
                          { id: '', label: 'Semua Sub Departemen' },
                          ...subDepartemenList
                            .filter(sub => sub.is_active && (!deptFilter || String(sub.department_id || sub.department_code) === String(deptFilter)))
                            .map(sub => ({
                              id: String(sub.id),
                              label: sub.name || sub.sub_departemen
                            }))
                        ]}
                      />
                    ) 
                  },
                  { 
                    key: 'pos', 
                    label: 'POS', 
                    render: () => (
                      <FormSelectSearch
                        value={posFilter}
                        onChange={onPosFilterChange}
                        placeholder="Semua POS"
                        options={[
                          { id: '', label: 'Semua POS' },
                          ...posList.filter(p => p.is_active).map(p => ({
                            id: String(p.id),
                            label: p.title || p.name
                          }))
                        ]}
                      />
                    ) 
                  },
                  { 
                    key: 'grade', 
                    label: 'Grade', 
                    render: () => (
                      <FormSelectSearch
                        value={gradeFilter}
                        onChange={onGradeFilterChange}
                        placeholder="Semua Grade"
                        options={[
                          { id: '', label: 'Semua Grade' },
                          ...gradeList.filter(g => g.is_active).map(g => ({
                            id: String(g.id),
                            label: g.name || g.grade
                          }))
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
                        onChange={onStatusFilterChange}
                        placeholder="Semua Status"
                        showSearch={false}
                        options={[
                          { id: '', label: 'Semua Status' },
                          { id: 'true', label: 'Aktif' },
                          { id: 'false', label: 'Non Aktif' }
                        ]}
                      />
                    ) 
                  },
                ]}
              />
            }
            actionButtons={
              <div className="flex items-center gap-2">
                <AddButton onClick={onAdd} />
                <SettingDropdown
                  items={[
                    {
                      key: 'reset_password',
                      label: 'Reset Password',
                      icon: <KeyRound className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
                      variant: 'blue',
                      onClick: () => {
                        if (selectedIds.length === 0) {
                          toast.error('Pilih setidaknya satu karyawan terlebih dahulu.');
                          return;
                        }
                        setShowResetConfirm(true);
                      },
                    },
                    {
                      key: 'import',
                      label: 'Import Data',
                      icon: <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
                      variant: 'blue',
                      onClick: () => onImportData?.(),
                    },
                    {
                      key: 'export',
                      label: 'Export Data',
                      icon: <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
                      variant: 'emerald',
                      onClick: () => onExportData?.(selectedIds), // 👈 Kirim selectedIds ke handler export
                    },
                    {
                      key: 'status',
                      label: 'Status',
                      icon: <ToggleLeft className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
                      variant: 'amber',
                      dividerTop: true,
                      onClick: () => {
                        if (selectedIds.length === 0) {
                          toast.error('Pilih setidaknya satu karyawan terlebih dahulu.');
                          return;
                        }
                        setShowStatusConfirm(true);
                      },
                    },
                  ]}
                />
              </div>
            }
          />
        </div>

        <div className="px-5 py-2 bg-gray-50/50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 w-full">
          <DataPagination table={table} />
        </div>

        {/* TABEL VIEW (DESKTOP) */}
        <div className="hidden md:block">
          <DataTable
            table={table}
            columnsLength={columns.length}
            emptyMessage="Tidak ada data karyawan ditemukan."
          />
        </div>

        {/* CARDS VIEW (MOBILE) */}
        <div className="block md:hidden divide-y divide-gray-100 dark:divide-gray-800">
          {data.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500">
              Tidak ada data karyawan ditemukan.
            </div>
          ) : (
            data.map((item) => {
              const isSelected = item.id ? selectedIds.includes(item.id) : false;
              const deptName = item.department?.name || (item as any).departemen || '-';
              const subDeptName = item.sub_department?.name || (item as any).sub_departemen || '-';
              const posTitle = item.position?.title || item.position?.name || (item as any).pos || '-';
              const gradeName = item.grade?.name || (item as any).grade || '-';

              return (
                <div key={item.id} className="p-4 flex flex-col gap-3 bg-white dark:bg-gray-900">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => item.id && handleSelectRow(item.id, e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-gray-900 dark:text-gray-100">
                          {item.full_name || item.name || '-'}
                        </h4>
                        <span className="font-mono text-[11px] text-gray-500">
                          NIP: {item.nip || '-'}
                        </span>
                      </div>
                    </div>
                    <Badge 
                      variant={item.is_active ? 'outline' : 'destructive'}
                      className={
                        item.is_active 
                          ? 'rounded-full bg-emerald-50 text-emerald-600 border-emerald-200 px-2 py-0.5 text-[10px]' 
                          : 'rounded-full bg-rose-50 text-rose-600 border-rose-200 px-2 py-0.5 text-[10px]'
                      }
                    >
                      {item.is_active ? 'Aktif' : 'Non Aktif'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800/80">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-semibold">Departemen</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-200">{deptName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-semibold">Sub Departemen</span>
                      <span className="text-gray-700 dark:text-gray-300">{subDeptName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-semibold">POS</span>
                      <span className="text-gray-700 dark:text-gray-300">{posTitle}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-semibold">Grade</span>
                      <span className="text-gray-700 dark:text-gray-300">{gradeName}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-gray-500">
                      Umur: <strong className="font-mono">{item.age_years ?? '-'} thn</strong> | Kerja: <strong className="font-mono">{item.work_duration_months ?? '-'} bln</strong>
                    </span>
                    <EditActionButton onClick={() => onEdit(item)} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <MobileAddFab onClick={onAdd} title="Tambah Karyawan" />

      {/* Confirm Alert Dialog Reset Password */}
      <ConfirmAlertDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={() => {
          onBulkResetPassword(selectedIds);
          setSelectedIds([]);
          setShowResetConfirm(false);
        }}
        title="Reset Password Karyawan?"
        description={`Apakah Anda yakin ingin mereset password untuk ${selectedIds.length} karyawan yang dipilih? Password akan dikembalikan ke default (NIP).`}
        confirmText="Ya, Reset Password"
        cancelText="Batal"
        variant="warning"
      />

      {/* Confirm Alert Dialog Status */}
      <ConfirmAlertDialog
        isOpen={showStatusConfirm}
        onClose={() => setShowStatusConfirm(false)}
        onConfirm={() => {
          onToggleStatus(selectedIds);
          setSelectedIds([]);
          setShowStatusConfirm(false);
        }}
        title="Ubah Status Karyawan?"
        description={`Apakah Anda yakin ingin mengubah status aktif/non-aktif untuk ${selectedIds.length} karyawan yang dipilih?`}
        confirmText="Ya, Ubah"
        cancelText="Batal"
        variant="warning"
      />
    </div>
  );
};