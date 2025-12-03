import { useMemo } from 'react';
import {
  useCreatePostMutation as useCreatePostMutationRQ,
  usePostDetailQuery,
  usePostsListQuery,
} from '@/api/Post/postApi';
import type { CreatePostRequest, PostListParams } from '@/types';

export const usePostsList = (params?: PostListParams) => {
  const queryArgs = useMemo(
    () => ({
      limit: params?.limit ?? 10,
      page: params?.page ?? 1,
      search: params?.search?.trim() || undefined,
      user_id: params?.user_id,
    }),
    [params?.limit, params?.page, params?.search, params?.user_id],
  );

  const { data, isLoading, isError, error, refetch, isFetching } = usePostsListQuery(queryArgs);

  return {
    posts: data?.data ?? [],
    meta: data?.meta,
    links: data?.links,
    isLoading: isLoading || isFetching,
    isError,
    error,
    refetch,
  };
};

export const usePostActions = () => {
  const { mutateAsync: createPostMutation, isPending } = useCreatePostMutationRQ();

  const createPost = async ({ content, fileUpload }: CreatePostRequest) => {
    try {
      return await createPostMutation({ content, fileUpload });
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Không thể tạo bài viết.';
      throw new Error(errorMessage);
    }
  };

  return {
    createPost,
    isCreating: isPending,
  };
};

export const usePostDetail = (postId?: string | number) => {
  const postKey = postId !== undefined && postId !== null ? postId.toString() : '';
  const { data, isLoading, isFetching, isError, error, refetch } = usePostDetailQuery(postKey);

  return {
    post: data,
    isLoading: isLoading || isFetching,
    isError,
    error,
    refetch,
  };
};