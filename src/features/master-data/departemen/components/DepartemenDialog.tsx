import React from 'react';
import { DepartemenForm } from './DepartemenForm';
import { AppDialog } from '../../../../components/ui/AppDialog';
import type { Departemen } from '../types/departemen.type';
import type { DepartemenFormValues } from '../schemas/departemen.schema';

interface DepartemenDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Departemen | null;
  draftValues?: DepartemenFormValues | null;
  existingDepartemens?: Departemen[];
  serverErrors?: Record<string, string[]> | null;
  onSubmit: (data: DepartemenFormValues) => void;
}

export const DepartemenDialog: React.FC<DepartemenDialogProps> = ({
  isOpen,
  onClose,
  initialData,
  draftValues = null,
  existingDepartemens = [],
  serverErrors = null,
  onSubmit,
}) => {
  const isEditMode = !!initialData;

  return (
    <AppDialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Departemen' : 'Tambah Departemen Baru'}
      maxWidth="md"
    >
      <DepartemenForm
        initialData={initialData}
        draftValues={draftValues}
        existingDepartemens={existingDepartemens}
        serverErrors={serverErrors}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </AppDialog>
  );
};