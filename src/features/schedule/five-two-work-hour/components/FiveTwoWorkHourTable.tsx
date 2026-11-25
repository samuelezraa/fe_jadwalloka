import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
} from '@tanstack/react-table';
import type { FiveTwoWorkHourEmployee } from '../types/five-two-work-hour.type';
import { DataPagination } from '../../../../components/DataPagination';
import { Clock } from 'lucide-react';
import { api } from '../../../../lib/axios';

// Reusable UI Components
import { TableToolbar } from '../../../../components/ui/TableToolbar';
import {
  EditActionButton,
  ImportIconButton,
  ExportIconButton,
  MobileActionFabGroup,
} from '../../../../components/ui/ActionButtons';
import { DataTable } from '../../../../components/ui/data-table';
import { TableFilterPopover } from '../../../../components/ui/TableFilterPopover';
import { ImportScheduleDialog } from '../../../../components/ui/ImportScheduleDialog';
import { FormSelectSearch } from '../../../../components/ui/FormSelectSearch';
import { Badge } from '../../../../components/ui/badge';

interface FiveTwoWorkHourTableProps {
  data: FiveTwoWorkHourEmployee[];
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
  onEdit: (item: FiveTwoWorkHourEmployee) => void;
  onImport?: (file: File) => void;
  onExport?: () => void;
  onDownloadSample?: () => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  deptFilter: string;
  onDeptFilterChange: (val: string) => void;
  subDeptFilter: string;
  onSubDeptFilterChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  departemenList?: any[];
  subDepartemenList?: any[];
}

const LOCKED_ROLE_DEPT_MAP: Record<string, string> = {
  SALES: 'Sales',
  MANAGEMENT: 'Management',
  IT: 'IT',
};

