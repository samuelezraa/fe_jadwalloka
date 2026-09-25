import React, { useState } from 'react';
import { useDepartemen } from '../hooks/useDepartemen';
import { DepartemenTable } from '../components/DepartemenTable';
import { DepartemenDialog } from '../components/DepartemenDialog';
import type { Departemen } from '../types/departemen.type';
import type { DepartemenFormValues } from '../schemas/departemen.schema';

export const DepartemenPage: React.FC = () => {
  const { data, loading, addDepartemen, editDepartemen } = useDepartemen();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDepartemen, setSelectedDepartemen] = useState<Departemen | null>(null);

  const handleOpenAdd = () => {
    setSelectedDepartemen(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: Departemen) => {
    setSelectedDepartemen(item);
    setIsDialogOpen(true);
  };

  const handleSubmitForm = async (formData: DepartemenFormValues) => {
    if (selectedDepartemen) {
      await editDepartemen(selectedDepartemen.id, { departemen: formData.departemen });
    } else {
      await addDepartemen(formData);
    }
    setIsDialogOpen(false);
  };
  
  if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-xs animate-pulse">Memuat data Departemen...</p>
        </div>
      );
    }

  return (
    <div className="space-y-6">
      {/* Bagian header 'Master Data Departemen' di sini sudah dihapus */}

      {/* Tabel Utama */}
      <DepartemenTable
        data={data}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
      />

      {/* Modal Dialog Form */}
      <DepartemenDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        initialData={selectedDepartemen}
        onSubmit={handleSubmitForm}
      />
    </div>
  );
};