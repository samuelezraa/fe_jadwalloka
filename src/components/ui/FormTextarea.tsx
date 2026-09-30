import React from 'react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({ label, className = "", ...props }) => {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <textarea
        /* 
          - border-[0.5px] atau border digunakan untuk ketebalan tipis
          - focus:ring-1 mengurangi ketebalan bayangan/outline saat diklik
        */
        className={`w-full px-3 py-2 text-xs bg-white dark:bg-gray-900 border-[0.5px] border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-gray-50 dark:focus:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none transition-colors ${className}`}
        {...props}
      />
    </div>
  );
};