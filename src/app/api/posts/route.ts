import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '20');
    const maxLimit = Math.min(limit, 100); // 最大100件まで

    // 投稿を取得
    const posts = await prisma.post.findMany({
      take: maxLimit + 1, // 次のページがあるかチェックするため+1
      skip: cursor ? 1 : 0, // cursorがある場合は最初の1件をスキップ
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            bio: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });

    // 次のページがあるかチェック
    const hasMore = posts.length > maxLimit;
    const postsToReturn = hasMore ? posts.slice(0, maxLimit) : posts;
    const nextCursor = hasMore ? posts[maxLimit - 1].id : null;

    const response: ApiResponse<{
      posts: typeof postsToReturn;
      hasMore: boolean;
      nextCursor: string | null;
    }> = {
      data: {
        posts: postsToReturn,
        hasMore,
        nextCursor
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('投稿取得エラー:', error);
    
    const errorResponse: ApiResponse<null> = {
      error: '投稿の取得に失敗しました',
      message: 'サーバーエラーが発生しました。しばらく時間をおいてから再試行してください。'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, userId } = body;

    // バリデーション
    if (!content || typeof content !== 'string') {
      const errorResponse: ApiResponse<null> = {
        error: '投稿内容が無効です',
        message: '投稿内容を入力してください'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (content.length > 280) {
      const errorResponse: ApiResponse<null> = {
        error: '投稿内容が長すぎます',
        message: '投稿内容は280文字以内で入力してください'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (!userId) {
      const errorResponse: ApiResponse<null> = {
        error: 'ユーザーIDが無効です',
        message: '認証が必要です'
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // 投稿を作成
    const post = await prisma.post.create({
      data: {
        content,
        userId,
        likesCount: 0,
        repostsCount: 0,
        repliesCount: 0
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            bio: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });

    const response: ApiResponse<typeof post> = {
      data: post,
      message: '投稿が作成されました'
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('投稿作成エラー:', error);
    
    const errorResponse: ApiResponse<null> = {
      error: '投稿の作成に失敗しました',
      message: 'サーバーエラーが発生しました。しばらく時間をおいてから再試行してください。'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
} 