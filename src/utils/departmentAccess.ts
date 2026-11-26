import type { User } from '@/features/auth/types/auth.type';

export type DepartmentAccessGroup = 'HR' | 'IT' | 'OTHER';

export const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

export const getDepartmentAccessGroup = (user?: User | null): DepartmentAccessGroup => {
  if (!user) return 'OTHER';

  const deptId = String(user.department_id ?? '').trim();
  const deptObj = typeof user.department === 'object' && user.department !== null ? user.department : null;
  const deptCode = String(
    user.department_code ?? deptObj?.code ?? user.department_info?.code ?? ''
  )
    .trim()
    .toUpperCase();
  const deptName = String(
    typeof user.department === 'string'
      ? user.department
      : deptObj?.name ?? user.department_info?.name ?? ''
  )
    .trim()
    .toUpperCase();

  // HR / HRD (DP002)
  if (
    deptCode === 'DP002' ||
    ['HR', 'HRD', 'HR MANAGEMENT', 'HUMAN RESOURCE', 'HUMAN RESOURCES'].includes(deptName)
  ) {
    return 'HR';
  }

  // IT (DP001)
  if (
    deptCode === 'DP001' ||
    ['IT', 'INFORMATION TECHNOLOGY', 'TEKNOLOGI INFORMASI'].includes(deptName)
  ) {
    return 'IT';
  }

  // Fallback jika department_id diisi angka 1 / 2 dan relasi belum ter-load
  if (deptId === '2') return 'HR';
  if (deptId === '1') return 'IT';

  return 'OTHER';
};

export const canAccessDashboard = (user?: User | null): boolean => {
  const group = getDepartmentAccessGroup(user);
  return group === 'HR' || group === 'IT';
};

export const canAccessHrManagement = (user?: User | null): boolean => {
  return getDepartmentAccessGroup(user) === 'HR';
};

export const canAccessAdminPages = (user?: User | null): boolean => {
  const group = getDepartmentAccessGroup(user);
  return group === 'HR' || group === 'IT';
};

export const getDefaultHomeRoute = (user?: User | null): string => {
  return canAccessDashboard(user) ? '/dashboard' : '/schedule/my-schedule';
};