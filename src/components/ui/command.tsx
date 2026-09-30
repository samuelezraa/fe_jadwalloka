import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"
import { cn } from "cn"

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-lg bg-popover text-popover-foreground",
        className
      )}
      {...props}
    />
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex items-center border-b border-gray-100 dark:border-gray-700 px-3 bg-gray-50/50 dark:bg-gray-900/50"
    >
      <Search className="mr-2 h-3.5 w-3.5 shrink-0 text-gray-400" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "flex h-8 w-full rounded-md bg-transparent py-2 text-xs text-gray-800 dark:text-gray-100 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-48 overflow-y-auto overflow-x-hidden p-1 space-y-0.5",
        className
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="py-4 text-center text-xs text-gray-400"
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-md px-2.5 py-1.5 text-xs text-gray-700 dark:text-gray-200 outline-none transition-colors data-[disabled=true]:pointer-events-none data-[selected=true]:bg-emerald-50 dark:data-[selected=true]:bg-emerald-950/60 data-[selected=true]:text-emerald-700 dark:data-[selected=true]:text-emerald-400 data-[selected=true]:font-semibold data-[disabled=true]:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700/50",
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
}