import { useState, useEffect, useCallback } from 'react';
import { fiveTwoWorkHourService } from '../services/five-two-work-hour.service';
import type { FiveTwoWorkHourEmployee } from '../types/five-two-work-hour.type';
import type { FiveTwoWorkHourFormValues } from '../schemas/five-two-work-hour.schema';
import toast from 'react-hot-toast';

interface StoredUser {
  id?: number | string;
  name?: string;
  username?: string;
  email?: string;
  role?: string | null;
  department?: string | { id?: number | string; name?: string } | null;
  department_id?: number | string | null;
}

const getStoredUser = (): StoredUser | null => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

const getUserDepartmentFilter = (user: StoredUser | null): {
  isRestrictedByDept: boolean;
  deptId: string;
  deptName: string;
} => {
  if (!user) {
    return { isRestrictedByDept: false, deptId: '', deptName: '' };
  }

  const roleUpper = String(user.role ?? '').trim().toUpperCase();
  const explicitDeptName =
    typeof user.department === 'string'
      ? user.department.trim()
      : String(user.department?.name ?? '').trim();
  const explicitDeptId =
    user.department_id !== undefined && user.department_id !== null && String(user.department_id) !== ''
      ? String(user.department_id)
      : typeof user.department === 'object' && user.department?.id !== undefined
      ? String(user.department.id)
      : '';

  // HR (hrstaff) bisa melihat semua data tanpa batasan departemen
  if (roleUpper === 'HR') {
    return { isRestrictedByDept: false, deptId: '', deptName: '' };
  }

  // Role yang otomatis terfilter sesuai departemen masing-masing
  const roleDeptMap: Record<string, string> = {
    SALES: 'Sales',
    MANAGEMENT: 'Management',
    IT: 'IT',
  };

  if (roleUpper in roleDeptMap) {
    return {
      isRestrictedByDept: true,
      deptId: explicitDeptId,
      deptName: explicitDeptName || roleDeptMap[roleUpper],
    };
  }

  // Jika ada department_id / department eksplisit pada user selain HR
  if (explicitDeptId || explicitDeptName) {
    return {
      isRestrictedByDept: true,
      deptId: explicitDeptId,
      deptName: explicitDeptName,
    };
  }

  return { isRestrictedByDept: false, deptId: '', deptName: '' };
};

const deduplicateSchedules = (items: FiveTwoWorkHourEmployee[]): FiveTwoWorkHourEmployee[] => {
  if (!Array.isArray(items)) return [];
  const seen = new Set<string>();

  return items.filter((item: any) => {
    const empKey =
      item.employee_id_code ||
      item.employee?.employee_id ||
      item.employee_id ||
      item.employee?.id ||
      item.nip ||
      item.id;

    const fallbackKey = `${item.employee_name || item.name || ''}|${
      item.department_name || item.department?.name || ''
    }|${item.sub_department_name || item.sub_department?.name || ''}`;

    const uniqueKey =
      empKey !== undefined && empKey !== null && String(empKey) !== ''
        ? `emp:${String(empKey)}`
        : `row:${fallbackKey}`;

    if (seen.has(uniqueKey)) {
      return false;
    }
    seen.add(uniqueKey);
    return true;
  });
};

const filterByDepartmentIfNeeded = (
  items: FiveTwoWorkHourEmployee[],
  deptFilterInfo: { isRestrictedByDept: boolean; deptId: string; deptName: string }
): FiveTwoWorkHourEmployee[] => {
  if (!deptFilterInfo.isRestrictedByDept || !Array.isArray(items)) {
    return items;
  }

  const targetName = deptFilterInfo.deptName.trim().toLowerCase();
  const targetId = deptFilterInfo.deptId.trim();

  return items.filter((item: any) => {
    const itemDeptName = String(
      item.department_name ?? item.department?.name ?? item.employee?.department?.name ?? ''
    )
      .trim()
      .toLowerCase();
    const itemDeptId = String(
      item.department_id ?? item.department?.id ?? item.employee?.department_id ?? ''
    ).trim();

    const matchById = targetId !== '' && itemDeptId !== '' && itemDeptId === targetId;
    const matchByName =
      targetName !== '' &&
      itemDeptName !== '' &&
      (itemDeptName === targetName || itemDeptName.includes(targetName));

    return matchById || matchByName;
  });
};

export const useFiveTwoWorkHour = (
  searchQuery = '',
  deptFilter = '',
  subDeptFilter = '',
  statusFilter = ''
) => {
  const [schedules, setSchedules] = useState<FiveTwoWorkHourEmployee[]>([]);
  const [meta, setMeta] = useState<{
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from?: number | null;
    to?: number | null;
  }>({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 25,
    from: null,
    to: null,
  });

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const currentUser = getStoredUser();
  const deptRestriction = getUserDepartmentFilter(currentUser);
  const effectiveDeptFilter = deptRestriction.isRestrictedByDept
    ? deptRestriction.deptId || deptFilter
    : deptFilter;

  const fetchSchedules = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fiveTwoWorkHourService.getAll(
        searchQuery,
        effectiveDeptFilter,
        subDeptFilter,
        statusFilter,
        page,
        pageSize
      );

      const uniqueData = deduplicateSchedules(res.data || []);
      const filteredData = filterByDepartmentIfNeeded(uniqueData, deptRestriction);

      setSchedules(filteredData);
      if (res.meta) {
        setMeta(
          deptRestriction.isRestrictedByDept
            ? {
                ...res.meta,
                total: filteredData.length,
              }
            : res.meta
        );
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal memuat data jadwal jam kerja 5-2.');
      toast.error('Gagal memuat data jam kerja.');
    } finally {
      setIsLoading(false);
    }
  }, [
    searchQuery,
    effectiveDeptFilter,
    subDeptFilter,
    statusFilter,
    page,
    pageSize,
    deptRestriction.isRestrictedByDept,
    deptRestriction.deptId,
    deptRestriction.deptName,
  ]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, effectiveDeptFilter, subDeptFilter, statusFilter]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const addSchedule = async (payload: FiveTwoWorkHourFormValues) => {
    const created = await fiveTwoWorkHourService.create(payload);
    await fetchSchedules();
    return created;
  };

  const updateSchedule = async (id: number | string, payload: FiveTwoWorkHourFormValues) => {
    const updated = await fiveTwoWorkHourService.update(id, payload);
    await fetchSchedules();
    return updated;
  };

  const removeSchedule = async (id: number | string) => {
    await fiveTwoWorkHourService.delete(id);
    await fetchSchedules();
  };

  return {
    schedules,
    meta,
    page,
    setPage,
    pageSize,
    setPageSize,
    isLoading,
    error,
    refetch: fetchSchedules,
    addSchedule,
    updateSchedule,
    removeSchedule,
    isDepartmentLocked: deptRestriction.isRestrictedByDept,
    lockedDepartmentName: deptRestriction.deptName,
  };
};