import { useState, useEffect, useCallback } from 'react';
import type { InputJadwalPeriode } from '../types/input-jadwal.type';
import type { InputJadwalFormValues } from '../schemas/input-jadwal.schema';
import { inputJadwalService } from '../services/input-jadwal.service';

export const useInputJadwal = () => {
  const [data, setData] = useState<InputJadwalPeriode[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<InputJadwalPeriode | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await inputJadwalService.getJadwalPeriodeList();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleEdit = (item: InputJadwalPeriode) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedItem(null);
    setIsDialogOpen(false);
  };

  const handleSubmitForm = async (values: InputJadwalFormValues) => {
    if (selectedItem) {
      await inputJadwalService.updateJadwalPeriode(selectedItem.id, values);
      await fetchList();
      handleCloseDialog();
    }
  };

  return {
    data,
    isLoading,
    selectedItem,
    isDialogOpen,
    handleEdit,
    handleCloseDialog,
    handleSubmitForm,
  };
};