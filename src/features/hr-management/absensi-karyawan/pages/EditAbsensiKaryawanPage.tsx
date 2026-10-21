import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Briefcase, User } from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
} from '@tanstack/react-table';

import { DataTable } from '@/components/ui/data-table';
import { SaveButton, CancelButton } from '@/components/ui/ActionButtons';
import { FormSelect } from '@/components/ui/FormSelect';
import { FormTimeInput } from '@/components/ui/FormTimeInput';
import { Input } from '@/components/ui/input';
import { ConfirmAlertDialog } from '@/components/ui/ConfirmAlertDialog';
import toast from 'react-hot-toast';

interface DetailKehadiranHarian {
  id: string;
  no: number;
  hari: string;
  tanggal: string;
  kehadiran: 'Berangkat' | 'Libur' | 'PH' | 'Alfa' | 'Cuti';
  jamDatang: string;
  jamPulang: string;
  absenDatang: string;
  absenPulang: string;
  status: string;
  keterangan: string;
  ref: string;
}

interface KeteranganCellProps {
  value: string;
  onChange: (val: string) => void;
}

const KeteranganCell: React.FC<KeteranganCellProps> = ({ value, onChange }) => {
  const [localVal, setLocalVal] = useState(value);

  useEffect(() => {
    setLocalVal(value);
  }, [value]);

  return (
    <Input
      value={localVal}
      onChange={(e) => setLocalVal(e.target.value)}
      onBlur={() => {
        if (localVal !== value) {
          onChange(localVal);
        }
      }}
    />
  );
};

export const EditAbsensiKaryawanPage: React.FC = () => {
  const navigate = useNavigate();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const karyawanInfo = {
    nama: 'User Trial IT',
    nip: '99-9999-99',
    periode: 'Oktober 2026',
    rentangTanggal: '2026-10-01 — 2026-10-31',
    skema: '5-2',
    totalHariKerja: 21,
    jamKerjaPerHari: 9,
  };

  const [jadwalList, setJadwalList] = useState<DetailKehadiranHarian[]>([
    { id: '1', no: 1, hari: 'Kamis', tanggal: '2026-10-01', kehadiran: 'Berangkat', jamDatang: '09:00:00', jamPulang: '18:00:00', absenDatang: '00:00:00', absenPulang: '00:00:00', status: '-', keterangan: '-', ref: '2026-10-01' },
    { id: '2', no: 2, hari: 'Jumat', tanggal: '2026-10-02', kehadiran: 'Libur', jamDatang: '00:00:00', jamPulang: '00:00:00', absenDatang: '00:00:00', absenPulang: '00:00:00', status: '-', keterangan: '-', ref: '2026-10-01' },
    { id: '3', no: 3, hari: 'Sabtu', tanggal: '2026-10-03', kehadiran: 'PH', jamDatang: '00:00:00', jamPulang: '00:00:00', absenDatang: '00:00:00', absenPulang: '00:00:00', status: '-', keterangan: '-', ref: '2026-10-01' },
    { id: '4', no: 4, hari: 'Minggu', tanggal: '2026-10-04', kehadiran: 'Alfa', jamDatang: '00:00:00', jamPulang: '00:00:00', absenDatang: '00:00:00', absenPulang: '00:00:00', status: '-', keterangan: '-', ref: '2026-10-01' },
  ]);

  const handleFieldChange = (rowId: string, field: keyof DetailKehadiranHarian, value: any) => {
    setJadwalList((prev) =>
      prev.map((item) => (item.id === rowId ? { ...item, [field]: value } : item))
    );
  };

  const handleExecuteSave = () => {
    setIsConfirmOpen(false);
    toast.success('Data Absensi Karyawan berhasil disimpan!');
    navigate('/hr-management/absensi-karyawan');
  };

  const columns: ColumnDef<DetailKehadiranHarian>[] = [
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
              { value: 'Alfa', label: 'Alfa' },
              { value: 'Cuti', label: 'Cuti' },
            ]}
          />
        </div>
      ),
    },
    {
      accessorKey: 'jamDatang',
      header: () => <div className="text-center">Jam Datang</div>,
      cell: ({ row }) => (
        <FormTimeInput
          value={row.original.jamDatang}
          onChange={(newVal) => handleFieldChange(row.original.id, 'jamDatang', newVal)}
        />
      ),
    },
    {
      accessorKey: 'jamPulang',
      header: () => <div className="text-center">Jam Pulang</div>,
      cell: ({ row }) => (
        <FormTimeInput
          value={row.original.jamPulang}
          onChange={(newVal) => handleFieldChange(row.original.id, 'jamPulang', newVal)}
        />
      ),
    },
    {
      accessorKey: 'absenDatang',
      header: () => <div className="text-center">Absen Datang</div>,
      cell: ({ row }) => (
        <FormTimeInput
          value={row.original.absenDatang}
          onChange={(newVal) => handleFieldChange(row.original.id, 'absenDatang', newVal)}
        />
      ),
    },
    {
      accessorKey: 'absenPulang',
      header: () => <div className="text-center">Absen Pulang</div>,
      cell: ({ row }) => (
        <FormTimeInput
          value={row.original.absenPulang}
          onChange={(newVal) => handleFieldChange(row.original.id, 'absenPulang', newVal)}
        />
      ),
    },
    { accessorKey: 'status', header: 'Status' },
    {
      accessorKey: 'keterangan',
      header: 'Keterangan',
      cell: ({ row }) => (
        <KeteranganCell
          value={row.original.keterangan}
          onChange={(newVal) => handleFieldChange(row.original.id, 'keterangan', newVal)}
        />
      ),
    },
    { accessorKey: 'ref', header: 'Ref' },
  ];

  const table = useReactTable({
    data: jadwalList,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
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
            Edit Absensi Karyawan
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Kelola rincian status kehadiran dan jam kerja harian karyawan
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 dark:divide-gray-800">
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

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xs overflow-hidden">
        <DataTable table={table} columnsLength={columns.length} showOnMobile={true} />

        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <CancelButton onClick={() => navigate(-1)} />
          <SaveButton onClick={() => setIsConfirmOpen(true)} />
        </div>
      </div>

      <ConfirmAlertDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleExecuteSave}
        title="Simpan Perubahan Absensi Karyawan?"
        confirmText="Ya"
      />
    </div>
  );
};

export default EditAbsensiKaryawanPage;