import React, { useState } from 'react';
import { useDataKaryawan } from '../hooks/useDataKaryawan';
import { DataKaryawanTable } from '../components/DataKaryawanTable';
import { DataKaryawanDialog, ImportDataKaryawanDialog } from '../components/DataKaryawanDialog';
import type { DataKaryawan } from '../types/data-karyawan.type';
import type { DataKaryawanFormValues } from '../schemas/data-karyawan.schema';
import toast from 'react-hot-toast';

export const DataKaryawanPage: React.FC = () => {
  const {
    data,
    loading,
    addKaryawan,
    editKaryawan,
    toggleStatusKaryawan,
    resetPasswordKaryawan,
  } = useDataKaryawan();

  // State Dialog Form Karyawan (Tambah / Edit)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DataKaryawan | null>(null);

  // State Dialog Import File
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleOpenAdd = () => {
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: DataKaryawan) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleSubmitForm = async (formData: DataKaryawanFormValues) => {
    if (selectedItem) {
      await editKaryawan(selectedItem.id, formData);
    } else {
      await addKaryawan(formData as any);
    }
    setIsDialogOpen(false);
  };

  // Handler Aksi Import, Export & Download Sample
  const handleImportFile = (file: File) => {
    console.log('File diunggah:', file);
    toast.success(`File "${file.name}" berhasil diunggah.`);
    // TODO: Panggil API / service import data karyawan di sini
  };

  const handleExportData = () => {
    toast.success('Mulai mengunduh data karyawan...');
    // TODO: Panggil service export Excel/CSV di sini
  };

  const handleDownloadSample = () => {
    toast.success('Mengunduh sampel format spreadsheet...');
    // TODO: Jalankan proses unduh file template sampel Excel/CSV di sini
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xs animate-pulse">Memuat data Karyawan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DataKaryawanTable
        data={data}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
        onToggleStatus={toggleStatusKaryawan}
        onBulkResetPassword={resetPasswordKaryawan}
        onDownloadSample={handleDownloadSample}
        onExportData={handleExportData}
        onImportData={() => setIsImportModalOpen(true)}
      />

      {/* Modal Dialog Form Tambah / Edit Karyawan */}
      <DataKaryawanDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        initialData={selectedItem}
        onSubmit={handleSubmitForm}
      />

      {/* Modal Dialog Import Data Spreadsheet */}
      <ImportDataKaryawanDialog
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportFile}
      />
    </div>
  );
};