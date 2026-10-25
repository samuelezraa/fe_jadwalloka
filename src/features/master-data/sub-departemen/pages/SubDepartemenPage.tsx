import React, { useState } from 'react';
import { useSubDepartemen } from '../hooks/useSubDepartemen';
import { useDepartemen } from '../../departemen/hooks/useDepartemen';
import { SubDepartemenTable } from '../components/SubDepartemenTable';
import { SubDepartemenDialog } from '../components/SubDepartemenDialog';
import { ConfirmAlertDialog } from '../../../../components/ui/ConfirmAlertDialog';
import type { SubDepartemen } from '../types/sub-departemen.type';
import type { SubDepartemenFormValues } from '../schemas/sub-departemen.schema';

export const SubDepartemenPage: React.FC = () => {
  // Destructure sesuai dengan return dari custom hooks (departemens/subDepartemens & isLoading)
  const { 
    subDepartemens = [], 
    isLoading: isSubLoading, 
    addSubDepartemen, 
    editSubDepartemen 
  } = useSubDepartemen();
  
  
  // Ubah destructuring `departemens` menjadi `data: departemens` (alias)
 const { 
  departemens = [], 
  isLoading: isDeptLoading 
} = useDepartemen();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SubDepartemen | null>(null);

  // State untuk menyimpan data form sementara yang akan dikonfirmasi
  const [pendingFormData, setPendingFormData] = useState<SubDepartemenFormValues | null>(null);
  const [isSubmittingApi, setIsSubmittingApi] = useState(false);

  // State Dialog Konfirmasi (Pertanyaan sebelum simpan)
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
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: SubDepartemen) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  // 1. Saat Klik 'Simpan' di Form: Tahan data & Buka Dialog Konfirmasi Pertanyaan
  const handleSubmitForm = (formData: SubDepartemenFormValues) => {
    setPendingFormData(formData);
    setIsConfirmOpen(true);
  };

  // 2. Batal Konfirmasi: Tutup dialog konfirmasi, form tetap ada
  const handleCancelConfirm = () => {
    setIsConfirmOpen(false);
  };

  // 3. Eksekusi API saat user klik 'Ya, Simpan' di Dialog Konfirmasi
  const handleConfirmSave = async () => {
    if (!pendingFormData) return;

    // ⚡ TUTUP FORM EDIT & DIALOG KONFIRMASI DULUAN DI AWAL (agar tidak saling tumpuk)
    setIsDialogOpen(false);
    setIsConfirmOpen(false);
    setIsSubmittingApi(true);

    try {
      // Lakukan pengecekan ID terlebih dahulu sebelum memanggil API
      if (selectedItem && selectedItem.id !== undefined) {
        // Konversi selectedItem.id ke number secara eksplisit
        await editSubDepartemen(Number(selectedItem.id), pendingFormData);

        setAlertConfig({
          isOpen: true,
          title: 'Berhasil Diperbarui!',
          description: `Sub departemen berhasil diperbarui.`,
          variant: 'primary',
        });
      } else {
        // Alur untuk tambah data baru
        await addSubDepartemen(pendingFormData);


        setAlertConfig({
          isOpen: true,
          title: 'Berhasil Ditambahkan!',
          description: `Sub departemen baru berhasil ditambahkan.`,
          variant: 'primary',
        });
      }

      setPendingFormData(null);
      setSelectedItem(null);
    } catch (error: any) {
      const errorMessage = error?.message || 'Gagal menyimpan data sub departemen. Silakan coba lagi.';
      
      // Buka kembali modal form edit jika terjadi kesalahan jaringan/server
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

  const isLoading = isSubLoading || isDeptLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xs animate-pulse">Memuat data sub departemen...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabel Utama Sub Departemen */}
    {/* KODE PERBAIKAN */}
    <SubDepartemenTable
      data={Array.isArray(subDepartemens) ? subDepartemens : []}
      departemenList={Array.isArray(departemens) ? departemens : []}
      onEdit={handleOpenEdit}
      onAdd={handleOpenAdd}
/>

      {/* Modal Dialog Form */}
     <SubDepartemenDialog
      isOpen={isDialogOpen}
      onClose={() => setIsDialogOpen(false)}
      initialData={selectedItem}
      departemenList={Array.isArray(departemens) ? departemens : []}
      onSubmit={handleSubmitForm}
    />

      {/* 1. Dialog Pertanyaan Konfirmasi Sebelum Simpan */}
      <ConfirmAlertDialog
        isOpen={isConfirmOpen}
        onClose={handleCancelConfirm}
        onConfirm={handleConfirmSave}
        title={selectedItem ? 'Simpan Perubahan?' : 'Tambah Sub Departemen?'}
        description={
          selectedItem
            ? `Apakah Anda yakin ingin memperbarui data sub departemen "${pendingFormData?.name}"?`
            : `Apakah Anda yakin ingin menambahkan sub departemen "${pendingFormData?.name}"?`
        }
        confirmText="Simpan"
        variant="warning"
        isLoading={isSubmittingApi}
      />

      {/* 2. Alert Result (Sukses / Gagal Setelah Simpan) */}
      {/* 2. Alert Result (Sukses / Gagal Setelah Simpan) */}
      <ConfirmAlertDialog
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={() => setAlertConfig((prev) => ({ ...prev, isOpen: false }))}
        title={alertConfig.title}
        description={alertConfig.description}
        variant={alertConfig.variant}
        confirmText="OK"
        cancelText=""
      />
    </div>
  );
};