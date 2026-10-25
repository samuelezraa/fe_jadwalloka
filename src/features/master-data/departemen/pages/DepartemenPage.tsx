import React, { useState } from 'react';
import { useDepartemen } from '../hooks/useDepartemen';
import { DepartemenTable } from '../components/DepartemenTable';
import { DepartemenDialog } from '../components/DepartemenDialog';
import { ConfirmAlertDialog } from '../../../../components/ui/ConfirmAlertDialog';
import type { Departemen } from '../types/departemen.type';
import type { DepartemenFormValues } from '../schemas/departemen.schema';

export const DepartemenPage: React.FC = () => {
  const { 
    departemens = [], 
    isLoading, 
    addDepartemen, 
    editDepartemen 
  } = useDepartemen();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDepartemen, setSelectedDepartemen] = useState<Departemen | null>(null);

  // Data form sementara yang sedang menunggu konfirmasi
  const [pendingFormData, setPendingFormData] = useState<DepartemenFormValues | null>(null);
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
    setSelectedDepartemen(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: Departemen) => {
    setSelectedDepartemen(item);
    setIsDialogOpen(true);
  };

  // 1. Saat Klik 'Simpan' di Form: Buka Dialog Konfirmasi saja
  const handleSubmitForm = (formData: DepartemenFormValues) => {
    setPendingFormData(formData);
    setIsConfirmOpen(true);
  };

  // 2. Jika Batal Konfirmasi: Hanya tutup dialog konfirmasi, form tetap ada
  const handleCancelConfirm = () => {
    setIsConfirmOpen(false);
  };

  // 3. Saat Klik 'Ya, Simpan': TUTUP FORM EDIT DULUAN, baru eksekusi API & tampilkan alert sukses
  const handleConfirmSave = async () => {
    if (!pendingFormData) return;

    // Tutup Form Edit & Dialog Konfirmasi sekaligus secara bersamaan DI AWAL
    setIsDialogOpen(false);
    setIsConfirmOpen(false);
    setIsSubmittingApi(true);

    try {
      if (selectedDepartemen) {
        await editDepartemen(selectedDepartemen.id, pendingFormData);
        setAlertConfig({
          isOpen: true,
          title: 'Berhasil Diperbarui!',
          description: `Data departemen "${pendingFormData.name}" berhasil diperbarui.`,
          variant: 'primary',
        });
      } else {
        await addDepartemen(pendingFormData);
        setAlertConfig({
          isOpen: true,
          title: 'Berhasil Ditambahkan!',
          description: `Departemen baru "${pendingFormData.name}" berhasil ditambahkan.`,
          variant: 'primary',
        });
      }

      setPendingFormData(null);
      setSelectedDepartemen(null);
    } catch (error: any) {
      const errorMessage = error?.message || 'Gagal menyimpan data departemen. Silakan coba lagi.';
      
      // Jika GAGAL, baru buka kembali form edit agar user bisa perbaiki isinya
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
        <p className="text-gray-500 text-xs animate-pulse">Memuat data Departemen...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabel Utama */}
      <DepartemenTable
        data={Array.isArray(departemens) ? departemens : []}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
      />

      {/* Modal Dialog Form */}
      <DepartemenDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        initialData={selectedDepartemen}
        onSubmit={handleSubmitForm}
      />

      {/* 1. Dialog Pertanyaan Konfirmasi */}
      <ConfirmAlertDialog
        isOpen={isConfirmOpen}
        onClose={handleCancelConfirm}
        onConfirm={handleConfirmSave}
        title={selectedDepartemen ? 'Simpan Perubahan?' : 'Tambah Departemen?'}
        description={
          selectedDepartemen
            ? `Apakah Anda yakin ingin memperbarui data departemen "${pendingFormData?.name}"?`
            : `Apakah Anda yakin ingin menambahkan departemen "${pendingFormData?.name}"?`
        }
        confirmText="Ya, Simpan"
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