import React, { useState } from 'react';
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';
import { CustomDialog } from '../../../../components/ui/CustomDialog';
import { FormInput } from '../../../../components/ui/FormInput';
import { FormSelect } from '../../../../components/ui/FormSelect';
import { FormTextarea } from '../../../../components/ui/FormTextarea';
import { DatePicker } from '../../../../components/ui/DatePicker';

interface KomplimenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

export const KomplimenModal: React.FC<KomplimenModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [nip, setNip] = useState('');
  const [nama, setNama] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [kategori, setKategori] = useState('Koreksi Absen Masuk');
  const [keterangan, setKeterangan] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nip, nama, tanggal, kategori, keterangan, status: 'Pending', departemen: 'IT' });
    onClose();
  };

  return (
    <CustomDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Pengajuan Komplimen"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <FormInput
          label="NIP Karyawan"
          required
          value={nip}
          onChange={(e) => setNip(e.target.value)}
          placeholder="Contoh: 9999"
        />

        <FormInput
          label="Nama Karyawan"
          required
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Contoh: User Trial IT"
        />

        <DatePicker
          label="Tanggal"
          value={tanggal}
          onChange={(date) => setTanggal(date)}
          placeholder="Pilih tanggal"
        />

        <FormSelect
          label="Kategori Komplimen"
          value={kategori}
          onChange={(val: string) => setKategori(val)} 
          options={[
            { value: 'Koreksi Absen Masuk', label: 'Koreksi Absen Masuk' },
            { value: 'Koreksi Absen Pulang', label: 'Koreksi Absen Pulang' },
            { value: 'Lembur', label: 'Lembur' },
            { value: 'Sakit / Izin', label: 'Sakit / Izin' },
          ]}
        />

        <FormTextarea
          label="Keterangan"
          rows={3}
          required
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
          placeholder="Tuliskan alasan atau keterangan pengajuan..."
        />

        {/* Footer Tombol Aksi */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
          <CancelButton onClick={onClose}>Batal</CancelButton>
          <SaveButton type="submit">Simpan Pengajuan</SaveButton>
        </div>
      </form>
    </CustomDialog>
  );
};