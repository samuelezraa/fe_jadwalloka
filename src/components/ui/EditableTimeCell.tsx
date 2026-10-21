import React, { useState } from 'react';

interface EditableTimeCellProps {
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
}

export const EditableTimeCell: React.FC<EditableTimeCellProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="flex items-center justify-center w-full">
        <input
          type="time"
          step="1"
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setIsEditing(false)}
          className={`px-2 py-1 w-24 text-xs font-mono bg-transparent text-gray-800 dark:text-gray-100 border-none outline-none focus:outline-none focus:ring-0 text-center cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden ${className}`}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full">
      <div
        onClick={() => setIsEditing(true)}
        className={`px-2 py-1 w-24 text-xs font-mono bg-transparent text-gray-800 dark:text-gray-100 hover:text-sky-500 dark:hover:text-sky-400 cursor-pointer transition-colors text-center ${className}`}
      >
        {value}
      </div>
    </div>
  );
};