import React from 'react';
import { AppDialog } from '@/components/ui/AppDialog';
import { PeriodeJadwalForm } from './PeriodeJadwalForm';
import type { PeriodeJadwalFormData } from '../types/periodeJadwal.type';

interface PeriodeJadwalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PeriodeJadwalFormData) => void;
}

export const PeriodeJadwalDialog: React.FC<PeriodeJadwalDialogProps> = ({
  isOpen,
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
      <PeriodeJadwalForm
        onSubmit={(data) => {
          onSubmit(data);
          onClose();
        }}
        onCancel={onClose}
      />
    </AppDialog>
  );
};