import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import type { EmployeePresence } from '../types/employee-presence.type';
import { DataPagination } from '@/components/DataPagination';
import { Users } from 'lucide-react';

// Reusable UI Components
import { TableToolbar } from '@/components/ui/TableToolbar';
import { ExportIconButton, MobileActionFabGroup } from '@/components/ui/ActionButtons';
import { TableFilterPopover } from '@/components/ui/TableFilterPopover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter, // 👈 Import TableFooter di sini
} from '@/components/ui/table';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { FormSelectSearch } from '@/components/ui/FormSelectSearch';

interface EmployeePresenceTableProps {
  data: EmployeePresence[];
  onExport?: () => void;
}

export const EmployeePresenceTable: React.FC<EmployeePresenceTableProps> = ({ data, onExport }) => {
  const [globalFilter, setGlobalFilter] = useState('');
  
  const [selectedPeriode, setSelectedPeriode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
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
    return data;
  }, [data, startDate, endDate, selectedPeriode]);

  // Hitung total pax secara dinamis
  const grandTotalPax = useMemo(() => {
    return filteredData.reduce((acc, item) => acc + (Number(item.totalPax) || 0), 0);
  }, [filteredData]);

  const isFiltered = Boolean(startDate || endDate || selectedPeriode);

  const columns = useMemo<ColumnDef<EmployeePresence>[]>(
    () => [
      {
        id: 'index',
        header: '#',
        cell: (info) => (
          <span className="font-medium text-gray-500 dark:text-gray-400">
            {info.row.index + 1}
          </span>
        ),
      },
      {
        accessorKey: 'department',
        header: 'Departemen',
        cell: (info) => (
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'totalPax',
        header: 'Total Pax',
        cell: (info) => (
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {String(info.getValue())} Pax
          </span>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
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
            title="Kehadiran Karyawan"
            subtitle="Rekapitulasi total pax kehadiran berdasarkan departemen"
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
                  setSelectedPeriode('');
                  setStartDate('');
                  setEndDate('');
                }}
                fields={[
                  {
                    key: 'periode',
                    label: 'Periode',
                    render: () => (
                      <FormSelectSearch
                        value={selectedPeriode}
                        onChange={setSelectedPeriode}
                        placeholder="Pilih Periode..."
                        options={[
                          { id: '2026-09', label: 'September 2026' },
                          { id: '2026-10', label: 'Oktober 2026' },
                        ]}
                      />
                    ),
                  },
                  {
                    key: 'tanggalRange',
                    label: 'Rentang Tanggal',
                    render: () => (
                      <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(start, end) => {
                          setStartDate(start);
                          setEndDate(end);
                        }}
                        placeholder="DD-MM-YYYY ~ DD-MM-YYYY"
                      />
                    ),
                  },
                ]}
              />
            }
            actionButtons={
              <div className="hidden md:flex items-center gap-2">
                <ExportIconButton onClick={onExport} title="Export Kehadiran Karyawan" />
              </div>
            }
          />
        </div>

        <div className="px-5 py-2 bg-gray-50/50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 w-full">
          <DataPagination table={table} />
        </div>

        {/* Tampilan Desktop Table */}
        <div className="hidden md:block w-full overflow-x-auto rounded-b-2xl">
          <Table className="w-full font-sans">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="whitespace-nowrap px-4 py-3">
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
                      <TableCell key={cell.id} className="whitespace-nowrap px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-gray-400">
                    Tidak ada data kehadiran ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

            {/* Total Row Footer */}
            {rows.length > 0 && (
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2} className="px-4 py-3 text-right text-gray-700 dark:text-gray-200 uppercase tracking-wider text-xs font-bold">
                    Total
                  </TableCell>
                  <TableCell className="px-4 py-3 text-emerald-600 dark:text-emerald-400 text-sm font-extrabold">
                    {grandTotalPax} Pax
                  </TableCell>
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </div>

        {/* Tampilan Mobile Card */}
        <div className="block md:hidden p-4 space-y-3 bg-gray-50/50 dark:bg-gray-950/50 rounded-b-2xl">
          {rows.length > 0 ? (
            <>
              {rows.map((row) => {
                const item = row.original;
                return (
                  <div key={row.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm flex justify-between items-center">
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Departemen</span>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.department}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Total Pax</span>
                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        {item.totalPax} Pax
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Card Total Mobile */}
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-4 flex justify-between items-center">
                <span className="font-bold text-sm text-gray-800 dark:text-gray-100 uppercase">
                  Total Seluruhnya
                </span>
                <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                  {grandTotalPax} Pax
                </span>
              </div>
            </>
          ) : (
            <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-xs">
              Tidak ada data kehadiran ditemukan.
            </div>
          )}
        </div>
      </div>

      <MobileActionFabGroup onExport={onExport} />
    </div>
  );
};