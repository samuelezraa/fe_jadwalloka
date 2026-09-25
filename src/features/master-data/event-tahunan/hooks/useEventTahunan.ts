import { useState, useEffect, useCallback } from 'react';
import type { EventTahunan } from '../types/event-tahunan.type';
import { eventTahunanService } from '../services/event-tahunan.service';

export const useEventTahunan = () => {
  const [data, setData] = useState<EventTahunan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const result = await eventTahunanService.getAll();
      setData(result);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data Event Tahunan');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const addEvent = async (newData: Omit<EventTahunan, 'status'>) => {
    await eventTahunanService.create(newData);
    await fetchEvents();
  };

  const editEvent = async (id: string, updatedData: Partial<EventTahunan>) => {
    await eventTahunanService.update(id, updatedData);
    await fetchEvents();
  };

  const deleteEvent = async (id: string) => {
    await eventTahunanService.delete(id);
    await fetchEvents();
  };

  return {
    data,
    loading,
    error,
    addEvent,
    editEvent,
    deleteEvent,
    refetch: fetchEvents,
  };
};