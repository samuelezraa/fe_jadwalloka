import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
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
  onExport?: () => void;
}

export const PivotTable: React.FC<PivotTableProps> = ({ data, onExport }) => {
  const [globalFilter, setGlobalFilter] = useState('');
  
  // State Filter Utama & Tanggal
  const [periodeFilter, setPeriodeFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  // State Filter Tambahan (Departemen, Sub Dept, Grade, POS, Skema)
  const [departemenFilter, setDepartemenFilter] = useState('');
  const [subDepartemenFilter, setSubDepartemenFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [posFilter, setPosFilter] = useState('');
  const [skemaFilter, setSkemaFilter] = useState('');
  
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

  // Extract Opsi Unik dari Data
  const departemenOptions = useMemo(() => {
    const unique = Array.from(new Set(data.map((item) => item.departemen).filter(Boolean)));
    return [
      { id: '', label: 'Semua Departemen' },
      ...unique.map((dep) => ({ id: dep, label: dep })),
    ];
  }, [data]);

  const subDepartemenOptions = useMemo(() => {
    const unique = Array.from(new Set(data.map((item) => item.sub_departemen).filter(Boolean)));
    return [
      { id: '', label: 'Semua Sub Departemen' },
      ...unique.map((sub) => ({ id: sub, label: sub })),
    ];
  }, [data]);

  const posOptions = useMemo(() => {
    const unique = Array.from(new Set(data.map((item) => item.pos).filter(Boolean)));
    return [
      { id: '', label: 'Semua POS' },
      ...unique.map((p) => ({ id: p, label: p })),
    ];
  }, [data]);

  const gradeOptions = useMemo(() => {
    const unique = Array.from(new Set(data.map((item) => item.grade).filter(Boolean)));
    return [
      { id: '', label: 'Semua Grade' },
      ...unique.map((g) => ({ id: g, label: g })),
    ];
  }, [data]);

  const skemaOptions = useMemo(() => {
    const unique = Array.from(new Set(data.map((item) => item.skema).filter(Boolean)));
    return [
      { id: '', label: 'Semua Skema' },
      ...unique.map((s) => ({ id: s, label: s })),
    ];
  }, [data]);

  // Logic Filtering Data
  const filteredData = useMemo(() => {
    let result = data;

    if (departemenFilter) {
      result = result.filter((item) => item.departemen === departemenFilter);
    }
    if (subDepartemenFilter) {
      result = result.filter((item) => item.sub_departemen === subDepartemenFilter);
    }
    if (posFilter) {
      result = result.filter((item) => item.pos === posFilter);
    }
    if (gradeFilter) {
      result = result.filter((item) => item.grade === gradeFilter);
    }
    if (skemaFilter) {
      result = result.filter((item) => item.skema === skemaFilter);
    }

    return result;
  }, [
    data,
    periodeFilter,
    startDateFilter,
    endDateFilter,
    departemenFilter,
    subDepartemenFilter,
    posFilter,
    gradeFilter,
    skemaFilter,
  ]);

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
        cell: ({ row, table }) => {
          const paginationState = table.getState().pagination;
          return (
            <span className="font-medium text-gray-500 dark:text-gray-400">
              {paginationState.pageIndex * paginationState.pageSize + row.index + 1}
            </span>
          );
        },
      },
      {
        accessorKey: 'nip',
        header: 'NIP',
        size: 90,
        cell: (info) => <span className="font-mono text-gray-800 dark:text-gray-100">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'nama',
        header: 'Nama',
        size: 160,
        cell: (info) => <span className="font-bold text-gray-900 dark:text-gray-100">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'departemen',
        header: 'Departemen',
        size: 110,
        cell: (info) => <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'sub_departemen',
        header: 'Sub Departemen',
        size: 150,
        cell: (info) => <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'pos',
        header: 'POS',
        size: 150,
        cell: (info) => <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'grade',
        header: 'Grade',
        size: 100,
        cell: (info) => <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'skema',
        header: 'Skema',
        size: 90,
        cell: (info) => <span className="font-mono text-xs text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'masuk',
        header: 'Masuk',
        size: 70,
        cell: (info) => <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'libur',
        header: 'Libur',
        size: 70,
        cell: (info) => <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'ph',
        header: 'PH',
        size: 60,
        cell: (info) => <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'izin',
        header: 'Izin',
        size: 60,
        cell: (info) => <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'alfa',
        header: 'Alfa',
        size: 60,
        cell: (info) => <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'sakit',
        header: 'Sakit',
        size: 60,
        cell: (info) => <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'cuti',
        header: 'Cuti',
        size: 60,
        cell: (info) => <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>,
      },
      {
        accessorKey: 'terlambat',
        header: 'Terlambat',
        size: 80,
        cell: (info) => <span className="text-gray-700 dark:text-gray-300">{String(info.getValue())}</span>,
      },
    ],
    []
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
        className="w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm mb-16 md:mb-0 flex flex-col relative"
      >
        <div className="w-full">
          <TableToolbar
            title="Pivot"
            subtitle="Laporan rekapitulasi data kehadiran pivot karyawan"
            icon={<FileText className="w-6 h-6" />}
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
                  setPeriodeFilter('');
                  setStartDateFilter('');
                  setEndDateFilter('');
                  setDepartemenFilter('');
                  setSubDepartemenFilter('');
                  setGradeFilter('');
                  setPosFilter('');
                  setSkemaFilter('');
                }}
                fields={[
                  {
                    key: 'periode',
                    label: 'Periode',
                    render: () => (
                      <FormSelectSearch
                        value={periodeFilter}
                        onChange={setPeriodeFilter}
                        placeholder="Semua Periode"
                        options={[
                          { id: '', label: 'Semua Periode' },
                          { id: '2026-09', label: 'September 2026' },
                          { id: '2026-10', label: 'Oktober 2026' },
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
                        onChange={setDepartemenFilter}
                        placeholder="Semua Departemen"
                        options={departemenOptions}
                      />
                    ),
                  },
                  {
                    key: 'sub_departemen',
                    label: 'Sub Departemen',
                    render: () => (
                      <FormSelectSearch
                        value={subDepartemenFilter}
                        onChange={setSubDepartemenFilter}
                        placeholder="Semua Sub Departemen"
                        options={subDepartemenOptions}
                      />
                    ),
                  },
                  {
                    key: 'pos',
                    label: 'POS',
                    render: () => (
                      <FormSelectSearch
                        value={posFilter}
                        onChange={setPosFilter}
                        placeholder="Semua POS"
                        options={posOptions}
                      />
                    ),
                  },
                  {
                    key: 'grade',
                    label: 'Grade',
                    render: () => (
                      <FormSelectSearch
                        value={gradeFilter}
                        onChange={setGradeFilter}
                        placeholder="Semua Grade"
                        options={gradeOptions}
                      />
                    ),
                  },
                  {
                    key: 'skema',
                    label: 'Skema',
                    render: () => (
                      <FormSelectSearch
                        value={skemaFilter}
                        onChange={setSkemaFilter}
                        placeholder="Semua Skema"
                        options={skemaOptions}
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
                        onChange={(start, end) => {
                          setStartDateFilter(start);
                          setEndDateFilter(end);
                        }}
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
                <div key={row.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-3">
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
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.departemen} - {item.sub_departemen}</p>
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