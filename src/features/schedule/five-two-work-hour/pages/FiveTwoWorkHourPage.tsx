import React, { useState, useEffect } from 'react';
import { useFiveTwoWorkHour } from '../hooks/useFiveTwoWorkHour';
import { FiveTwoWorkHourTable } from '../components/FiveTwoWorkHourTable';
import { FiveTwoWorkHourDialog } from '../components/FiveTwoWorkHourDialog';
import { ConfirmAlertDialog } from '@/components/ui/ConfirmAlertDialog';
import { fiveTwoWorkHourService } from '../services/five-two-work-hour.service';
import type { FiveTwoWorkHourEmployee } from '../types/five-two-work-hour.type';
import type { FiveTwoWorkHourFormValues } from '../schemas/five-two-work-hour.schema';
import { api } from '@/lib/axios';

export const FiveTwoWorkHourPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [subDeptFilter, setSubDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [departemens, setDepartemens] = useState<any[]>([]);
  const [subDepartemens, setSubDepartemens] = useState<any[]>([]);

  const {
    schedules,
    meta,
    setPage,
    setPageSize,
    isLoading,
    updateSchedule,
    refetch,
  } = useFiveTwoWorkHour(searchQuery, deptFilter, subDeptFilter, statusFilter);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FiveTwoWorkHourEmployee | null>(null);
  const [pendingFormData, setPendingFormData] = useState<FiveTwoWorkHourFormValues | null>(null);
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

  // Fetch Master Departemen & Sub Departemen untuk Dropdown Filter
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [deptRes, subDeptRes] = await Promise.all([
          api.get('/departments'),
          api.get('/sub-departments'),
        ]);
        setDepartemens(deptRes.data.data || deptRes.data || []);
        setSubDepartemens(subDeptRes.data.data || subDeptRes.data || []);
      } catch (err) {
        console.error('Gagal memuat master departemen:', err);
      }
    };
    fetchMasterData();
  }, []);

  // Auto-close Pop-up Berhasil/Gagal dalam 1.5 detik tanpa perlu tombol OK
  useEffect(() => {
    if (alertConfig.isOpen) {
      const timer = setTimeout(() => {
        setAlertConfig((prev) => ({ ...prev, isOpen: false }));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [alertConfig.isOpen]);

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

  const handleExport = async () => {
    try {
      await fiveTwoWorkHourService.exportData();
    } catch (err) {
      setAlertConfig({
        isOpen: true,
        title: 'Export Gagal!',
        description: 'Gagal mengunduh data jam kerja.',
        variant: 'danger',
      });
    }
  };

  // Handler Download Sample Excel
  const handleDownloadSample = async () => {
    try {
      await fiveTwoWorkHourService.downloadSample();
    } catch (err) {
      setAlertConfig({
        isOpen: true,
        title: 'Download Sample Gagal!',
        description: 'Gagal mengunduh file sample jam kerja.',
        variant: 'danger',
      });
    }
  };

  // Handler Import File
// Handler Import File dengan Safety Catch
  const handleImportFile = async (file: File) => {
    try {
      await fiveTwoWorkHourService.importData(file);
      setAlertConfig({
        isOpen: true,
        title: 'Berhasil Diimpor!',
        description: 'Data jam kerja berhasil diimpor.',
        variant: 'primary',
      });
      refetch();
    } catch (err: any) {
      // Re-throw error agar ditangkap dan ditampilkan di ImportScheduleDialog
      throw err;
    }
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
      await updateSchedule(targetId, pendingFormData);

      setAlertConfig({
        isOpen: true,
        title: 'Berhasil Diperbarui!',
        description: `Pengaturan jam kerja "${selectedItem.employee_name || selectedItem.name || 'Karyawan'}" berhasil diperbarui.`,
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
        meta={meta}
        setPage={setPage}
        setPageSize={setPageSize}
        onEdit={handleOpenEdit}
        onExport={handleExport}
        onImport={handleImportFile}
        onDownloadSample={handleDownloadSample}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        deptFilter={deptFilter}
        onDeptFilterChange={setDeptFilter}
        subDeptFilter={subDeptFilter}
        onSubDeptFilterChange={setSubDeptFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        departemenList={departemens}
        subDepartemenList={subDepartemens}
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
        description={`Apakah Anda yakin ingin memperbarui pengaturan jam kerja untuk "${selectedItem?.employee_name || selectedItem?.name || 'Karyawan'}"?`}
        confirmText="Ya, Simpan"
        variant="warning"
        isLoading={isSubmittingApi}
      />

      {/* 2. Alert Hasil Sukses / Gagal (Otomatis Hilang Tanpa Tombol OK & Teks Hitam di Light Mode) */}
      <ConfirmAlertDialog
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={() => {}}
        title={alertConfig.title}
        description={alertConfig.description}
        variant={alertConfig.variant}
        confirmText=""
        cancelText=""
        showCancelButton={false}
        autoClose={true}
      />
    </div>
  );
};

export default FiveTwoWorkHourPage;