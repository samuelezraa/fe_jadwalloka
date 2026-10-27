import * as React from "react"
import { cn } from "../../lib/utils"

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(({ className, ...props }, ref) => (
  <table 
    ref={ref} 
    className={cn("w-full min-w-max caption-bottom text-sm text-center border-collapse", className)} 
    {...props} 
  />
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("bg-gray-50/80 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("bg-white dark:bg-gray-900", className)} {...props} />
))
TableBody.displayName = "TableBody"

// 🌟 Tambahkan TableFooter di sini
const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("border-t bg-gray-100/80 dark:bg-gray-800/80 font-bold border-gray-200 dark:border-gray-700", className)}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({ className, ...props }, ref) => (
  <tr 
    ref={ref} 
    className={cn(
      "hover:bg-emerald-50/20 dark:hover:bg-emerald-950/30 transition-colors border-b border-gray-200 dark:border-gray-800 last:border-b-0", 
      className
    )} 
    {...props} 
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <th 
    ref={ref} 
    className={cn(
      "px-4 py-3 text-xs font-bold text-black dark:text-white capitalize tracking-wider border-r border-gray-200 dark:border-gray-800 last:border-r-0 align-middle whitespace-nowrap", 
      className
    )} 
    {...props} 
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <td 
    ref={ref} 
    className={cn(
      "px-4 py-3 text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap border-r border-gray-200 dark:border-gray-800 last:border-r-0 align-middle", 
      className
    )} 
    {...props} 
  />
))
TableCell.displayName = "TableCell"

// 🌟 Pastikan TableFooter diekspor
export { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell }