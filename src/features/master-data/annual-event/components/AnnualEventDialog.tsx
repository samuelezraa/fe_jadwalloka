import React from 'react';
import { AppDialog } from '../../../../components/ui/AppDialog';
import { AnnualEventForm } from './AnnualEventForm';
import type { AnnualEvent } from '../types/annual-event.type';
import type { AnnualEventFormValues } from '../schemas/annual-event.schema';

interface AnnualEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: AnnualEvent | null;
  onSubmit: (data: AnnualEventFormValues) => void;
}

export const AnnualEventDialog: React.FC<AnnualEventDialogProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}) => {
  const isEdit = !!initialData;

  return (
    <AppDialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Event Tahunan' : 'Tambah Event Tahunan Baru'}
      maxWidth="md"
    >
      <AnnualEventForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </AppDialog>
  );
};