import React, { useState } from 'react';
import { usePos } from '../hooks/usePos';
import { useDepartemen } from '../../departemen/hooks/useDepartemen';
import { useSubDepartemen } from '../../sub-departemen/hooks/useSubDepartemen';
import { PosTable } from '../components/PosTable';
import { PosDialog } from '../components/PosDialog';
import type { Pos } from '../types/pos.type';

export const PosPage: React.FC = () => {
  const { data, loading, addPos, editPos } = usePos();
  const { data: departemenList } = useDepartemen();
  const { data: subDepartemenList } = useSubDepartemen();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Pos | null>(null);

  const handleOpenAdd = () => {
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: Pos) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleSubmitForm = async (formData: any) => {
    if (selectedItem) {
      // Edit Mode (termasuk status)
      await editPos(selectedItem.id, {
        departemen_id: formData.departemen_id,
        departemen_nama: formData.departemen_nama,
        sub_departemen_id: formData.sub_departemen_id,
        sub_departemen_nama: formData.sub_departemen_nama,
        pos: formData.pos,
        status: formData.status,
      });
    } else {
      // Add Mode
      await addPos({
        id: formData.id,
        departemen_id: formData.departemen_id,
        departemen_nama: formData.departemen_nama,
        sub_departemen_id: formData.sub_departemen_id,
        sub_departemen_nama: formData.sub_departemen_nama,
        pos: formData.pos,
      });
    }
    setIsDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xs animate-pulse">Memuat data POS...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PosTable
        data={data}
        departemenList={departemenList}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
      />

      <PosDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        initialData={selectedItem}
        departemenList={departemenList}
        subDepartemenList={subDepartemenList}
        onSubmit={handleSubmitForm}
      />
    </div>
  );
};