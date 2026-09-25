import React from 'react';
import { DataKaryawanForm } from './DataKaryawanForm';
import { AppDialog } from '../../../../components/ui/AppDialog';
import type { DataKaryawan } from '../types/data-karyawan.type';
import type { DataKaryawanFormValues } from '../schemas/data-karyawan.schema';

interface DataKaryawanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: DataKaryawan | null;
  onSubmit: (data: DataKaryawanFormValues) => void;
}

export const DataKaryawanDialog: React.FC<DataKaryawanDialogProps> = ({
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
      title={isEditMode ? 'Edit Data Karyawan' : 'Tambah Data Karyawan Baru'}
      maxWidth="2xl"
    >
      <DataKaryawanForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </AppDialog>
  );
};