import React from 'react';
import { AppDialog } from '../../../../components/ui/AppDialog';
import { CustomWorkHourForm } from './CustomWorkHourForm'; // 👈 Kembalikan kurung kurawal {}
import type { CustomWorkHour } from '../types/custom-work-hour.type';
import type { CustomWorkHourFormValues } from '../schemas/custom-work-hour.schema';

interface CustomWorkHourDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CustomWorkHour | null;
  onSubmit: (data: CustomWorkHourFormValues) => void | Promise<any>;
}

export const CustomWorkHourDialog: React.FC<CustomWorkHourDialogProps> = ({
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
      title={isEditMode ? 'Edit Custom Jam Kerja' : 'Tambah Custom Jam Kerja Baru'}
      maxWidth="md"
    >
      <CustomWorkHourForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </AppDialog>
  );
};