import React, { useState, useEffect } from 'react';

interface FormTimeInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export const FormTimeInput: React.FC<FormTimeInputProps> = ({
  value,
  onChange,
  className = '',
  disabled = false,
}) => {
  const [localValue, setLocalValue] = useState(value || '');

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  return (
    <input
      type="time"
      step="1"
      value={localValue}
      disabled={disabled}
      onChange={(e) => {
        setLocalValue(e.target.value);
      }}
      onBlur={() => {
        if (localValue !== value) {
          onChange(localValue);
        }
      }}
      // 🌟 Dihapus kelas border, rounded, dan focus:ring agar tidak ada garis sama sekali
      className={`w-full text-xs px-2 py-1 bg-transparent text-gray-800 dark:text-gray-100 border-none outline-none shadow-none focus:outline-none focus:ring-0 focus:border-none transition-colors [&::-webkit-calendar-picker-indicator]:cursor-pointer opacity-90 ${className}`}
    />
  );
};