import React, { useState } from 'react';
import { InputJadwalTable } from '../components/InputJadwalTable';
import { InputJadwalDialog } from '../components/InputJadwalDialog';
// ✅ UBAH BARIS DI BAWAH INI: Arahkan ke folder ui/
import { ImportJadwalDialog } from '@/components/ui/ImportJadwalDialog';
import { SettingJamMingguanDialog } from '../components/SettingJamMingguanDialog';
import { useInputJadwal } from '../hooks/useInputJadwal';

export const InputJadwalPage: React.FC = () => {
  const {
    data,
    selectedItem,
    isDialogOpen,
    isLoading,
    handleEdit,
    handleCloseDialog,
    handleSubmitForm,
  } = useInputJadwal();

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  const handleSettingGlobal = () => {
    setIsSettingOpen(true);
  };

  const handleOpenImport = () => {
    setIsImportOpen(true);
  };

  const handleExecuteImport = (file: File) => {
    console.log('File diimport:', file);
  };

  const handleExport = () => {
    alert('Mengunduh data jadwal...');
  };

  const handleSaveSetting = (formData: {
    id_periode: string;
    skema_kerja: string;
    total_hari: number;
    masuk: number;
    libur: number;
    ph: number;
    cuti: number;
  }) => {
    console.log('Menyimpan setting jam mingguan global:', formData);
    alert('Pengaturan jadwal global untuk semua karyawan berhasil disimpan.');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400 text-xs animate-pulse">
          Memuat data Jadwal...
        </p>
      </div>
    );
  }

  return (
    <div className="px-0 py-4 md:p-6">
      <InputJadwalTable
        data={data}
        onEdit={handleEdit}
        onSettingGlobal={handleSettingGlobal}
        onImport={handleOpenImport}
        onExport={handleExport}
      />

      {/* Modal Dialog Edit Jadwal */}
      <InputJadwalDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        initialData={selectedItem}
        onSubmit={handleSubmitForm}
      />

      {/* Modal Dialog Import */}
      <ImportJadwalDialog
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={handleExecuteImport}
      />

      {/* Modal Dialog Setting Jam Mingguan (Global) */}
      <SettingJamMingguanDialog
        isOpen={isSettingOpen}
        onClose={() => setIsSettingOpen(false)}
        onSave={handleSaveSetting}
      />
    </div>
  );
};

export default InputJadwalPage;