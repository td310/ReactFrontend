import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/store/store';
import type {
  ProfileResponse,
  UpdateAvatarRequest,
  UpdateBackgroundRequest,
  UpdateMediaResponse,
} from '@/types/User';
import { API_URL } from '@/utils/constants';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProfile: builder.query<ProfileResponse, void>({
      query: () => ({
        url: '/profile',
        method: 'GET',
      }),
    }),
    updateAvatar: builder.mutation<UpdateMediaResponse, UpdateAvatarRequest>({
      query: (payload) => ({
        url: '/user/update-avatar',
        method: 'POST',
        body: payload,
      }),
    }),
    updateBackground: builder.mutation<UpdateMediaResponse, UpdateBackgroundRequest>({
      query: (payload) => ({
        url: '/user/update-background',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateAvatarMutation,
  useUpdateBackgroundMutation,
} = userApi;

