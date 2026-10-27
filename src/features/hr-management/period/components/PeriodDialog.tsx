import React from 'react';
import { AppDialog } from '@/components/ui/AppDialog';
import { SchedulePeriodForm } from './SchedulePeriodForm';
import type { PeriodeJadwalFormData } from '../types/schedule-period.type';

interface PeriodeJadwalDialogProps {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (data: PeriodeJadwalFormData) => void;
}

export const PeriodeJadwalDialog: React.FC<PeriodeJadwalDialogProps> = ({
  isOpen,
  isLoading = false,
  onClose,
  onSubmit,
}) => {
  return (
    <AppDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Periode Jadwal Baru"
      maxWidth="lg"
    >
      <SchedulePeriodForm
        onSubmit={onSubmit}
        onCancel={onClose}
        isLoading={isLoading}
      />
    </AppDialog>
  );
};