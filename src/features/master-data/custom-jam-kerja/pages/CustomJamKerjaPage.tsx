import React, { useState } from 'react';
import { CustomJamKerjaTable } from '../components/CustomJamKerjaTable';
import { CustomJamKerjaDialog } from '../components/CustomJamKerjaDialog';
import type { CustomJamKerja } from '../types/custom-jam-kerja.type';
import type { CustomJamKerjaFormValues } from '../schemas/custom-jam-kerja.schema';
import toast from 'react-hot-toast';

export const CustomJamKerjaPage: React.FC = () => {
  const [data, setData] = useState<CustomJamKerja[]>([
    {
      id: 'CUS001',
      periodeStart: '2026-12-15',
      periodeEnd: '2027-01-15',
      skemaHariKerja: '5-2',
      jamMasuk: '12:00',
      toleransiKeterlambatan: '5 Menit',
      keterangan: 'Peak Season',
      status: 'Aktif',
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CustomJamKerja | null>(null);

  const handleOpenAdd = () => {
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: CustomJamKerja) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleSubmit = (values: CustomJamKerjaFormValues) => {
    if (selectedItem) {
      setData((prev) =>
        prev.map((item) => (item.id === selectedItem.id ? { ...item, ...values } : item))
      );
      toast.success('Custom jam kerja berhasil diperbarui!');
    } else {
      const newItem: CustomJamKerja = {
        id: `CUS00${data.length + 1}`,
        ...values,
      };
      setData((prev) => [...prev, newItem]);
      toast.success('Custom jam kerja berhasil ditambahkan!');
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <CustomJamKerjaTable
        data={data}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
      />

      <CustomJamKerjaDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        initialData={selectedItem}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CustomJamKerjaPage;