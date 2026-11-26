import React from 'react';
import { AppDialog } from '../../../../components/ui/AppDialog';
import { ScheduleSchemeForm } from './ScheduleSchemeForm';
import type { ScheduleScheme } from '../types/schedule-scheme.type';
import type { ScheduleSchemeFormValues } from '../schemas/schedule-scheme.schema';

interface ScheduleSchemeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ScheduleScheme | null;
  existingList?: ScheduleScheme[];
  onSubmit: (data: ScheduleSchemeFormValues) => Promise<void> | void;
}

export const ScheduleSchemeDialog: React.FC<ScheduleSchemeDialogProps> = ({
  isOpen,
  onClose,
  initialData,
  existingList = [],
  onSubmit,
}) => {
  const isEdit = !!initialData;

  return (
    <AppDialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Skema Hari Kerja' : 'Tambah Skema Hari Kerja Baru'}
      maxWidth="md"
    >
      <ScheduleSchemeForm
        initialData={initialData}
        existingList={existingList}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </AppDialog>
  );
};