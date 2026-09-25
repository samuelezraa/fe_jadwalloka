import React, { useState } from 'react';
import { useDataKaryawan } from '../hooks/useDataKaryawan';
import { DataKaryawanTable } from '../components/DataKaryawanTable';
import { DataKaryawanDialog } from '../components/DataKaryawanDialog';
import type { DataKaryawan } from '../types/data-karyawan.type';
import type { DataKaryawanFormValues } from '../schemas/data-karyawan.schema';

export const DataKaryawanPage: React.FC = () => {
  const {
    data,
    loading,
    addKaryawan,
    editKaryawan,
    toggleStatusKaryawan,
    resetPasswordKaryawan,
  } = useDataKaryawan();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DataKaryawan | null>(null);

  const handleOpenAdd = () => {
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: DataKaryawan) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleSubmitForm = async (formData: DataKaryawanFormValues) => {
    if (selectedItem) {
      await editKaryawan(selectedItem.id, formData);
    } else {
      await addKaryawan(formData as any);
    }
    setIsDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xs animate-pulse">Memuat data Karyawan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DataKaryawanTable
        data={data}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
        onToggleStatus={toggleStatusKaryawan}
        onResetPassword={resetPasswordKaryawan}
      />

      <DataKaryawanDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        initialData={selectedItem}
        onSubmit={handleSubmitForm}
      />
    </div>
  );
};