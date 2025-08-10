"use client";


import { PostForm } from "./PostForm";
import { PostCard } from "./PostCard";
import { usePosts } from "@/hooks/usePosts";
import { Post, Comment, LoadingState } from "@/types";

export function Timeline() {
  const { posts, loading, error, addPost, toggleLike, addReply } = usePosts();

  // 固定のユーザーIDを使用（認証なし）
  const currentUserId = "550e8400-e29b-41d4-a716-446655440000"; // 固定UUID

  const handlePostSubmit = async (content: string) => {
    try {
      // 新しい投稿オブジェクトを作成
      const newPost: Post = {
        id: Date.now().toString(), // 一時的なID
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likesCount: 0,
        repostsCount: 0,
        repliesCount: 0,
        userId: currentUserId,
        user: {
          id: currentUserId,
          username: 'user',
          displayName: 'ユーザー',
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          bio: 'SNSアプリのユーザーです',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };

      // 実際のAPIを呼び出す場合は以下のコメントアウトを解除
      /*
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, userId: currentUserId }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.data) {
          // APIから返された投稿データを使用
          addPost(responseData.data);
        }
      } else {
        console.error('投稿の作成に失敗しました');
        return;
      }
      */

      // モックデータとして新しい投稿を追加
      addPost(newPost);

    } catch (error) {
      console.error('投稿エラー:', error);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      // モックデータとしていいねを処理
      // 実際のAPIを呼び出す場合は以下のコメントアウトを解除
      /*
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUserId }),
      });

      if (response.ok) {
        // いいね後にタイムラインを更新
        // await refetch();
      } else {
        console.error('いいねの処理に失敗しました');
      }
      */

      // usePostsのtoggleLikeを使用していいねを更新
      toggleLike(postId);

    } catch (error) {
      console.error('いいねエラー:', error);
    }
  };

  const handleComment = async (postId: string, content: string) => {
    try {
      // よりユニークなIDを生成（投稿ID + タイムスタンプ + ランダム数値）
      const uniqueId = `${postId}_comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // 新しいコメントオブジェクトを作成
      const newComment: Comment = {
        id: uniqueId,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: currentUserId,
        postId,
        user: {
          id: currentUserId,
          username: 'user',
          displayName: 'ユーザー',
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          bio: 'SNSアプリのユーザーです',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };

      // モックデータとしてコメントを処理
      // 実際のAPIを呼び出す場合は以下のコメントアウトを解除
      /*
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, userId: currentUserId }),
      });

      if (response.ok) {
        // コメント後にタイムラインを更新
        // await refetch();
      } else {
        console.error('コメントの作成に失敗しました');
      }
      */

      // usePostsのaddReplyを使用して返信数とコメントを更新
      addReply(postId, newComment);

    } catch (error) {
      console.error('コメントエラー:', error);
    }
  };

  const handleShare = async (postId: string) => {
    try {
      const postUrl = `${window.location.origin}/post/${postId}`;
      await navigator.clipboard.writeText(postUrl);
      alert('投稿のURLをクリップボードにコピーしました！');
    } catch (error) {
      console.error('シェアエラー:', error);
    }
  };

  // ローディング状態の処理
  if (loading === 'idle' || loading === 'loading') {
    return (
      <div className="flex-1 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading === 'error' || error) {
    return (
      <div className="flex-1 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-8">
            <p className="text-red-600">エラーが発生しました: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              再試行
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 p-4">
      <div className="max-w-2xl mx-auto">
        {/* 投稿フォーム */}
        <div className="mb-6">
          <PostForm 
            onSubmit={handlePostSubmit}
            userAvatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
            userName="ユーザー"
          />
        </div>

        {/* 投稿一覧 */}
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={() => handleLike(post.id)}
              onComment={handleComment}
              onShare={() => handleShare(post.id)}
              currentUserId={currentUserId}
            />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">まだ投稿がありません</p>
            <p className="text-sm text-gray-400 mt-2">最初の投稿を作成してみましょう！</p>
          </div>
        )}
      </div>
    </main>
  );
} 