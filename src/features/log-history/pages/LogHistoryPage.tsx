import React, { useState } from 'react';
import { initialLogHistoryData } from '../services/logHistory.service';
import type { LogHistory } from '../types/logHistory.type';
import { LogHistoryTable } from '../components/LogHistoryTable';

export const LogHistoryPage: React.FC = () => {
  const [data] = useState<LogHistory[]>(initialLogHistoryData);

  return (
    <div className="space-y-6">
      <LogHistoryTable data={data} />
    </div>
  );
};