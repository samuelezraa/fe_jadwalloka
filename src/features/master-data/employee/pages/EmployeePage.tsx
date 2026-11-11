import React, { useState, useEffect } from 'react';
import { useEmployee } from '../hooks/useEmployee';
import { useDepartemen } from '../../departemen/hooks/useDepartemen';
import { useSubDepartemen } from '../../sub-departemen/hooks/useSubDepartemen';
import { usePos } from '../../pos/hooks/usePos';
import { useGrade } from '../../grade/hooks/useGrade';
import { useScheduleScheme } from '../../schedule-scheme/hooks/useScheduleScheme';
import { EmployeeTable } from '../components/EmployeeTable';
import { EmployeeDialog, ImportEmployeeDialog } from '../components/EmployeeDialog';
import { ConfirmAlertDialog } from '../../../../components/ui/ConfirmAlertDialog';
import type { Employee } from '../types/employee.type';
import toast from 'react-hot-toast';
import { employeeService } from '../services/employee.service';

export const EmployeePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [subDeptFilter, setSubDeptFilter] = useState('');
  const [posFilter, setPosFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const {
    data,
    meta,
    setPage,
    setPageSize,
    loading,
    addEmployee,
    editEmployee,
    bulkToggleStatus,
    bulkResetPassword,
  } = useEmployee(searchQuery, deptFilter, subDeptFilter, posFilter, gradeFilter, statusFilter);

  const { departemens = [] } = useDepartemen('', 'true');
  const { subDepartemens = [] } = useSubDepartemen('', '', 'true');
  const { data: posList = [] } = usePos();
  const { grades = [] } = useGrade();
  const { data: schemes = [] } = useScheduleScheme();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Employee | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<any>(null);

  const [successAlertConfig, setSuccessAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
  }>({
    isOpen: false,
    title: '',
    description: '',
  });

  useEffect(() => {
    if (successAlertConfig.isOpen) {
      const timer = setTimeout(() => {
        setSuccessAlertConfig((prev) => ({ ...prev, isOpen: false }));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [successAlertConfig.isOpen]);

  const handleOpenAdd = () => {
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: Employee) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handlePreSubmitForm = (formData: any) => {
    setPendingFormData(formData);
    setIsDialogOpen(false);
    setShowConfirmAlert(true);
  };

  const handleConfirmSave = async () => {
    if (!pendingFormData) return;
    try {
      if (selectedItem && selectedItem.id) {
        await editEmployee(selectedItem.id, pendingFormData);
        setShowConfirmAlert(false);
        setSuccessAlertConfig({
          isOpen: true,
          title: 'Berhasil Diperbarui!',
          description: `Data karyawan "${selectedItem.full_name || selectedItem.name}" berhasil diperbarui.`,
        });
      } else {
        await addEmployee(pendingFormData);
        setShowConfirmAlert(false);
        setSuccessAlertConfig({
          isOpen: true,
          title: 'Berhasil Ditambahkan!',
          description: `Data karyawan "${pendingFormData.full_name}" berhasil ditambahkan.`,
        });
      }
      setPendingFormData(null);
      setSelectedItem(null);
    } catch (err: any) {
      setShowConfirmAlert(false);
      setIsDialogOpen(true);
      toast.error(err?.response?.data?.message || 'Gagal menyimpan data karyawan.');
    }
  };

  const handleToggleStatus = async (ids: (string | number)[]) => {
    await bulkToggleStatus(ids);
  };

  const handleBulkResetPassword = async (ids: (string | number)[]) => {
    await bulkResetPassword(ids);
  };

  // Menerima parameter selectedIds
  const handleExportData = async (selectedIds?: (string | number)[]) => {
    try {
      toast.loading('Mengunduh data karyawan...');
      const blobData = await employeeService.exportData(selectedIds);
      const blob = new Blob([blobData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `data-karyawan-${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss();
      toast.success('Data karyawan berhasil diunduh!');
    } catch (err: any) {
      toast.dismiss();
      toast.error('Gagal mengunduh data karyawan.');
    }
  };

  const handleDownloadSample = async () => {
    try {
      toast.loading('Mengunduh templat sample...');
      const blobData = await employeeService.downloadSample(); 
      const blob = new Blob([blobData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'template-import-karyawan.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss();
      toast.success('Templat sample berhasil diunduh!');
    } catch (err: any) {
      toast.dismiss();
      toast.error('Gagal mengunduh templat sample.');
    }
  };

  if (loading && data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xs animate-pulse">Memuat data Karyawan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EmployeeTable
        data={data}
        meta={meta}
        setPage={setPage}
        setPageSize={setPageSize}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
        onToggleStatus={handleToggleStatus}
        onBulkResetPassword={handleBulkResetPassword}
        onExportData={handleExportData}
        onImportData={() => setIsImportModalOpen(true)}
        onDownloadSample={handleDownloadSample}
        departemenList={departemens}
        subDepartemenList={subDepartemens}
        posList={posList}
        gradeList={grades}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        deptFilter={deptFilter}
        onDeptFilterChange={setDeptFilter}
        subDeptFilter={subDeptFilter}
        onSubDeptFilterChange={setSubDeptFilter}
        posFilter={posFilter}
        onPosFilterChange={setPosFilter}
        gradeFilter={gradeFilter}
        onGradeFilterChange={setGradeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
   
      />

      <EmployeeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        initialData={selectedItem}
        onSubmit={handlePreSubmitForm}
        departemenList={departemens}
        subDepartemenList={subDepartemens}
        posList={posList}
        gradeList={grades}
        schemeList={schemes}
      />

      <ImportEmployeeDialog
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={async (file) => {
          try {
            toast.loading('Mengimpor data karyawan...');
            const formData = new FormData();
            formData.append('file', file);
            await employeeService.importData(formData);
            toast.dismiss();
            toast.success(`File "${file.name}" berhasil diunggah.`);
            setIsImportModalOpen(false);
          } catch (err: any) {
            toast.dismiss();
            toast.error(err?.response?.data?.message || 'Gagal mengimpor file.');
          }
        }}
        onDownloadSample={handleDownloadSample}
      />

      <ConfirmAlertDialog
        isOpen={showConfirmAlert}
        onClose={() => {
          setShowConfirmAlert(false);
          setIsDialogOpen(true);
        }}
        onConfirm={handleConfirmSave}
        title={selectedItem ? 'Simpan Perubahan?' : 'Tambah Karyawan Baru?'}
        description={
          selectedItem
            ? `Apakah Anda yakin ingin memperbarui data karyawan "${selectedItem.full_name || selectedItem.name}"?`
            : 'Apakah Anda yakin ingin menyimpan data karyawan baru ini?'
        }
        confirmText="Ya, Simpan"
        cancelText="Batal"
        variant="warning"
      />

      <ConfirmAlertDialog
        isOpen={successAlertConfig.isOpen}
        onClose={() => setSuccessAlertConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={() => {}}
        title={successAlertConfig.title}
        description={successAlertConfig.description}
        confirmText=""
        cancelText=""
        showCancelButton={false}
        autoClose={true}
        variant="primary"
      />
    </div>
  );
};