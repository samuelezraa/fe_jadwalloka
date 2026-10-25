import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  type ColumnDef,
} from '@tanstack/react-table';
import type { Pos } from '../types/pos.type';
import type { Departemen } from '../../departemen/types/departemen.type';
import type { SubDepartemen } from '../../sub-departemen/types/sub-departemen.type';
import { DataPagination } from '../../../../components/DataPagination';
import { Building2 } from 'lucide-react';
import { FormSelectSearch } from '../../../../components/ui/FormSelectSearch';

// Reusable UI Components
import { TableToolbar } from '../../../../components/ui/TableToolbar';
import { AddButton, EditActionButton, MobileAddFab } from '../../../../components/ui/ActionButtons';
import { DataTable } from '../../../../components/ui/data-table';
import { TableFilterPopover } from '../../../../components/ui/TableFilterPopover';

interface PosTableProps {
  data: Pos[];
  departemenList?: Departemen[];
  subDepartemenList?: SubDepartemen[];
  onEdit: (item: Pos) => void;
  onAdd: () => void;
}

export const PosTable: React.FC<PosTableProps> = ({
  data = [],
  departemenList = [],
  subDepartemenList = [],
  onEdit,
  onAdd,
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  
  // State Filter
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('');
  const [selectedSubDeptFilter, setSelectedSubDeptFilter] = useState<string>('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('');
  
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});

  // Helper untuk mendapatkan nama Departemen
const getDepartmentName = (param?: Pos | string | null) => {
  if (!param) return '-';
  const deptCode = typeof param === 'string' 
    ? param 
    : param.department_code || (param as any).departemen_id || (param as any).department_id;
  
  if (deptCode && departemenList.length > 0) {
    const dept = departemenList.find(
      (d) => String(d.code || d.id).toLowerCase() === String(deptCode).toLowerCase()
    );
    if (dept) {
      return (dept as any).departemen || dept.name || (dept as any).department_name || deptCode;
    }
  }
  return typeof param === 'object' 
    ? ((param as any).departemen_nama || (param as any).departemen || (param as any).department_name || '-') 
    : (deptCode || '-');
};

// Helper untuk mendapatkan nama Sub Departemen
const getSubDepartmentName = (param?: Pos | string | null) => {
  if (!param) return '-';
  const subDeptCode = typeof param === 'string' 
    ? param 
    : param.sub_department_code || (param as any).sub_departemen_id || (param as any).sub_department_id;
  
  if (subDeptCode && subDepartemenList.length > 0) {
    const sub = subDepartemenList.find(
      (s) => String(s.code || s.id).toLowerCase() === String(subDeptCode).toLowerCase()
    );
    if (sub) {
      // Cek atribut nama sub departemen yang tersedia
      return (sub as any).sub_departemen || sub.name || (sub as any).sub_department_name || subDeptCode;
    }
  }
  return typeof param === 'object' 
    ? ((param as any).sub_departemen_nama || (param as any).sub_departemen || (param as any).sub_department_name || '-') 
    : (subDeptCode || '-');
};

  // Filter Data Multi-Kriteria
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const deptCode = item.department_code || (item as any).departemen_id || (item as any).department_id;
      const subDeptCode = item.sub_department_code || (item as any).sub_departemen_id || (item as any).sub_department_id;

      const matchDept = selectedDeptFilter ? String(deptCode) === String(selectedDeptFilter) : true;
      const matchSubDept = selectedSubDeptFilter ? String(subDeptCode) === String(selectedSubDeptFilter) : true;

      const rawActive = (item as any).is_active ?? (item as any).status;
      const isActive = Boolean(rawActive === true || rawActive === 1 || rawActive === 'Aktif');
      const matchStatus =
        selectedStatusFilter === ''
          ? true
          : selectedStatusFilter === 'true'
          ? isActive
          : !isActive;

      return matchDept && matchSubDept && matchStatus;
    });
  }, [data, selectedDeptFilter, selectedSubDeptFilter, selectedStatusFilter]);

  const isFiltered = Boolean(selectedDeptFilter || selectedSubDeptFilter || selectedStatusFilter);

  // Kolom Tabel Sesuai Spesifikasi Dokumen
  const columns = useMemo<ColumnDef<Pos>[]>(
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
        accessorKey: 'code',
        header: 'ID POS',
        cell: (info) => {
          const codeVal = info.getValue() || (info.row.original as any).id;
          return (
            <span className="font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-xs">
              {String(codeVal || '-')}
            </span>
          );
        },
      },
      {
        accessorKey: 'department_code',
        header: 'Departemen',
        cell: ({ row }) => (
          <span className="font-semibold text-gray-800 dark:text-gray-100">
            {getDepartmentName(row.original)}
          </span>
        ),
      },
      {
        accessorKey: 'sub_department_code',
        header: 'Sub Departemen',
        cell: ({ row }) => (
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            {getSubDepartmentName(row.original)}
          </span>
        ),
      },
      {
        accessorKey: 'title',
        header: 'Pos',
        cell: (info) => {
          const titleVal = info.getValue() || (info.row.original as any).pos;
          return (
            <span className="text-gray-800 dark:text-gray-100 font-semibold">
              {String(titleVal || '-')}
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
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                  isAktif
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                }`}
              >
                {isAktif ? 'Aktif' : 'Nonaktif'}
              </span>
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
    [onEdit, departemenList, subDepartemenList]
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
          title="POS"
          subtitle="Daftar kelola posisi jabatan (POS) LokaHR"
          icon={<Building2 className="w-6 h-6" />}
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
                setSelectedDeptFilter('');
                setSelectedSubDeptFilter('');
                setSelectedStatusFilter('');
              }}
              fields={[
                {
                  key: 'departemen',
                  label: 'Departemen',
                  render: () => (
                    <FormSelectSearch
                      value={selectedDeptFilter}
                      onChange={(val) => {
                        setSelectedDeptFilter(val);
                        setSelectedSubDeptFilter('');
                      }}
                      placeholder="Pilih Departemen"
                      options={[
                        { id: '', label: 'Semua Departemen' },
                        ...departemenList.map((d) => ({
                          id: String(d.code || d.id),
                          label: d.name || (d as any).departemen || String(d.code || d.id),
                        })),
                      ]}
                    />
                  ),
                },
                {
                  key: 'sub_departemen',
                  label: 'Sub Departemen',
                  render: () => (
                    <FormSelectSearch
                      value={selectedSubDeptFilter}
                      onChange={(val) => setSelectedSubDeptFilter(val)}
                      placeholder="Pilih Sub Departemen"
                      options={[
                        { id: '', label: 'Semua Sub Departemen' },
                        ...subDepartemenList
                          .filter((sub) => {
                            if (!selectedDeptFilter) return true;
                            const parentCode = sub.department_code || (sub as any).departemen_id;
                            return String(parentCode) === String(selectedDeptFilter);
                          })
                          .map((sub) => ({
                            id: String(sub.code || sub.id),
                            label: sub.name || (sub as any).sub_departemen || String(sub.code || sub.id),
                          })),
                      ]}
                    />
                  ),
                },
                {
                  key: 'status',
                  label: 'Status',
                  render: () => (
                    <FormSelectSearch
                      value={selectedStatusFilter}
                      onChange={(val) => setSelectedStatusFilter(val)}
                      placeholder="Pilih Status"
                      showSearch={false}
                      options={[
                        { id: '', label: 'Semua Status' },
                        { id: 'true', label: 'Aktif' },
                        { id: 'false', label: 'Nonaktif' },
                      ]}
                    />
                  ),
                },
              ]}
            />
          }
          actionButtons={<AddButton onClick={onAdd} />}
        />

        <div className="px-5 py-2 bg-gray-50/50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800">
          <DataPagination table={table} />
        </div>

        {/* Mobile View */}
        <div className="block md:hidden p-4 space-y-3 bg-gray-50/50 dark:bg-gray-950/50">
          {rows.length > 0 ? (
            rows.map((row) => {
              const item = row.original;
              const rawActive = (item as any).is_active ?? (item as any).status;
              const isAktif = Boolean(rawActive === true || rawActive === 1 || rawActive === 'Aktif');
              const codeVal = item.code || (item as any).id;
              const titleVal = item.title || (item as any).pos;

              return (
                <div key={row.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                      {codeVal}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        isAktif
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                      }`}
                    >
                      {isAktif ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Departemen</p>
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-0.5">{getDepartmentName(item)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Sub Departemen</p>
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-0.5">{getSubDepartmentName(item)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Pos</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mt-0.5">{titleVal}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                    <EditActionButton onClick={() => onEdit(item)} />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-xs">
              Tidak ada data POS ditemukan.
            </div>
          )}
        </div>

        <DataTable table={table} columnsLength={columns.length} emptyMessage="Tidak ada data POS ditemukan." />
      </div>

      <MobileAddFab onClick={onAdd} title="Tambah Pos" />
    </div>
  );
};