const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const FiveTwoWorkHourTable: React.FC<FiveTwoWorkHourTableProps> = ({
  data = [],
  meta = { current_page: 1, last_page: 1, total: 0, per_page: 25, from: null, to: null },
  setPage,
  setPageSize,
  onEdit,
  onImport,
  onExport,
  onDownloadSample,
  searchQuery,
  onSearchChange,
  deptFilter,
  onDeptFilterChange,
  subDeptFilter,
  onSubDeptFilterChange,
  statusFilter,
  onStatusFilterChange,
  departemenList = [],
  subDepartemenList = [],
}) => {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [isImportOpen, setIsImportOpen] = useState(false);
  const filterWrapperRef = useRef<HTMLDivElement>(null);

  const [asyncDeptOptions, setAsyncDeptOptions] = useState<any[]>(departemenList);
  const [asyncSubDeptOptions, setAsyncSubDeptOptions] = useState<any[]>(subDepartemenList);

  const currentUser = useMemo(() => getStoredUser(), []);
  const roleUpper = String(currentUser?.role ?? '').trim().toUpperCase();
  const isDepartmentLocked = roleUpper in LOCKED_ROLE_DEPT_MAP;

  const lockedDeptId = useMemo(() => {
    if (!isDepartmentLocked) return '';

    const explicitDeptId =
      currentUser?.department_id ??
      (typeof currentUser?.department === 'object' ? currentUser?.department?.id : '');

    if (explicitDeptId !== undefined && explicitDeptId !== null && String(explicitDeptId) !== '') {
      return String(explicitDeptId);
    }

    const explicitDeptName =
      typeof currentUser?.department === 'string'
        ? currentUser.department.trim()
        : String(currentUser?.department?.name ?? '').trim();

    const targetName = (explicitDeptName || LOCKED_ROLE_DEPT_MAP[roleUpper] || '')
      .trim()
      .toLowerCase();

    const matchedDept = asyncDeptOptions.find((d) => {
      const dName = String(d.name || d.departemen || '').trim().toLowerCase();
      return targetName !== '' && (dName === targetName || dName.includes(targetName));
    });

    return matchedDept ? String(matchedDept.id) : '';
  }, [isDepartmentLocked, currentUser, roleUpper, asyncDeptOptions]);

  useEffect(() => {
    if (isDepartmentLocked && lockedDeptId && deptFilter !== lockedDeptId) {
      onDeptFilterChange(lockedDeptId);
    }
  }, [isDepartmentLocked, lockedDeptId, deptFilter, onDeptFilterChange]);

  useEffect(() => {
    setAsyncDeptOptions(departemenList);
  }, [departemenList]);

  useEffect(() => {
    setAsyncSubDeptOptions(subDepartemenList);
  }, [subDepartemenList]);

  const fetchFilterOptions = async (
    endpoint: string,
    query: string,
    setter: Function,
    extraParams = {}
  ) => {
    try {
      const res = await api.get(`/${endpoint}`, {
        params: { search: query, per_page: 25, status: 'true', ...extraParams },
      });
      const items = res.data.data || res.data || [];
      setter(items);
    } catch (err) {
      console.error(`Gagal memuat opsi ${endpoint}`, err);
    }
  };

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

  const isFiltered = Boolean((!isDepartmentLocked && deptFilter) || subDeptFilter || statusFilter);

  const columns = useMemo<ColumnDef<FiveTwoWorkHourEmployee>[]>(
    () => [
      {
        id: 'number',
        header: '#',
        cell: (info) => (
          <span className="font-medium text-gray-500 dark:text-gray-400">
            {info.row.index + 1 + (meta.current_page - 1) * meta.per_page}
          </span>
        ),
      },
      {
        id: 'employee_id_code',
        header: 'ID Karyawan',
        cell: ({ row }) => {
          const item = row.original as any;
          const empCode =
            item.employee_id_code ||
            item.employee?.employee_id ||
            item.employee_id ||
            item.nip ||
            '-';
          return (
            <span className="font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-xs font-semibold">
              {String(empCode)}
            </span>
          );
        },
      },
      {
        accessorKey: 'employee_name',
        header: 'Nama Karyawan',
        cell: ({ row }) => (
          <span className="font-bold text-gray-900 dark:text-gray-100 text-xs">
            {String(row.original.employee_name || row.original.name || '-')}
          </span>
        ),
      },
      {
        accessorKey: 'department_name',
        header: 'Departemen',
        cell: ({ row }) => (
          <span className="text-gray-700 dark:text-gray-300 text-xs">
            {String(
              row.original.department_name ||
                row.original.department?.name ||
                (row.original as any).department_name ||
                '-'
            )}
          </span>
        ),
      },
      {
        accessorKey: 'sub_department_name',
        header: 'Sub Departemen',
        cell: ({ row }) => (
          <span className="text-gray-700 dark:text-gray-300 text-xs">
            {String(
              row.original.sub_department_name ||
                row.original.sub_department?.name ||
                (row.original as any).sub_department_name ||
                '-'
            )}
          </span>
        ),
      },
      {
        accessorKey: 'is_active',
        header: 'Status',
        cell: (info) => {
          const active = info.getValue() !== false;
          return (
            <div className="flex justify-center">
              <Badge
                variant="outline"
                className={
                  active
                    ? 'rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 font-semibold px-3'
                    : 'rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 font-semibold px-3'
                }
              >
                {active ? 'Aktif' : 'Non Aktif'}
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
    [onEdit, meta]
  );

  const uniqueData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    const seen = new Set<string>();

    return data.filter((item: any) => {
      const empKey =
        item.employee_id_code ||
        item.employee?.employee_id ||
        item.employee_id ||
        item.employee?.id ||
        item.nip ||
        item.id;

      const fallbackKey = `${item.employee_name || item.name || ''}|${
        item.department_name || item.department?.name || ''
      }|${item.sub_department_name || item.sub_department?.name || ''}`;

      const key =
        empKey !== undefined && empKey !== null && String(empKey) !== ''
          ? `emp:${String(empKey)}`
          : `row:${fallbackKey}`;

      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [data]);

  const table = useReactTable({
    data: uniqueData,
    columns,
    pageCount: meta.last_page,
    manualPagination: true,
    state: {
      globalFilter: searchQuery,
      pagination: {
        pageIndex: (meta.current_page ?? 1) - 1,
        pageSize: meta.per_page ?? 25,
      },
      columnVisibility,
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({
          pageIndex: (meta.current_page ?? 1) - 1,
          pageSize: meta.per_page ?? 25,
        });
        setPage(newState.pageIndex + 1);
        setPageSize(newState.pageSize);
      }
    },
    onGlobalFilterChange: (val) =>
      onSearchChange(typeof val === 'function' ? val(searchQuery) : val),
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;
  const activeDeptValue = isDepartmentLocked ? lockedDeptId || deptFilter : deptFilter;

  return (
    <div className="relative" ref={filterWrapperRef}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-visible mb-16 md:mb-0 transition-colors duration-200">
        <TableToolbar
          title="Jam Kerja (Skema 5-2)"
          subtitle="Daftar pengaturan jam kerja karyawan LokaHR"
          icon={<Clock className="w-6 h-6" />}
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
                if (!isDepartmentLocked) {
                  onDeptFilterChange('');
                }
                onSubDeptFilterChange('');
                onStatusFilterChange('');
              }}
              fields={[
                {
                  key: 'department',
                  label: 'Departemen',
                  render: () => (
                    <FormSelectSearch
                      value={activeDeptValue}
                      disabled={isDepartmentLocked}
                      onChange={(val) => {
                        if (isDepartmentLocked) return;
                        onDeptFilterChange(val);
                        onSubDeptFilterChange('');
                        fetchFilterOptions('sub-departments', '', setAsyncSubDeptOptions, {
                          department_id: val,
                        });
                      }}
                      onSearchChange={(query) =>
                        fetchFilterOptions('departments', query, setAsyncDeptOptions)
                      }
                      placeholder="Semua Departemen"
                      options={[
                        { id: '', label: 'Semua Departemen' },
                        ...asyncDeptOptions
                          .filter((d) => d.is_active !== false)
                          .map((d) => ({
                            id: String(d.id),
                            label: d.name || d.departemen || '-',
                          })),
                      ]}
                    />
                  ),
                },
                {
                  key: 'sub_department',
                  label: 'Sub Departemen',
                  render: () => (
                    <FormSelectSearch
                      value={subDeptFilter}
                      onChange={(val) => onSubDeptFilterChange(val)}
                      onSearchChange={(query) =>
                        fetchFilterOptions('sub-departments', query, setAsyncSubDeptOptions, {
                          department_id: activeDeptValue,
                        })
                      }
                      placeholder={activeDeptValue ? 'Semua Sub Departemen' : 'Pilih Departemen dahulu'}
                      disabled={!activeDeptValue}
                      options={[
                        { id: '', label: 'Semua Sub Departemen' },
                        ...asyncSubDeptOptions
                          .filter((sub) => {
                            const isActive =
                              sub.is_active === undefined ||
                              sub.is_active === null ||
                              sub.is_active === true ||
                              sub.is_active === 1;
                            if (!isActive) return false;
                            if (!activeDeptValue) return false;

                            const rawDeptId =
                              sub.department_id ??
                              sub.departemen_id ??
                              sub.department?.id ??
                              sub.departemen?.id;

                            if (rawDeptId === undefined || rawDeptId === null || rawDeptId === '') {
                              return true;
                            }

                            const selectedDept = asyncDeptOptions.find(
                              (d) => String(d.id) === String(activeDeptValue)
                            );
                            const selectedDeptCode = selectedDept?.code
                              ? String(selectedDept.code)
                              : '';

                            return (
                              String(rawDeptId) === String(activeDeptValue) ||
                              (selectedDeptCode !== '' && String(rawDeptId) === selectedDeptCode)
                            );
                          })
                          .map((sd) => ({
                            id: String(sd.id),
                            label: sd.name || sd.sub_departemen || '-',
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
                      value={statusFilter}
                      onChange={(val) => onStatusFilterChange(val)}
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
          actionButtons={
            <div className="hidden md:flex items-center gap-2">
              <ImportIconButton onClick={() => setIsImportOpen(true)} />
              <ExportIconButton onClick={onExport || (() => {})} />
            </div>
          }
        />

        <div className="px-5 py-2 bg-gray-50/50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 relative">
          <DataPagination table={table} />
        </div>

        {/* TAMPILAN CARD MOBILE DATA */}
        <div className="block md:hidden p-4 space-y-3 bg-gray-50/50 dark:bg-gray-950/50">
          {rows.length > 0 ? (
            rows.map((row) => {
              const item = row.original;
              const active = item.is_active !== false;
              const nipCode =
                item.employee_id_code ||
                item.employee?.employee_id ||
                item.employee_id ||
                item.nip ||
                '-';
              const empName = item.employee_name || item.name || '-';
              const deptName =
                item.department_name ||
                item.department?.name ||
                (item as any).department_name ||
                '-';
              const subDeptName =
                item.sub_department_name ||
                item.sub_department?.name ||
                (item as any).sub_department_name ||
                '-';

              return (
                <div
                  key={row.id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-2xs space-y-3 transition-colors"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                    <span className="font-mono text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                      ID: {nipCode}
                    </span>
                    <Badge
                      variant="outline"
                      className={
                        active
                          ? 'rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 font-semibold px-2.5 py-0.5 text-[10px]'
                          : 'rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 font-semibold px-2.5 py-0.5 text-[10px]'
                      }
                    >
                      {active ? 'Aktif' : 'Non Aktif'}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{empName}</p>
                    <div className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                      <p>
                        <span className="font-medium text-gray-500">Dept:</span> {deptName}
                      </p>
                      <p>
                        <span className="font-medium text-gray-500">Sub Dept:</span> {subDeptName}
                      </p>
                    </div>
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

        {/* TAMPILAN DESKTOP TABLE */}
        <DataTable
          table={table}
          columnsLength={columns.length}
          emptyMessage="Tidak ada data jam kerja ditemukan."
        />
      </div>

      <MobileActionFabGroup
        onImport={() => setIsImportOpen(true)}
        onExport={onExport || (() => {})}
      />

      <ImportScheduleDialog
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={async (file) => {
          if (onImport) {
            await onImport(file);
          }
        }}
        onDownloadSample={onDownloadSample}
      />
    </div>
  );
};