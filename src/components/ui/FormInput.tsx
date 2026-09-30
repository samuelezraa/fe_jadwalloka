import React from 'react';
import { Input } from './input';

interface FormInputProps extends React.ComponentProps<typeof Input> {
  label?: string;
  error?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <Input
        ref={ref}
        className={`${error ? 'border-red-500 focus-visible:ring-red-500/20' : ''} disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-700 dark:disabled:text-gray-300 disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';