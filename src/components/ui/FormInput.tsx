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
    const isDisabledOrReadOnly = props.disabled || props.readOnly;

    return (
      <div className="w-full space-y-0.5">
        {label && (
          <label className="block text-[10px] font-semibold text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-2.5 z-10 pointer-events-none flex items-center justify-center text-gray-400">
              {leftIcon}
            </div>
          )}

          <Input
            ref={ref}
            className={`h-8 py-1 text-[11px] border-gray-200 placeholder:text-gray-400 dark:border-gray-700 ${
              leftIcon ? 'pl-8' : 'pl-2.5'
            } ${rightIcon ? 'pr-8' : 'pr-2.5'} ${
              isDisabledOrReadOnly
                ? 'bg-gray-200/90 text-gray-600 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed select-none border-gray-300 dark:border-gray-700'
                : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'
            } ${
              error 
                ? 'border-red-500 focus-visible:ring-red-500/20' 
                : 'focus-visible:border-amber-500 focus-visible:ring-1 focus-visible:ring-amber-500/30'
            } ${className}`}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-2.5 z-10 flex items-center justify-center text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <p className="text-[10px] text-red-500 dark:text-red-400 mt-0.5">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';