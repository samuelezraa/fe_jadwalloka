import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { useReactTable, getCoreRowModel, type ColumnDef } from '@tanstack/react-table';
import toast from 'react-hot-toast';

import { DataTable } from '../../../../components/ui/data-table';
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';
import { FormSelect } from '../../../../components/ui/FormSelect';
import { FormTimeInput } from '../../../../components/ui/FormTimeInput';
import { ConfirmAlertDialog } from '../../../../components/ui/ConfirmAlertDialog';
import { EmployeeScheduleHeaderCard } from '../components/EmployeeScheduleHeaderCard';
import { inputScheduleService } from '../services/input-schedule.service';

export const EditEmployeeSchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmittingApi, setIsSubmittingApi] = useState(false);
  
  const [employeeInfo, setEmployeeInfo] = useState<any>(null);
  const [scheduleList, setScheduleList] = useState<any[]>([]);

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

  // Fetch data detail karyawan & jadwal harian dari backend saat halaman dimuat
  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const res = await inputScheduleService.getEmployeeScheduleDetail(id);
        setEmployeeInfo(res.employeeInfo);
        setScheduleList(res.scheduleList);
      } catch (error) {
        toast.error('Gagal mengambil detail jadwal karyawan.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleFieldChange = (rowId: string, field: string, value: any) => {
    setScheduleList((prev) =>
      prev.map((item) => (item.id === rowId ? { ...item, [field]: value } : item))
    );
  };

  const handleConfirmSave = async () => {
    if (!id) return;
    setIsConfirmOpen(false);
    setIsSubmittingApi(true);

    try {
      await inputScheduleService.updateEmployeeSchedule(id, { scheduleList });
      setAlertConfig({
        isOpen: true,
        title: 'Berhasil Diperbarui!',
        description: `Jadwal karyawan berhasil diperbarui ke database.`,
        variant: 'primary',
      });
    } catch (error: any) {
      setAlertConfig({
        isOpen: true,
        title: 'Gagal Menyimpan!',
        description: error?.response?.data?.message || 'Terjadi kesalahan saat menyimpan ke server.',
        variant: 'danger',
      });
    } finally {
      setIsSubmittingApi(false);
    }
  };

  const handleCloseAlert = () => {
    setAlertConfig((prev) => ({ ...prev, isOpen: false }));
    if (alertConfig.variant === 'primary') {
      navigate('/schedule/input-schedule');
    }
  };

  // Definisi Kolom Tabel (seperti sebelumnya dengan sticky date)
  const columns: ColumnDef<any>[] = [
    { accessorKey: 'no', header: 'No.' },
    { accessorKey: 'dayName', header: 'Hari' },
    {
      accessorKey: 'date',
      cell: (info: any) => <span className="font-mono text-xs">{info.row.original.date}</span>,
      header: () => <span>Tanggal</span>,
      meta: {
        className: "sticky left-0 z-20 bg-white dark:bg-gray-900 shadow-[2px_0_5px_rgba(0,0,0,0.08)]",
      },
    } as any,
    {
      accessorKey: 'attendanceStatus',
      header: 'Kehadiran',
      cell: ({ row }: { row: any }) => (
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
      cell: ({ row }: { row: any }) => (
        <div className="w-28 mx-auto flex items-center px-2 py-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-800">
          <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0 mr-1" />
          <FormTimeInput
            value={row.original.scheduledCheckIn}
            onChange={(newVal) => handleFieldChange(row.original.id, 'scheduledCheckIn', newVal)}
            className="text-center font-mono font-medium w-full"
          />
        </div>
      ),
    },
    {
      accessorKey: 'scheduledCheckOut',
      header: () => <div className="text-center">Jam Pulang Jadwal</div>,
      cell: ({ row }: { row: any }) => (
        <div className="w-28 mx-auto flex items-center px-2 py-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-800">
          <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0 mr-1" />
          <FormTimeInput
            value={row.original.scheduledCheckOut}
            onChange={(newVal) => handleFieldChange(row.original.id, 'scheduledCheckOut', newVal)}
            className="text-center font-mono font-medium w-full"
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
        <p className="text-xs text-gray-400 animate-pulse">Memuat data rincian jadwal...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-bold text-gray-900 dark:text-gray-100">Edit Jadwal Karyawan</h1>
          <p className="text-xs text-gray-500">Kelola rincian jadwal harian karyawan per periode</p>
        </div>
      </div>

      {employeeInfo && <EmployeeScheduleHeaderCard employeeInfo={employeeInfo} />}

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xs">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-xs font-bold uppercase tracking-wider">Edit Jadwal Karyawan</h3>
        </div>
        <DataTable table={table} columnsLength={columns.length} showOnMobile={true} />
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <CancelButton onClick={() => navigate(-1)} />
          <SaveButton onClick={() => setIsConfirmOpen(true)} />
        </div>
      </div>

      <ConfirmAlertDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSave}
        title="Simpan Perubahan Jadwal?"
        description={`Apakah Anda yakin ingin memperbarui rincian jadwal karyawan ini?`}
        confirmText="Ya, Simpan"
        variant="warning"
        isLoading={isSubmittingApi}
      />

      <ConfirmAlertDialog
        isOpen={alertConfig.isOpen}
        onClose={handleCloseAlert}
        onConfirm={handleCloseAlert}
        title={alertConfig.title}
        description={alertConfig.description}
        variant={alertConfig.variant}
        confirmText="OK"
        showCancelButton={false}
      />
    </div>
  );
};

export default EditEmployeeSchedulePage;