import React, { useState } from 'react';
import { useAnnualEvent } from '../hooks/useAnnualEvent';
import { AnnualEventTable } from '../components/AnnualEventTable';
import { AnnualEventDialog } from '../components/AnnualEventDialog';
import { ConfirmAlertDialog } from '../../../../components/ui/ConfirmAlertDialog';
import type { AnnualEvent } from '../types/annual-event.type';

export const AnnualEventPage: React.FC = () => {
  const { data: events = [], loading, addAnnualEvent, editAnnualEvent } = useAnnualEvent();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AnnualEvent | null>(null);

  // Ubah tipe state menjadi any agar fleksibel dengan payload start_date & end_date
  const [pendingFormData, setPendingFormData] = useState<any | null>(null);
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

  const handleOpenEdit = (item: AnnualEvent) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleSubmitForm = (formData: any) => {
    const payload = {
      title: formData.title,
      start_date: formData.start_date || formData.event_date || '',
      end_date: formData.end_date || formData.start_date || formData.event_date || '',
      is_national_holiday: formData.is_national_holiday,
      description: formData.description,
      is_active: formData.is_active,
    };
    setPendingFormData(payload);
    setIsConfirmOpen(true);
  };

  const handleConfirmSave = async () => {
    if (!pendingFormData) return;

    setIsDialogOpen(false);
    setIsConfirmOpen(false);
    setIsSubmittingApi(true);

    try {
      if (selectedItem) {
        const targetId = selectedItem.id;
        await editAnnualEvent(targetId!, pendingFormData);
        setAlertConfig({
          isOpen: true,
          title: 'Berhasil Diperbarui!',
          description: `Data event "${pendingFormData.title}" berhasil diperbarui.`,
          variant: 'primary',
        });
      } else {
        await addAnnualEvent(pendingFormData);
        setAlertConfig({
          isOpen: true,
          title: 'Berhasil Ditambahkan!',
          description: `Event baru "${pendingFormData.title}" berhasil ditambahkan.`,
          variant: 'primary',
        });
      }

      setPendingFormData(null);
      setSelectedItem(null);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Gagal menyimpan data event tahunan.';
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

  if (loading && events.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xs animate-pulse">Memuat data Event Tahunan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnnualEventTable
        data={Array.isArray(events) ? events : []}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
      />

      <AnnualEventDialog
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
        title={selectedItem ? 'Simpan Perubahan?' : 'Tambah Event Tahunan?'}
        description={
          selectedItem
            ? `Apakah Anda yakin ingin memperbarui data event "${pendingFormData?.title}"?`
            : `Apakah Anda yakin ingin menambahkan event "${pendingFormData?.title}"?`
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