import React, { useState } from 'react';
import { CustomWorkHourTable } from '../components/CustomWorkHourTable';
import { CustomWorkHourDialog } from '../components/CustomWorkHourDialog';
import { ConfirmAlertDialog } from '../../../../components/ui/ConfirmAlertDialog';
import { useCustomWorkHour } from '../hooks/useCustomWorkHour';
import type { CustomWorkHour } from '../types/custom-work-hour.type';
import type { CustomWorkHourFormValues } from '../schemas/custom-work-hour.schema';

export const CustomWorkHourPage: React.FC = () => {
  const { data, loading, addCustomWorkHour, editCustomWorkHour } = useCustomWorkHour();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CustomWorkHour | null>(null);

  // Form Data sementara menunggu konfirmasi
  const [pendingFormData, setPendingFormData] = useState<CustomWorkHourFormValues | null>(null);
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

  const handleOpenEdit = (item: CustomWorkHour) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleSubmitForm = (formData: CustomWorkHourFormValues) => {
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
      if (selectedItem && selectedItem.id) {
        await editCustomWorkHour(selectedItem.id, pendingFormData);
        setAlertConfig({
          isOpen: true,
          title: 'Berhasil Diperbarui!',
          description: `Custom jam kerja "${pendingFormData.name}" berhasil diperbarui.`,
          variant: 'primary',
        });
      } else {
        await addCustomWorkHour(pendingFormData);
        setAlertConfig({
          isOpen: true,
          title: 'Berhasil Ditambahkan!',
          description: `Custom jam kerja baru "${pendingFormData.name}" berhasil ditambahkan.`,
          variant: 'primary',
        });
      }

      setPendingFormData(null);
      setSelectedItem(null);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Gagal menyimpan data Custom Jam Kerja. Silakan coba lagi.';
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

  if (loading && (!data || data.length === 0)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xs animate-pulse">Memuat data Custom Jam Kerja...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabel Utama Custom Work Hour */}
      <CustomWorkHourTable
        data={Array.isArray(data) ? data : []}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
      />

      {/* Modal Dialog Form */}
      <CustomWorkHourDialog
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
        title={selectedItem ? 'Simpan Perubahan?' : 'Tambah Custom Jam Kerja?'}
        description={
          selectedItem
            ? `Apakah Anda yakin ingin memperbarui custom jam kerja "${pendingFormData?.name}"?`
            : `Apakah Anda yakin ingin menambahkan custom jam kerja "${pendingFormData?.name}"?`
        }
        confirmText="Ya, Simpan"
        variant="warning"
        isLoading={isSubmittingApi}
      />

      {/* 2. Alert Hasil Sukses / Gagal */}
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

export default CustomWorkHourPage;