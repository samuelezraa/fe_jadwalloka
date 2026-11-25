export interface User {
  id: number | string;
  name: string;
  username: string;
  email: string;
  role?: string | null;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token?: string;
  };
}