import React, { useState } from 'react';
import { useEmployee } from '../hooks/useEmployee';
import { EmployeeTable } from '../components/EmployeeTable';
import { EmployeeDialog, ImportEmployeeDialog } from '../components/EmployeeDialog';
import { ConfirmAlertDialog } from '../../../../components/ui/ConfirmAlertDialog';
import type { Employee } from '../types/employee.type';
import toast from 'react-hot-toast';
import { employeeService } from '../services/employee.service';

export const EmployeePage: React.FC = () => {
  const {
    data,
    loading,
    addEmployee,
    editEmployee,
    bulkToggleStatus, // 👈 Ambil fungsi bulkToggleStatus dari hook
  } = useEmployee();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Employee | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // State untuk Alert Konfirmasi sebelum simpan
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<any>(null);

  // State untuk Alert Sukses setelah data tersimpan
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertTitle, setSuccessAlertTitle] = useState('');
  const [successAlertDesc, setSuccessAlertDesc] = useState('');

  const handleOpenAdd = () => {
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: Employee) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  // Dipanggil saat form di-submit -> Memunculkan alert konfirmasi dulu
  const handlePreSubmitForm = (formData: any) => {
    setPendingFormData(formData);
    setShowConfirmAlert(true);
  };

  // Dieksekusi setelah user menekan tombol "Ya, Simpan" pada alert konfirmasi
  const handleConfirmSave = async () => {
    if (!pendingFormData) return;
    try {
      if (selectedItem && selectedItem.id) {
        await editEmployee(selectedItem.id, pendingFormData);
        setIsDialogOpen(false);
        setShowConfirmAlert(false);
        
        // Tampilkan Alert Sukses (Centang Hijau)
        setSuccessAlertTitle('Berhasil Diperbarui!');
        setSuccessAlertDesc(`Data karyawan "${selectedItem.full_name || selectedItem.name}" berhasil diperbarui.`);
        setShowSuccessAlert(true);
      } else {
        await addEmployee(pendingFormData);
        setIsDialogOpen(false);
        setShowConfirmAlert(false);
        
        // Tampilkan Alert Sukses (Centang Hijau)
        setSuccessAlertTitle('Berhasil Ditambahkan!');
        setSuccessAlertDesc(`Data karyawan "${pendingFormData.full_name}" berhasil ditambahkan.`);
        setShowSuccessAlert(true);
      }
      setPendingFormData(null);
    } catch (err: any) {
      setShowConfirmAlert(false);
      toast.error(err?.response?.data?.message || 'Gagal menyimpan data karyawan.');
    }
  };

  // 🔹 Hubungkan handler toggle status ke hook
  const handleToggleStatus = async (ids: (string | number)[]) => {
    await bulkToggleStatus(ids);
  };

  const handleBulkResetPassword = (selectedIds: (string | number)[]) => {
    toast.success(`Berhasil mereset password untuk ${selectedIds.length} karyawan.`);
  };

  const handleImportFile = (file: File) => {
    toast.success(`File "${file.name}" berhasil diunggah.`);
  };

  const handleExportData = async () => {
    try {
      toast.loading('Mengunduh data karyawan...');
      const blobData = await employeeService.exportData();
      
      const blob = new Blob([blobData], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
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

  const handleDownloadSample = () => {
    toast.success('Mengunduh sampel format spreadsheet...');
  };

  if (loading) {
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
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
        onToggleStatus={handleToggleStatus}
        onBulkResetPassword={handleBulkResetPassword}
        onDownloadSample={handleDownloadSample}
        onExportData={handleExportData}
        onImportData={() => setIsImportModalOpen(true)}
      />

      <EmployeeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        initialData={selectedItem}
        onSubmit={handlePreSubmitForm}
      />

      <ImportEmployeeDialog
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportFile}
        onDownloadSample={handleDownloadSample}
      />

      {/* 1. Alert Konfirmasi (Tanda Tanya: "Simpan Perubahan?") */}
      <ConfirmAlertDialog
        isOpen={showConfirmAlert}
        onClose={() => setShowConfirmAlert(false)}
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

      {/* 2. Alert Sukses (Centang Hijau & Tombol OK) */}
      <ConfirmAlertDialog
        isOpen={showSuccessAlert}
        onClose={() => setShowSuccessAlert(false)}
        onConfirm={() => setShowSuccessAlert(false)}
        title={successAlertTitle}
        description={successAlertDesc}
        confirmText="OK"
        showCancelButton={false}
        variant="primary"
      />
    </div>
  );
};