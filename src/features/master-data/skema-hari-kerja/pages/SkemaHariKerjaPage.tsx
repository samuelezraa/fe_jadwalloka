import React, { useState } from 'react';
import { useSkemaHariKerja } from '../hooks/useSkemaHariKerja';
import { SkemaHariKerjaTable } from '../components/SkemaHariKerjaTable';
import { SkemaHariKerjaDialog } from '../components/SkemaHariKerjaDialog';
import { CustomDialog } from '../../../../components/ui/CustomDialog'; // 👈 Menggunakan CustomDialog yang ada
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';
import type { SkemaHariKerja } from '../types/skema-hari-kerja.type';
import type { SkemaHariKerjaFormValues } from '../schemas/skema-hari-kerja.schema';
import toast from 'react-hot-toast';

export const SkemaHariKerjaPage: React.FC = () => {
  const { data, loading, addSkema, editSkema } = useSkemaHariKerja();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SkemaHariKerja | null>(null);

  // State dialog konfirmasi simpan
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<SkemaHariKerjaFormValues | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAdd = () => {
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: SkemaHariKerja) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  // 1. Menerima submit dari form, menampung data, lalu membuka dialog konfirmasi
  const handleFormSubmit = (formData: SkemaHariKerjaFormValues) => {
    setPendingFormData(formData);
    setIsConfirmOpen(true);
  };

  // 2. Eksekusi simpan setelah tombol konfirmasi diklik
  const handleConfirmSave = async () => {
    if (!pendingFormData) return;

    setIsSubmitting(true);
    try {
      if (selectedItem) {
        await editSkema(selectedItem.id, pendingFormData);
        toast.success('Skema hari kerja berhasil diperbarui!');
      } else {
        await addSkema(pendingFormData);
        toast.success('Skema hari kerja berhasil ditambahkan!');
      }

      setIsConfirmOpen(false);
      setIsDialogOpen(false);
      setPendingFormData(null);
    } catch (error) {
      console.error('Error saat menyimpan skema:', error);
      toast.error('Gagal menyimpan skema hari kerja.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xs animate-pulse">Memuat data Skema Hari Kerja...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SkemaHariKerjaTable
        data={data}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
      />

      {/* Dialog Form Tambah / Edit */}
      <SkemaHariKerjaDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        initialData={selectedItem}
        onSubmit={handleFormSubmit}
      />

      {/* 🌟 Modal Konfirmasi menggunakan CustomDialog langsung */}
      <CustomDialog
        isOpen={isConfirmOpen}
        onClose={() => !isSubmitting && setIsConfirmOpen(false)}
        title="Konfirmasi Perubahan"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4 py-1">
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Apakah Anda yakin ingin {selectedItem ? 'mengubah' : 'menambahkan'} data skema hari kerja ini?
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <CancelButton 
              onClick={() => setIsConfirmOpen(false)} 
              disabled={isSubmitting} 
            />
            <SaveButton 
              onClick={handleConfirmSave} 
              isLoading={isSubmitting}
            >
              Ya, Simpan
            </SaveButton>
          </div>
        </div>
      </CustomDialog>
    </div>
  );
};