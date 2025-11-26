import { useGetPostsQuery, useCreatePostMutation, useGetPostQuery } from '@/api/Post/postsApi';
import type { CreatePostRequest } from '@/types';

export const usePostsList = () => {
  const { data, isLoading, isError, error, refetch, isFetching } = useGetPostsQuery();

  return {
    posts: data?.data ?? [],
    isLoading: isLoading || isFetching,
    isError,
    error,
    refetch,
  };
};

export const usePostActions = () => {
  const [createPostMutation, { isLoading }] = useCreatePostMutation();

  const createPost = async ({ content, fileUpload }: CreatePostRequest) => {
    const formData = new FormData();
    formData.append('content', content);

    (fileUpload ?? []).forEach((file) => {
      formData.append('fileUpload[]', file);
    });

    try {
      return await createPostMutation(formData).unwrap();
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Không thể tạo bài viết.';
      throw new Error(errorMessage);
    }
  };

  return {
    createPost,
    isCreating: isLoading,
  };
};

export const usePostDetail = (postId?: string | number) => {
  const postKey = postId !== undefined && postId !== null ? postId.toString() : '';
  const skip = !postKey;
  const { data, isLoading, isFetching, isError, error, refetch } = useGetPostQuery(postKey, {
    skip,
  });

  return {
    post: data,
    isLoading: isLoading || isFetching,
    isError,
    error,
    refetch,
  };
};