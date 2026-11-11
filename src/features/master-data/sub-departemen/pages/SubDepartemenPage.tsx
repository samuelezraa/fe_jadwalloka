import React, { useState, useEffect } from 'react';
import { useSubDepartemen } from '../hooks/useSubDepartemen';
import { useDepartemen } from '../../departemen/hooks/useDepartemen';
import { SubDepartemenTable } from '../components/SubDepartemenTable';
import { SubDepartemenDialog } from '../components/SubDepartemenDialog';
import { ConfirmAlertDialog } from '../../../../components/ui/ConfirmAlertDialog';
import type { SubDepartemen } from '../types/sub-departemen.type';
import type { SubDepartemenFormValues } from '../schemas/sub-departemen.schema';

export const SubDepartemenPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deptQuery, setDeptQuery] = useState('');
  const [statusQuery, setStatusQuery] = useState('');

  const { 
    subDepartemens = [], 
    meta,
    setPage,
    setPageSize,
    isLoading: isSubLoading, 
    addSubDepartemen, 
    editSubDepartemen 
  } = useSubDepartemen(searchQuery, deptQuery, statusQuery);

    // 🌟 Ubah pemanggilan ini agar hanya mengambil departemen yang aktif (status 'true')
  const { 
    departemens = [], 
    isLoading: isDeptLoading 
  } = useDepartemen('', 'true');


  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SubDepartemen | null>(null);

  const [pendingFormData, setPendingFormData] = useState<SubDepartemenFormValues | null>(null);
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

  // Auto-close alert hasil sukses setelah 1.5 detik
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

  const handleOpenEdit = (item: SubDepartemen) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleSubmitForm = (formData: SubDepartemenFormValues) => {
    setPendingFormData(formData);
    setIsDialogOpen(false); // Tutup dialog form agar tidak bertumpuk
    setIsConfirmOpen(true);
  };

  const handleCancelConfirm = () => {
    setIsConfirmOpen(false);
    setIsDialogOpen(true); // Buka kembali form dialog jika batal
  };

  const handleConfirmSave = async () => {
    if (!pendingFormData) return;

    setIsDialogOpen(false);
    setIsConfirmOpen(false);
    setIsSubmittingApi(true);

    try {
      if (selectedItem && selectedItem.id !== undefined) {
        await editSubDepartemen(Number(selectedItem.id), pendingFormData);
        setAlertConfig({
          isOpen: true,
          title: 'Berhasil Diperbarui!',
          description: `Sub departemen "${pendingFormData.name}" berhasil diperbarui.`,
          variant: 'primary',
        });
      } else {
        await addSubDepartemen(pendingFormData);
        setAlertConfig({
          isOpen: true,
          title: 'Berhasil Ditambahkan!',
          description: `Sub departemen baru "${pendingFormData.name}" berhasil ditambahkan.`,
          variant: 'primary',
        });
      }

      setPendingFormData(null);
      setSelectedItem(null);
    } catch (error: any) {
      const errorMessage = error?.message || 'Gagal menyimpan data sub departemen. Silakan coba lagi.';
      
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

  const isLoading = (isSubLoading && subDepartemens.length === 0) || isDeptLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xs animate-pulse">Memuat data sub departemen...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SubDepartemenTable
        data={Array.isArray(subDepartemens) ? subDepartemens : []}
        meta={meta}
        setPage={setPage}
        setPageSize={setPageSize}
        departemenList={Array.isArray(departemens) ? departemens : []}
        onEdit={handleOpenEdit}
        onAdd={handleOpenAdd}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedDeptFilter={deptQuery}
        onDeptFilterChange={setDeptQuery}
        statusFilter={statusQuery}
        onStatusFilterChange={setStatusQuery}
      />

      <SubDepartemenDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        initialData={selectedItem}
        departemenList={Array.isArray(departemens) ? departemens : []}
        onSubmit={handleSubmitForm}
      />

      {/* 1. Dialog Pertanyaan Konfirmasi */}
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
        confirmText="Ya, Simpan"
        variant="warning"
        isLoading={isSubmittingApi}
      />

      {/* 2. Alert Result Sukses / Gagal (Auto-Close Tanpa Tombol OK) */}
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