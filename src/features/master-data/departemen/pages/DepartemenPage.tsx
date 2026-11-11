import React, { useState, useEffect } from 'react';
import { useDepartemen } from '../hooks/useDepartemen';
import { DepartemenTable } from '../components/DepartemenTable';
import { DepartemenDialog } from '../components/DepartemenDialog';
import { ConfirmAlertDialog } from '../../../../components/ui/ConfirmAlertDialog';
import type { Departemen } from '../types/departemen.type';
import type { DepartemenFormValues } from '../schemas/departemen.schema';

export const DepartemenPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusQuery, setStatusQuery] = useState('');

  // 🌟 Ambil meta, page, dan setter pagination dari hook
  const { 
    departemens = [], 
    meta,
    setPage,
    setPageSize,
    isLoading, 
    addDepartemen, 
    editDepartemen 
  } = useDepartemen(searchQuery, statusQuery);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDepartemen, setSelectedDepartemen] = useState<Departemen | null>(null);

  const [pendingFormData, setPendingFormData] = useState<DepartemenFormValues | null>(null);
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

  // Auto-close alert sukses otomatis setelah 1.5 detik
  useEffect(() => {
    if (alertConfig.isOpen && alertConfig.variant === 'primary') {
      const timer = setTimeout(() => {
        setAlertConfig((prev) => ({ ...prev, isOpen: false }));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [alertConfig.isOpen, alertConfig.variant]);

  const handleOpenAdd = () => {
    setSelectedDepartemen(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: Departemen) => {
    setSelectedDepartemen(item);
    setIsDialogOpen(true);
  };

  const handleSubmitForm = (formData: DepartemenFormValues) => {
    setPendingFormData(formData);
    setIsDialogOpen(false);
    setIsConfirmOpen(true);
  };

  const handleCancelConfirm = () => {
    setIsConfirmOpen(false);
    setIsDialogOpen(true);
  };

  const handleConfirmSave = async () => {
    if (!pendingFormData) return;

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

  if (isLoading && departemens.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xs animate-pulse">Memuat data Departemen...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 🌟 Kirimkan props pagination lengkap ke DepartemenTable */}
      <DepartemenTable
        data={Array.isArray(departemens) ? departemens : []}
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

      <DepartemenDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        initialData={selectedDepartemen}
        onSubmit={handleSubmitForm}
      />

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