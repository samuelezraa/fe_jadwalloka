import React, { useState, useRef, useEffect } from 'react';
import { Settings } from 'lucide-react';

export interface SettingDropdownItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'emerald' | 'blue' | 'amber' | 'rose' | 'default';
  dividerTop?: boolean;
}

interface SettingDropdownProps {
  items: SettingDropdownItem[];
  label?: string;
  buttonClassName?: string;
}

export const SettingDropdown: React.FC<SettingDropdownProps> = ({
  items,
  label = 'Setting',
  buttonClassName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getVariantClasses = (variant?: string) => {
    switch (variant) {
      case 'emerald':
        return 'hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 text-gray-700 dark:text-gray-200';
      case 'blue':
        return 'hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-gray-200';
      case 'amber':
        return 'hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-600 dark:hover:text-amber-400 text-gray-700 dark:text-gray-200';
      case 'rose':
        return 'hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 text-gray-700 dark:text-gray-200';
      default:
        return 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={
          buttonClassName ||
          'flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl transition-all shadow-sm'
        }
      >
        <Settings className="w-4 h-4" />
        <span>{label}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 z-50 w-48 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center gap-2.5 transition-colors ${getVariantClasses(
                item.variant
              )} ${item.dividerTop ? 'border-t border-gray-100 dark:border-gray-800' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};