import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const cursor = searchParams.get('cursor');
    const maxLimit = Math.min(limit, 100);

    // コメントを取得
    const comments = await prisma.comment.findMany({
      where: { postId },
      take: maxLimit + 1,
      skip: cursor ? 1 : 0,
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
            avatarUrl: true
          }
        }
      }
    });

    // 次のページがあるかチェック
    const hasMore = comments.length > maxLimit;
    const commentsToReturn = hasMore ? comments.slice(0, maxLimit) : comments;
    const nextCursor = hasMore ? comments[maxLimit - 1].id : null;

    const response: ApiResponse<{
      comments: typeof commentsToReturn;
      hasMore: boolean;
      nextCursor: string | null;
    }> = {
      data: {
        comments: commentsToReturn,
        hasMore,
        nextCursor
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('コメント取得エラー:', error);
    
    const errorResponse: ApiResponse<null> = {
      error: 'コメントの取得に失敗しました',
      message: 'サーバーエラーが発生しました。しばらく時間をおいてから再試行してください。'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params;
    const body = await request.json();
    const { content, userId } = body;

    // バリデーション
    if (!content || typeof content !== 'string') {
      const errorResponse: ApiResponse<null> = {
        error: 'コメント内容が無効です',
        message: 'コメント内容を入力してください'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (content.length > 280) {
      const errorResponse: ApiResponse<null> = {
        error: 'コメント内容が長すぎます',
        message: 'コメント内容は280文字以内で入力してください'
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

    // コメントを作成
    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        postId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true
          }
        }
      }
    });

    // 投稿のコメント数を増やす
    await prisma.post.update({
      where: { id: postId },
      data: {
        repliesCount: {
          increment: 1
        }
      }
    });

    const response: ApiResponse<typeof comment> = {
      data: comment,
      message: 'コメントが作成されました'
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('コメント作成エラー:', error);
    
    const errorResponse: ApiResponse<null> = {
      error: 'コメントの作成に失敗しました',
      message: 'サーバーエラーが発生しました。しばらく時間をおいてから再試行してください。'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
} 