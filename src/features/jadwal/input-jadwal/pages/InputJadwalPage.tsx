import React, { useState } from 'react';
import { InputJadwalTable } from '../components/InputJadwalTable';
import { InputJadwalDialog } from '../components/InputJadwalDialog';
import { ImportJadwalDialog } from '../components/ImportJadwalDialog';
import { SettingJamMingguanDialog } from '../components/SettingJamMingguanDialog';
import { useInputJadwal } from '../hooks/useInputJadwal';

export const InputJadwalPage: React.FC = () => {
  const {
    data,
    selectedItem,
    isDialogOpen,
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

  return (
    /* Mengubah padding horizontal mobile menjadi px-2 agar sejajar dengan halaman Jam Kerja */
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