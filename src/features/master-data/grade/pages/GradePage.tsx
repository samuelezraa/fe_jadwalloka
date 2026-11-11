import React, { useState, useEffect } from 'react';
import { useGrade } from '../hooks/useGrade';
import { GradeTable } from '../components/GradeTable';
import { GradeDialog } from '../components/GradeDialog';
import { ConfirmAlertDialog } from '../../../../components/ui/ConfirmAlertDialog';
import type { Grade } from '../types/grade.type';
import type { GradeFormValues } from '../schemas/grade.schema';

export const GradePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusQuery, setStatusQuery] = useState('');

  const { 
    grades, 
    meta,
    setPage,
    setPageSize,
    isLoading, 
    createGrade, 
    updateGrade 
  } = useGrade(searchQuery, statusQuery);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Grade | null>(null);

  const [pendingFormData, setPendingFormData] = useState<GradeFormValues | null>(null);
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

  // Auto-close alert sukses setelah 1.5 detik
  useEffect(() => {
    if (alertConfig.isOpen && alertConfig.variant === 'primary') {
      const timer = setTimeout(() => {
        setAlertConfig((prev) => ({ ...prev, isOpen: false }));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [alertConfig.isOpen, alertConfig.variant]);

  const handleOpenAdd = () => {
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: Grade) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleSubmitForm = (formData: GradeFormValues) => {
    setPendingFormData(formData);
    setIsDialogOpen(false); // Tutup dialog form agar tidak bertumpuk
    setIsConfirmOpen(true);
  };

  const handleCancelConfirm = () => {
    setIsConfirmOpen(false);
    setIsDialogOpen(true); // Buka kembali jika batal
  };

  const handleConfirmSave = async () => {
    if (!pendingFormData) return;

    setIsDialogOpen(false);
    setIsConfirmOpen(false);
    setIsSubmittingApi(true);

    try {
      if (selectedItem) {
        const targetId = selectedItem.code || selectedItem.id;
        await updateGrade({
          id: targetId!,
          data: {
            code: pendingFormData.code,
            name: pendingFormData.name,
            level: Number(pendingFormData.level), // 🌟 Menyertakan level
            is_active: pendingFormData.is_active,
          },
        });
        setAlertConfig({
          isOpen: true,
          title: 'Berhasil Diperbarui!',
          description: `Data grade "${pendingFormData.name}" berhasil diperbarui.`,
          variant: 'primary',
        });
      } else {
        await createGrade({
          code: pendingFormData.code,
          name: pendingFormData.name,
          level: Number(pendingFormData.level), // 🌟 Menyertakan level agar tidak error required
          is_active: true,
        });
        setAlertConfig({
          isOpen: true,
          title: 'Berhasil Ditambahkan!',
          description: `Grade baru "${pendingFormData.name}" berhasil ditambahkan.`,
          variant: 'primary',
        });
      }

      setPendingFormData(null);
      setSelectedItem(null);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Gagal menyimpan data Grade. Silakan coba lagi.';
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

  if (isLoading && (!grades || grades.length === 0)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xs animate-pulse">Memuat data Grade...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GradeTable
        data={Array.isArray(grades) ? grades : []}
        meta={meta}
        setPage={setPage}
        setPageSize={setPageSize}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusQuery}
        onStatusFilterChange={setStatusQuery}
      />

      <GradeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        initialData={selectedItem}
        onSubmit={handleSubmitForm}
      />

      <ConfirmAlertDialog
        isOpen={isConfirmOpen}
        onClose={handleCancelConfirm}
        onConfirm={handleConfirmSave}
        title={selectedItem ? 'Simpan Perubahan?' : 'Tambah Grade?'}
        description={
          selectedItem
            ? `Apakah Anda yakin ingin memperbarui data grade "${pendingFormData?.name}"?`
            : `Apakah Anda yakin ingin menambahkan grade "${pendingFormData?.name}"?`
        }
        confirmText="Ya, Simpan"
        variant="warning"
        isLoading={isSubmittingApi}
      />

      {/* Alert Sukses/Gagal (Auto-Close Tanpa Tombol OK) */}
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