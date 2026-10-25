import { useState, useEffect, useCallback } from 'react';
import type { SubDepartemen } from '../types/sub-departemen.type';
import type { SubDepartemenFormValues } from '../schemas/sub-departemen.schema';
import { subDepartemenService } from '../services/sub-departemen.service';

export const useSubDepartemen = () => {
  const [subDepartemens, setSubDepartemens] = useState<SubDepartemen[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  
  // Di useSubDepartemen.ts
const fetchSubDepartemens = useCallback(async () => {
  setIsLoading(true);
  try {
    const response = await subDepartemenService.getAll();
    // Karena service sudah mengembalikan response.data.data, response di sini langsung berupa array
    const dataList = Array.isArray(response) ? response : [];
    setSubDepartemens(dataList);
  } catch (err: any) {
    console.error('Gagal mengambil data Sub Departemen:', err);
  } finally {
    setIsLoading(false);
  }
}, []);

  useEffect(() => {
    fetchSubDepartemens();
  }, [fetchSubDepartemens]);

  const addSubDepartemen = async (values: SubDepartemenFormValues) => {
    const newItem = await subDepartemenService.create(values);
    setSubDepartemens((prev) => [newItem, ...prev]);
  };

  const editSubDepartemen = async (id: number, values: SubDepartemenFormValues) => {
    const updatedItem = await subDepartemenService.update(id, values);
    setSubDepartemens((prev) =>
      prev.map((item) => (item.id === id ? updatedItem : item))
    );
  };

  return {
    subDepartemens,
    isLoading,
    addSubDepartemen,
    editSubDepartemen,
    refetch: fetchSubDepartemens,
  };
};