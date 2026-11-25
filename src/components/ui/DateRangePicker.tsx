import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
  placeholder?: string;
}

type ViewMode = 'calendar' | 'month' | 'year';

const parseIsoParts = (dateStr?: string) => {
  if (!dateStr) return null;
  const clean = dateStr.trim().split('T')[0].split(' ')[0];
  const match = clean.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return {
    year: Number(match[1]),
    month: Number(match[2]) - 1, // 0-indexed untuk state bulan
    day: Number(match[3]),
    iso: clean,
  };
};

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  placeholder = "DD-MM-YYYY ~ DD-MM-YYYY"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const popoverRef = useRef<HTMLDivElement>(null);

  const parsedInitial = parseIsoParts(startDate);
  const now = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    parsedInitial ? parsedInitial.month : now.getMonth()
  );
  const [currentYear, setCurrentYear] = useState(
    parsedInitial ? parsedInitial.year : now.getFullYear()
  );
  const [yearRangeStart, setYearRangeStart] = useState(
    Math.floor((parsedInitial ? parsedInitial.year : now.getFullYear()) / 12) * 12
  );
  const [selectingStep, setSelectingStep] = useState<'start' | 'end'>('start');

  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

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
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (clickedDate: string, isCurrentMonth: boolean, month: number, year: number) => {
    if (!isCurrentMonth) {
      setCurrentMonth(month);
      setCurrentYear(year);
    }

    const cleanStart = parseIsoParts(startDate)?.iso || '';

    if (selectingStep === 'start') {
      onChange(clickedDate, '');
      setSelectingStep('end');
    } else {
      if (cleanStart && clickedDate < cleanStart) {
        onChange(clickedDate, '');
        setSelectingStep('end');
      } else {
        onChange(cleanStart || clickedDate, clickedDate);
        setSelectingStep('start');
        setIsOpen(false);
      }
    }
  };

  const formatDateForDisplay = (dateString: string) => {
    const parsed = parseIsoParts(dateString);
    if (!parsed) return '';
    return `${String(parsed.day).padStart(2, '0')}-${String(parsed.month + 1).padStart(2, '0')}-${parsed.year}`;
  };

  const cleanStartIso = parseIsoParts(startDate)?.iso || '';
  const cleanEndIso = parseIsoParts(endDate)?.iso || '';

  const displayValue = cleanStartIso
    ? `${formatDateForDisplay(cleanStartIso)} ~ ${cleanEndIso ? formatDateForDisplay(cleanEndIso) : 'DD-MM-YYYY'}`
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
  const yearGrid = Array.from({ length: 12 }, (_, i) => yearRangeStart + i);

  const todayObj = new Date();
  const todayStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;

  return (
    <div className="relative w-full text-left" ref={popoverRef}>
      {/* Input Trigger */}
      <div
        onClick={() => {
          if (!isOpen) {
            setViewMode('calendar');
            const parsed = parseIsoParts(startDate);
            if (parsed) {
              setCurrentMonth(parsed.month);
              setCurrentYear(parsed.year);
              setYearRangeStart(Math.floor(parsed.year / 12) * 12);
            }
          }
          setIsOpen(!isOpen);
        }}
        className={`flex items-center justify-between w-full px-2.5 py-1.5 text-xs bg-white dark:bg-gray-800 rounded-lg cursor-pointer transition-colors border ${
          isOpen ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
        }`}
      >
        <span className={`block truncate ${displayValue ? 'text-gray-800 dark:text-gray-100 font-medium' : 'text-gray-400 dark:text-gray-500'}`}>
          {displayValue || placeholder}
        </span>
        <CalendarIcon className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-2" />
      </div>

      {/* Popover Kalender */}
      {isOpen && (
        <div className="absolute left-0 top-full z-[99999] p-2.5 mt-1 bg-white border border-gray-200 shadow-2xl dark:bg-gray-900 dark:border-gray-800 rounded-xl w-[250px] animate-in fade-in zoom-in-95">
          <div className="absolute top-[-5px] left-5 w-2.5 h-2.5 bg-white dark:bg-gray-900 border-t border-l border-gray-200 dark:border-gray-800 rotate-45" />

          {/* Header Navigasi */}
          <div className="flex items-center justify-between mb-2 p-1 border border-gray-200 dark:border-gray-700 rounded-lg">
            {viewMode === 'calendar' && (
              <button type="button" onClick={handlePrevMonth} className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {viewMode === 'year' && (
              <button type="button" onClick={() => setYearRangeStart((prev) => prev - 12)} className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                <ChevronsLeft className="w-4 h-4" />
              </button>
            )}
            {viewMode === 'month' && <div className="w-6" />}

            <div className="flex items-center gap-1 flex-1 justify-center">
              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'month' ? 'calendar' : 'month')}
                className={`px-2 py-1 text-[11px] font-bold rounded-md transition-colors ${
                  viewMode === 'month'
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700'
                    : 'text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {months[currentMonth]}
              </button>
              <button
                type="button"
                onClick={() => {
                  setYearRangeStart(Math.floor(currentYear / 12) * 12);
                  setViewMode(viewMode === 'year' ? 'calendar' : 'year');
                }}
                className={`px-2 py-1 text-[11px] font-bold rounded-md transition-colors ${
                  viewMode === 'year'
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700'
                    : 'text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {currentYear}
              </button>
            </div>

            {viewMode === 'calendar' && (
              <button type="button" onClick={handleNextMonth} className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            {viewMode === 'year' && (
              <button type="button" onClick={() => setYearRangeStart((prev) => prev + 12)} className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                <ChevronsRight className="w-4 h-4" />
              </button>
            )}
            {viewMode === 'month' && <div className="w-6" />}
          </div>

          {/* TAMPILAN 1: GRID BULAN */}
          {viewMode === 'month' && (
            <div className="grid grid-cols-2 gap-1.5 py-1">
              {months.map((m, idx) => {
                const isSelectedMonth = idx === currentMonth;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setCurrentMonth(idx);
                      setViewMode('calendar');
                    }}
                    className={`py-2 text-xs rounded-lg transition-colors ${
                      isSelectedMonth
                        ? 'bg-emerald-500 text-white font-bold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          )}

          {/* TAMPILAN 2: GRID TAHUN */}
          {viewMode === 'year' && (
            <div className="grid grid-cols-2 gap-1.5 py-1">
              {yearGrid.map((year) => {
                const isSelectedYear = year === currentYear;
                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => {
                      setCurrentYear(year);
                      setViewMode('month');
                    }}
                    className={`py-2 text-xs rounded-lg transition-colors ${
                      isSelectedYear
                        ? 'bg-emerald-500 text-white font-bold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          )}

          {/* TAMPILAN 3: GRID TANGGAL (CALENDAR) */}
          {viewMode === 'calendar' && (
            <>
              <div className="grid grid-cols-7 mb-1 text-[9px] font-semibold text-center text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-1.5">
                {days.map((day) => <div key={day}>{day}</div>)}
              </div>

              <div className="grid grid-cols-7 gap-y-0.5 text-center mt-1.5">
                {allDays.map((dateObj, index) => {
                  const currentStr = `${dateObj.year}-${String(dateObj.month + 1).padStart(2, '0')}-${String(dateObj.day).padStart(2, '0')}`;
                  const isStart = currentStr === cleanStartIso;
                  const isEnd = currentStr === cleanEndIso;
                  const isBetween = cleanStartIso && cleanEndIso && currentStr > cleanStartIso && currentStr < cleanEndIso;
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
            </>
          )}

          {/* Footer Aksi */}
          <div className="mt-2 pt-1.5 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <button
              type="button"
              onClick={() => { onChange('', ''); setSelectingStep('start'); setViewMode('calendar'); }}
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