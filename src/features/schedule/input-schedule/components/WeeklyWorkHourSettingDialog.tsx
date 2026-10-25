import React, { useState, useEffect } from 'react';
import { CustomDialog } from '../../../../components/ui/CustomDialog';
import { FormTimeInput } from '../../../../components/ui/FormTimeInput';
import { SaveButton, CancelButton } from '../../../../components/ui/ActionButtons';
import { Clock } from 'lucide-react';

interface WeeklyWorkHourData {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

interface WeeklyWorkHourSettingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (formData: WeeklyWorkHourData) => void;
}

const DEFAULT_WORK_HOURS: WeeklyWorkHourData = {
  monday: '00:00:00',
  tuesday: '00:00:00',
  wednesday: '00:00:00',
  thursday: '00:00:00',
  friday: '00:00:00',
  saturday: '00:00:00',
  sunday: '00:00:00',
};

const DAY_LIST: { key: keyof WeeklyWorkHourData; label: string }[] = [
  { key: 'monday', label: 'Senin' },
  { key: 'tuesday', label: 'Selasa' },
  { key: 'wednesday', label: 'Rabu' },
  { key: 'thursday', label: 'Kamis' },
  { key: 'friday', label: 'Jumat' },
  { key: 'saturday', label: 'Sabtu' },
  { key: 'sunday', label: 'Minggu' },
];

export const WeeklyWorkHourSettingDialog: React.FC<WeeklyWorkHourSettingDialogProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<WeeklyWorkHourData>(DEFAULT_WORK_HOURS);

  useEffect(() => {
    if (isOpen) {
      setFormData(DEFAULT_WORK_HOURS);
    }
  }, [isOpen]);

  const handleChangeTime = (key: keyof WeeklyWorkHourData, timeValue: string) => {
    const formattedTime = timeValue.length === 5 ? `${timeValue}:00` : timeValue;
    setFormData((prev) => ({
      ...prev,
      [key]: formattedTime || '00:00:00',
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  return (
    <CustomDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Set Weekly Work Hours"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div className="space-y-3 max-h-[60vh] overflow-y-auto px-1 pr-2">
          {DAY_LIST.map(({ key, label }) => (
            <div key={key} className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-4 text-xs font-bold text-gray-800 dark:text-gray-200">
                {label}
              </label>
              <div className="col-span-8">
                {/* 🌟 Container dengan Border Line yang tetap ada & rapi */}
                <div className="relative flex items-center px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800 focus-within:bg-white dark:focus-within:bg-gray-900 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all [&_input::-webkit-calendar-picker-indicator]:hidden">
                  <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0 mr-2 pointer-events-none" />
                  <FormTimeInput
                    value={formData[key]}
                    onChange={(val) => handleChangeTime(key, val)}
                    className="text-center font-mono font-medium tracking-wide w-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 mt-6">
          <CancelButton onClick={onClose} />
          <SaveButton />
        </div>
      </form>
    </CustomDialog>
  );
};