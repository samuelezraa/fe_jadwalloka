import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputJadwalTable } from '../components/InputJadwalTable';
import { ImportJadwalDialog } from '@/components/ui/ImportJadwalDialog';
import { SettingJamMingguanDialog } from '../components/SettingJamMingguanDialog';
import { useInputJadwal } from '../hooks/useInputJadwal';
import type { InputJadwalPeriode } from '../types/input-jadwal.type';
import toast from 'react-hot-toast';

export const InputJadwalPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    data,
    isLoading,
  } = useInputJadwal();

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  // 🌟 Pindah ke Halaman Baru saat Edit diklik
  const handleNavigateEdit = (item: InputJadwalPeriode) => {
    navigate(`/jadwal/input-jadwal/edit/${item.id_periode}`);
  };

  const handleSettingGlobal = () => {
    setIsSettingOpen(true);
  };

  const handleOpenImport = () => {
    setIsImportOpen(true);
  };

  const handleExecuteImport = (file: File) => {
    console.log('File diimport:', file);
    toast.success('Data jadwal berhasil diimport!');
    setIsImportOpen(false);
  };

  const handleExport = () => {
    toast.success('Unduhan data jadwal dimulai...');
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
    toast.success('Pengaturan jadwal global untuk semua karyawan berhasil disimpan.');
    setIsSettingOpen(false);
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
    /* 🌟 Disamakan persis dengan DataKaryawanPage.tsx menggunakan space-y-6 */
    <div className="space-y-6">
      <InputJadwalTable
        data={data}
        onEdit={handleNavigateEdit}
        onSettingGlobal={handleSettingGlobal}
        onImport={handleOpenImport}
        onExport={handleExport}
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