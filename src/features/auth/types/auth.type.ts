export interface User {
  id: number | string;
  name: string;
  username: string;
  email: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token?: string;
  };
}