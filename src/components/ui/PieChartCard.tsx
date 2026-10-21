import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export interface PieChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface PieChartCardProps {
  title: string;
  subtitle?: string;
  data: PieChartDataItem[];
  totalLabel?: string;
}

export const PieChartCard: React.FC<PieChartCardProps> = ({
  title,
  subtitle,
  data,
  totalLabel = 'Total'
}) => {
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm flex flex-col justify-between transition-colors duration-200">
      <div>
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      <div className="h-64 my-2 relative flex items-center justify-center">
        {totalValue > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  borderRadius: '0.5rem',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            Tidak ada data untuk ditampilkan
          </div>
        )}

        {/* Info Angka Total di Tengah Doughnut Pie */}
        {totalValue > 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
            <span className="text-xl font-extrabold text-gray-800 dark:text-gray-100">
              {totalValue}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
              {totalLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PieChartCard;