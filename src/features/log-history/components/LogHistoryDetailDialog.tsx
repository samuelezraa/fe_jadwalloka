import React, { useEffect } from 'react';
import type { LogHistory } from '../types/log-history.type';
import { X, ArrowRight, User, Clock, Layers } from 'lucide-react';

interface LogHistoryDetailDialogProps {
  log: LogHistory | null;
  onClose: () => void;
}

const formatValue = (val: unknown): string => {
  if (val === null || val === undefined || val === '') return '-';
  if (typeof val === 'boolean') return val ? 'True' : 'False';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
};

export const LogHistoryDetailDialog: React.FC<LogHistoryDetailDialogProps> = ({
  log,
  onClose,
}) => {
  useEffect(() => {
    if (!log) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [log, onClose]);

  if (!log) return null;

  const changeItems = log.changes?.items ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shrink-0">
              {log.id}
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                {log.action_label || log.type} — {log.subMenu}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {log.description}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
            aria-label="Tutup modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Metadata Ringkas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 px-5 py-3.5 bg-gray-50/70 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800 text-xs">
          <div className="flex items-start gap-2">
            <User className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase font-semibold text-gray-400 block">
                User / PIC
              </span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {log.user?.name || log.pic}
              </span>
              {log.user?.email && (
                <span className="block text-[11px] text-gray-500">
                  {log.user.email}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Layers className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase font-semibold text-gray-400 block">
                Subject & Menu
              </span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {log.menu} • #{log.subject?.id ?? '-'}
              </span>
              {log.subject?.type && (
                <span className="block font-mono text-[10px] text-gray-500 truncate max-w-[180px]">
                  {log.subject.type}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase font-semibold text-gray-400 block">
                Waktu Aktivitas
              </span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {log.date}{' '}
                {log.time && log.time !== '-' ? `• ${log.time}` : ''}
              </span>
              {log.created_at_human && (
                <span className="block text-[11px] text-gray-500">
                  {log.created_at_human}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tabel Perbandingan Before vs After */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {changeItems.length > 0 ? (
            <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-100/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 font-semibold">
                  <tr>
                    <th className="px-3.5 py-2.5">Field</th>
                    <th className="px-3.5 py-2.5">Before</th>
                    <th className="px-2 py-2.5 w-8 text-center" />
                    <th className="px-3.5 py-2.5">After</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {changeItems.map((entry) => (
                    <tr key={entry.key} className="bg-white dark:bg-gray-900">
                      <td className="px-3.5 py-2.5 font-semibold text-gray-800 dark:text-gray-200">
                        <div>{entry.label}</div>
                        <div className="font-mono text-[10px] text-gray-400">
                          {entry.key}
                        </div>
                      </td>
                      <td className="px-3.5 py-2.5">
                        <span className="inline-block px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200/70 dark:border-rose-900/60 break-all">
                          {formatValue(entry.before)}
                        </span>
                      </td>
                      <td className="px-2 py-2.5 text-center text-gray-400">
                        <ArrowRight className="w-3.5 h-3.5 inline" />
                      </td>
                      <td className="px-3.5 py-2.5">
                        <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-900/60 break-all">
                          {formatValue(entry.after)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
              Tidak ada rincian perubahan field (`before` / `after`) pada aktivitas ini.
            </div>
          )}
        </div>

      
      </div>
    </div>
  );
};