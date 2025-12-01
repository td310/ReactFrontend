import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/store/store';
import type {
  CreateCommentRequest,
  CreateCommentResponse,
  EditCommentRequest,
  EditCommentResponse,
  DeleteCommentResponse,
} from '@/types/Comment';
import { API_URL } from '@/utils/constants';

export const commentsApi = createApi({
  reducerPath: 'commentsApi',
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
  tagTypes: ['Posts'],
  endpoints: (builder) => ({
    createComment: builder.mutation<CreateCommentResponse, { postId: string | number; body: CreateCommentRequest }>({
      query: ({ postId, body }) => ({
        url: `/add-comment${postId}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Posts', id: postId },
        { type: 'Posts', id: 'LIST' },
      ],
    }),
    editComment: builder.mutation<EditCommentResponse, { postId: string | number; body: EditCommentRequest }>({
      query: ({ postId, body }) => ({
        url: `/edit-comment${postId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Posts', id: postId },
        { type: 'Posts', id: 'LIST' },
      ],
    }),
    deleteComment: builder.mutation<DeleteCommentResponse, { postId: string | number; commentId: number }>({
      query: ({ postId, commentId }) => ({
        url: `/delete-comment${postId}`,
        method: 'DELETE',
        params: { comment_id: commentId },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Posts', id: postId },
        { type: 'Posts', id: 'LIST' },
      ],
    }),
  }),
});

export const { useCreateCommentMutation, useEditCommentMutation, useDeleteCommentMutation } = commentsApi;

