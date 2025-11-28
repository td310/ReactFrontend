import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/store/store';
import type { CreatePostResponse, PostDetailResponse, PostListResponse, Post } from '@/types';
import { API_URL } from '@/utils/constants';

export const postsApi = createApi({
  reducerPath: 'postsApi',
  tagTypes: ['Posts'],
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getPosts: builder.query<PostListResponse, void>({
      query: () => ({
        url: '/posts',
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((post) => ({ type: 'Posts' as const, id: post.id })),
              { type: 'Posts' as const, id: 'LIST' },
            ]
          : [{ type: 'Posts' as const, id: 'LIST' }],
    }),
    createPost: builder.mutation<CreatePostResponse, FormData>({
      query: (body) => ({
        url: '/posts',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
    }),
    getPost: builder.query<Post, number | string>({
      query: (postId) => ({
        url: `/posts/${postId}`,
        method: 'GET',
      }),
      transformResponse: (response: PostDetailResponse | Post) => {
        if (typeof response === 'object' && response !== null && 'data' in response) {
          return (response as PostDetailResponse).data;
        }
        return response as Post;
      },
      providesTags: (result, error, postId) => [{ type: 'Posts', id: postId }],
    }),
  }),
});

export const { useGetPostsQuery, useCreatePostMutation, useGetPostQuery } = postsApi;


