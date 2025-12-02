import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { store } from '@/store/store';
import type {
  ProfileResponse,
  UpdateAvatarRequest,
  UpdateBackgroundRequest,
  UpdateMediaResponse,
} from '@/types/User';
import { API_URL } from '@/utils/constants';

const getAuthHeaders = () => {
  const token = store.getState().auth.token;
  const headers: HeadersInit = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const fetchProfile = async (): Promise<ProfileResponse> => {
  const response = await fetch(`${API_URL}/profile`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }

  return (await response.json()) as ProfileResponse;
};

const updateAvatarRequest = async (payload: UpdateAvatarRequest): Promise<UpdateMediaResponse> => {
  const response = await fetch(`${API_URL}/user/update-avatar`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to update avatar');
  }

  return (await response.json()) as UpdateMediaResponse;
};

const updateBackgroundRequest = async (
  payload: UpdateBackgroundRequest,
): Promise<UpdateMediaResponse> => {
  const response = await fetch(`${API_URL}/user/update-background`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to update background');
  }

  return (await response.json()) as UpdateMediaResponse;
};

export const useGetProfileQuery = () =>
  useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

export const useUpdateAvatarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAvatarRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useUpdateBackgroundMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBackgroundRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
