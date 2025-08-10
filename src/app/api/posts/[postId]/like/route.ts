import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params;
    const body = await request.json();
    const { userId } = body;

    // バリデーション
    if (!userId) {
      const errorResponse: ApiResponse<null> = {
        error: 'ユーザーIDが無効です',
        message: '認証が必要です'
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // 既存のいいねをチェック
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    });

    if (existingLike) {
      // いいねを削除（アンいいね）
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId
          }
        }
      });

      // 投稿のいいね数を減らす
      await prisma.post.update({
        where: { id: postId },
        data: {
          likesCount: {
            decrement: 1
          }
        }
      });

      const response: ApiResponse<{ liked: boolean }> = {
        data: { liked: false },
        message: 'いいねが削除されました'
      };
      return NextResponse.json(response);
    } else {
      // いいねを追加
      await prisma.like.create({
        data: {
          userId,
          postId
        }
      });

      // 投稿のいいね数を増やす
      await prisma.post.update({
        where: { id: postId },
        data: {
          likesCount: {
            increment: 1
          }
        }
      });

      const response: ApiResponse<{ liked: boolean }> = {
        data: { liked: true },
        message: 'いいねが追加されました'
      };
      return NextResponse.json(response);
    }

  } catch (error) {
    console.error('いいね処理エラー:', error);
    
    const errorResponse: ApiResponse<null> = {
      error: 'いいねの処理に失敗しました',
      message: 'サーバーエラーが発生しました。しばらく時間をおいてから再試行してください。'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      const errorResponse: ApiResponse<null> = {
        error: 'ユーザーIDが無効です',
        message: '認証が必要です'
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // ユーザーがこの投稿にいいねしているかチェック
    const like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    });

    const response: ApiResponse<{ liked: boolean }> = {
      data: { liked: !!like }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('いいね状態取得エラー:', error);
    
    const errorResponse: ApiResponse<null> = {
      error: 'いいね状態の取得に失敗しました',
      message: 'サーバーエラーが発生しました。しばらく時間をおいてから再試行してください。'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
} 