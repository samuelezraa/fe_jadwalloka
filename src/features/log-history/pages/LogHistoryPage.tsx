import React, { useState, useEffect } from 'react';
import { logHistoryService, initialLogHistoryData } from '../services/log-history.service';
import type { LogHistory } from '../types/log-history.type';
import { LogHistoryTable } from '../components/LogHistoryTable';

export const LogHistoryPage: React.FC = () => {
  const [data, setData] = useState<LogHistory[]>(initialLogHistoryData);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLogHistories = async () => {
      try {
        setLoading(true);
        const result = await logHistoryService.getAll();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch log histories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogHistories();
  }, []);

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
            Memuat data log history dari server...
          </p>
        </div>
      ) : (
        <LogHistoryTable data={data} />
      )}
    </div>
  );
};