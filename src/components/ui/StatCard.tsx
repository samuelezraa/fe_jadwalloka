import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  badgeText?: string;
  badgeColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = 'bg-emerald-50 dark:bg-emerald-950/50',
  iconColor = 'text-emerald-600 dark:text-emerald-400',
  badgeText,
  badgeColor = 'text-gray-500 dark:text-gray-400',
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-start justify-between transition-colors duration-200">
      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </p>
        <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">
          {value}{' '}
          <span className="text-xs font-normal text-gray-400 dark:text-gray-500">
            Orang
          </span>
        </h3>
        {subtitle && (
          <p className={`text-xs mt-2 font-medium ${badgeColor}`}>
            {subtitle}
          </p>
        )}
        {badgeText && (
          <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 ${badgeColor}`}>
            {badgeText}
          </span>
        )}
      </div>
      <div className={`p-3 rounded-xl ${iconBgColor} ${iconColor}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};