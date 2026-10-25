import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
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
  onEdit: (item: Employee) => void;
  onAdd: () => void;
  onToggleStatus: (ids: (string | number)[]) => void;
  onBulkResetPassword: (selectedIds: (string | number)[]) => void;
  onDownloadSample?: () => void;
  onImportData?: () => void;
  onExportData?: () => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  data,
  onEdit,
  onAdd,
  onToggleStatus,
  onBulkResetPassword,
  onImportData,
  onExportData,
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  // State Confirmation Dialog
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);

  // State Filter
  const [deptFilter, setDeptFilter] = useState('');
  const [subDeptFilter, setSubDeptFilter] = useState('');
  const [posFilter, setPosFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [skemaHariKerjaFilter, setSkemaHariKerjaFilter] = useState('');
  
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // 🔹 Nonaktifkan kolom Skema Hari Kerja, Tanggal Bergabung, Tanggal Lahir, dan No. Telp secara default
 // Gunakan tipe Record<string, boolean> agar fleksibel
  // 🔹 Set false agar default-nya nonaktif (tidak dicentang) di menu Kolom
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

  const filteredData = useMemo(() => {
    let result = data;
    if (deptFilter) result = result.filter((item) => String(item.department_id || item.department?.name || (item as any).departemen) === deptFilter);
    if (subDeptFilter) result = result.filter((item) => String(item.sub_department_id || item.sub_department?.name || (item as any).sub_departemen) === subDeptFilter);
    if (posFilter) result = result.filter((item) => String(item.position_id || item.position?.title || item.position?.name || (item as any).pos) === posFilter);
    if (gradeFilter) result = result.filter((item) => String(item.grade_id || item.grade?.name) === gradeFilter);
    if (statusFilter) {
      const isAktifFilter = statusFilter === 'true';
      result = result.filter((item) => Boolean(item.is_active ?? ((item as any).status === 'Aktif')) === isAktifFilter);
    }
    return result;
  }, [data, deptFilter, subDeptFilter, posFilter, gradeFilter, statusFilter, skemaHariKerjaFilter]);

  const isFiltered = Boolean(
    deptFilter || subDeptFilter || posFilter || gradeFilter || statusFilter || skemaHariKerjaFilter
  );

  const isAllSelected = useMemo(() => {
    if (filteredData.length === 0) return false;
    return filteredData.every((item) => item.id && selectedIds.includes(item.id));
  }, [filteredData, selectedIds]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredData.map((item) => item.id!).filter(Boolean);
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

  const handleTriggerResetPassword = () => {
    if (selectedIds.length === 0) {
      toast.error('Pilih setidaknya satu karyawan terlebih dahulu.');
      return;
    }
    setShowResetConfirm(true);
  };

  const handleTriggerToggleStatus = () => {
    if (selectedIds.length === 0) {
      toast.error('Pilih setidaknya satu karyawan terlebih dahulu.');
      return;
    }
    setShowStatusConfirm(true);
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
        accessorKey: 'id_absen',
        id: 'ID Absen',
        header: () => <span className="block leading-tight text-center text-xs">ID Absen /<br/>Username</span>,
        size: 90,
        cell: ({ row }) => {
          const item = row.original;
          const val = (item as any).id_absen || item.nik || item.nip || '-';
          return (
            <div className="flex justify-center">
              <span className="font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-[11px]">
                {String(val)}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: 'nik',
        id: 'NIK / NIP',
        header: 'NIK / NIP',
        size: 85,
        cell: ({ row }) => {
          const item = row.original;
          const val = item.nik || item.nip || '-';
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
        header: () => <span className="block leading-tight text-center text-xs">No.<br/>Telepon</span>,
        size: 110,
        cell: ({ row }) => {
          const item = row.original;
          const val = item.phone || (item as any).nomor_telephone || '-';
          return <span className="text-gray-700 dark:text-gray-300 text-xs whitespace-nowrap">{String(val)}</span>;
        },
      },
      {
        accessorKey: 'work_schedule_scheme',
        id: 'Skema Hari Kerja',
        header: () => <span className="block leading-tight text-center text-xs">Skema Hari<br/>Kerja</span>,
        size: 100,
        cell: ({ row }) => {
          const item = row.original;
          const val = item.work_schedule_scheme?.name || (item as any).skema_hari_kerja || '-';
          return <span className="text-gray-700 dark:text-gray-300 font-mono text-xs whitespace-nowrap text-center block">{String(val)}</span>;
        },
      },
      {
        accessorKey: 'join_date',
        id: 'Tanggal Bergabung',
        header: () => <span className="block leading-tight text-center text-xs">Tanggal<br/>Bergabung</span>,
        size: 95,
        cell: ({ row }) => {
          const item = row.original;
          const rawVal = item.join_date || (item as any).tanggal_bergabung || '-';
          const formattedVal = rawVal && rawVal !== '-' ? String(rawVal).split('T')[0] : '-';
          return <span className="text-gray-700 dark:text-gray-300 text-xs whitespace-nowrap text-center block">{formattedVal}</span>;
        },
      },
      {
        accessorKey: 'birth_date',
        id: 'Tanggal Lahir',
        header: () => <span className="block leading-tight text-center text-xs">Tanggal<br/>Lahir</span>,
        size: 95,
        cell: ({ row }) => {
          const item = row.original;
          const rawVal = item.birth_date || (item as any).tanggal_lahir || '-';
          const formattedVal = rawVal && rawVal !== '-' ? String(rawVal).split('T')[0] : '-';
          return <span className="text-gray-700 dark:text-gray-300 text-xs whitespace-nowrap text-center block">{formattedVal}</span>;
        },
      },
      {
        accessorKey: 'is_active',
        id: 'Status',
        header: 'Status',
        size: 85,
        cell: (info) => {
          const isAktif = Boolean(info.getValue() ?? ((info.row.original as any).status === 'Aktif'));
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
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex items-center justify-center">
              <EditActionButton onClick={() => onEdit(item)} />
            </div>
          );
        },
      },
    ],
    [onEdit, selectedIds, isAllSelected, filteredData]
  );

const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      globalFilter,
      columnVisibility,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility as any, // 👈 Casting ke any untuk mem-bypass perbedaan tipe updater TanStack
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const rows = table.getRowModel().rows;

  return (
    <div className="grid grid-cols-1 w-full relative">
      <div 
        ref={filterWrapperRef}
        className="w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm mb-16 md:mb-0 flex flex-col overflow-hidden"
      >
        <div className="w-full">
          <TableToolbar
            title="Data Karyawan"
            subtitle="Daftar manajemen data karyawan LokaHR"
            icon={<Users className="w-6 h-6" />}
            searchValue={globalFilter ?? ''}
            onSearchChange={setGlobalFilter}
            showFilterDropdown={showFilterDropdown}
            onToggleFilterDropdown={() => setShowFilterDropdown(!showFilterDropdown)}
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
                  setSkemaHariKerjaFilter('');
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
                        options={[
                          { id: '', label: 'Semua Departemen' },
                          { id: '1', label: 'IT' },
                          { id: '2', label: 'HRD' },
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
                        onChange={setSubDeptFilter}
                        placeholder="Semua Sub Departemen"
                        options={[
                          { id: '', label: 'Semua Sub Departemen' },
                          { id: '1', label: 'Aplikasi & System' },
                          { id: '2', label: 'Infrastructure' },
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
                        onChange={setPosFilter}
                        placeholder="Semua POS"
                        options={[
                          { id: '', label: 'Semua POS' },
                          { id: '1', label: 'Programmer Officer' },
                          { id: '2', label: 'System Analyst' },
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
                      key: 'export',
                      label: 'Export Data',
                      icon: <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
                      variant: 'emerald',
                      onClick: () => onExportData?.(),
                    },
                    {
                      key: 'import',
                      label: 'Import Data',
                      icon: <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
                      variant: 'emerald',
                      onClick: () => onImportData?.(),
                    },
                    {
                      key: 'reset-password',
                      label: 'Reset Password',
                      icon: <KeyRound className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
                      variant: 'blue',
                      dividerTop: true,
                      onClick: handleTriggerResetPassword,
                    },
                    {
                      key: 'status',
                      label: 'Status',
                      icon: <ToggleLeft className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
                      variant: 'amber',
                      onClick: handleTriggerToggleStatus,
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

        {/* Tabel Desktop */}
        <DataTable
          table={table}
          columnsLength={columns.length}
          emptyMessage="Tidak ada data karyawan ditemukan."
        />

        {/* TAMPILAN MOBILE */}
        <div className="block md:hidden p-4 space-y-3 bg-gray-50/50 dark:bg-gray-950/50 rounded-b-2xl">
          {rows.length > 0 ? (
            rows.map((row) => {
              const item = row.original;
              const isAktif = Boolean(item.is_active ?? ((item as any).status === 'Aktif'));
              const isSelected = item.id ? selectedIds.includes(item.id) : false;
              return (
                <div key={row.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => item.id && handleSelectRow(item.id, e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                        NIK: {item.nik || item.nip}
                      </span>
                    </div>
                    <Badge 
                      variant={isAktif ? 'outline' : 'destructive'} 
                      className={
                        isAktif 
                          ? 'rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 font-semibold px-3 py-0.5' 
                          : 'rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 font-semibold px-3 py-0.5'
                      }
                    >
                      {isAktif ? 'Aktif' : 'Non Aktif'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.full_name || item.name}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end">
                    <EditActionButton onClick={() => onEdit(item)} />
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

      {/* Alert SweetAlert2 Konfirmasi Reset Password */}
      <ConfirmAlertDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={() => {
          onBulkResetPassword(selectedIds);
          setSelectedIds([]);
          setShowResetConfirm(false);
        }}
        title="Reset Password Karyawan?"
        description={`Apakah Anda yakin ingin mereset password untuk ${selectedIds.length} karyawan yang dipilih?`}
        confirmText="Ya, Reset"
        cancelText="Batal"
        variant="primary"
      />

      {/* Alert SweetAlert2 Konfirmasi Ubah Status */}
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