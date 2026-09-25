import React from 'react';
import { GradeForm } from './GradeForm';
import { AppDialog } from '../../../../components/ui/AppDialog';
import type { Grade } from '../types/grade.type';

interface GradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Grade | null;
  onSubmit: (data: any) => void;
}

export const GradeDialog: React.FC<GradeDialogProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}) => {
  const isEditMode = !!initialData;

  return (
    <AppDialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Grade' : 'Tambah Grade Baru'}
      maxWidth="md"
    >
      <GradeForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </AppDialog>
  );
};