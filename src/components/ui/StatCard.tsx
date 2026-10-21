import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  iconBgColor = 'bg-emerald-50 dark:bg-emerald-950/50',
  iconColor = 'text-emerald-600 dark:text-emerald-400',
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm flex items-center justify-between transition-colors duration-200">
      <div>
        <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          {title}
        </p>
        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">
          {value}{' '}
          <span className="text-xs font-normal text-gray-400 dark:text-gray-500">
            Orang
          </span>
        </h3>
      </div>
      <div className={`p-3 rounded-xl ${iconBgColor} ${iconColor}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};