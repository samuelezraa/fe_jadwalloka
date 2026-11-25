import React from 'react';
import { GradeForm } from './GradeForm';
import { AppDialog } from '../../../../components/ui/AppDialog';
import type { Grade } from '../types/grade.type';
import type { GradeFormValues } from '../schemas/grade.schema';

interface GradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Grade | null;
  existingGrades?: Grade[];
  serverCodeError?: string | null;
  onSubmit: (data: GradeFormValues) => void;
}

export const GradeDialog: React.FC<GradeDialogProps> = ({
  isOpen,
  onClose,
  initialData,
  existingGrades = [],
  serverCodeError = null,
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
        existingGrades={existingGrades}
        serverCodeError={serverCodeError}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </AppDialog>
  );
};