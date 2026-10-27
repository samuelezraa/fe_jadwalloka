import React, { useState } from 'react';
import { useSchedulePeriod } from '../hooks/useSchedulePeriod';
import { PeriodeJadwalTable } from '../components/SchedulePeriodTable';
import { PeriodeJadwalDialog } from '../components/PeriodDialog';
import { ConfirmAlertDialog } from '@/components/ui/ConfirmAlertDialog';
import type { SchedulePeriodFormValues } from '../schemas/schedule-period.schema';

export const SchedulePeriodPage: React.FC = () => {
  const {
    data,
    isLoading,
    handleCreate,
  } = useSchedulePeriod();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<SchedulePeriodFormValues | null>(null);
  const [isSubmittingApi, setIsSubmittingApi] = useState(false);

  // State Dialog Konfirmasi (Pertanyaan)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // State Alert Result (Hasil Sukses / Gagal)
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
    setIsDialogOpen(true);
  };

  // 1. Saat Klik 'Simpan' di Form: Buka Dialog Konfirmasi
  const handleSubmitForm = (formData: SchedulePeriodFormValues) => {
    setPendingFormData(formData);
    setIsConfirmOpen(true);
  };

  // 2. Jika Batal Konfirmasi: Tutup dialog konfirmasi, form tetap terbuka
  const handleCancelConfirm = () => {
    setIsConfirmOpen(false);
  };

  // 3. Saat Klik 'Ya, Simpan': Tutup form & dialog konfirmasi, lalu jalankan API
  const handleConfirmSave = async () => {
    if (!pendingFormData) return;

    // Tutup Form Dialog & Dialog Konfirmasi secara bersamaan di awal
    setIsDialogOpen(false);
    setIsConfirmOpen(false);
    setIsSubmittingApi(true);

    try {
      await handleCreate(pendingFormData);

      setAlertConfig({
        isOpen: true,
        title: 'Berhasil Ditambahkan!',
        description: `Periode jadwal "${pendingFormData.periodeJadwal}" berhasil ditambahkan.`,
        variant: 'primary',
      });

      setPendingFormData(null);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Gagal menyimpan periode jadwal. Silakan coba lagi.';

      // Jika GAGAL, buka kembali form dialog agar pengguna dapat memperbaiki data
      setIsDialogOpen(true);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xs animate-pulse">
          Memuat data periode jadwal...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabel Utama */}
      <PeriodeJadwalTable
        data={data}
        onAddClick={handleOpenAdd}
      />

      {/* Modal Dialog Form */}
      <PeriodeJadwalDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmitForm}
      />

      {/* 1. Dialog Pertanyaan Konfirmasi */}
      <ConfirmAlertDialog
        isOpen={isConfirmOpen}
        onClose={handleCancelConfirm}
        onConfirm={handleConfirmSave}
        title="Tambah Periode Jadwal?"
        description={`Apakah Anda yakin ingin menambahkan periode jadwal "${pendingFormData?.periodeJadwal}"?`}
        confirmText="Simpan"
        variant="warning"
        isLoading={isSubmittingApi}
      />

      {/* 2. Alert Hasil Sukses / Gagal (Tombol Batal Disembunyikan) */}
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