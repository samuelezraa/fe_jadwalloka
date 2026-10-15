import React from 'react';
import { CustomDialog } from '@/components/ui/CustomDialog';
import { SkemaHariKerjaForm } from './SkemaHariKerjaForm';
import type { SkemaHariKerja } from '../types/skema-hari-kerja.type';
import type { SkemaHariKerjaFormValues } from '../schemas/skema-hari-kerja.schema';

interface SkemaHariKerjaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: SkemaHariKerja | null;
  onSubmit: (data: SkemaHariKerjaFormValues) => void;
}

export const SkemaHariKerjaDialog: React.FC<SkemaHariKerjaDialogProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}) => {
  const isEdit = !!initialData;

  return (
    <CustomDialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Skema Hari Kerja' : 'Tambah Skema Hari Kerja Baru'}
    >
      <SkemaHariKerjaForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </CustomDialog>
  );
};