import { useState, useEffect, useCallback } from 'react';
import { Post, Comment, LoadingState } from '@/types';

interface UsePostsReturn {
  posts: Post[];
  loading: LoadingState;
  error: string | null;
  refetch: () => Promise<void>;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  addPost: (post: Post) => void;
  toggleLike: (postId: string) => void;
  addReply: (postId: string, comment: Comment) => void;
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
    repliesCount: 2, // 2つのコメントがあるので2に修正
    userId: '550e8400-e29b-41d4-a716-446655440000',
    user: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      username: 'user',
      displayName: 'ユーザー',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'SNSアプリのユーザーです',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    comments: [
      {
        id: '1_comment_1703123456789_abc123def',
        content: '素晴らしい投稿ですね！',
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        updatedAt: new Date(Date.now() - 1800000).toISOString(),
        userId: '660e8400-e29b-41d4-a716-446655440001',
        postId: '1',
        user: {
          id: '660e8400-e29b-41d4-a716-446655440001',
          username: 'sakura',
          displayName: '桜',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          bio: 'デザイナーです',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      },
      {
        id: '1_comment_1703123456789_xyz789ghi',
        content: '私も同じことを思いました！',
        createdAt: new Date(Date.now() - 900000).toISOString(),
        updatedAt: new Date(Date.now() - 900000).toISOString(),
        userId: '770e8400-e29b-41d4-a716-446655440002',
        postId: '1',
        user: {
          id: '770e8400-e29b-41d4-a716-446655440002',
          username: 'taro',
          displayName: '太郎',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          bio: 'プログラミングが趣味です',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    ]
  },
  {
    id: '2',
    content: '2番目の投稿です。いいねやコメント、シェアの機能をテストできます。',
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1時間前
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    likesCount: 12,
    repostsCount: 1,
    repliesCount: 1, // 1つのコメントがあるので1に修正
    userId: '660e8400-e29b-41d4-a716-446655440001',
    user: {
      id: '660e8400-e29b-41d4-a716-446655440001',
      username: 'sakura',
      displayName: '桜',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bio: 'デザイナーです',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    comments: [
      {
        id: '2_comment_1703123456789_def456ghi',
        content: 'とても参考になります！',
        createdAt: new Date(Date.now() - 2700000).toISOString(),
        updatedAt: new Date(Date.now() - 2700000).toISOString(),
        userId: '880e8400-e29b-41d4-a716-446655440003',
        postId: '2',
        user: {
          id: '880e8400-e29b-41d4-a716-446655440003',
          username: 'hanako',
          displayName: '花子',
          avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          bio: 'フロントエンド開発者です',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    ]
  },
  {
    id: '3',
    content: '3番目の投稿です。長めの投稿内容で、改行や長いテキストの表示をテストできます。\n\n改行も含まれています。',
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2時間前
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    likesCount: 8,
    repostsCount: 0,
    repliesCount: 1, // 1つのコメントがあるので1に修正
    userId: '770e8400-e29b-41d4-a716-446655440002',
    user: {
      id: '770e8400-e29b-41d4-a716-446655440002',
      username: 'taro',
      displayName: '太郎',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'プログラミングが趣味です',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    comments: [
      {
        id: '3_comment_1703123456789_ghi789jkl',
        content: '改行の表示がきれいですね！',
        createdAt: new Date(Date.now() - 6300000).toISOString(),
        updatedAt: new Date(Date.now() - 6300000).toISOString(),
        userId: '550e8400-e29b-41d4-a716-446655440000',
        postId: '3',
        user: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          username: 'user',
          displayName: 'ユーザー',
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          bio: 'SNSアプリのユーザーです',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    ]
  },
  {
    id: '4',
    content: '新しい技術について学んでいます。Next.jsとPrismaの組み合わせがとても使いやすいですね！',
    createdAt: new Date(Date.now() - 10800000).toISOString(), // 3時間前
    updatedAt: new Date(Date.now() - 10800000).toISOString(),
    likesCount: 15,
    repostsCount: 3,
    repliesCount: 0, // コメントがないので0に修正
    userId: '880e8400-e29b-41d4-a716-446655440003',
    user: {
      id: '880e8400-e29b-41d4-a716-446655440003',
      username: 'hanako',
      displayName: '花子',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      bio: 'フロントエンド開発者です',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    comments: [] // 空の配列を明示的に設定
  },
  {
    id: '5',
    content: '今日は良い天気ですね。散歩に出かけて、新しいカフェを発見しました。コーヒーが美味しかったです！',
    createdAt: new Date(Date.now() - 14400000).toISOString(), // 4時間前
    updatedAt: new Date(Date.now() - 14400000).toISOString(),
    likesCount: 22,
    repostsCount: 1,
    repliesCount: 0, // コメントがないので0に修正
    userId: '990e8400-e29b-41d4-a716-446655440004',
    user: {
      id: '990e8400-e29b-41d4-a716-446655440004',
      username: 'yuki',
      displayName: '雪',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      bio: 'カフェ巡りが趣味です',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    comments: [] // 空の配列を明示的に設定
  }
];

export function usePosts(limit: number = 20): UsePostsReturn {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);

  // ローカルストレージからデータを読み込む
  const loadFromStorage = useCallback(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sns-posts');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.warn('ローカルストレージのデータの解析に失敗しました:', e);
        }
      }
    }
    return null;
  }, []);

  // ローカルストレージにデータを保存する
  const saveToStorage = useCallback((data: Post[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sns-posts', JSON.stringify(data));
    }
  }, []);

  const fetchPosts = useCallback(async (isLoadMore: boolean = false) => {
    try {
      setLoading('loading');
      setError(null);

      // まずローカルストレージから読み込みを試行
      const storedPosts = loadFromStorage();
      
      if (storedPosts && storedPosts.length > 0) {
        // ローカルストレージにデータがある場合はそれを使用
        if (isLoadMore) {
          setPosts(prev => [...prev, ...storedPosts]);
        } else {
          setPosts(storedPosts);
        }
        setHasMore(false);
        setCursor(null);
        setLoading('success');
        return;
      }

      // ローカルストレージにデータがない場合はモックデータを使用
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1秒の遅延をシミュレート
      
      if (isLoadMore) {
        setPosts(prev => [...prev, ...mockPosts]);
      } else {
        setPosts(mockPosts);
      }
      
      // モックデータをローカルストレージに保存
      saveToStorage(mockPosts);
      
      setHasMore(false); // モックデータなので追加読み込みなし
      setCursor(null);

    } catch (error) {
      setError('ネットワークエラーが発生しました');
    } finally {
      setLoading('success');
    }
  }, [loadFromStorage, saveToStorage]);

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
    setPosts(prev => {
      const newPosts = [newPost, ...prev];
      saveToStorage(newPosts);
      return newPosts;
    });
  }, [saveToStorage]);

  // いいねを切り替える関数
  const toggleLike = useCallback((postId: string) => {
    setPosts(prev => {
      const newPosts = prev.map(post => 
        post.id === postId 
          ? { ...post, likesCount: post.likesCount + 1 }
          : post
      );
      saveToStorage(newPosts);
      return newPosts;
    });
  }, [saveToStorage]);

  // 返信を追加する関数
  const addReply = useCallback((postId: string, comment: Comment) => {
    setPosts(prev => {
      const newPosts = prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              repliesCount: post.repliesCount + 1,
              comments: [...(post.comments || []), comment]
            }
          : post
      );
      saveToStorage(newPosts);
      return newPosts;
    });
  }, [saveToStorage]);

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
    addPost,
    toggleLike,
    addReply
  };
} 