"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Post } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatTimeAgo, formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  className?: string;
  onLike?: (postId: string) => void;
  onComment?: (postId: string, content: string) => void;
  onShare?: (postId: string) => void;
  currentUserId?: string;
}

export function PostCard({ 
  post, 
  className,
  onLike,
  onComment,
  onShare,
  currentUserId
}: PostCardProps) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(post.likesCount);

  // 初期化時にいいねの状態を設定
  // 実際のアプリでは、APIから現在のユーザーがいいねしているかどうかを取得
  // ここではモックデータとして、ランダムにいいね状態を設定
  useEffect(() => {
    // モックデータとして、30%の確率でいいね済みにする
    const randomLiked = Math.random() < 0.3;
    setIsLiked(randomLiked);
    if (randomLiked) {
      setLocalLikesCount(prev => prev + 1);
    }
  }, [post.id]);

  // いいねボタンのクリック処理
  const handleLike = () => {
    if (onLike) {
      // ローカル状態を即座に更新（楽観的更新）
      if (isLiked) {
        setLocalLikesCount(prev => Math.max(0, prev - 1));
      } else {
        setLocalLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
      
      // 親コンポーネントに通知
      onLike(post.id);
    }
  };

  const handleComment = () => {
    if (showCommentForm) {
      // コメントフォームが表示されている場合は送信
      if (commentContent.trim()) {
        onComment?.(post.id, commentContent.trim());
        setCommentContent('');
        setShowCommentForm(false);
      }
    } else {
      // コメントフォームを表示
      setShowCommentForm(true);
    }
  };

  const handleShare = () => {
    onShare?.(post.id);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentContent.trim()) {
      onComment?.(post.id, commentContent.trim());
      setCommentContent('');
      setShowCommentForm(false);
    }
  };

  // いいねボタンのスタイルを動的に変更
  const likeButtonStyle = cn(
    "flex items-center space-x-2 transition-colors",
    isLiked 
      ? "text-red-500 hover:text-red-600 hover:bg-red-50" 
      : "text-gray-500 hover:text-red-500 hover:bg-red-50"
  );

  return (
    <article className={cn(
      'p-4 hover:bg-gray-50 transition-colors border-b border-gray-200',
      className
    )}>
      <div className="flex space-x-3">
        <Link href={`/profile/${post.user.username}`}>
          <Avatar
            src={post.user.avatarUrl}
            alt={post.user.displayName || post.user.username}
            fallback={post.user.displayName || post.user.username}
            size="md"
            className="flex-shrink-0"
          />
        </Link>
        
        <div className="flex-1 min-w-0">
          {/* ヘッダー */}
          <div className="flex items-center space-x-2 flex-wrap mb-1">
            <Link 
              href={`/profile/${post.user.username}`}
              className="font-semibold text-gray-900 hover:underline"
            >
              {post.user.displayName || post.user.username}
            </Link>
            <Link 
              href={`/profile/${post.user.username}`}
              className="text-gray-500 hover:underline"
            >
              @{post.user.username}
            </Link>
            <span className="text-gray-500">·</span>
            <time className="text-gray-500 text-sm">
              {formatTimeAgo(post.createdAt)}
            </time>
          </div>

          {/* 投稿内容 */}
          <p className="text-gray-900 mb-3 whitespace-pre-wrap">
            {post.content}
          </p>

          {/* コメントフォーム */}
          {showCommentForm && (
            <div className="mb-3 p-3 bg-gray-50 rounded-lg">
              <form onSubmit={handleCommentSubmit} className="space-y-2">
                <Input
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="返信を入力..."
                  className="w-full"
                  maxLength={280}
                />
                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!commentContent.trim()}
                  >
                    返信
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowCommentForm(false);
                      setCommentContent('');
                    }}
                  >
                    キャンセル
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* 既存のコメントを表示 */}
          {post.comments && post.comments.length > 0 && (
            <div className="mb-3 space-y-2">
              <h4 className="text-sm font-medium text-gray-700 mb-2">返信</h4>
              {post.comments.map((comment) => (
                <div key={comment.id} className="pl-4 border-l-2 border-gray-200">
                  <div className="flex items-start space-x-2">
                    <Avatar
                      src={comment.user.avatarUrl || undefined}
                      alt={comment.user.displayName || comment.user.username}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm text-gray-900">
                          {comment.user.displayName || comment.user.username}
                        </span>
                        <span className="text-gray-500 text-xs">
                          @{comment.user.username}
                        </span>
                        <time className="text-gray-400 text-xs">
                          {formatTimeAgo(comment.createdAt)}
                        </time>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* アクションボタン */}
          <div className="flex items-center justify-between max-w-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleComment}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm">{formatNumber(post.repliesCount)}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="flex items-center space-x-2 text-gray-500 hover:text-green-500 hover:bg-green-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <span className="text-sm">{formatNumber(post.repostsCount)}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={likeButtonStyle}
            >
              <svg 
                className="w-4 h-4" 
                fill={isLiked ? "currentColor" : "none"} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm">{formatNumber(localLikesCount)}</span>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
} 