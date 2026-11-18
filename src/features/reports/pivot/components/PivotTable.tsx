import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import type { PivotData } from '../types/pivot.type';
import { DataPagination } from '@/components/DataPagination';
import { FileText } from 'lucide-react';

// Reusable UI Components
import { TableToolbar } from '@/components/ui/TableToolbar';
import { ExportIconButton } from '@/components/ui/ActionButtons';
import { TableFilterPopover } from '@/components/ui/TableFilterPopover';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FormSelectSearch } from '@/components/ui/FormSelectSearch';

interface PivotTableProps {
  data: PivotData[];
  meta: any;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  periodeFilter: string;
  onPeriodeChange: (val: string) => void;
  startDateFilter: string;
  endDateFilter: string;
  onDateRangeChange: (start: string, end: string) => void;
  departemenFilter: string;
  onDepartemenChange: (val: string) => void;
  subDepartemenFilter: string;
  onSubDepartemenChange: (val: string) => void;
  posFilter: string;
  onPosChange: (val: string) => void;
  gradeFilter: string;
  onGradeChange: (val: string) => void;
  skemaFilter: string;
  onSkemaChange: (val: string) => void;
  departemenList?: any[];
  subDepartemenList?: any[];
  posList?: any[];
  gradeList?: any[];
  skemaList?: any[];
  periodeList?: any[]; // 👈 Tambahkan ini
  onExport?: () => void;
}

export const PivotTable: React.FC<PivotTableProps> = ({
  data = [],
  meta,
  setPage,
  setPageSize,
  searchQuery,
  onSearchChange,
  periodeFilter,
  onPeriodeChange,
  startDateFilter,
  endDateFilter,
  onDateRangeChange,
  departemenFilter,
  onDepartemenChange,
  subDepartemenFilter,
  onSubDepartemenChange,
  posFilter,
  onPosChange,
  gradeFilter,
  onGradeChange,
  skemaFilter,
  onSkemaChange,
  departemenList = [],
  subDepartemenList = [],
  posList = [],
  gradeList = [],
  skemaList = [],
  periodeList = [], // 👈 Tambahkan ini juga
  onExport,
}) => {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});

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

