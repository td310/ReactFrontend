import { useMemo } from 'react';
import {
  useCreatePostMutation as useCreatePostMutationRQ,
  usePostDetailQuery,
  usePostsListQuery,
  useUpdatePostStatusMutation,
} from '@/api/Post/postApi';
import type { CreatePostRequest, Post, PostListParams } from '@/types';

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

export const usePostInteraction = () => {
  const { mutateAsync: updatePostStatus, isPending } = useUpdatePostStatusMutation();

  const togglePin = async (post: Post) => {
    const isCurrentlyPinned = Number(post.is_pinned) === 2;
    const type = isCurrentlyPinned ? 0 : 1;

    await updatePostStatus({
      postId: post.id,
      type,
      content: post.content,
    });
  };

  const toggleEmote = async (post: Post) => {
    const isCurrentlyEmoted = Boolean(post.is_emoted);
    const type = isCurrentlyEmoted ? 3 : 2;

    await updatePostStatus({
      postId: post.id,
      type,
      content: post.content,
    });
  };

  return {
    togglePin,
    toggleEmote,
    isUpdating: isPending,
  };
};