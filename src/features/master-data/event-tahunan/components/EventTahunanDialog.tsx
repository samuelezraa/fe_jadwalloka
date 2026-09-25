import React from 'react';
import { EventTahunanForm } from './EventTahunanForm';
import { AppDialog } from '../../../../components/ui/AppDialog';
import type { EventTahunan } from '../types/event-tahunan.type';

interface EventTahunanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: EventTahunan | null;
  onSubmit: (data: any) => void;
}

export const EventTahunanDialog: React.FC<EventTahunanDialogProps> = ({
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
      title={isEditMode ? 'Edit Event Tahunan' : 'Tambah Event Tahunan Baru'}
      maxWidth="md"
    >
      <EventTahunanForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </AppDialog>
  );
};