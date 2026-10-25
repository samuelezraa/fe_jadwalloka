import React, { useState } from 'react';
import { useScheduleScheme } from '../hooks/useScheduleScheme';
import { ScheduleSchemeTable } from '../components/ScheduleSchemeTable';
import { ScheduleSchemeDialog } from '../components/ScheduleSchemeDialog';
import { ConfirmAlertDialog } from '../../../../components/ui/ConfirmAlertDialog';
import type { ScheduleScheme } from '../types/schedule-scheme.type';
import type { ScheduleSchemeFormValues } from '../schemas/schedule-scheme.schema';

export const ScheduleSchemePage: React.FC = () => {
  const { data: schemes = [], loading, addScheduleScheme, editScheduleScheme } = useScheduleScheme();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ScheduleScheme | null>(null);

  const [pendingFormData, setPendingFormData] = useState<ScheduleSchemeFormValues | null>(null);
  const [isSubmittingApi, setIsSubmittingApi] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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

  const handleOpenEdit = (item: ScheduleScheme) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleSubmitForm = (formData: ScheduleSchemeFormValues) => {
    setPendingFormData(formData);
    setIsConfirmOpen(true);
  };

  const handleConfirmSave = async () => {
    if (!pendingFormData) return;

    setIsDialogOpen(false);
    setIsConfirmOpen(false);
    setIsSubmittingApi(true);

    try {
      if (selectedItem) {
        const targetId = selectedItem.code || selectedItem.id;
        await editScheduleScheme(targetId!, pendingFormData);
        setAlertConfig({
          isOpen: true,
          title: 'Berhasil Diperbarui!',
          description: `Data skema "${pendingFormData.name}" berhasil diperbarui.`,
          variant: 'primary',
        });
      } else {
        await addScheduleScheme(pendingFormData);
        setAlertConfig({
          isOpen: true,
          title: 'Berhasil Ditambahkan!',
          description: `Skema baru "${pendingFormData.name}" berhasil ditambahkan.`,
          variant: 'primary',
        });
      }

      setPendingFormData(null);
      setSelectedItem(null);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Gagal menyimpan data skema hari kerja.';
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

  if (loading && schemes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xs animate-pulse">Memuat data Skema Hari Kerja...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ScheduleSchemeTable
        data={Array.isArray(schemes) ? schemes : []}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
      />

      <ScheduleSchemeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        initialData={selectedItem}
        onSubmit={handleSubmitForm}
      />

      {/* Dialog Konfirmasi Simpan */}
      <ConfirmAlertDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSave}
        title={selectedItem ? 'Simpan Perubahan?' : 'Tambah Skema Hari Kerja?'}
        description={
          selectedItem
            ? `Apakah Anda yakin ingin memperbarui data skema "${pendingFormData?.name}"?`
            : `Apakah Anda yakin ingin menambahkan skema "${pendingFormData?.name}"?`
        }
        confirmText="Ya, Simpan"
        variant="warning"
        isLoading={isSubmittingApi}
      />

      {/* Alert Hasil Sukses / Gagal */}
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