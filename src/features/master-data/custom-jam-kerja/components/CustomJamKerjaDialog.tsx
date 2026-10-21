import React from 'react';
import { AppDialog } from '../../../../components/ui/AppDialog';
import { CustomJamKerjaForm } from './CustomJamKerjaForm';
import type { CustomJamKerja } from '../types/custom-jam-kerja.type';
import type { CustomJamKerjaFormValues } from '../schemas/custom-jam-kerja.schema';

interface CustomJamKerjaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CustomJamKerja | null;
  onSubmit: (data: CustomJamKerjaFormValues) => void;
}

export const CustomJamKerjaDialog: React.FC<CustomJamKerjaDialogProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}) => {
  return (
    <AppDialog
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Custom Jam Kerja' : 'Tambah Custom Jam Kerja'}
      maxWidth="md"
    >
      <CustomJamKerjaForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </AppDialog>
  );
};