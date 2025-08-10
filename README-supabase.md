# Supabaseセットアップ手順

このドキュメントでは、SNSアプリでSupabaseを使用するためのセットアップ手順を説明します。

## 1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクト名と地域を選択（日本の場合は「Northeast Asia (Tokyo)」推奨）

## 2. 環境変数の設定

1. プロジェクトルートに `.env.local` ファイルを作成
2. `env.example` を参考に以下の環境変数を設定：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 値の取得方法：
- Supabaseダッシュボード → Settings → API
- `Project URL` を `NEXT_PUBLIC_SUPABASE_URL` に
- `anon public` キーを `NEXT_PUBLIC_SUPABASE_ANON_KEY` に
- `service_role secret` キーを `SUPABASE_SERVICE_ROLE_KEY` に

## 3. データベーススキーマの適用

1. Supabaseダッシュボード → SQL Editor
2. `supabase-schema.sql` の内容をコピー&ペースト
3. 「Run」ボタンでスキーマを実行

## 4. 認証設定

1. Supabaseダッシュボード → Authentication → Settings
2. 必要に応じて認証プロバイダーを設定
3. Email認証は既定で有効

## 5. Row Level Security (RLS) の確認

スキーマ適用後、以下のポリシーが設定されます：

- **プロフィール**: 誰でも閲覧可能、自分のプロフィールのみ編集可能
- **投稿**: 誰でも閲覧可能、自分の投稿のみ編集・削除可能
- **いいね**: 誰でも閲覧可能、自分のいいねのみ追加・削除可能
- **フォロー**: 誰でも閲覧可能、自分からのフォローのみ追加・削除可能

## 6. データベーステーブル構成

### profiles
- ユーザープロフィール情報
- auth.usersと1:1の関係

### posts
- ユーザーの投稿
- 280文字制限
- いいね数、リポスト数、返信数を自動カウント

### likes
- 投稿へのいいね
- ユーザーと投稿の組み合わせで一意

### follows
- ユーザー間のフォロー関係
- 自分自身をフォローすることは不可

## 7. 使用方法

```typescript
import { supabase } from '@/lib/supabase'

// 投稿を取得
const { data: posts } = await supabase
  .from('posts')
  .select('*, profiles(*)')
  .order('created_at', { ascending: false })

// 新しい投稿を作成
const { data, error } = await supabase
  .from('posts')
  .insert([
    { user_id: user.id, content: 'Hello World!' }
  ])
```

## トラブルシューティング

### よくある問題

1. **RLS エラー**: ポリシーが正しく設定されているか確認
2. **認証エラー**: 環境変数が正しく設定されているか確認
3. **型エラー**: `src/types/database.ts` の型定義を確認 