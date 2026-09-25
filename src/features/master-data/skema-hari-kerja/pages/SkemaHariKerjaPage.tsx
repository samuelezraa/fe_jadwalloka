import React, { useState } from 'react';
import { useSkemaHariKerja } from '../hooks/useSkemaHariKerja';
import { SkemaHariKerjaTable } from '../components/SkemaHariKerjaTable';
import { SkemaHariKerjaDialog } from '../components/SkemaHariKerjaDialog';
import type { SkemaHariKerja } from '../types/skema-hari-kerja.type';
import type { SkemaHariKerjaFormValues } from '../schemas/skema-hari-kerja.schema';

export const SkemaHariKerjaPage: React.FC = () => {
  const { data, loading, addSkema, editSkema } = useSkemaHariKerja();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SkemaHariKerja | null>(null);

  const handleOpenAdd = () => {
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: SkemaHariKerja) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleSubmitForm = async (formData: SkemaHariKerjaFormValues) => {
    if (selectedItem) {
      // Mode Edit
      await editSkema(selectedItem.id, {
        skema: formData.skema,
        jumlah_hari_kerja: formData.jumlah_hari_kerja,
        jumlah_hari_libur: formData.jumlah_hari_libur,
      });
    } else {
      // Mode Tambah
      await addSkema(formData);
    }
    setIsDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xs animate-pulse">Memuat data Skema Hari Kerja...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SkemaHariKerjaTable
        data={data}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
      />

      <SkemaHariKerjaDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        initialData={selectedItem}
        onSubmit={handleSubmitForm}
      />
    </div>
  );
};