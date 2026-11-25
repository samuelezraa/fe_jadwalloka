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
  const [serverErrors, setServerErrors] = useState<Record<string, string[]> | null>(null);

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
    setPendingFormData(null);
    setServerErrors(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: Departemen) => {
    setSelectedDepartemen(item);
    setPendingFormData(null);
    setServerErrors(null);
    setIsDialogOpen(true);
  };

  const handleSubmitForm = (formData: DepartemenFormValues) => {
    setServerErrors(null);
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

    setIsConfirmOpen(false);
    setIsSubmittingApi(true);

    try {
      if (selectedDepartemen) {
        await editDepartemen(selectedDepartemen.id, pendingFormData);
        setIsDialogOpen(false);
        setAlertConfig({
          isOpen: true,
          title: 'Berhasil Diperbarui!',
          description: `Data departemen "${pendingFormData.name}" berhasil diperbarui.`,
          variant: 'primary',
        });
      } else {
        await addDepartemen(pendingFormData);
        setIsDialogOpen(false);
        setAlertConfig({
          isOpen: true,
          title: 'Berhasil Ditambahkan!',
          description: `Departemen baru "${pendingFormData.name}" berhasil ditambahkan.`,
          variant: 'primary',
        });
      }

      setPendingFormData(null);
      setSelectedDepartemen(null);
      setServerErrors(null);
    } catch (error: any) {
      const apiErrors = error?.response?.data?.errors || null;
      setServerErrors(apiErrors);
      setIsDialogOpen(true);
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
        onClose={() => {
          setIsDialogOpen(false);
          setPendingFormData(null);
          setServerErrors(null);
        }}
        initialData={selectedDepartemen}
        draftValues={pendingFormData}
        existingDepartemens={Array.isArray(departemens) ? departemens : []}
        serverErrors={serverErrors}
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