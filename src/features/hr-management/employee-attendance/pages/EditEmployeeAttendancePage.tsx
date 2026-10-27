import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { useEmployeeAttendanceDetail } from '../hooks/useEmployeeAttendance';
import type { DetailKehadiranHarian } from '../types/employee-attendance.type';

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

export const EditEmployeeAttendancePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { detailData, isLoading, isSubmitting, fetchDetail, saveDetail } =
    useEmployeeAttendanceDetail(id);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [jadwalList, setJadwalList] = useState<DetailKehadiranHarian[]>([]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    if (detailData?.jadwalList) {
      setJadwalList(detailData.jadwalList);
    }
  }, [detailData]);

  const handleFieldChange = (rowId: string, field: keyof DetailKehadiranHarian, value: any) => {
    setJadwalList((prev) =>
      prev.map((item) => (item.id === rowId ? { ...item, [field]: value } : item))
    );
  };

  const handleExecuteSave = async () => {
    setIsConfirmOpen(false);
    try {
      await saveDetail(jadwalList);
      // Refresh data detail agar data terbaru tampil tanpa berpindah halaman
      await fetchDetail();
    } catch (error) {
      // Error handling diproses oleh custom hook
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xs animate-pulse">
          Memuat rincian absensi karyawan...
        </p>
      </div>
    );
  }

  const karyawanInfo = detailData?.karyawanInfo;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/hr-management/employee-attendance')}
          className="..."
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

      {karyawanInfo && (
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
      )}

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xs overflow-hidden">
        <DataTable table={table} columnsLength={columns.length} showOnMobile={true} />

        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <CancelButton 
            onClick={() => navigate('/hr-management/employee-attendance')} 
            disabled={isSubmitting} 
          />
          <SaveButton onClick={() => setIsConfirmOpen(true)} isLoading={isSubmitting} />
        </div>
      </div>

      <ConfirmAlertDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleExecuteSave}
        title="Simpan Perubahan Absensi Karyawan?"
        confirmText="Ya"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default EditEmployeeAttendancePage;