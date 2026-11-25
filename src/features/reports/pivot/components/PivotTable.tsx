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
import { api } from '@/lib/axios';

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
  periodeList?: any[];
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
  periodeList = [],
  onExport,
}) => {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});
  const filterWrapperRef = useRef<HTMLDivElement>(null);

  // State Backend Search Debounce untuk setiap Filter Dropdown
  const [periodeSearchQuery, setPeriodeSearchQuery] = useState('');
  const [filteredPeriodeOptions, setFilteredPeriodeOptions] = useState<any[]>(periodeList);

  const [deptSearchQuery, setDeptSearchQuery] = useState('');
  const [filteredDeptOptions, setFilteredDeptOptions] = useState<any[]>(departemenList);

  const [subDeptSearchQuery, setSubDeptSearchQuery] = useState('');
  const [filteredSubDeptOptions, setFilteredSubDeptOptions] = useState<any[]>(subDepartemenList);

  const [posSearchQuery, setPosSearchQuery] = useState('');
  const [filteredPosOptions, setFilteredPosOptions] = useState<any[]>(posList);

  const [gradeSearchQuery, setGradeSearchQuery] = useState('');
  const [filteredGradeOptions, setFilteredGradeOptions] = useState<any[]>(gradeList);

  const [skemaSearchQuery, setSkemaSearchQuery] = useState('');
  const [filteredSkemaOptions, setFilteredSkemaOptions] = useState<any[]>(skemaList);

  const filterActive = (arr: any[]) =>
    (arr || []).filter(
      (item: any) =>
        (item.isActive ?? item.is_active) === undefined ||
        (item.isActive ?? item.is_active) === true ||
        (item.isActive ?? item.is_active) === 1 ||
        (item.isActive ?? item.is_active) === '1'
    );

  // Ambil objek Departemen yang sedang dipilih (untuk mengirim code/id/name ke backend)
  const selectedDeptObj = useMemo(() => {
    if (!departemenFilter) return null;
    return (filteredDeptOptions || []).find(
      (d) =>
        String(d.name || d).toLowerCase() === String(departemenFilter).toLowerCase() ||
        String(d.code || '') === String(departemenFilter) ||
        String(d.id || '') === String(departemenFilter)
    );
  }, [departemenFilter, filteredDeptOptions]);

  // Ambil objek Sub Departemen yang sedang dipilih
  const selectedSubDeptObj = useMemo(() => {
    if (!subDepartemenFilter) return null;
    return (filteredSubDeptOptions || []).find(
      (sd) =>
        String(sd.name || sd).toLowerCase() === String(subDepartemenFilter).toLowerCase() ||
        String(sd.code || '') === String(subDepartemenFilter) ||
        String(sd.id || '') === String(subDepartemenFilter)
    );
  }, [subDepartemenFilter, filteredSubDeptOptions]);

  // 1. Fetch Periode dengan Backend Search Debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const res = await api.get('/periods', {
          params: { search: periodeSearchQuery, status: 'true', per_page: 25 },
        });
        setFilteredPeriodeOptions(filterActive(res.data?.data || res.data));
      } catch (err) {
        console.error(err);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [periodeSearchQuery]);

  // 2. Fetch Departemen dengan Backend Search Debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const res = await api.get('/departments', {
          params: { search: deptSearchQuery, per_page: 25 },
        });
        setFilteredDeptOptions(filterActive(res.data?.data || res.data));
      } catch (err) {
        console.error(err);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [deptSearchQuery]);

  // 3. Fetch Sub Departemen dengan Backend Search Debounce + Relasi Departemen
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const deptParam = selectedDeptObj?.code || selectedDeptObj?.id || departemenFilter;
        const res = await api.get('/sub-departments', {
          params: {
            search: subDeptSearchQuery,
            department: deptParam,
            department_code: selectedDeptObj?.code || '',
            department_id: selectedDeptObj?.id || '',
            per_page: 25,
          },
        });
        setFilteredSubDeptOptions(filterActive(res.data?.data || res.data));
      } catch (err) {
        console.error(err);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [subDeptSearchQuery, departemenFilter, selectedDeptObj]);

  // 4. Fetch POS dengan Backend Search Debounce + Relasi Departemen & Sub Departemen
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const deptParam = selectedDeptObj?.code || selectedDeptObj?.id || departemenFilter;
        const subDeptParam =
          selectedSubDeptObj?.code || selectedSubDeptObj?.id || subDepartemenFilter;
        const res = await api.get('/positions', {
          params: {
            search: posSearchQuery,
            department: deptParam,
            department_code: selectedDeptObj?.code || '',
            sub_department: subDeptParam,
            sub_department_code: selectedSubDeptObj?.code || '',
            per_page: 25,
          },
        });
        setFilteredPosOptions(filterActive(res.data?.data || res.data));
      } catch (err) {
        console.error(err);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [posSearchQuery, departemenFilter, subDepartemenFilter, selectedDeptObj, selectedSubDeptObj]);

  // 5. Fetch Grade dengan Backend Search Debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const res = await api.get('/grades', {
          params: { search: gradeSearchQuery, per_page: 25 },
        });
        setFilteredGradeOptions(filterActive(res.data?.data || res.data));
      } catch (err) {
        console.error(err);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [gradeSearchQuery]);

  // 6. Fetch Skema dengan Backend Search Debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const res = await api.get('/work-schedule-schemes', {
          params: { search: skemaSearchQuery, per_page: 25 },
        });
        setFilteredSkemaOptions(filterActive(res.data?.data || res.data));
      } catch (err) {
        console.error(err);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [skemaSearchQuery]);

  // Format opsi dropdown periode lengkap dengan rentang tanggal
  const displayedPeriodeOptions = useMemo(() => {
    return (filteredPeriodeOptions || []).map((p: any) => {
      const code = String(p.code ?? p.idPeriode ?? p.id ?? '').trim();
      const name = String(p.periode ?? p.name ?? code ?? 'Periode').trim();
      const startDate = String(p.tanggalAwal ?? p.start_date ?? '').trim();
      const endDate = String(p.tanggalAkhir ?? p.end_date ?? '').trim();

      const dateRange =
        startDate && endDate && startDate !== '-' && endDate !== '-'
          ? ` (${startDate} — ${endDate})`
          : '';

      return {
        id: code,
        label: `${name}${dateRange}`,
      };
    });
  }, [filteredPeriodeOptions]);

  // Penyaringan tambahan untuk memastikan Sub Departemen sesuai dengan Departemen terpilih
  const displayedSubDeptOptions = useMemo(() => {
    if (!departemenFilter) return filteredSubDeptOptions || [];
    return (filteredSubDeptOptions || []).filter((sub) => {
      if (selectedDeptObj?.code && sub.department_code) {
        return (
          String(sub.department_code).toLowerCase() ===
          String(selectedDeptObj.code).toLowerCase()
        );
      }
      if (selectedDeptObj?.id !== undefined && sub.department_id !== undefined) {
        return String(sub.department_id) === String(selectedDeptObj.id);
      }
      const parentName = sub.department?.name || sub.department_name;
      if (parentName) {
        return (
          String(parentName).toLowerCase() === String(departemenFilter).toLowerCase()
        );
      }
      return true;
    });
  }, [filteredSubDeptOptions, departemenFilter, selectedDeptObj]);

  // Penyaringan tambahan untuk memastikan POS sesuai dengan Sub Departemen / Departemen terpilih
  const displayedPosOptions = useMemo(() => {
    const list = filteredPosOptions || [];
    if (subDepartemenFilter) {
      return list.filter((p) => {
        if (selectedSubDeptObj?.code && p.sub_department_code) {
          return (
            String(p.sub_department_code).toLowerCase() ===
            String(selectedSubDeptObj.code).toLowerCase()
          );
        }
        if (selectedSubDeptObj?.id !== undefined && p.sub_department_id !== undefined) {
          return String(p.sub_department_id) === String(selectedSubDeptObj.id);
        }
        const subName = p.sub_department?.name || p.sub_department_name;
        if (subName) {
          return (
            String(subName).toLowerCase() === String(subDepartemenFilter).toLowerCase()
          );
        }
        return true;
      });
    }
    if (departemenFilter) {
      return list.filter((p) => {
        if (selectedDeptObj?.code && p.department_code) {
          return (
            String(p.department_code).toLowerCase() ===
            String(selectedDeptObj.code).toLowerCase()
          );
        }
        if (selectedDeptObj?.id !== undefined && p.department_id !== undefined) {
          return String(p.department_id) === String(selectedDeptObj.id);
        }
        const deptName = p.department?.name || p.department_name;
        if (deptName) {
          return (
            String(deptName).toLowerCase() === String(departemenFilter).toLowerCase()
          );
        }
        return true;
      });
    }
    return list;
  }, [
    filteredPosOptions,
    departemenFilter,
    subDepartemenFilter,
    selectedDeptObj,
    selectedSubDeptObj,
  ]);

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
            {row.index + 1 + ((meta?.current_page ?? 1) - 1) * (meta?.per_page ?? 25)}
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
          <span className="text-gray-700 dark:text-gray-300">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'sub_departemen',
        header: 'Sub Departemen',
        size: 150,
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-300">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'pos',
        header: 'POS',
        size: 150,
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-300">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'grade',
        header: 'Grade',
        size: 100,
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-300">
            {String(info.getValue())}
          </span>
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
    pageCount: meta?.last_page ?? 1,
    manualPagination: true,
    state: {
      globalFilter: searchQuery,
      pagination: {
        pageIndex: (meta?.current_page ?? 1) - 1,
        pageSize: meta?.per_page ?? 25,
      },
      columnVisibility,
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({
          pageIndex: (meta?.current_page ?? 1) - 1,
          pageSize: meta?.per_page ?? 25,
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
            onToggleFilterDropdown={() =>
              setShowFilterDropdown(!showFilterDropdown)
            }
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
                  setPeriodeSearchQuery('');
                  setDeptSearchQuery('');
                  setSubDeptSearchQuery('');
                  setPosSearchQuery('');
                  setGradeSearchQuery('');
                  setSkemaSearchQuery('');
                }}
                fields={[
                  {
                    key: 'periode',
                    label: 'Periode',
                    render: () => (
                      <FormSelectSearch
                        value={periodeFilter}
                        onChange={(val) => onPeriodeChange(val)}
                        onSearchChange={(query) => setPeriodeSearchQuery(query)}
                        placeholder="Semua Periode"
                        options={[
                          { id: '', label: 'Semua Periode' },
                          ...displayedPeriodeOptions,
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
                          onSubDepartemenChange('');
                          onPosChange('');
                          setSubDeptSearchQuery('');
                          setPosSearchQuery('');
                        }}
                        onSearchChange={(query) => setDeptSearchQuery(query)}
                        placeholder="Semua Departemen"
                        options={[
                          { id: '', label: 'Semua Departemen' },
                          ...(filteredDeptOptions || []).map((d) => ({
                            id: String(d.name || d),
                            label: String(d.name || d),
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
                          setPosSearchQuery('');
                        }}
                        onSearchChange={(query) => setSubDeptSearchQuery(query)}
                        placeholder="Semua Sub Departemen"
                        options={[
                          { id: '', label: 'Semua Sub Departemen' },
                          ...(displayedSubDeptOptions || []).map((sd) => ({
                            id: String(sd.name || sd),
                            label: String(sd.name || sd),
                          })),
                        ]}
                      />
                    ),
                  },
                  {
                    key: 'pos',
                    label: 'POS',
                    render: () => (
                      <FormSelectSearch
                        value={posFilter}
                        onChange={(val) => onPosChange(val)}
                        onSearchChange={(query) => setPosSearchQuery(query)}
                        placeholder="Semua POS"
                        options={[
                          { id: '', label: 'Semua POS' },
                          ...(displayedPosOptions || []).map((p) => ({
                            id: String(p.name || p.title || p),
                            label: String(p.name || p.title || p),
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
                        onChange={(val) => onGradeChange(val)}
                        onSearchChange={(query) => setGradeSearchQuery(query)}
                        placeholder="Semua Grade"
                        options={[
                          { id: '', label: 'Semua Grade' },
                          ...(filteredGradeOptions || []).map((g) => ({
                            id: String(g.name || g),
                            label: String(g.name || g),
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
                        onChange={(val) => onSkemaChange(val)}
                        onSearchChange={(query) => setSkemaSearchQuery(query)}
                        placeholder="Semua Skema"
                        options={[
                          { id: '', label: 'Semua Skema' },
                          ...(filteredSkemaOptions || []).map((s) => ({
                            id: String(s.name || s.code || s),
                            label: String(s.name || s.code || s),
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
            actionButtons={
              <ExportIconButton onClick={onExport} title="Export Pivot" />
            }
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
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
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
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-gray-400"
                  >
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
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {item.nama}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.departemen} - {item.sub_departemen}
                    </p>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs pt-1 border-t border-gray-100 dark:border-gray-800 text-center">
                    <div className="bg-gray-50 dark:bg-gray-800 p-1 rounded">
                      <span className="text-[10px] text-gray-400 block">
                        Masuk
                      </span>
                      <span className="font-bold">{item.masuk}</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-1 rounded">
                      <span className="text-[10px] text-gray-400 block">
                        Libur
                      </span>
                      <span className="font-bold">{item.libur}</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-1 rounded">
                      <span className="text-[10px] text-gray-400 block">
                        Sakit
                      </span>
                      <span className="font-bold">{item.sakit}</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-1 rounded">
                      <span className="text-[10px] text-gray-400 block">
                        Cuti
                      </span>
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