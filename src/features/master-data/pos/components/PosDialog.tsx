import React from 'react';
import { PosForm } from './PosForm';
import { AppDialog } from '../../../../components/ui/AppDialog';
import type { Pos } from '../types/pos.type';
import type { PosFormValues } from '../schemas/pos.schema';
import type { Departemen } from '../../departemen/types/departemen.type';
import type { SubDepartemen } from '../../sub-departemen/types/sub-departemen.type';

interface PosDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Pos | null;
  departemenList?: Departemen[];
  subDepartemenList?: SubDepartemen[];
  onSubmit: (data: PosFormValues) => void;
}

export const PosDialog: React.FC<PosDialogProps> = ({
  isOpen,
  onClose,
  initialData,
  departemenList = [],
  subDepartemenList = [],
  onSubmit,
}) => {
  const isEditMode = !!initialData;

  return (
    <AppDialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit POS' : 'Tambah POS Baru'}
      maxWidth="md"
    >
      <PosForm
        initialData={initialData}
        departemenList={departemenList}
        subDepartemenList={subDepartemenList}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </AppDialog>
  );
};