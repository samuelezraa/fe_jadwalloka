export interface LogHistory {
  id: string;
  type: 'Create' | 'Edit' | 'Delete';
  menu: string;
  subMenu: string;
  pic: string;
  date: string; // Format: YYYY-MM-DD
  description: string;
}