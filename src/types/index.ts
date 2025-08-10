export interface Profile {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  repostsCount: number;
  repliesCount: number;
  userId: string;
  user: Profile;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  postId: string;
  user: Profile;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'; 