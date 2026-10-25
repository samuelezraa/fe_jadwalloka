import React, { useState } from 'react';
import { useGrade } from '../hooks/useGrade';
import { GradeTable } from '../components/GradeTable';
import { GradeDialog } from '../components/GradeDialog';
import { ConfirmAlertDialog } from '../../../../components/ui/ConfirmAlertDialog';
import type { Grade } from '../types/grade.type';
import type { GradeFormValues } from '../schemas/grade.schema';

export const GradePage: React.FC = () => {
  const { grades, isLoading, createGrade, updateGrade } = useGrade();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Grade | null>(null);

  // Form Data sementara menunggu konfirmasi
  const [pendingFormData, setPendingFormData] = useState<GradeFormValues | null>(null);
  const [isSubmittingApi, setIsSubmittingApi] = useState(false);

  // State Dialog Konfirmasi
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // State Alert Result (Sukses / Gagal)
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    variant: 'primary' | 'danger';
  }>({
    isOpen: false,
    title: '',
    description: '',
    variant: 'primary',
  });

  const handleOpenAdd = () => {
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: Grade) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleSubmitForm = (formData: GradeFormValues) => {
    setPendingFormData(formData);
    setIsConfirmOpen(true);
  };

  const handleCancelConfirm = () => {
    setIsConfirmOpen(false);
  };

  const handleConfirmSave = async () => {
    if (!pendingFormData) return;

    setIsDialogOpen(false);
    setIsConfirmOpen(false);
    setIsSubmittingApi(true);

    try {
      if (selectedItem) {
        const targetId = selectedItem.code || selectedItem.id;
        await updateGrade({
          id: targetId!,
          data: {
            code: pendingFormData.code,
            name: pendingFormData.name,
            is_active: pendingFormData.is_active,
          },
        });
        setAlertConfig({
          isOpen: true,
          title: 'Berhasil Diperbarui!',
          description: `Data grade "${pendingFormData.name}" berhasil diperbarui.`,
          variant: 'primary',
        });
      } else {
        await createGrade({
          code: pendingFormData.code,
          name: pendingFormData.name,
          is_active: true,
        });
        setAlertConfig({
          isOpen: true,
          title: 'Berhasil Ditambahkan!',
          description: `Grade baru "${pendingFormData.name}" berhasil ditambahkan.`,
          variant: 'primary',
        });
      }

      setPendingFormData(null);
      setSelectedItem(null);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Gagal menyimpan data Grade. Silakan coba lagi.';
      setAlertConfig({
        isOpen: true,
        title: 'Gagal Menyimpan!',
        description: errorMessage,
        variant: 'danger',
      });
    } finally {
      setIsSubmittingApi(false);
    }
  };

  if (isLoading && (!grades || grades.length === 0)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xs animate-pulse">Memuat data Grade...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabel Utama Grade */}
      <GradeTable
        data={Array.isArray(grades) ? grades : []}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
      />

      {/* Modal Dialog Form */}
      <GradeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        initialData={selectedItem}
        onSubmit={handleSubmitForm}
      />

      {/* 1. Dialog Pertanyaan Konfirmasi */}
      <ConfirmAlertDialog
        isOpen={isConfirmOpen}
        onClose={handleCancelConfirm}
        onConfirm={handleConfirmSave}
        title={selectedItem ? 'Simpan Perubahan?' : 'Tambah Grade?'}
        description={
          selectedItem
            ? `Apakah Anda yakin ingin memperbarui data grade "${pendingFormData?.name}"?`
            : `Apakah Anda yakin ingin menambahkan grade "${pendingFormData?.name}"?`
        }
        confirmText="Ya, Simpan"
        variant="warning"
        isLoading={isSubmittingApi}
      />

      {/* 2. Alert Hasil Sukses / Gagal (Sama persis seperti PosPage) */}
      <ConfirmAlertDialog
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={() => setAlertConfig((prev) => ({ ...prev, isOpen: false }))}
        title={alertConfig.title}
        description={alertConfig.description}
        variant={alertConfig.variant}
        confirmText="OK"
        cancelText=""
        showCancelButton={false}
      />
    </div>
  );
};