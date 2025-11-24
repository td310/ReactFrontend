export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string | null;
  email: string;
  status?: string | number;
  status_name?: string;
  badge_name?: string;
  roles?: Role[];
  avatar_url: string | null;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

