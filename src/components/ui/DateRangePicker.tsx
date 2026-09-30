import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
  placeholder?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  placeholder = "DD-MM-YYYY ~ DD-MM-YYYY"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectingStep, setSelectingStep] = useState<'start' | 'end'>('start');

  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else { setCurrentMonth(currentMonth - 1); }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else { setCurrentMonth(currentMonth + 1); }
  };

  const handleDateClick = (clickedDate: string, isCurrentMonth: boolean, month: number, year: number) => {
    if (!isCurrentMonth) {
      setCurrentMonth(month);
      setCurrentYear(year);
    }

    if (selectingStep === 'start') {
      onChange(clickedDate, '');
      setSelectingStep('end');
    } else {
      if (new Date(clickedDate) < new Date(startDate)) {
        onChange(clickedDate, '');
        setSelectingStep('end');
      } else {
        onChange(startDate, clickedDate);
        setSelectingStep('start');
        setIsOpen(false);
      }
    }
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    const [y, m, d] = dateString.split('-');
    return `${d}-${m}-${y}`;
  };

  const displayValue = startDate
    ? `${formatDateForDisplay(startDate)} ~ ${endDate ? formatDateForDisplay(endDate) : 'DD-MM-YYYY'}`
    : '';

  const totalDays = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const daysInPrevMonth = getDaysInMonth(prevMonth, prevYear);

  const prevDays = Array.from({ length: firstDay }, (_, i) => {
    const day = daysInPrevMonth - firstDay + i + 1;
    return { day, month: prevMonth, year: prevYear, isCurrentMonth: false };
  });

  const currDays = Array.from({ length: totalDays }, (_, i) => {
    return { day: i + 1, month: currentMonth, year: currentYear, isCurrentMonth: true };
  });

  const remainingCells = 42 - (prevDays.length + currDays.length);
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  const nextDays = Array.from({ length: remainingCells }, (_, i) => {
    return { day: i + 1, month: nextMonth, year: nextYear, isCurrentMonth: false };
  });

  const allDays = [...prevDays, ...currDays, ...nextDays];

  return (
    <div className="relative w-full text-left" ref={popoverRef}>
      {/* Input Trigger dikecilkan padding & font-nya agar proporsional */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-2.5 py-1.5 text-xs bg-white dark:bg-gray-800 rounded-lg cursor-pointer transition-colors border ${
          isOpen ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
        }`}
      >
        <span className={`block truncate ${displayValue ? 'text-gray-800 dark:text-gray-100 font-medium' : 'text-gray-400 dark:text-gray-500'}`}>
          {displayValue || placeholder}
        </span>
        <CalendarIcon className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-2" />
      </div>

      {/* Popover Kotak Kalender */}
      {isOpen && (
        <div className="absolute left-0 top-full z-[9999] p-2.5 mt-1 bg-white border border-gray-200 shadow-xl dark:bg-gray-900 dark:border-gray-800 rounded-xl w-[240px] animate-in fade-in zoom-in-95">
          <div className="absolute top-[-5px] left-5 w-2.5 h-2.5 bg-white dark:bg-gray-900 border-t border-l border-gray-200 dark:border-gray-800 rotate-45" />

          <div className="flex items-center justify-between mb-2 border border-gray-200 dark:border-gray-700 rounded-md px-1 py-1">
            <button type="button" onClick={handlePrevMonth} className="p-0.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div className="text-[11px] font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
              {months[currentMonth]} <span className="ml-1">{currentYear}</span>
            </div>
            <button type="button" onClick={handleNextMonth} className="p-0.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-1 text-[9px] font-semibold text-center text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-1.5">
            {days.map((day) => <div key={day}>{day}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-y-0.5 text-center mt-1.5">
            {allDays.map((dateObj, index) => {
              const currentStr = `${dateObj.year}-${String(dateObj.month + 1).padStart(2, '0')}-${String(dateObj.day).padStart(2, '0')}`;
              const isStart = currentStr === startDate;
              const isEnd = currentStr === endDate;
              const isBetween = startDate && endDate && currentStr > startDate && currentStr < endDate;

              const todayStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
              const isToday = currentStr === todayStr;

              let textClass = dateObj.isCurrentMonth
                ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
                : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer';

              if (isToday && !isStart && !isEnd && !isBetween) {
                textClass = 'text-emerald-500 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-950/30 cursor-pointer';
              }

              let bgClass = '';
              if (isStart || isEnd) {
                bgClass = 'bg-emerald-500 text-white font-bold shadow-sm hover:bg-emerald-600';
                textClass = ''; 
              } else if (isBetween) {
                bgClass = 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400';
                textClass = ''; 
              }

              return (
                <button
                  key={`${dateObj.month}-${dateObj.day}-${index}`}
                  type="button"
                  onClick={() => handleDateClick(currentStr, dateObj.isCurrentMonth, dateObj.month, dateObj.year)}
                  className={`h-6 w-6 mx-auto rounded-full flex items-center justify-center transition-colors text-[10px] ${textClass} ${bgClass}`}
                >
                  {dateObj.day}
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-1.5 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <button
              type="button"
              onClick={() => { onChange('', ''); setSelectingStep('start'); }}
              className="text-[10px] text-red-500 hover:text-red-600 font-medium transition-colors"
            >
              Reset
            </button>
            <div className="text-[8px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              {selectingStep === 'start' ? 'Pilih Mulai' : 'Pilih Selesai'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};