import { useState, useEffect, useCallback } from 'react';
import { employeeService } from '../services/employee.service';
import type { Employee } from '../types/employee.type';
import toast from 'react-hot-toast';

export const useEmployee = () => {
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setIsError(false);
    try {
      const responseData = await employeeService.getAll();
      setData(Array.isArray(responseData) ? responseData : []);
    } catch (err) {
      setIsError(true);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const addEmployee = async (formData: Omit<Employee, 'id'>) => {
    const result = await employeeService.create(formData);
    await fetchEmployees();
    return result;
  };

  const editEmployee = async (id: string | number, formData: Partial<Employee>) => {
    const result = await employeeService.update(id, formData);
    await fetchEmployees();
    return result;
  };

  const removeEmployee = async (id: string | number) => {
    const result = await employeeService.delete(id);
    await fetchEmployees();
    return result;
  };

  // 🔹 Tambahan fungsi untuk ubah status massal
  const bulkToggleStatus = async (ids: (string | number)[]) => {
    try {
      await employeeService.bulkToggleStatus(ids);
      await fetchEmployees();
      toast.success(`Berhasil mengubah status untuk ${ids.length} karyawan.`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gagal mengubah status karyawan.');
    }
  };

  return {
    data,
    loading,
    isError,
    error,
    addEmployee,
    editEmployee,
    removeEmployee,
    bulkToggleStatus,
    refetch: fetchEmployees,
  };
};