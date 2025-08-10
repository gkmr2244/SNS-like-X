# Supabase + Prisma セットアップ手順

このドキュメントでは、SupabaseとPrismaを組み合わせてSNSアプリを構築するための詳細なセットアップ手順を説明します。

## 1. 前提条件

- Node.js がインストールされていること
- Supabaseアカウントが作成済みであること
- プロジェクトが既にある程度セットアップされていること

## 2. Supabaseプロジェクトのセットアップ

### 2.1 プロジェクト作成
1. [Supabase Dashboard](https://app.supabase.com)にログイン
2. 「New Project」をクリック
3. プロジェクト名を入力（例：sns-with-ai）
4. 強力なパスワードを設定
5. 地域を選択（日本の場合は「Northeast Asia (Tokyo)」）
6. 「Create new project」をクリック

### 2.2 データベース接続情報の取得
1. プロジェクトダッシュボード → Settings → Database
2. 「Connection string」セクションで「URI」を選択
3. パスワード部分を実際のパスワードに置き換え

## 3. 環境変数の設定

`.env.local` ファイルを作成し、以下を設定：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database Configuration for Prisma
DATABASE_URL="postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres"
```

### 各値の取得方法：
- **NEXT_PUBLIC_SUPABASE_URL**: Settings → API → Project URL
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Settings → API → Project API keys → anon public
- **SUPABASE_SERVICE_ROLE_KEY**: Settings → API → Project API keys → service_role
- **DATABASE_URL**: Settings → Database → Connection string → URI形式

## 4. Prismaの初期化と同期

### 4.1 既存のSupabaseスキーマに合わせる
Supabaseで既にテーブルが作成されている場合：

```bash
# Prismaクライアントを生成
npm run db:generate

# 既存のデータベースとPrismaスキーマを同期
npm run db:push
```

### 4.2 新規でテーブルを作成する場合
まだテーブルが作成されていない場合：

```bash
# Prismaスキーマをデータベースにプッシュ
npm run db:push

# Prismaクライアントを生成
npm run db:generate
```

## 5. 使用方法

### 5.1 基本的な使用例

```typescript
import { prisma } from '@/lib/prisma'

// 投稿を取得
const posts = await prisma.post.findMany({
  include: {
    user: true,
    likes: true,
  },
  orderBy: {
    createdAt: 'desc'
  }
})

// 新しい投稿を作成
const newPost = await prisma.post.create({
  data: {
    content: 'Hello World!',
    userId: user.id
  }
})

// いいねを追加
const like = await prisma.like.create({
  data: {
    userId: user.id,
    postId: post.id
  }
})
```

### 5.2 Supabase認証との連携

```typescript
import { supabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'

// 認証済みユーザーの投稿を取得
const { data: { user } } = await supabase.auth.getUser()

if (user) {
  const userPosts = await prisma.post.findMany({
    where: {
      userId: user.id
    },
    include: {
      user: true,
      likes: true
    }
  })
}
```

## 6. 便利なスクリプト

追加済みのpackage.jsonスクリプト：

```bash
# Prismaクライアントを生成
npm run db:generate

# スキーマをデータベースにプッシュ
npm run db:push

# Prisma Studioを開く（データベースGUI）
npm run db:studio
```

## 7. Row Level Security (RLS) の設定

Supabaseの強力なセキュリティ機能を活用：

### 7.1 RLSポリシーの確認
Supabase Dashboard → Table Editor → テーブル選択 → RLS

### 7.2 Prismaでの注意点
- PrismaはRLSをバイパスするため、アプリケーションレベルでの認可制御が必要
- サーバーサイドでSupabaseの`service_role`キーを使用する場合は特に注意

## 8. トラブルシューティング

### よくある問題と解決方法

1. **接続エラー**
   ```
   Error: P1001: Can't reach database server
   ```
   → DATABASE_URLが正しく設定されているか確認

2. **認証エラー**
   ```
   Error: P1010: User does not have permission
   ```
   → パスワードとユーザー名が正しいか確認

3. **型エラー**
   ```
   Module not found: @prisma/client
   ```
   → `npm run db:generate`を実行

### デバッグのヒント

- `npm run db:studio`でデータを視覚的に確認
- Prismaクライアントのログを有効にする（`src/lib/prisma.ts`で設定済み）
- Supabase Dashboard → Logsでデータベースログを確認

## 9. 本番環境での考慮事項

- 接続プールの設定
- パフォーマンス最適化
- セキュリティ設定の見直し
- バックアップ戦略

これで、SupabaseとPrismaを組み合わせた強力で型安全なデータベース環境が構築できました！ 