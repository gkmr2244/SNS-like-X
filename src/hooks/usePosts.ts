import { useState, useEffect, useCallback } from 'react';
import { Post, LoadingState, ApiResponse } from '@/types';

interface UsePostsReturn {
  posts: Post[];
  loading: LoadingState;
  error: string | null;
  refetch: () => Promise<void>;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  addPost: (post: Post) => void;
}

// モックデータ
const mockPosts: Post[] = [
  {
    id: '1',
    content: 'こんにちは！これは最初の投稿です。SNSアプリが動作していることを確認できます。',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likesCount: 5,
    repostsCount: 2,
    repliesCount: 3,
    userId: '550e8400-e29b-41d4-a716-446655440000',
    user: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      username: 'user',
      displayName: 'ユーザー',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'SNSアプリのユーザーです',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: '2',
    content: '2番目の投稿です。いいねやコメント、シェアの機能をテストできます。',
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1時間前
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    likesCount: 12,
    repostsCount: 1,
    repliesCount: 7,
    userId: '660e8400-e29b-41d4-a716-446655440001',
    user: {
      id: '660e8400-e29b-41d4-a716-446655440001',
      username: 'sakura',
      displayName: 'さくら',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bio: '写真が好きなユーザーです',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: '3',
    content: '3番目の投稿です。長めの投稿内容で、改行や長いテキストの表示をテストできます。\n\n改行も含まれています。',
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2時間前
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    likesCount: 8,
    repostsCount: 0,
    repliesCount: 2,
    userId: '770e8400-e29b-41d4-a716-446655440002',
    user: {
      id: '770e8400-e29b-41d4-a716-446655440002',
      username: 'taro',
      displayName: '太郎',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'プログラミングが趣味です',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: '4',
    content: '新しい技術について学んでいます。Next.jsとPrismaの組み合わせがとても使いやすいですね！',
    createdAt: new Date(Date.now() - 10800000).toISOString(), // 3時間前
    updatedAt: new Date(Date.now() - 10800000).toISOString(),
    likesCount: 15,
    repostsCount: 3,
    repliesCount: 5,
    userId: '880e8400-e29b-41d4-a716-446655440003',
    user: {
      id: '880e8400-e29b-41d4-a716-446655440003',
      username: 'hanako',
      displayName: '花子',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      bio: 'フロントエンド開発者です',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: '5',
    content: '今日は良い天気ですね。散歩に出かけて、新しいカフェを発見しました。コーヒーが美味しかったです！',
    createdAt: new Date(Date.now() - 14400000).toISOString(), // 4時間前
    updatedAt: new Date(Date.now() - 14400000).toISOString(),
    likesCount: 22,
    repostsCount: 1,
    repliesCount: 8,
    userId: '990e8400-e29b-41d4-a716-446655440004',
    user: {
      id: '990e8400-e29b-41d4-a716-446655440004',
      username: 'yuki',
      displayName: '雪',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      bio: 'カフェ巡りが趣味です',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
];

export function usePosts(limit: number = 20): UsePostsReturn {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);

  const fetchPosts = useCallback(async (isLoadMore: boolean = false) => {
    try {
      setLoading('loading');
      setError(null);

      // モックデータを使用（データベース接続の問題を回避）
      // 実際のAPIを呼び出す場合は以下のコメントアウトを解除
      /*
      const params = new URLSearchParams();
      if (isLoadMore && cursor) {
        params.append('cursor', cursor);
      }
      params.append('limit', limit.toString());

      const response = await fetch(`/api/posts?${params.toString()}`);
      const data: ApiResponse<{ posts: Post[]; hasMore: boolean; nextCursor?: string }> = await response.json();

      if (response.ok && data.data) {
        if (isLoadMore) {
          setPosts(prev => [...prev, ...data.data!.posts]);
        } else {
          setPosts(data.data.posts);
        }
        setHasMore(data.data.hasMore);
        setCursor(data.data.nextCursor || null);
      } else {
        setError(data.error || '投稿の取得に失敗しました');
      }
      */

      // モックデータを返す
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1秒の遅延をシミュレート
      
      if (isLoadMore) {
        setPosts(prev => [...prev, ...mockPosts]);
      } else {
        setPosts(mockPosts);
      }
      setHasMore(false); // モックデータなので追加読み込みなし
      setCursor(null);

    } catch (err) {
      setError('ネットワークエラーが発生しました');
    } finally {
      setLoading('success');
    }
  }, [cursor, limit]);

  const refetch = useCallback(async () => {
    setCursor(null);
    setHasMore(true);
    await fetchPosts(false);
  }, [fetchPosts]);

  const loadMore = useCallback(async () => {
    if (hasMore && loading !== 'loading') {
      await fetchPosts(true);
    }
  }, [hasMore, loading, fetchPosts]);

  // 新しい投稿を追加する関数
  const addPost = useCallback((newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
  }, []);

  useEffect(() => {
    fetchPosts(false);
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    refetch,
    hasMore,
    loadMore,
    addPost
  };
} 