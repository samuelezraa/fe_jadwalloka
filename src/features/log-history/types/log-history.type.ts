export interface LogChangeItem {
  key: string;
  label: string;
  before: unknown;
  after: unknown;
}

export interface LogChanges {
  before: Record<string, unknown>;
  after: Record<string, unknown>;
  items: LogChangeItem[];
}

export interface LogSubjectInfo {
  id: number | string | null;
  type: string | null;
}

export interface LogUserInfo {
  id: number | string | null;
  name: string;
  email?: string | null;
}

export interface LogHistory {
  id: string;
  raw_id?: number | string;
  type: 'Create' | 'Edit' | 'Delete' | string;
  menu: string;
  subMenu: string;
  pic: string;
  date: string;
  time?: string;
  description: string;

  // Detail tambahan selaras dengan struktur aktivitas
  log_name?: string | null;
  event?: string | null;
  action_label?: string | null;
  properties?: Record<string, unknown>;
  subject?: LogSubjectInfo | null;
  user?: LogUserInfo | null;
  changes?: LogChanges | null;
  created_at?: string | null;
  created_at_human?: string | null;
}