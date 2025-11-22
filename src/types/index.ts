export interface User {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    status: string;
    roles: Array<{ id: number; name: string }>;
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