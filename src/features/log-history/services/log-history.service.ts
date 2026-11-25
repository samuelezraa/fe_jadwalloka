import { api } from '@/lib/axios';
import type { LogChangeItem, LogHistory } from '../types/log-history.type';

export interface LogHistoryPaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

export interface LogHistoryPaginatedResponse {
  data: LogHistory[];
  meta: LogHistoryPaginationMeta;
}

export const initialLogHistoryData: LogHistory[] = [
  {
    id: 'LOG001',
    type: 'Create',
    action_label: 'Dibuat',
    menu: 'Master Data',
    subMenu: 'Departemen',
    pic: 'User Trial IT',
    date: '2026-10-06',
    time: '09:00:00',
    description: 'User Trial IT created IT department',
    subject: { id: 1, type: 'App\\Models\\Department' },
    user: { id: 1, name: 'User Trial IT', email: 'it@lokahr.local' },
    changes: {
      before: {},
      after: { name: 'IT', is_active: true },
      items: [
        { key: 'name', label: 'Name', before: null, after: 'IT' },
        { key: 'is_active', label: 'Is Active', before: null, after: true },
      ],
    },
    created_at: '2026-10-06T09:00:00+07:00',
    created_at_human: '1 month ago',
  },
];

const normalizeChangeItems = (rawChanges: any, rawProps: any): LogChangeItem[] => {
  if (Array.isArray(rawChanges?.items) && rawChanges.items.length > 0) {
    return rawChanges.items.map((entry: any) => ({
      key: String(entry.key ?? ''),
      label: String(entry.label ?? entry.key ?? '-'),
      before: entry.before ?? null,
      after: entry.after ?? null,
    }));
  }

  const oldObj = rawChanges?.before ?? rawProps?.old ?? {};
  const newObj = rawChanges?.after ?? rawProps?.attributes ?? {};
  const keys = Array.from(new Set([...Object.keys(oldObj || {}), ...Object.keys(newObj || {})]));

  return keys
    .filter((k) => !['updated_at', 'created_at', 'deleted_at', 'id'].includes(k))
    .map((key) => ({
      key,
      label: key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase()),
      before: oldObj?.[key] ?? null,
      after: newObj?.[key] ?? null,
    }));
};

const mapRawLogs = (rawList: any[]): LogHistory[] =>
  rawList.map((item: any, index: number) => {
    const items = normalizeChangeItems(item.changes, item.properties);
    const beforeObj =
      item.changes?.before && typeof item.changes.before === 'object'
        ? item.changes.before
        : Object.fromEntries(items.map((i) => [i.key, i.before]));
    const afterObj =
      item.changes?.after && typeof item.changes.after === 'object'
        ? item.changes.after
        : Object.fromEntries(items.map((i) => [i.key, i.after]));

    return {
      id: item.id || `LOG${String(index + 1).padStart(3, '0')}`,
      raw_id: item.raw_id ?? item.id,
      type: item.type || item.tipe || 'Create',
      menu: item.menu || item.log_name || '-',
      subMenu: item.sub_menu || item.subMenu || '-',
      pic: item.pic || item.user?.name || item.user_name || 'System',
      date: item.date || item.tanggal || new Date().toISOString().split('T')[0],
      time: item.time || '-',
      description: item.description || item.keterangan || '-',
      log_name: item.log_name ?? item.menu ?? null,
      event: item.event ?? null,
      action_label: item.action_label ?? item.type ?? null,
      properties: item.properties ?? {},
      subject: item.subject ?? null,
      user: item.user ?? null,
      changes: {
        before: beforeObj,
        after: afterObj,
        items,
      },
      created_at: item.created_at ?? null,
      created_at_human: item.created_at_human ?? null,
    };
  });

export const logHistoryService = {
  getPaginated: async (params?: {
    page?: number;
    per_page?: number;
    start_date?: string;
    end_date?: string;
    search?: string;
  }): Promise<LogHistoryPaginatedResponse> => {
    const perPage = params?.per_page ?? 25;
    const page = params?.page ?? 1;

    try {
      const response = await api.get('/log-histories', {
        params: {
          page,
          per_page: perPage,
          ...(params?.start_date ? { start_date: params.start_date } : {}),
          ...(params?.end_date ? { end_date: params.end_date } : {}),
          ...(params?.search ? { search: params.search } : {}),
        },
      });

      const rawList = Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : [];

      const mapped = mapRawLogs(rawList);
      const total = Number(response.data?.meta?.total ?? mapped.length);
      const currentPage = Number(response.data?.meta?.current_page ?? page);
      const effectivePerPage = Number(response.data?.meta?.per_page ?? perPage);
      const lastPage = Number(
        response.data?.meta?.last_page ?? Math.max(1, Math.ceil(total / effectivePerPage))
      );

      return {
        data: mapped,
        meta: {
          current_page: currentPage,
          from:
            response.data?.meta?.from ??
            (mapped.length > 0 ? (currentPage - 1) * effectivePerPage + 1 : null),
          last_page: lastPage,
          per_page: effectivePerPage,
          to:
            response.data?.meta?.to ??
            (mapped.length > 0 ? (currentPage - 1) * effectivePerPage + mapped.length : null),
          total,
        },
      };
    } catch {
      return {
        data: initialLogHistoryData,
        meta: {
          current_page: 1,
          from: initialLogHistoryData.length > 0 ? 1 : null,
          last_page: 1,
          per_page: perPage,
          to: initialLogHistoryData.length,
          total: initialLogHistoryData.length,
        },
      };
    }
  },

  getAll: async (params?: { start_date?: string; end_date?: string }): Promise<LogHistory[]> => {
    const res = await logHistoryService.getPaginated({
      page: 1,
      per_page: 25,
      ...params,
    });
    return res.data;
  },
};