import React from 'react';
import { Input } from './input';

interface FormInputProps extends React.ComponentProps<typeof Input> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, leftIcon, rightIcon, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-[12px] font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 z-10 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}

          <Input
            ref={ref}
            className={`h-11 border-gray-200 text-xs placeholder:text-gray-300 dark:border-gray-700 ${
              leftIcon ? 'pl-10' : 'pl-3'
            } ${rightIcon ? 'pr-10' : 'pr-3'} ${
              error 
                ? 'border-red-500 focus-visible:ring-red-500/20' 
                : 'focus-visible:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30'
            } ${className}`}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 z-10 flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';