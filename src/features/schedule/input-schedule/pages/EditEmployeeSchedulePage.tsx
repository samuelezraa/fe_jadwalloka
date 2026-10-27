import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

  // Fetch data detail dari Backend saat halaman dimuat
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

  const handleFieldChange = (rowId: string, field: keyof DailyScheduleDetail, value: any) => {
    setScheduleList((prev) =>
      prev.map((item) => (item.id === rowId ? { ...item, [field]: value } : item))
    );
  };

  const handleConfirmSave = async () => {
    if (!id) return;
    setIsConfirmOpen(false);
    setIsSubmittingApi(true);

    try {
      // Kirim data update ke backend
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

  // 🌟 Disesuaikan agar tetap stay di halaman setelah tekan OK
  const handleCloseAlert = () => {
    setAlertConfig((prev) => ({ ...prev, isOpen: false }));
    // Panggil fetchDetail() jika ingin menyegarkan data terbaru tanpa berpindah halaman
    fetchDetail();
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
          <FormSelect
            value={row.original.attendanceStatus}
            onValueChange={(val) => handleFieldChange(row.original.id, 'attendanceStatus', val)}
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
      accessorKey: 'scheduledCheckIn',
      header: () => <div className="text-center">Jam Datang Jadwal</div>,
      cell: ({ row }) => (
        <div className="w-28 mx-auto flex items-center px-2 py-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-800 focus-within:bg-white dark:focus-within:bg-gray-900 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all [&_input::-webkit-calendar-picker-indicator]:hidden">
          <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0 mr-1 pointer-events-none" />
          <FormTimeInput
            value={row.original.scheduledCheckIn}
            onChange={(newVal) => handleFieldChange(row.original.id, 'scheduledCheckIn', newVal)}
            className="text-center font-mono font-medium tracking-wide w-full"
          />
        </div>
      ),
    },
    {
      accessorKey: 'scheduledCheckOut',
      header: () => <div className="text-center">Jam Pulang Jadwal</div>,
      cell: ({ row }) => (
        <div className="w-28 mx-auto flex items-center px-2 py-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-800 focus-within:bg-white dark:focus-within:bg-gray-900 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all [&_input::-webkit-calendar-picker-indicator]:hidden">
          <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0 mr-1 pointer-events-none" />
          <FormTimeInput
            value={row.original.scheduledCheckOut}
            onChange={(newVal) => handleFieldChange(row.original.id, 'scheduledCheckOut', newVal)}
            className="text-center font-mono font-medium tracking-wide w-full"
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
            Edit Jadwal Karyawan
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Kelola rincian jadwal harian karyawan per periode
          </p>
        </div>
      </div>

      {/* Header Card & Statistik Reusable */}
      <EmployeeScheduleHeaderCard employeeInfo={employeeInfo} />

      {/* Container Edit Jadwal */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xs overflow-visible w-full max-w-full min-w-0">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
            Edit Jadwal Karyawan
          </h3>
        </div>

        <DataTable 
          table={table} 
          columnsLength={columns.length} 
          showOnMobile={true} 
        />

        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <CancelButton onClick={() => navigate(-1)} />
          <SaveButton onClick={() => setIsConfirmOpen(true)} />
        </div>
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
        onClose={handleCloseAlert}
        onConfirm={handleCloseAlert}
        title={alertConfig.title}
        description={alertConfig.description}
        variant={alertConfig.variant}
        confirmText="OK"
        cancelText=""
        showCancelButton={false}
      />
    </div>
  );
};

export default EditEmployeeSchedulePage;