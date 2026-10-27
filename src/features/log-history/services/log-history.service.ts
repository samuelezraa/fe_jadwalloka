import { api } from '@/lib/axios';
import type { LogHistory } from '../types/log-history.type';

export const initialLogHistoryData: LogHistory[] = [
  {
    id: 'LOG001',
    type: 'Create',
    menu: 'Master Data',
    subMenu: 'Department',
    pic: 'User Trial IT',
    date: '2026-10-06',
    description: 'User Trial IT created IT department',
  },
  {
    id: 'LOG002',
    type: 'Create',
    menu: 'Master Data',
    subMenu: 'Employee',
    pic: 'User Trial IT',
    date: '2026-10-06',
    description: 'User Trial IT added Antika Lorien to employee data',
  },
];

export const logHistoryService = {
  getAll: async (params?: { start_date?: string; end_date?: string }): Promise<LogHistory[]> => {
    try {
      const response = await api.get('/log-histories', { params });
      const rawList = response.data?.data || response.data || [];
      return rawList.map((item: any, index: number) => ({
        id: item.id || `LOG${String(index + 1).padStart(3, '0')}`,
        type: item.type || item.tipe || 'Create',
        menu: item.menu || '-',
        subMenu: item.sub_menu || item.subMenu || '-',
        pic: item.pic || item.user_name || 'System',
        date: item.date || item.tanggal || new Date().toISOString().split('T')[0],
        description: item.description || item.keterangan || '-',
      }));
    } catch {
      return initialLogHistoryData;
    }
  },
};