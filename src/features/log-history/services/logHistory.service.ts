import type { LogHistory } from '../types/logHistory.type';

export const initialLogHistoryData: LogHistory[] = [
  {
    id: 'LOG001',
    tipe: 'Create',
    menu: 'Master Data',
    subMenu: 'Departemen',
    pic: 'User Trial IT',
    tanggal: '2026-10-06',
    keterangan: 'User Trial IT create departemen IT',
  },
  {
    id: 'LOG002',
    tipe: 'Create',
    menu: 'Master Data',
    subMenu: 'Data Karyawan',
    pic: 'User Trial IT',
    tanggal: '2026-10-06',
    keterangan: 'User Trial IT menambahkan Antika Lorien pada data karyawan',
  },
];