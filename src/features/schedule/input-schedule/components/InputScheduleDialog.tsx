import React from 'react';
import { InputScheduleForm } from './InputScheduleForm';
import { AppDialog } from '../../../../components/ui/AppDialog';
import type { InputSchedulePeriodItem } from '../types/input-schedule.type';
import type { InputScheduleFormValues } from '../schemas/input-schedule.schema';

interface InputScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: InputSchedulePeriodItem | null;
  onSubmit: (data: InputScheduleFormValues) => void;
}

export const InputScheduleDialog: React.FC<InputScheduleDialogProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}) => {
  return (
    <AppDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Input Schedule (Periode)"
      maxWidth="xl"
    >
      <InputScheduleForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </AppDialog>
  );
};