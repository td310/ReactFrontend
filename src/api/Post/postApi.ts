import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  CreatePostRequest,
  CreatePostResponse,
  Post,
  PostDetailResponse,
  PostListParams,
  PostListResponse,
} from '@/types';
import { API_URL } from '@/utils/constants';
import { store } from '@/store/store';

const getAuthHeaders = (isJson = false): HeadersInit => {
  const token = store.getState().auth.token;
  const headers: HeadersInit = {
    Accept: 'application/json',
  };

  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const buildPostsListUrl = (params?: PostListParams) => {
  const url = new URL(`${API_URL}/posts`);
  const limit = params?.limit ?? 10;
  const page = params?.page ?? 1;

  url.searchParams.set('limit', String(limit));
  url.searchParams.set('page', String(page));

  if (params?.search) {
    url.searchParams.set('search', params.search.trim());
  }

  if (typeof params?.user_id === 'number' && !Number.isNaN(params.user_id)) {
    url.searchParams.set('user_id', String(params.user_id));
  }

  return url.toString();
};

const fetchPosts = async (params?: PostListParams): Promise<PostListResponse> => {
  const response = await fetch(buildPostsListUrl(params), {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Không thể tải danh sách bài viết');
  }

  return (await response.json()) as PostListResponse;
};

const fetchPostDetail = async (postId: string | number): Promise<Post> => {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Không thể tải chi tiết bài viết');
  }

  const data = (await response.json()) as PostDetailResponse | Post;
  if (data && typeof data === 'object' && 'data' in data) {
    return (data as PostDetailResponse).data;
  }

  return data as Post;
};

const createPostRequest = async ({ content, fileUpload }: CreatePostRequest): Promise<CreatePostResponse> => {
  const formData = new FormData();
  formData.append('content', content);

  (fileUpload ?? []).forEach((file) => {
    formData.append('fileUpload[]', file);
  });

  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: getAuthHeaders(false),
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.message || 'Không thể tạo bài viết.';
    throw new Error(message);
  }

  return (await response.json()) as CreatePostResponse;
};

type PostActionType = 0 | 1 | 2 | 3;

interface UpdatePostStatusPayload {
  postId: string | number;
  type: PostActionType;
  content?: string;
}

const updatePostStatusRequest = async ({
  postId,
  type,
  content,
}: UpdatePostStatusPayload): Promise<CreatePostResponse> => {
  const url = new URL(`${API_URL}/posts/${postId}`);
  url.searchParams.set('type', String(type));

  const body: Record<string, unknown> = {};

  if (typeof content === 'string' && content.trim()) {
    body.content = content.trim();
  }

  const response = await fetch(url.toString(), {
    method: 'PUT',
    headers: getAuthHeaders(true),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.message || 'Không thể cập nhật trạng thái bài viết.';
    throw new Error(message);
  }

  return (await response.json()) as CreatePostResponse;
};

export const usePostsListQuery = (params?: PostListParams) =>
  useQuery<PostListResponse, Error>({
    queryKey: ['posts', params],
    queryFn: () => fetchPosts(params),
  });

export const usePostDetailQuery = (postId?: string | number) =>
  useQuery<Post, Error>({
    queryKey: ['posts', 'detail', postId],
    queryFn: () => fetchPostDetail(postId as string | number),
    enabled: postId !== undefined && postId !== null && postId !== '',
  });

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPostRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useUpdatePostStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreatePostResponse, Error, UpdatePostStatusPayload>({
    mutationFn: updatePostStatusRequest,
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['posts'] });
      void queryClient.invalidateQueries({ queryKey: ['posts', 'detail', variables.postId] });
    },
  });
};


