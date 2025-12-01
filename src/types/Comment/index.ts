import type { PostDetailResponse } from '@/types/Post';

export interface Comment {
  id: number;
  content: string;
  parent?: Comment | number | null;
  user_name?: string;
  created_at?: string;
}

export interface CreateCommentRequest {
  content: string;
  parent?: string | null;
}

export interface EditCommentRequest {
  comment_id: number;
  content: string;
}

export interface DeleteCommentRequest {
  comment_id: number;
}

export type CreateCommentResponse = PostDetailResponse;
export type EditCommentResponse = PostDetailResponse;
export type DeleteCommentResponse = PostDetailResponse;

