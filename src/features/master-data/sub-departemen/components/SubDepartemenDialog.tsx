import React from 'react';
import { SubDepartemenForm } from './SubDepartemenForm';
import { AppDialog } from '../../../../components/ui/AppDialog';
import type { SubDepartemen } from '../types/sub-departemen.type';
import type { SubDepartemenFormValues } from '../schemas/sub-departemen.schema';
import type { Departemen } from '../../departemen/types/departemen.type';

interface SubDepartemenDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: SubDepartemen | null;
  departemenList: Departemen[];
  onSubmit: (data: SubDepartemenFormValues & { departemen_nama: string }) => void;
}

export const SubDepartemenDialog: React.FC<SubDepartemenDialogProps> = ({
  isOpen,
  onClose,
  initialData,
  departemenList,
  onSubmit,
}) => {
  const isEditMode = !!initialData;

  return (
    <AppDialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Sub Departemen' : 'Tambah Sub Departemen Baru'}
      maxWidth="md"
    >
      <SubDepartemenForm
        initialData={initialData}
        departemenList={departemenList}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </AppDialog>
  );
};