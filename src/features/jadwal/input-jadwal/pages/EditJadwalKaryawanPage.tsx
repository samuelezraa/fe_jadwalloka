import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Briefcase, User } from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
} from '@tanstack/react-table';

// Reusable UI Components
import { DataTable } from '../../../../components/ui/data-table';
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';
import { FormSelect } from '../../../../components/ui/FormSelect';
import { EditableTimeCell } from '../../../../components/ui/EditableTimeCell';
import { ConfirmAlertDialog } from '../../../../components/ui/ConfirmAlertDialog';
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

  // State untuk mengontrol dialog konfirmasi simpan
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Header Info Karyawan
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

  const handleFieldChange = (rowId: string, field: keyof DetailJadwalHarian, value: any) => {
    setJadwalList((prev) =>
      prev.map((item) => (item.id === rowId ? { ...item, [field]: value } : item))
    );
  };

  // Fungsi saat tombol simpan diklik (membuka dialog)
  const handleOpenConfirm = () => {
    setIsConfirmOpen(true);
  };

  // Fungsi eksekusi simpan setelah dikonfirmasi
  const handleExecuteSave = () => {
    setIsConfirmOpen(false);
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
            onValueChange={(val) => handleFieldChange(row.original.id, 'kehadiran', val)}
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
    {
      accessorKey: 'jamDatang',
      header: () => <div className="text-center">Jam Datang Jadwal</div>,
      cell: ({ row }) => (
        <EditableTimeCell
          value={row.original.jamDatang}
          onChange={(newVal) => handleFieldChange(row.original.id, 'jamDatang', newVal)}
        />
      ),
    },
    {
      accessorKey: 'jamPulang',
      header: () => <div className="text-center">Jam Pulang Jadwal</div>,
      cell: ({ row }) => (
        <EditableTimeCell
          value={row.original.jamPulang}
          onChange={(newVal) => handleFieldChange(row.original.id, 'jamPulang', newVal)}
        />
      ),
    },
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
    <div className="space-y-4">
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

      {/* CARD HEADER INFO KARYAWAN */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 dark:divide-gray-800">
          
          {/* Section 1: Profil Karyawan & Periode */}
          <div className="flex items-center gap-3 pr-2 w-full lg:w-auto">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {karyawanInfo.nama}
                </h2>
                <span className="font-mono text-[11px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                  {karyawanInfo.nip}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{karyawanInfo.periode}</span>
                <span>•</span>
                <span>{karyawanInfo.rentangTanggal}</span>
              </p>
            </div>
          </div>

          {/* Section 2: Stat Badges Sejajar */}
          <div className="flex items-center justify-between lg:justify-end gap-6 pt-3 lg:pt-0 pl-0 lg:pl-6 w-full lg:w-auto shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Skema</p>
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{karyawanInfo.skema}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-lg shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Total Hari</p>
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{karyawanInfo.totalHariKerja} Hari</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-lg shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Jam / Hari</p>
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{karyawanInfo.jamKerjaPerHari} Jam</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* CONTAINER EDIT JADWAL */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xs overflow-hidden w-full max-w-full min-w-0">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
            Edit Jadwal Karyawan
          </h3>
        </div>

        {/* Tabel dengan scroll horizontal mobile */}
        <DataTable 
          table={table} 
          columnsLength={columns.length} 
          showOnMobile={true} 
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <CancelButton onClick={() => navigate(-1)} />
          <SaveButton onClick={handleOpenConfirm} />
        </div>
      </div>

      {/* DIALOG KONFIRMASI SIMPAN */}
      {/* DIALOG KONFIRMASI SIMPAN */}
      <ConfirmAlertDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleExecuteSave}
        title="Simpan Perubahan Jadwal?"
        confirmText="Ya"
      />
    </div>
  );
};