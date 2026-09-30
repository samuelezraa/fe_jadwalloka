import React from 'react';
import { usePivot } from '../hooks/usePivot';
import { PivotTable } from '../components/PivotTable';

export const PivotPage: React.FC = () => {
  const { data, loading } = usePivot();

  const handleExport = () => {
    alert('Fitur Export Laporan Pivot dijalankan!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xs animate-pulse">Memuat data Laporan Pivot...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PivotTable data={data} onExport={handleExport} />
    </div>
  );
};