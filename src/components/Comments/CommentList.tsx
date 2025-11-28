import { useMemo } from 'react';
import type { PostComment } from '@/types/Post';
import CommentItem from './CommentItem';

interface CommentListProps {
  comments: PostComment[];
  postId: string | number;
  onCommentAdded?: () => void;
  onCommentUpdated?: () => void;
  onCommentDeleted?: () => void;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  postId,
  onCommentAdded,
  onCommentUpdated,
  onCommentDeleted,
}) => {
  const organizedComments = useMemo(() => {
    const commentMap = new Map<number, PostComment & { children: PostComment[] }>();
    const rootComments: (PostComment & { children: PostComment[] })[] = [];

    comments.forEach((comment) => {
      const parentId =
        typeof comment.parent === 'object' && comment.parent
          ? comment.parent.id
          : typeof comment.parent === 'number'
            ? comment.parent
            : null;

      const commentWithChildren = { ...comment, children: [] };
      commentMap.set(comment.id, commentWithChildren);

      if (parentId && commentMap.has(parentId)) {
        commentMap.get(parentId)!.children.push(commentWithChildren);
      } else {
        rootComments.push(commentWithChildren);
      }
    });

    return rootComments;
  }, [comments]);

  const renderCommentTree = (
    comment: PostComment & { children: PostComment[] },
    level: number = 0,
  ): React.ReactNode => {
    return (
      <li key={comment.id}>
        <CommentItem
          comment={comment}
          postId={postId}
          level={level}
          onCommentAdded={onCommentAdded}
          onCommentUpdated={onCommentUpdated}
          onCommentDeleted={onCommentDeleted}
        />
        {comment.children.length > 0 && (
          <ul className="mt-3 space-y-3 ml-6 border-l-2 border-gray-200 pl-4">
            {comment.children.map((child) => renderCommentTree(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  if (organizedComments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-gray-500 text-center">
        Chưa có bình luận nào.
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {organizedComments.map((comment) => renderCommentTree(comment, 0))}
    </ul>
  );
};

export default CommentList;

