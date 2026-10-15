import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Briefcase } from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
} from '@tanstack/react-table';

// Reusable UI Components (Keluar 4 level: pages -> input-jadwal -> jadwal -> features -> src)
import { DataTable } from '../../../../components/ui/data-table';
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';
import { FormSelect } from '../../../../components/ui/FormSelect';
import toast from 'react-hot-toast';

interface DetailJadwalHarian {
  id: string;
  no: number;
  hari: string;
  tanggal: string;
  kehadiran: 'Berangkat' | 'Libur' | 'PH' | 'Cuti';
  jamDatang: string;
  jamPulang: string;
  absensiDatang: string;
  absensiPulang: string;
  keterangan: string;
  ref: string;
}

export const EditJadwalKaryawanPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Dummy Header Info Karyawan Minimalis
  const karyawanInfo = {
    nama: 'User Trial IT',
    nip: '99-9999-99',
    periode: 'Oktober 2026',
    rentangTanggal: '2026-10-01 — 2026-10-31',
    skema: '5-2',
    totalHariKerja: 21,
    jamKerjaPerHari: 9,
  };

  // State Jadwal Harian
  const [jadwalList, setJadwalList] = useState<DetailJadwalHarian[]>([
    { id: '1', no: 1, hari: 'Kamis', tanggal: '2026-10-01', kehadiran: 'Berangkat', jamDatang: '09:03:00', jamPulang: '18:03:00', absensiDatang: '00:00:00', absensiPulang: '00:00:00', keterangan: '-', ref: '2026-10-01' },
    { id: '2', no: 2, hari: 'Jumat', tanggal: '2026-10-02', kehadiran: 'Libur', jamDatang: '00:00:00', jamPulang: '00:00:00', absensiDatang: '00:00:00', absensiPulang: '00:00:00', keterangan: '-', ref: '2026-10-01' },
    { id: '3', no: 3, hari: 'Sabtu', tanggal: '2026-10-03', kehadiran: 'Berangkat', jamDatang: '09:01:00', jamPulang: '18:01:00', absensiDatang: '00:00:00', absensiPulang: '00:00:00', keterangan: '-', ref: '2026-10-01' },
    { id: '4', no: 4, hari: 'Minggu', tanggal: '2026-10-04', kehadiran: 'Berangkat', jamDatang: '09:00:00', jamPulang: '18:00:00', absensiDatang: '00:00:00', absensiPulang: '00:00:00', keterangan: '-', ref: '2026-10-01' },
    { id: '5', no: 5, hari: 'Senin', tanggal: '2026-10-05', kehadiran: 'Libur', jamDatang: '09:00:00', jamPulang: '18:00:00', absensiDatang: '00:00:00', absensiPulang: '00:00:00', keterangan: '-', ref: '2026-10-01' },
  ]);

  const handleKehadiranChange = (rowId: string, val: any) => {
    setJadwalList((prev) =>
      prev.map((item) => (item.id === rowId ? { ...item, kehadiran: val } : item))
    );
  };

  const handleSave = () => {
    toast.success('Jadwal karyawan berhasil diperbarui!');
    navigate('/jadwal/input-jadwal');
  };

  const columns: ColumnDef<DetailJadwalHarian>[] = [
    { accessorKey: 'no', header: 'No.' },
    { accessorKey: 'hari', header: 'Hari' },
    { accessorKey: 'tanggal', header: 'Tanggal' },
    {
      accessorKey: 'kehadiran',
      header: 'Kehadiran',
      cell: ({ row }) => (
        <div className="w-32">
          <FormSelect
            value={row.original.kehadiran}
            onValueChange={(val) => handleKehadiranChange(row.original.id, val)}
            options={[
              { value: 'Berangkat', label: 'Berangkat' },
              { value: 'Libur', label: 'Libur' },
              { value: 'PH', label: 'PH' },
              { value: 'Cuti', label: 'Cuti' },
            ]}
          />
        </div>
      ),
    },
    { accessorKey: 'jamDatang', header: 'Jam Datang Jadwal' },
    { accessorKey: 'jamPulang', header: 'Jam Pulang Jadwal' },
    { accessorKey: 'absensiDatang', header: 'Absensi Datang' },
    { accessorKey: 'absensiPulang', header: 'Absensi Pulang' },
    { accessorKey: 'keterangan', header: 'Keterangan' },
    { accessorKey: 'ref', header: 'Ref' },
  ];

  const table = useReactTable({
    data: jadwalList,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6">
      {/* Header Tombol Kembali */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-bold text-gray-900 dark:text-gray-100">
            Edit Jadwal Karyawan
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Kelola rincian jadwal harian karyawan per periode
          </p>
        </div>
      </div>

      {/* HEADER MINIMALIS RINGKASAN KARYAWAN */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="text-center space-y-1 pb-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {karyawanInfo.nama}
          </h2>
          <p className="font-mono text-xs text-gray-500 dark:text-gray-400">
            {karyawanInfo.nip}
          </p>
          <div className="flex items-center justify-center gap-3 text-xs text-gray-600 dark:text-gray-300 pt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              {karyawanInfo.periode}
            </span>
            <span>•</span>
            <span>{karyawanInfo.rentangTanggal}</span>
          </div>
        </div>

        {/* Status Stat Ringkas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="flex items-center gap-3 p-3 bg-gray-50/80 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-semibold uppercase">Skema</p>
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{karyawanInfo.skema}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50/80 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-semibold uppercase">Total Hari Kerja</p>
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{karyawanInfo.totalHariKerja} Hari</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50/80 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-semibold uppercase">Jam Kerja/Hari</p>
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{karyawanInfo.jamKerjaPerHari} Jam</p>
            </div>
          </div>
        </div>
      </div>

      {/* TABEL EDIT JADWAL REUSABLE */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
            Edit Jadwal Karyawan
          </h3>
        </div>

        <DataTable table={table} columnsLength={columns.length} />

        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <CancelButton onClick={() => navigate(-1)} />
          <SaveButton onClick={handleSave} />
        </div>
      </div>
    </div>
  );
};