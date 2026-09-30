import React, { useState } from 'react';
import { useKomplimen } from '../hooks/useKomplimen';
import { KomplimenTable } from '../components/KomplimenTable';
import { KomplimenModal } from '../components/KomplimenModal';

export const KomplimenPage: React.FC = () => {
  const { data, loading } = useKomplimen();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleExport = () => {
    alert('Fitur Export Laporan Komplimen dijalankan!');
  };

  const handleAddSubmit = (newData: any) => {
    console.log('Data baru disubmit:', newData);
    alert('Pengajuan komplimen berhasil ditambahkan!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xs animate-pulse">Memuat data Laporan Komplimen...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <KomplimenTable 
        data={data} 
        onAdd={() => setIsModalOpen(true)} 
        onExport={handleExport} 
      />

      {/* Modal Form Tambah */}
      <KomplimenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddSubmit}
      />
    </div>
  );
};