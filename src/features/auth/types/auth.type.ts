export interface DepartmentInfo {
  id?: number | string;
  code?: string;
  name?: string;
}

export interface User {
  id: number | string;
  name: string;
  username: string;
  email: string;
  role?: string | null;
  department_id?: number | string | null;
  department?: string | DepartmentInfo | null;
  department_code?: string | null;
  department_info?: DepartmentInfo | null;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token?: string;
  };
}