import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

interface DatePickerProps {
  value: string; // Format: YYYY-MM-DD
  onChange: (date: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
}

type ViewMode = 'calendar' | 'month' | 'year';

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = 'DD-MM-YYYY',
  label,
  error,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const initialDate = value ? new Date(value) : new Date();
  const [currentMonth, setCurrentMonth] = useState(
    !isNaN(initialDate.getTime()) ? initialDate.getMonth() : new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = useState(
    !isNaN(initialDate.getTime()) ? initialDate.getFullYear() : new Date().getFullYear()
  );
  // Rentang tahun awal untuk tampilan grid 12 tahun (misal: 2026 - 2037)
  const [yearRangeStart, setYearRangeStart] = useState(
    Math.floor(currentYear / 12) * 12
  );

  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Sinkronisasi state kalender saat prop value berubah dari luar (misal saat edit data)
  useEffect(() => {
    if (value) {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) {
        setCurrentMonth(parsed.getMonth());
        setCurrentYear(parsed.getFullYear());
        setYearRangeStart(Math.floor(parsed.getFullYear() / 12) * 12);
      }
    }
  }, [value]);

  const handleToggleOpen = () => {
    if (disabled) return;
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const popoverHeight = 285;
      const spaceBelow = window.innerHeight - rect.bottom;
      const showAbove = spaceBelow < popoverHeight;

      setCoords({
        top: showAbove
          ? rect.top + window.scrollY - popoverHeight - 6
          : rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
      setViewMode('calendar'); // Reset ke tampilan tanggal saat dibuka
      setYearRangeStart(Math.floor(currentYear / 12) * 12);
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        const popoverEl = document.getElementById('datepicker-popover-fixed');
        if (popoverEl && popoverEl.contains(event.target as Node)) {
          return;
        }
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

  const handleDateClick = (day: number) => {
    const clickedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(clickedDate);
    setIsOpen(false);
  };

  const setToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setYearRangeStart(Math.floor(today.getFullYear() / 12) * 12);
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    const [y, m, d] = dateString.split('-');
    return `${d}-${m}-${y}`;
  };

  const totalDays = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);
  const monthDays = Array.from({ length: totalDays }, (_, i) => i + 1);
  const yearGrid = Array.from({ length: 12 }, (_, i) => yearRangeStart + i);

  return (
    <div className="relative w-full text-left" ref={containerRef}>
      {/* Label Field */}
      {label && (
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}

      {/* Input / Trigger */}
      <div
        onClick={handleToggleOpen}
        className={`flex items-center justify-between w-full px-3 py-2 text-xs bg-white dark:bg-gray-800 border rounded-lg transition-colors ${
          disabled
            ? 'bg-gray-100 dark:bg-gray-900/50 text-gray-500 border-gray-200 dark:border-gray-800 cursor-not-allowed'
            : isOpen
              ? 'border-emerald-500 ring-2 ring-emerald-500/20 cursor-pointer'
              : error
                ? 'border-red-500 cursor-pointer'
                : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/80 cursor-pointer'
        }`}
      >
        <span
          className={
            value && !disabled
              ? 'text-gray-800 dark:text-gray-100 font-medium'
              : 'text-gray-400 dark:text-gray-500'
          }
        >
          {value ? formatDateForDisplay(value) : placeholder}
        </span>
        <CalendarIcon className="w-4 h-4 text-gray-400" />
      </div>

      {/* Pesan Error */}
      {error && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{error}</p>}

      {/* Popover Kalender */}
      {isOpen && !disabled && (
        <div
          id="datepicker-popover-fixed"
          style={{ top: coords.top, left: coords.left }}
          className="fixed z-[999999] p-2.5 bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-800 rounded-xl w-64 shadow-2xl animate-in fade-in zoom-in-95"
        >
          {/* Header Navigasi */}
          <div className="flex items-center justify-between mb-2 p-1 border border-gray-200 dark:border-gray-800 rounded-lg">
            {/* Tombol Kiri (< untuk bulan, << untuk tahun) */}
            {viewMode === 'calendar' && (
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {viewMode === 'year' && (
              <button
                type="button"
                onClick={() => setYearRangeStart((prev) => prev - 12)}
                className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
            )}
            {viewMode === 'month' && <div className="w-6" />}

            {/* Tombol Toggle Bulan & Tahun */}
            <div className="flex items-center gap-1 flex-1 justify-center">
              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'month' ? 'calendar' : 'month')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
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
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                  viewMode === 'year'
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700'
                    : 'text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {currentYear}
              </button>
            </div>

            {/* Tombol Kanan (> untuk bulan, >> untuk tahun) */}
            {viewMode === 'calendar' && (
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            {viewMode === 'year' && (
              <button
                type="button"
                onClick={() => setYearRangeStart((prev) => prev + 12)}
                className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            )}
            {viewMode === 'month' && <div className="w-6" />}
          </div>

          {/* TAMPILAN 1: GRID BULAN (2 Kolom) */}
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
                        ? 'bg-gray-100 dark:bg-gray-800 font-bold text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          )}

          {/* TAMPILAN 2: GRID TAHUN (2 Kolom, 12 Tahun per halaman) */}
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
                      setViewMode('month'); // Lanjut pilih bulan setelah memilih tahun
                    }}
                    className={`py-2 text-xs rounded-lg transition-colors ${
                      isSelectedYear
                        ? 'bg-gray-100 dark:bg-gray-800 font-bold text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                    }`}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          )}

          {/* TAMPILAN 3: GRID TANGGAL (Default) */}
          {viewMode === 'calendar' && (
            <>
              <div className="grid grid-cols-7 mb-1 text-[10px] font-semibold text-center text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-1">
                {days.map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-y-0.5 text-[11px] text-center">
                {emptyDays.map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {monthDays.map((day) => {
                  const currentStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const isSelected = currentStr === value;
                  const todayStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
                  const isToday = currentStr === todayStr;

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDateClick(day)}
                      className={`h-6 w-6 mx-auto rounded-full flex items-center justify-center transition-colors text-[10px] ${
                        isSelected
                          ? 'bg-emerald-500 text-white font-bold hover:bg-emerald-600'
                          : isToday
                            ? 'bg-gray-100 dark:bg-gray-800 text-emerald-600 font-bold hover:bg-gray-200 dark:hover:bg-gray-700'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Aksi Bawah */}
          <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-[11px] font-medium">
            <button
              type="button"
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
              className="text-gray-500 hover:text-red-500 transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={setToday}
              className="text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};