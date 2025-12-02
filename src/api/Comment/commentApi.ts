import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  CreateCommentRequest,
  CreateCommentResponse,
  EditCommentRequest,
  EditCommentResponse,
  DeleteCommentResponse,
} from '@/types/Comment';
import { API_URL } from '@/utils/constants';
import { store } from '@/store/store';

const getAuthHeaders = (): HeadersInit => {
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

const createCommentRequest = async (
  postId: string | number,
  body: CreateCommentRequest,
): Promise<CreateCommentResponse> => {
  const response = await fetch(`${API_URL}/add-comment${postId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.message || 'Không thể tạo bình luận.';
    throw new Error(message);
  }

  return (await response.json()) as CreateCommentResponse;
};

const editCommentRequest = async (
  postId: string | number,
  body: EditCommentRequest,
): Promise<EditCommentResponse> => {
  const response = await fetch(`${API_URL}/edit-comment${postId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.message || 'Không thể chỉnh sửa bình luận.';
    throw new Error(message);
  }

  return (await response.json()) as EditCommentResponse;
};

const deleteCommentRequest = async (
  postId: string | number,
  commentId: number,
): Promise<DeleteCommentResponse> => {
  const url = new URL(`${API_URL}/delete-comment${postId}`);
  url.searchParams.set('comment_id', String(commentId));

  const response = await fetch(url.toString(), {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.message || 'Không thể xóa bình luận.';
    throw new Error(message);
  }

  return (await response.json()) as DeleteCommentResponse;
};

export const useCreateCommentMutation = (postId?: string | number) => {
  const queryClient = useQueryClient();

  return useMutation<CreateCommentResponse, Error, CreateCommentRequest>({
    mutationFn: async (body) => {
      if (!postId) {
        throw new Error('Post ID is required to create a comment.');
      }
      return createCommentRequest(postId, body);
    },
    onSuccess: () => {
      if (postId) {
        void queryClient.invalidateQueries({ queryKey: ['posts', 'detail', postId] });
        void queryClient.invalidateQueries({ queryKey: ['posts'] });
      }
    },
  });
};

export const useEditCommentMutation = (postId?: string | number) => {
  const queryClient = useQueryClient();

  return useMutation<EditCommentResponse, Error, EditCommentRequest>({
    mutationFn: async (body) => {
      if (!postId) {
        throw new Error('Post ID is required to edit a comment.');
      }
      return editCommentRequest(postId, body);
    },
    onSuccess: () => {
      if (postId) {
        void queryClient.invalidateQueries({ queryKey: ['posts', 'detail', postId] });
        void queryClient.invalidateQueries({ queryKey: ['posts'] });
      }
    },
  });
};

export const useDeleteCommentMutation = (postId?: string | number) => {
  const queryClient = useQueryClient();

  return useMutation<DeleteCommentResponse, Error, number>({
    mutationFn: async (commentId) => {
      if (!postId) {
        throw new Error('Post ID is required to delete a comment.');
      }
      return deleteCommentRequest(postId, commentId);
    },
    onSuccess: () => {
      if (postId) {
        void queryClient.invalidateQueries({ queryKey: ['posts', 'detail', postId] });
        void queryClient.invalidateQueries({ queryKey: ['posts'] });
      }
    },
  });
};


