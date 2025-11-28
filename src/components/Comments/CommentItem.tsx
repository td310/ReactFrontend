import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import type { PostComment } from '@/types/Post';
import { createCommentSchema, type CreateCommentFormValues } from '@/validation/comments/createComment.schema';
import { editCommentSchema, type EditCommentFormValues } from '@/validation/comments/editComment.schema';
import { useCommentActions } from '@/services/CommentService/commentService';
import { resolveMediaUrl } from '@/utils/media';

interface CommentItemProps {
  comment: PostComment;
  postId: string | number;
  level?: number;
  onCommentAdded?: () => void;
  onCommentUpdated?: () => void;
  onCommentDeleted?: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  postId,
  level = 0,
  onCommentAdded,
  onCommentUpdated,
  onCommentDeleted,
}) => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const { createComment, editComment, deleteComment, isCreating, isEditing: isEditingComment, isDeleting: isDeletingComment } = useCommentActions(postId);

  const commentUser = comment.user;
  const userName = commentUser?.name || comment.user_name || 'Ẩn danh';
  const userAvatar = commentUser?.avatar_url ? resolveMediaUrl(commentUser.avatar_url) : null;
  const isCommentOwner = currentUser?.id === commentUser?.id;

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: editErrors },
    reset: resetEdit,
  } = useForm<EditCommentFormValues>({
    resolver: zodResolver(editCommentSchema),
    defaultValues: {
      comment_id: comment.id,
      content: comment.content,
    },
  });

  const {
    register: registerReply,
    handleSubmit: handleSubmitReply,
    formState: { errors: replyErrors },
    reset: resetReply,
  } = useForm({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      content: '',
      parent: comment.id.toString(),
    },
  });

  const handleEdit = async (values: EditCommentFormValues) => {
    try {
      await editComment(values);
      setIsEditing(false);
      resetEdit();
      onCommentUpdated?.();
    } catch (error) {
      console.error('Edit comment error:', error);
    }
  };

  const handleReply = async (values: CreateCommentFormValues) => {
    try {
      await createComment({
        content: values.content,
        parent: values.parent ? String(values.parent) : undefined,
      });
      setIsReplying(false);
      resetReply();
      onCommentAdded?.();
    } catch (error) {
      console.error('Reply comment error:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
      return;
    }
    try {
      await deleteComment(comment.id);
      onCommentDeleted?.();
    } catch (error) {
      console.error('Delete comment error:', error);
    }
  };

  const maxLevel = 3;
  const canNest = level < maxLevel;

  return (
    <div className={`${level > 0 ? 'mt-3' : ''}`}>
      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="font-semibold text-gray-800">{userName}</span>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmitEdit(handleEdit)} className="space-y-3">
            <textarea
              {...registerEdit('content')}
              className={`w-full min-h-[100px] rounded-xl border border-amber-200 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-200 ${
                editErrors.content ? 'border-red-500' : ''
              }`}
              placeholder="Chỉnh sửa bình luận"
            />
            {editErrors.content && <p className="text-sm text-red-600">{editErrors.content.message}</p>}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  resetEdit();
                }}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isEditingComment}
                className="px-4 py-2 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition disabled:opacity-60"
              >
                {isEditingComment ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </form>
        ) : (
          <>
            <p className="text-gray-700 whitespace-pre-line">{comment.content}</p>
            <div className="flex flex-wrap gap-2 text-sm">
              {canNest && (
                <button
                  type="button"
                  onClick={() => setIsReplying(!isReplying)}
                  className="text-blue-600 hover:text-blue-700 font-medium bg-blue-500 text-white"
                >
                  {isReplying ? 'Hủy' : 'Trả lời'}
                </button>
              )}
              {isCommentOwner && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-amber-600 hover:text-amber-700 font-medium bg-amber-500 text-white"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeletingComment}
                    className="text-red-600 hover:text-red-700 font-medium disabled:opacity-60 text-white"
                  >
                    {isDeletingComment ? 'Đang xóa...' : 'Xóa'}
                  </button>
                </>
              )}
            </div>
          </>
        )}

        {isReplying && (
          <form onSubmit={handleSubmitReply(handleReply)} className="mt-3 space-y-3">
            <textarea
              {...registerReply('content')}
              className={`w-full min-h-[100px] rounded-xl border border-amber-200 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-200 ${
                replyErrors.content ? 'border-red-500' : ''
              }`}
              placeholder="Nhập bình luận"
            />
            {replyErrors.content && <p className="text-sm text-red-600">{replyErrors.content.message}</p>}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsReplying(false);
                  resetReply();
                }}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="px-4 py-2 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition disabled:opacity-60"
              >
                {isCreating ? 'Đang gửi...' : 'Gửi'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CommentItem;

