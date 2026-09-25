import React, { useState } from 'react';
import { useSubDepartemen } from '../hooks/useSubDepartemen';
import { useDepartemen } from '../../departemen/hooks/useDepartemen';
import { SubDepartemenTable } from '../components/SubDepartemenTable';
import { SubDepartemenDialog } from '../components/SubDepartemenDialog';
import type { SubDepartemen } from '../types/sub-departemen.type';

export const SubDepartemenPage: React.FC = () => {
  const { data, loading, addSubDepartemen, editSubDepartemen } = useSubDepartemen();
  const { data: departemenList } = useDepartemen();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SubDepartemen | null>(null);

  const handleOpenAdd = () => {
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: SubDepartemen) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleSubmitForm = async (formData: any) => {
    if (selectedItem) {
      await editSubDepartemen(selectedItem.id, {
        departemen_id: formData.departemen_id,
        departemen_nama: formData.departemen_nama,
        sub_departemen: formData.sub_departemen,
      });
    } else {
      await addSubDepartemen({
        id: formData.id,
        departemen_id: formData.departemen_id,
        departemen_nama: formData.departemen_nama,
        sub_departemen: formData.sub_departemen,
      });
    }
    setIsDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 animate-pulse">Memuat data sub departemen...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SubDepartemenTable
        data={data}
        departemenList={departemenList}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
      />

      <SubDepartemenDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        initialData={selectedItem}
        departemenList={departemenList}
        onSubmit={handleSubmitForm}
      />
    </div>
  );
};