// 🟢 1. Filter Sub Departemen Aktif Berdasarkan Departemen Terpilih (Aman dari Error)
  const filteredSubDepts = useMemo(() => {
    if (!departemenFilter) return subDepartemenList || [];

    const selectedDeptObj = (departemenList || []).find((d) => {
      const dId = typeof d === 'object' && d !== null ? String(d?.id ?? '') : '';
      const dName = typeof d === 'string' ? d : String(d?.name || '');
      return dId === String(departemenFilter) || dName.toLowerCase() === String(departemenFilter).toLowerCase();
    });

    if (!selectedDeptObj) return subDepartemenList || [];

    return (subDepartemenList || []).filter((sub) => {
      if (!sub) return false;
      if (typeof selectedDeptObj === 'object' && selectedDeptObj?.id !== undefined && sub.department_id !== undefined) {
        return String(sub.department_id) === String(selectedDeptObj.id);
      }
      const subDeptParentName = sub.department?.name || sub.department_name;
      if (subDeptParentName && typeof selectedDeptObj === 'object' && selectedDeptObj?.name) {
        return String(subDeptParentName).toLowerCase() === String(selectedDeptObj.name).toLowerCase();
      }
      return true;
    });
  }, [subDepartemenList, departemenList, departemenFilter]);

  // 🟢 2. Filter POS Aktif Berdasarkan Sub Departemen / Departemen Terpilih (Aman dari Error)
  const filteredPosList = useMemo(() => {
    let result = posList || [];

    if (subDepartemenFilter) {
      const selectedSubDeptObj = (subDepartemenList || []).find((sd) => {
        const sdName = typeof sd === 'string' ? sd : String(sd?.name || '');
        const sdId = typeof sd === 'object' && sd !== null ? String(sd?.id ?? '') : '';
        const sdCode = typeof sd === 'object' && sd !== null ? String(sd?.code || '') : '';
        return (
          sdName.toLowerCase() === String(subDepartemenFilter).toLowerCase() ||
          sdId === String(subDepartemenFilter) ||
          sdCode === String(subDepartemenFilter)
        );
      });

      const targetSubCode = typeof selectedSubDeptObj === 'object' ? selectedSubDeptObj?.code || null : null;
      const targetSubId = typeof selectedSubDeptObj === 'object' ? selectedSubDeptObj?.id ? String(selectedSubDeptObj.id) : null : null;
      const targetSubName = String(subDepartemenFilter).toLowerCase();

      return result.filter((p) => {
        if (!p) return false;
        if (targetSubCode && p.sub_department_code) {
          if (String(p.sub_department_code) === String(targetSubCode)) return true;
        }

        const pSubId = p.sub_department_id ?? p.sub_department?.id;
        if (targetSubId && pSubId !== undefined && pSubId !== null) {
          if (String(pSubId) === targetSubId) return true;
        }

        const pSubName = p.sub_department?.name || p.sub_department_name || p.title;
        if (pSubName && targetSubName) {
          return String(pSubName).toLowerCase().includes(targetSubName);
        }

        return false;
      });
    }

    if (departemenFilter) {
      const selectedDeptObj = (departemenList || []).find((d) => {
        const dName = typeof d === 'string' ? d : String(d?.name || '');
        const dId = typeof d === 'object' && d !== null ? String(d?.id ?? '') : '';
        const dCode = typeof d === 'object' && d !== null ? String(d?.code || '') : '';
        return (
          dName.toLowerCase() === String(departemenFilter).toLowerCase() ||
          dId === String(departemenFilter) ||
          dCode === String(departemenFilter)
        );
      });

      const targetDeptCode = typeof selectedDeptObj === 'object' ? selectedDeptObj?.code || null : null;
      const targetDeptId = typeof selectedDeptObj === 'object' ? selectedDeptObj?.id ? String(selectedDeptObj.id) : null : null;
      const targetDeptName = String(departemenFilter).toLowerCase();

      return result.filter((p) => {
        if (!p) return false;
        if (targetDeptCode && p.department_code) {
          if (String(p.department_code) === String(targetDeptCode)) return true;
        }

        const pDeptId = p.department_id ?? p.department?.id;
        if (targetDeptId && pDeptId !== undefined && pDeptId !== null) {
          if (String(pDeptId) === targetDeptId) return true;
        }

        const pDeptName = p.department?.name || p.department_name;
        if (pDeptName && targetDeptName) {
          return String(pDeptName).toLowerCase().includes(targetDeptName);
        }

        return false;
      });
    }

    return result;
  }, [posList, subDepartemenList, departemenList, subDepartemenFilter, departemenFilter]);
  const isFiltered = Boolean(
    periodeFilter ||
      startDateFilter ||
      endDateFilter ||
      departemenFilter ||
      subDepartemenFilter ||
      posFilter ||
      gradeFilter ||
      skemaFilter
  );

  const columns = useMemo<ColumnDef<PivotData>[]>(
    () => [
      {
        id: 'rowNumber',
        header: '#',
        size: 50,
        cell: ({ row }) => (
          <span className="font-medium text-gray-500 dark:text-gray-400">
            {row.index + 1 + (meta.current_page - 1) * meta.per_page}
          </span>
        ),
      },
      {
        accessorKey: 'nip',
        header: 'NIP',
        size: 90,
        cell: ({ row }) => (
          <span className="font-mono text-gray-800 dark:text-gray-100 font-medium">
            {String(row.original.nip || row.original.employee_id || '-')}
          </span>
        ),
      },
      {
        accessorKey: 'nama',
        header: 'Nama',
        size: 160,
        cell: (info) => (
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'departemen',
        header: 'Departemen',
        size: 110,
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>
        ),
      },
      {
        accessorKey: 'sub_departemen',
        header: 'Sub Departemen',
        size: 150,
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>
        ),
      },
      {
        accessorKey: 'pos',
        header: 'POS',
        size: 150,
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>
        ),
      },
      {
        accessorKey: 'grade',
        header: 'Grade',
        size: 100,
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>
        ),
      },
      {
        accessorKey: 'skema',
        header: 'Skema',
        size: 90,
        cell: (info) => (
          <span className="font-mono text-xs text-gray-700 dark:text-gray-300">
            {String(info.getValue())}
          </span>
        ),
      },
      { accessorKey: 'masuk', header: 'Masuk', size: 70 },
      { accessorKey: 'libur', header: 'Libur', size: 70 },
      { accessorKey: 'ph', header: 'PH', size: 60 },
      { accessorKey: 'izin', header: 'Izin', size: 60 },
      { accessorKey: 'alfa', header: 'Alfa', size: 60 },
      { accessorKey: 'sakit', header: 'Sakit', size: 60 },
      { accessorKey: 'cuti', header: 'Cuti', size: 60 },
      { accessorKey: 'terlambat', header: 'Terlambat', size: 80 },
    ],
    [meta]
  );

  const table = useReactTable({
    data,
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
    onGlobalFilterChange: (val) =>
      onSearchChange(typeof val === 'function' ? val(searchQuery) : val),
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;

  return (
    <div className="grid grid-cols-1 w-full relative">
      <div
        ref={filterWrapperRef}
        className="w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm mb-16 md:mb-0 flex flex-col relative"
      >
        <div className="w-full">
          <TableToolbar
            title="Pivot"
            subtitle="Laporan rekapitulasi data kehadiran pivot karyawan"
            icon={<FileText className="w-6 h-6" />}
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
                  onPeriodeChange('');
                  onDateRangeChange('', '');
                  onDepartemenChange('');
                  onSubDepartemenChange('');
                  onGradeChange('');
                  onPosChange('');
                  onSkemaChange('');
                }}
                fields={[
                 {
                  key: 'periode',
                  label: 'Periode',
                  render: () => (
                    <FormSelectSearch
                      value={periodeFilter}
                      onChange={onPeriodeChange}
                      placeholder="Semua Periode"
                      options={[
                        { id: '', label: 'Semua Periode' },
                        ...(periodeList || []).map((p) => ({
                          // 🟢 Gunakan properti string secara spesifik, pastikan tidak merender objek `p` langsung
                          id: String(p.code || p.idPeriode || p.id || ''),
                          label: String(p.name || p.periode || p.code || 'Periode'),
                        })),
                      ]}
                    />
                  ),
                },
                  {
                  key: 'departemen',
                  label: 'Departemen',
                  render: () => (
                    <FormSelectSearch
                      value={departemenFilter}
                      onChange={(val) => {
                        onDepartemenChange(val);
                        onSubDepartemenChange(''); // Reset Sub Departemen
                        onPosChange('');           // Reset POS
                      }}
                      placeholder="Semua Departemen"
                      options={[
                        { id: '', label: 'Semua Departemen' },
                        ...departemenList
                          .filter((d) => {
                            // 🟢 Pastikan hanya departemen aktif yang lolos
                            const isActive = d.is_active === undefined || d.is_active === true || d.is_active === 1 || d.is_active === '1';
                            return isActive;
                          })
                          .map((d) => ({
                            id: d.name || d,
                            label: d.name || d,
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
                      value={subDepartemenFilter}
                      onChange={(val) => {
                        onSubDepartemenChange(val);
                        onPosChange(''); 
                      }}
                      placeholder="Semua Sub Departemen"
                      options={[
                        { id: '', label: 'Semua Sub Departemen' },
                        ...filteredSubDepts
                          .filter((sd) => {
                            // 🟢 Pastikan hanya sub departemen aktif yang lolos
                            const isActive = sd.is_active === undefined || sd.is_active === true || sd.is_active === 1 || sd.is_active === '1';
                            return isActive;
                          })
                          .map((sd) => ({
                            id: sd.name || sd,
                            label: sd.name || sd,
                          })),
                      ]}
                    />
                  ),
                },
                  // ✅ KODE BARU (Sudah menggunakan filteredPosList)
                  {
                    key: 'pos',
                    label: 'POS',
                    render: () => (
                      <FormSelectSearch
                        value={posFilter}
                        onChange={onPosChange}
                        placeholder="Semua POS"
                        options={[
                          { id: '', label: 'Semua POS' },
                          ...filteredPosList.map((p) => ({           // 👈 Ubah posList menjadi filteredPosList
                            id: p.name || p.title || p,
                            label: p.name || p.title || p,
                          })),
                        ]}
                      />
                    ),
                  },
                  {
                    key: 'grade',
                    label: 'Grade',
                    render: () => (
                      <FormSelectSearch
                        value={gradeFilter}
                        onChange={onGradeChange}
                        placeholder="Semua Grade"
                        options={[
                          { id: '', label: 'Semua Grade' },
                          ...gradeList.map((g) => ({
                            id: g.name || g,
                            label: g.name || g,
                          })),
                        ]}
                      />
                    ),
                  },
                  {
                    key: 'skema',
                    label: 'Skema',
                    render: () => (
                      <FormSelectSearch
                        value={skemaFilter}
                        onChange={onSkemaChange}
                        placeholder="Semua Skema"
                        options={[
                          { id: '', label: 'Semua Skema' },
                          ...skemaList.map((s) => ({
                            id: s.name || s.code || s,
                            label: s.name || s.code || s,
                          })),
                        ]}
                      />
                    ),
                  },
                  {
                    key: 'tanggal_range',
                    label: 'Tanggal (Range)',
                    render: () => (
                      <DateRangePicker
                        startDate={startDateFilter}
                        endDate={endDateFilter}
                        onChange={onDateRangeChange}
                      />
                    ),
                  },
                ]}
              />
            }
            actionButtons={<ExportIconButton onClick={onExport} title="Export Pivot" />}
          />
        </div>

        <div className="px-5 py-2 bg-gray-50/50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 w-full">
          <DataPagination table={table} />
        </div>

        <div className="hidden md:block w-full overflow-x-auto rounded-b-2xl">
          <Table className="w-max min-w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="whitespace-nowrap px-3 py-3"
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
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
                      <TableCell
                        key={cell.id}
                        className="whitespace-nowrap px-3 py-3 truncate"
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-gray-400">
                    Tidak ada data pivot ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="block md:hidden p-4 space-y-3 bg-gray-50/50 dark:bg-gray-950/50 rounded-b-2xl">
          {rows.length > 0 ? (
            rows.map((row) => {
              const item = row.original;
              return (
                <div
                  key={row.id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                      NIP: {item.nip}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Skema: {item.skema}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.nama}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.departemen} - {item.sub_departemen}
                    </p>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs pt-1 border-t border-gray-100 dark:border-gray-800 text-center">
                    <div className="bg-gray-50 dark:bg-gray-800 p-1 rounded">
                      <span className="text-[10px] text-gray-400 block">Masuk</span>
                      <span className="font-bold">{item.masuk}</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-1 rounded">
                      <span className="text-[10px] text-gray-400 block">Libur</span>
                      <span className="font-bold">{item.libur}</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-1 rounded">
                      <span className="text-[10px] text-gray-400 block">Sakit</span>
                      <span className="font-bold">{item.sakit}</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-1 rounded">
                      <span className="text-[10px] text-gray-400 block">Cuti</span>
                      <span className="font-bold">{item.cuti}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-xs">
              Tidak ada data pivot ditemukan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};