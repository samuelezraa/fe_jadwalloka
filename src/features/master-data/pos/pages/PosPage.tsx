import React, { useState, useEffect } from 'react';
import { usePos } from '../hooks/usePos';
import { useDepartemen } from '../../departemen/hooks/useDepartemen';
import { useSubDepartemen } from '../../sub-departemen/hooks/useSubDepartemen';
import { PosTable } from '../components/PosTable';
import { PosDialog } from '../components/PosDialog';
import { ConfirmAlertDialog } from '../../../../components/ui/ConfirmAlertDialog';
import type { Pos } from '../types/pos.type';
import type { PosFormValues } from '../schemas/pos.schema';

export const PosPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deptQuery, setDeptQuery] = useState('');
  const [subDeptQuery, setSubDeptQuery] = useState('');
  const [statusQuery, setStatusQuery] = useState('');

  const { 
    data: posList = [], 
    meta,

    setPage,
 
    setPageSize,
    loading, 
    addPos, 
    editPos 
  } = usePos(searchQuery, deptQuery, subDeptQuery, statusQuery);

  const { departemens = [] } = useDepartemen('', 'true');
  const { subDepartemens = [] } = useSubDepartemen('', '', 'true');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Pos | null>(null);

  const [pendingFormData, setPendingFormData] = useState<PosFormValues | null>(null);
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

  const handleOpenEdit = (item: Pos) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleSubmitForm = (formData: PosFormValues) => {
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
      const payload = {
        department_code: pendingFormData.department_code,
        sub_department_code: pendingFormData.sub_department_code,
        code: pendingFormData.code,
        title: pendingFormData.title,
        is_active: pendingFormData.is_active ?? true,
      };

      if (selectedItem) {
        await editPos(selectedItem.id, payload);
        setAlertConfig({
          isOpen: true,
          title: 'Berhasil Diperbarui!',
          description: `Data POS "${pendingFormData.title}" berhasil diperbarui.`,
          variant: 'primary',
        });
      } else {
        await addPos(payload);
        setAlertConfig({
          isOpen: true,
          title: 'Berhasil Ditambahkan!',
          description: `POS baru "${pendingFormData.title}" berhasil ditambahkan.`,
          variant: 'primary',
        });
      }

      setPendingFormData(null);
      setSelectedItem(null);
    } catch (error: any) {
      const errorMessage = error?.message || 'Gagal menyimpan data POS. Silakan coba lagi.';
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

  if (loading && posList.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xs animate-pulse">Memuat data POS...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PosTable
        data={Array.isArray(posList) ? posList : []}
        meta={meta}
        setPage={setPage}
        setPageSize={setPageSize}
        departemenList={Array.isArray(departemens) ? departemens : []}
        subDepartemenList={Array.isArray(subDepartemens) ? subDepartemens : []}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedDeptFilter={deptQuery}
        onDeptFilterChange={setDeptQuery}
        selectedSubDeptFilter={subDeptQuery}
        onSubDeptFilterChange={setSubDeptQuery}
        selectedStatusFilter={statusQuery}
        onStatusFilterChange={setStatusQuery}
      />

      <PosDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        initialData={selectedItem}
        departemenList={Array.isArray(departemens) ? departemens : []}
        subDepartemenList={Array.isArray(subDepartemens) ? subDepartemens : []}
        onSubmit={handleSubmitForm}
      />

      <ConfirmAlertDialog
        isOpen={isConfirmOpen}
        onClose={handleCancelConfirm}
        onConfirm={handleConfirmSave}
        title={selectedItem ? 'Simpan Perubahan?' : 'Tambah POS?'}
        description={
          selectedItem
            ? `Apakah Anda yakin ingin memperbarui data POS "${pendingFormData?.title}"?`
            : `Apakah Anda yakin ingin menambahkan POS "${pendingFormData?.title}"?`
        }
        confirmText="Ya, Simpan"
        variant="warning"
        isLoading={isSubmittingApi}
      />

      {/* Alert Hasil Sukses / Gagal (Auto-Close Tanpa Tombol OK) */}
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