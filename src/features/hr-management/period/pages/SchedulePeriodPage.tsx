import React, { useState, useEffect } from 'react';
import { useSchedulePeriod } from '../hooks/useSchedulePeriod';
import { PeriodeJadwalTable } from '../components/SchedulePeriodTable';
import { PeriodeJadwalDialog } from '../components/PeriodDialog';
import { ConfirmAlertDialog } from '@/components/ui/ConfirmAlertDialog';
import type { SchedulePeriodFormValues } from '../schemas/schedule-period.schema';

export const SchedulePeriodPage: React.FC = () => {
  const {
    data,
    isLoading,
    meta,
    setPage,
    setPageSize,
    searchQuery,
    setSearchQuery,
    handleCreate,
  } = useSchedulePeriod();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<SchedulePeriodFormValues | null>(null);
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

  // 🟢 Efek Auto-Close untuk Alert Sukses / Gagal (Hilang sendiri setelah 2.5 detik)
  useEffect(() => {
    if (alertConfig.isOpen) {
      const timer = setTimeout(() => {
        setAlertConfig((prev) => ({ ...prev, isOpen: false }));
      }, 2500); // 2.5 detik

      return () => clearTimeout(timer);
    }
  }, [alertConfig.isOpen]);

  const handleOpenAdd = () => {
    setIsDialogOpen(true);
  };

  const handleSubmitForm = (formData: SchedulePeriodFormValues) => {
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

  if (isLoading && (!data || data.length === 0)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xs animate-pulse">Memuat data periode jadwal...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PeriodeJadwalTable
        data={data}
        meta={meta}
        setPage={setPage}
        setPageSize={setPageSize}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={handleOpenAdd}
      />

      <PeriodeJadwalDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmitForm}
      />

      {/* Dialog Konfirmasi Awal (Tetap butuh tombol simpan/batal) */}
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

      {/* 🟢 Pop-up Hasil Sukses/Gagal (Tanpa Tombol OK & Auto-Close) */}
      <ConfirmAlertDialog
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={() => {}}
        title={alertConfig.title}
        description={alertConfig.description}
        variant={alertConfig.variant}
        showCancelButton={false}
        confirmText="" 
      />
    </div>
  );
};

export default SchedulePeriodPage;