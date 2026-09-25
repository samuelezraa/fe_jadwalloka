import React, { useState } from 'react';
import { useEventTahunan } from '../hooks/useEventTahunan';
import { EventTahunanTable } from '../components/EventTahunanTable';
import { EventTahunanDialog } from '../components/EventTahunanDialog';
import type { EventTahunan } from '../types/event-tahunan.type';

export const EventTahunanPage: React.FC = () => {
  const { data, loading, addEvent, editEvent } = useEventTahunan();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<EventTahunan | null>(null);

  const handleOpenAdd = () => {
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: EventTahunan) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleSubmitForm = async (formData: any) => {
    if (selectedItem) {
      await editEvent(selectedItem.id, {
        tanggal: formData.tanggal,
        event: formData.event,
        type: formData.type,
        keterangan: formData.keterangan,
        status: formData.status,
      });
    } else {
      await addEvent({
        id: formData.id,
        tanggal: formData.tanggal,
        event: formData.event,
        type: formData.type,
        keterangan: formData.keterangan,
      });
    }
    setIsDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xs animate-pulse">Memuat data Event Tahunan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EventTahunanTable
        data={data}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
      />

      <EventTahunanDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        initialData={selectedItem}
        onSubmit={handleSubmitForm}
      />
    </div>
  );
};