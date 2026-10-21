import React from "react"
import { flexRender, type Table as TanstackTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"

interface DataTableProps<TData> {
  table: TanstackTable<TData>
  columnsLength: number
  emptyMessage?: string
  showOnMobile?: boolean
}

export function DataTable<TData>({ 
  table, 
  columnsLength, 
  emptyMessage = "Tidak ada data ditemukan.",
  showOnMobile = false 
}: DataTableProps<TData>) {
  const rows = table.getRowModel().rows

  return (
    /* 
      - Di Mobile (< md): w-full overflow-x-auto
      - Di Desktop (md:): overflow-hidden w-full (kembali memenuhi kartu)
    */
    <div className={`w-full overflow-x-auto rounded-b-2xl ${showOnMobile ? 'block' : 'hidden md:block'}`}>
      {/* 
        - Mobile (< md): min-w-[850px] w-max (memaksa tabel melebar agar bisa di-scroll)
        - Desktop (md:): md:min-w-full md:w-full (memenuhi 100% lebar kartu)
      */}
      <Table className="min-w-[850px] w-max md:min-w-full md:w-full">
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
                  <TableCell key={cell.id} className="whitespace-nowrap px-4 py-2.5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columnsLength} className="h-24 text-center text-gray-400 dark:text-gray-500">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}