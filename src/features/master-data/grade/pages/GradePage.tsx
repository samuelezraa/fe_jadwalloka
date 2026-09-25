import React, { useState } from 'react';
import { useGrade } from '../hooks/useGrade';
import { GradeTable } from '../components/GradeTable';
import { GradeDialog } from '../components/GradeDialog';
import type { Grade } from '../types/grade.type';

export const GradePage: React.FC = () => {
  const { data, loading, addGrade, editGrade } = useGrade();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Grade | null>(null);

  const handleOpenAdd = () => {
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: Grade) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleSubmitForm = async (formData: any) => {
    if (selectedItem) {
      // Mode Edit
      await editGrade(selectedItem.id, {
        grade: formData.grade,
        status: formData.status,
      });
    } else {
      // Mode Tambah
      await addGrade({
        id: formData.id,
        grade: formData.grade,
      });
    }
    setIsDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xs animate-pulse">Memuat data Grade...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GradeTable
        data={data}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
      />

      <GradeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        initialData={selectedItem}
        onSubmit={handleSubmitForm}
      />
    </div>
  );
};