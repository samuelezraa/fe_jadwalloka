import React from "react"
import { SaveButton, CancelButton } from "./ActionButtons";

interface FormLayoutProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
  onCancel: () => void
  isSubmitting?: boolean
}

export function FormLayout({ children, onCancel, isSubmitting, className, ...props }: FormLayoutProps) {
  return (
    <form className={`flex flex-col ${className}`} {...props}>
      <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
        {children}
      </div>
      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
        <CancelButton onClick={onCancel} />
        <SaveButton isLoading={isSubmitting} />
      </div>
    </form>
  )
}