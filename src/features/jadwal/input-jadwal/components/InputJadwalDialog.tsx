import React from 'react';
import { InputJadwalForm } from './InputJadwalForm';
import { AppDialog } from '../../../../components/ui/AppDialog';
import type { InputJadwalPeriode } from '../types/input-jadwal.type';
import type { InputJadwalFormValues } from '../schemas/input-jadwal.schema';

interface InputJadwalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: InputJadwalPeriode | null;
  onSubmit: (data: InputJadwalFormValues) => void;
}

export const InputJadwalDialog: React.FC<InputJadwalDialogProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}) => {
  return (
    <AppDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Input Jadwal (Periode)"
      maxWidth="xl"
    >
      <InputJadwalForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </AppDialog>
  );
};