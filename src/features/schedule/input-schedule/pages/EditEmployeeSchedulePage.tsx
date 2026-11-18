import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom'; // 🟢 Tambahkan useLocation
import { ArrowLeft, Clock } from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
} from '@tanstack/react-table';
import toast from 'react-hot-toast';

// Reusable UI Components & Custom Components
import { DataTable } from '../../../../components/ui/data-table';
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';
import { FormSelect } from '../../../../components/ui/FormSelect';
import { FormTimeInput } from '../../../../components/ui/FormTimeInput';
import { ConfirmAlertDialog } from '../../../../components/ui/ConfirmAlertDialog';
import { EmployeeScheduleHeaderCard } from '../components/EmployeeScheduleHeaderCard';
import { inputScheduleService } from '../services/input-schedule.service';

interface DailyScheduleDetail {
  id: string;
  no: number;
  dayName: string;
  date: string;
  attendanceStatus: 'Berangkat' | 'Libur' | 'PH' | 'Cuti';
  scheduledCheckIn: string;
  scheduledCheckOut: string;
  actualCheckIn: string;
  actualCheckOut: string;
  notes: string;
  ref: string;
}

export const EditEmployeeSchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation(); // 🟢 Ambil informasi URL location

  // 🟢 Deteksi apakah mode readonly aktif berdasarkan query parameter (?readonly=true)
  const searchParams = new URLSearchParams(location.search);
  const isReadonly = searchParams.get('readonly') === 'true';

  // State Loading & Data
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [employeeInfo, setEmployeeInfo] = useState<any>({
    name: '-',
    nip: '-',
    period: '-',
    dateRange: '-',
    scheme: '5-2',
    hoursPerDay: 9,
    summary: {
      totalPeriodDays: 0,
      totalWorkDays: 0,
      totalOffDays: 0,
      totalPhDays: 0,
      totalPermitDays: 0,
      totalAlphaDays: 0,
      totalLeaveDays: 0,
      totalLateDays: 0,
    },
  });
  const [scheduleList, setScheduleList] = useState<DailyScheduleDetail[]>([]);

  // State Dialog & Alert
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmittingApi, setIsSubmittingApi] = useState(false);
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

  const fetchDetail = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await inputScheduleService.getEmployeeScheduleDetail(id);
      if (res.employeeInfo) {
        setEmployeeInfo(res.employeeInfo);
      }
      if (res.scheduleList) {
        setScheduleList(res.scheduleList);
      }
    } catch (error) {
      toast.error('Gagal mengambil detail jadwal karyawan.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  useEffect(() => {
    if (alertConfig.isOpen) {
      const timer = setTimeout(() => {
        setAlertConfig((prev) => ({ ...prev, isOpen: false }));
        fetchDetail();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [alertConfig.isOpen]);

  const handleFieldChange = (rowId: string, field: keyof DailyScheduleDetail, value: any) => {
    if (isReadonly) return; // Blokir perubahan jika readonly
    setScheduleList((prev) =>
      prev.map((item) => (item.id === rowId ? { ...item, [field]: value } : item))
    );
  };

  const handleConfirmSave = async () => {
    if (!id || isReadonly) return;
    setIsConfirmOpen(false);
    setIsSubmittingApi(true);

    try {
      await inputScheduleService.updateEmployeeSchedule(id, { scheduleList });

      setAlertConfig({
        isOpen: true,
        title: 'Berhasil Diperbarui!',
        description: `Jadwal karyawan "${employeeInfo.name}" berhasil diperbarui.`,
        variant: 'primary',
      });
    } catch (error: any) {
      setAlertConfig({
        isOpen: true,
        title: 'Gagal Menyimpan!',
        description: error?.response?.data?.message || 'Terjadi kesalahan saat menyimpan jadwal. Silakan coba lagi.',
        variant: 'danger',
      });
    } finally {
      setIsSubmittingApi(false);
    }
  };

  const columns: ColumnDef<DailyScheduleDetail>[] = [
    { accessorKey: 'no', header: 'No.' },
    { accessorKey: 'dayName', header: 'Hari' },
    {
      accessorKey: 'date',
      cell: ({ row }: { row: any }) => (
        <span className="font-mono text-xs">{row.original.date}</span>
      ),
      header: () => <span>Tanggal</span>,
      meta: {
        className: "sticky left-0 z-20 bg-white dark:bg-gray-900 shadow-[2px_0_5px_rgba(0,0,0,0.08)]",
      },
    } as any,
    {
      accessorKey: 'attendanceStatus',
      header: 'Kehadiran',
      cell: ({ row }) => (
        <div className="w-32">
          {/* 🟢 Disable FormSelect jika dalam mode readonly */}
          <FormSelect
            value={row.original.attendanceStatus}
            onValueChange={(val) => handleFieldChange(row.original.id, 'attendanceStatus', val)}
            options={[
              { value: 'Berangkat', label: 'Berangkat' },
              { value: 'Libur', label: 'Libur' },
              { value: 'PH', label: 'PH' },
              { value: 'Cuti', label: 'Cuti' },
            ]}
            disabled={isReadonly} 
          />
        </div>
      ),
    },
    {
      accessorKey: 'scheduledCheckIn',
      header: () => <div className="text-center">Jam Datang Jadwal</div>,
      cell: ({ row }) => (
        <div className={`w-28 mx-auto flex items-center px-2 py-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-800 ${isReadonly ? 'opacity-70 cursor-not-allowed' : ''}`}>
          <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0 mr-1 pointer-events-none" />
          <FormTimeInput
            value={row.original.scheduledCheckIn}
            onChange={(newVal) => handleFieldChange(row.original.id, 'scheduledCheckIn', newVal)}
            className="text-center font-mono font-medium tracking-wide w-full"
            disabled={isReadonly} // 🟢 Disable input jam jika readonly
          />
        </div>
      ),
    },
    {
      accessorKey: 'scheduledCheckOut',
      header: () => <div className="text-center">Jam Pulang Jadwal</div>,
      cell: ({ row }) => (
        <div className={`w-28 mx-auto flex items-center px-2 py-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-800 ${isReadonly ? 'opacity-70 cursor-not-allowed' : ''}`}>
          <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0 mr-1 pointer-events-none" />
          <FormTimeInput
            value={row.original.scheduledCheckOut}
            onChange={(newVal) => handleFieldChange(row.original.id, 'scheduledCheckOut', newVal)}
            className="text-center font-mono font-medium tracking-wide w-full"
            disabled={isReadonly} // 🟢 Disable input jam jika readonly
          />
        </div>
      ),
    },
    { accessorKey: 'actualCheckIn', header: 'Absensi Datang' },
    { accessorKey: 'actualCheckOut', header: 'Absensi Pulang' },
    { accessorKey: 'notes', header: 'Keterangan' },
    { accessorKey: 'ref', header: 'Ref' },
  ];

  const table = useReactTable({
    data: scheduleList,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400 text-xs animate-pulse">
          Memuat rincian jadwal harian karyawan...
        </p>
      </div>
    );
  }

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
            {isReadonly ? 'Detail Rincian Jadwal Karyawan' : 'Edit Jadwal Karyawan'}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isReadonly ? 'Menampilkan rekapitulasi rincian jadwal harian (Read-only)' : 'Kelola rincian jadwal harian karyawan per periode'}
          </p>
        </div>
      </div>

      {/* Header Card & Statistik Reusable */}
      <EmployeeScheduleHeaderCard employeeInfo={employeeInfo} />

      {/* Container Tabel Jadwal */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xs overflow-visible w-full max-w-full min-w-0">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
            {isReadonly ? 'Rincian Jadwal (Read-Only)' : 'Edit Jadwal Karyawan'}
          </h3>
          {isReadonly && (
            <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-full text-[10px] font-semibold">
              Mode Lihat Saja (Read-Only)
            </span>
          )}
        </div>

        <DataTable 
          table={table} 
          columnsLength={columns.length} 
          showOnMobile={true} 
        />

        {/* 🟢 Sembunyikan footer tombol Simpan jika mode readonly aktif */}
        {!isReadonly && (
          <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
            <CancelButton onClick={() => navigate(-1)} />
            <SaveButton onClick={() => setIsConfirmOpen(true)} />
          </div>
        )}
      </div>

      {/* Dialog Konfirmasi Simpan */}
      <ConfirmAlertDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSave}
        title="Simpan Perubahan Jadwal?"
        description={`Apakah Anda yakin ingin memperbarui rincian jadwal untuk karyawan "${employeeInfo.name}"?`}
        confirmText="Ya, Simpan"
        variant="warning"
        isLoading={isSubmittingApi}
      />

      {/* Alert Hasil Sukses / Gagal */}
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

export default EditEmployeeSchedulePage;