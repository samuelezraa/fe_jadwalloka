import React from 'react';
import { SkemaHariKerjaForm } from './SkemaHariKerjaForm';
import { AppDialog } from '../../../../components/ui/AppDialog';
import type { SkemaHariKerja } from '../types/skema-hari-kerja.type';

interface SkemaHariKerjaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: SkemaHariKerja | null;
  onSubmit: (data: any) => void;
}

export const SkemaHariKerjaDialog: React.FC<SkemaHariKerjaDialogProps> = ({
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
      title={isEditMode ? 'Edit Skema Hari Kerja' : 'Tambah Skema Hari Kerja Baru'}
      maxWidth="md"
    >
      <SkemaHariKerjaForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </AppDialog>
  );
};