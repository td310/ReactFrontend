import type { Role } from '@/types/Auth';

export interface Department {
  id: number;
  name: string;
}

export interface Title {
  id: number;
  level: string;
  description: string;
}

export interface UserProfileDetails {
  birth?: string | null;
  birth_place?: string | null;
  identification_number?: string | null;
  identification_date?: string | null;
  identification_place?: string | null;
  company_entry_date?: string | null;
  number_of_date_attached?: string | null;
  education_level?: string | null;
  gender?: string | null;
  bank_name?: string | null;
  bank_number?: string | null;
  personal_income_tax?: string | null;
  insurance_number?: string | null;
  relative_name?: string | null;
  relative_role?: string | null;
  relative_number?: string | null;
  school_name?: string | null;
  field?: string | null;
}

export interface UserProfile {
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
  departments: Department[];
  titles: Title[];
  background?: string | null;
  profile: UserProfileDetails | null;
  login_at?: string | null;
}

export interface ProfileResponse {
  message: string;
  data: UserProfile;
}

export interface Base64FilePayload {
  name: string;
  data: string;
}

export interface UpdateAvatarRequest {
  user_avatar: Base64FilePayload;
}

export interface UpdateBackgroundRequest {
  background: Base64FilePayload;
}

export interface UpdateMediaResponse {
  message: string;
  user: UserProfile;
}

