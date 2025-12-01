export interface CommentUser {
  id: number;
  name: string;
  email: string;
  avatar_url?: string | null;
}

export interface PostComment {
  id: number;
  content: string;
  user?: CommentUser;
  user_name?: string;
  created_at?: string;
  parent?: PostComment | number | null;
}

export interface Post {
  id: number;
  content: string;
  comments_count: number | null;
  emotes_count: number | null;
  is_emoted: boolean;
  is_pinned: number | boolean | null;
  is_pinned_label?: string | null;
  status_name?: string | null;
  status_badge?: string | null;
  survey?: unknown;
  created_at: string;
  file_upload?: string | null;
  file_uploads?: string[];
  comments: PostComment[];
}

export interface PostListResponse {
  message: string;
  data: Post[];
}

export interface CreatePostRequest {
  content: string;
  fileUpload?: File[] | null;
}

export interface CreatePostResponse {
  message: string;
  data: Post[];
}

export interface PostDetailResponse {
  message: string;
  data: Post;
}


