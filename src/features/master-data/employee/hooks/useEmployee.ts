import { useState, useEffect, useCallback } from 'react';
import type { Employee } from '../types/employee.type';
import { employeeService } from '../services/employee.service';
import toast from 'react-hot-toast';

export const useEmployee = (
  searchQuery = '',
  departmentQuery = '',
  subDepartmentQuery = '',
  positionQuery = '',
  gradeQuery = '',
  statusQuery = ''
) => {
  const [data, setData] = useState<Employee[]>([]);
  const [meta, setMeta] = useState<{
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from?: number | null;
    to?: number | null;
  }>({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
    from: null,
    to: null,
  });

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  const bulkResetPassword = async (ids: (string | number)[]) => {
  try {
    toast.loading('Mereset password karyawan...');
    await employeeService.bulkResetPassword(ids);
    toast.dismiss();
    toast.success('Password karyawan berhasil di-reset ke NIP!');
    
    // Panggil fetchEmployees dengan mengoper nilai state saat ini
    fetchEmployees(
      searchQuery,
      departmentQuery,
      subDepartmentQuery,
      positionQuery,
      gradeQuery,
      statusQuery,
      page,
      pageSize
    );
  } catch (err: any) {
    toast.dismiss();
    toast.error(err?.response?.data?.message || 'Gagal mereset password.');
  }
};

  useEffect(() => {
    setPage(1);
  }, [searchQuery, departmentQuery, subDepartmentQuery, positionQuery, gradeQuery, statusQuery]);

  const fetchEmployees = useCallback(
    async (
      search: string,
      deptId: string,
      subDeptId: string,
      posId: string,
      gradeId: string,
      status: string,
      currentPage: number,
      limit: number
    ) => {
      setLoading(true);
      setIsError(false);
      try {
        const response = await employeeService.getAll(
          search,
          deptId,
          subDeptId,
          posId,
          gradeId,
          status,
          currentPage,
          limit
        );
        setData(response.data);
        setMeta(response.meta);
      } catch (err) {
        setIsError(true);
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchEmployees(
      searchQuery,
      departmentQuery,
      subDepartmentQuery,
      positionQuery,
      gradeQuery,
      statusQuery,
      page,
      pageSize
    );
  }, [
    searchQuery,
    departmentQuery,
    subDepartmentQuery,
    positionQuery,
    gradeQuery,
    statusQuery,
    page,
    pageSize,
    fetchEmployees,
  ]);

  const addEmployee = async (formData: Omit<Employee, 'id'>) => {
    const result = await employeeService.create(formData);
    fetchEmployees(searchQuery, departmentQuery, subDepartmentQuery, positionQuery, gradeQuery, statusQuery, page, pageSize);
    return result;
  };

  const editEmployee = async (id: string | number, formData: Partial<Employee>) => {
    const result = await employeeService.update(id, formData);
    fetchEmployees(searchQuery, departmentQuery, subDepartmentQuery, positionQuery, gradeQuery, statusQuery, page, pageSize);
    return result;
  };

  const removeEmployee = async (id: string | number) => {
    const result = await employeeService.delete(id);
    fetchEmployees(searchQuery, departmentQuery, subDepartmentQuery, positionQuery, gradeQuery, statusQuery, page, pageSize);
    return result;
  };

  

  const bulkToggleStatus = async (ids: (string | number)[]) => {
    try {
      await employeeService.bulkToggleStatus(ids);
      fetchEmployees(searchQuery, departmentQuery, subDepartmentQuery, positionQuery, gradeQuery, statusQuery, page, pageSize);
      toast.success(`Berhasil mengubah status untuk ${ids.length} karyawan.`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gagal mengubah status karyawan.');
    }
  };

  return {
    data,
    meta,
    page,
    setPage,
    pageSize,
    setPageSize,
    loading,
    isError,
    error,
    addEmployee,
    editEmployee,
    removeEmployee,
    bulkToggleStatus,
    bulkResetPassword,
    refetch: () =>
      fetchEmployees(
        searchQuery,
        departmentQuery,
        subDepartmentQuery,
        positionQuery,
        gradeQuery,
        statusQuery,
        page,
        pageSize
      ),
  };
};