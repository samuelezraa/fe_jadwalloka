import React, { useState } from 'react';
import { useFiveTwoWorkHour } from '../hooks/useFiveTwoWorkHour';
import { FiveTwoWorkHourTable } from '../components/FiveTwoWorkHourTable';
import { FiveTwoWorkHourDialog } from '../components/FiveTwoWorkHourDialog';
import { ConfirmAlertDialog } from '@/components/ui/ConfirmAlertDialog';
import type { FiveTwoWorkHourEmployee } from '../types/five-two-work-hour.type';
import type { FiveTwoWorkHourFormValues } from '../schemas/five-two-work-hour.schema';

export const FiveTwoWorkHourPage: React.FC = () => {
  const { schedules, isLoading, updateSchedule } = useFiveTwoWorkHour();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FiveTwoWorkHourEmployee | null>(null);

  // Form Data sementara menunggu konfirmasi
  const [pendingFormData, setPendingFormData] = useState<FiveTwoWorkHourFormValues | null>(null);
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

  const handleOpenEdit = (item: FiveTwoWorkHourEmployee) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleSubmitForm = (formData: FiveTwoWorkHourFormValues) => {
    setPendingFormData(formData);
    setIsConfirmOpen(true);
  };

  const handleCancelConfirm = () => {
    setIsConfirmOpen(false);
  };

  // Handler untuk mengunduh data tabel ke file CSV / Excel
  const handleExport = () => {
    if (!schedules || schedules.length === 0) {
      setAlertConfig({
        isOpen: true,
        title: 'Ekspor Gagal!',
        description: 'Tidak ada data jam kerja yang tersedia untuk diekspor.',
        variant: 'danger',
      });
      return;
    }

    const headers = ['ID Jadwal', 'Nama Jadwal', 'Tipe Jam Kerja', 'Status'];

    const rows = schedules.map((item) => {
      const typeName =
        (item as any).schedule_schemes?.[0]?.work_schedule_scheme?.name ||
        item.work_hour_type ||
        'Skema 5-2';
      const statusText = item.is_active !== false ? 'Aktif' : 'Nonaktif';

      return [
        `"${item.id}"`,
        `"${item.name || '-'}"`,
        `"${typeName}"`,
        `"${statusText}"`,
      ].join(',');
    });

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);

    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Jam_Kerja_Skema_5-2_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmSave = async () => {
    if (!pendingFormData || !selectedItem) return;

    const targetId = selectedItem.id ?? selectedItem.employee_id;

    if (!targetId) {
      setAlertConfig({
        isOpen: true,
        title: 'Gagal Menyimpan!',
        description: 'ID Jadwal tidak ditemukan.',
        variant: 'danger',
      });
      return;
    }

    setIsDialogOpen(false);
    setIsConfirmOpen(false);
    setIsSubmittingApi(true);

    try {
      const payload = {
        name: selectedItem.name || 'Jadwal Reguler (Skema 5-2)',
        ...pendingFormData,
      };

      await updateSchedule(targetId, payload as any);

      setAlertConfig({
        isOpen: true,
        title: 'Berhasil Diperbarui!',
        description: `Pengaturan jam kerja "${selectedItem.name || 'Jadwal'}" berhasil diperbarui.`,
        variant: 'primary',
      });

      setPendingFormData(null);
      setSelectedItem(null);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Gagal menyimpan data Jam Kerja. Silakan coba lagi.';
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

  if (isLoading && (!schedules || schedules.length === 0)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xs animate-pulse">Memuat data Jam Kerja (Skema 5-2)...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabel Utama Jam Kerja (Skema 5-2) */}
      <FiveTwoWorkHourTable
        data={Array.isArray(schedules) ? schedules : []}
        onEdit={handleOpenEdit}
        onExport={handleExport}
      />

      {/* Modal Dialog Form Edit */}
      <FiveTwoWorkHourDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        initialData={selectedItem}
        onSubmit={handleSubmitForm}
      />

      {/* 1. Dialog Pertanyaan Konfirmasi Simpan */}
      <ConfirmAlertDialog
        isOpen={isConfirmOpen}
        onClose={handleCancelConfirm}
        onConfirm={handleConfirmSave}
        title="Simpan Perubahan Jam Kerja?"
        description={`Apakah Anda yakin ingin memperbarui pengaturan jam kerja untuk "${selectedItem?.name || 'Jadwal'}"?`}
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

export default FiveTwoWorkHourPage;