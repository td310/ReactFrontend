import {
  useCreateCommentMutation,
  useEditCommentMutation,
  useDeleteCommentMutation,
} from '@/api/Comment/commentsApi';
import type { CreateCommentRequest, EditCommentRequest } from '@/types/Comment';

export const useCommentActions = (postId?: string | number) => {
  const [createCommentMutation, { isLoading: isCreating }] = useCreateCommentMutation();
  const [editCommentMutation, { isLoading: isEditing }] = useEditCommentMutation();
  const [deleteCommentMutation, { isLoading: isDeleting }] = useDeleteCommentMutation();

  const createComment = async (payload: CreateCommentRequest) => {
    if (!postId) {
      throw new Error('Post ID is required to create a comment.');
    }
    try {
      const body: CreateCommentRequest = {
        content: payload.content,
        parent: payload.parent ? String(payload.parent) : undefined,
      };
      return await createCommentMutation({ postId, body }).unwrap();
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Không thể tạo bình luận.';
      throw new Error(errorMessage);
    }
  };

  const editComment = async (payload: EditCommentRequest) => {
    if (!postId) {
      throw new Error('Post ID is required to edit a comment.');
    }
    try {
      return await editCommentMutation({ postId, body: payload }).unwrap();
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Không thể chỉnh sửa bình luận.';
      throw new Error(errorMessage);
    }
  };

  const deleteComment = async (commentId: number) => {
    if (!postId) {
      throw new Error('Post ID is required to delete a comment.');
    }
    try {
      return await deleteCommentMutation({ postId, commentId }).unwrap();
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Không thể xóa bình luận.';
      throw new Error(errorMessage);
    }
  };

  return {
    createComment,
    editComment,
    deleteComment,
    isCreating,
    isEditing,
    isDeleting,
  };
};

