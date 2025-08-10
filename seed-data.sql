-- SNS App Seed Data
-- Supabase SQL Editorで実行してください

-- まず、ダミーユーザーを認証システムに追加する必要があります
-- 通常は認証システム経由でユーザーが作成されますが、
-- テスト用にダミーのUUIDを使用してプロフィールデータを作成します

-- 1. テストユーザーのプロフィールデータ
INSERT INTO profiles (id, username, display_name, bio, avatar_url) VALUES
-- ダミーUUID（実際の認証ユーザーID）
('550e8400-e29b-41d4-a716-446655440000', 'alice_tanaka', 'アリス田中', 'テクノロジーとコーヒーが好きです ☕️', 'https://i.pravatar.cc/150?img=1'),
('550e8400-e29b-41d4-a716-446655440001', 'bob_suzuki', 'ボブ鈴木', '写真撮影とランニングが趣味です 📸🏃‍♂️', 'https://i.pravatar.cc/150?img=2'),
('550e8400-e29b-41d4-a716-446655440002', 'carol_yamada', 'キャロル山田', 'デザイナーです。美しいものが大好き ✨', 'https://i.pravatar.cc/150?img=3'),
('550e8400-e29b-41d4-a716-446655440003', 'david_sato', 'デイビッド佐藤', 'エンジニア | 読書家 | 猫好き 🐱', 'https://i.pravatar.cc/150?img=4'),
('550e8400-e29b-41d4-a716-446655440004', 'emma_watanabe', 'エマ渡辺', '料理とガーデニングを楽しんでいます 🌱🍳', 'https://i.pravatar.cc/150?img=5');

-- 2. 投稿データ
INSERT INTO posts (user_id, content, likes_count, reposts_count, replies_count, created_at) VALUES
-- アリスの投稿
('550e8400-e29b-41d4-a716-446655440000', '新しいコーヒーショップを発見しました！エスプレッソが絶品でした ☕️ #コーヒー好き', 12, 3, 5, NOW() - INTERVAL '2 hours'),
('550e8400-e29b-41d4-a716-446655440000', 'Next.jsとSupabaseでSNSアプリを作っています。データベース設計が楽しい！ #開発日記', 8, 2, 3, NOW() - INTERVAL '1 day'),

-- ボブの投稿
('550e8400-e29b-41d4-a716-446655440001', '今朝のランニングで素晴らしい朝日を撮影できました 🌅 #ランニング #写真', 15, 1, 7, NOW() - INTERVAL '6 hours'),
('550e8400-e29b-41d4-a716-446655440001', '新しいカメラレンズを購入！週末に試し撮りに行く予定です 📸', 6, 0, 2, NOW() - INTERVAL '2 days'),

-- キャロルの投稿
('550e8400-e29b-41d4-a716-446655440002', 'UI/UXデザインのトレンドについてブログ記事を書きました。リンクはプロフィールに！', 20, 5, 8, NOW() - INTERVAL '4 hours'),
('550e8400-e29b-41d4-a716-446655440002', 'Figmaの新機能が素晴らしい！デザインワークフローが格段に向上しました ✨', 11, 2, 4, NOW() - INTERVAL '1 day'),

-- デイビッドの投稿
('550e8400-e29b-41d4-a716-446655440003', 'TypeScriptの型安全性について考えていました。Prismaとの組み合わせが最高ですね！', 9, 1, 6, NOW() - INTERVAL '8 hours'),
('550e8400-e29b-41d4-a716-446655440003', '猫のミケが新しいおもちゃを気に入ったようです 🐱 可愛すぎる...', 18, 0, 12, NOW() - INTERVAL '12 hours'),

-- エマの投稿
('550e8400-e29b-41d4-a716-446655440004', '家庭菜園でトマトが実りました！今夜はパスタソースを作る予定 🍅', 14, 2, 6, NOW() - INTERVAL '3 hours'),
('550e8400-e29b-41d4-a716-446655440004', '新しいパン作りのレシピに挑戦中。発酵がうまくいきますように 🍞', 7, 1, 3, NOW() - INTERVAL '1 day');

-- 3. いいねデータ（クロスいいね）
INSERT INTO likes (user_id, post_id) VALUES
-- アリスの投稿へのいいね
((SELECT id FROM posts WHERE content LIKE '%コーヒーショップ%' LIMIT 1), '550e8400-e29b-41d4-a716-446655440001'),
((SELECT id FROM posts WHERE content LIKE '%コーヒーショップ%' LIMIT 1), '550e8400-e29b-41d4-a716-446655440002'),
((SELECT id FROM posts WHERE content LIKE '%コーヒーショップ%' LIMIT 1), '550e8400-e29b-41d4-a716-446655440004'),

-- ボブの写真投稿へのいいね
((SELECT id FROM posts WHERE content LIKE '%朝日を撮影%' LIMIT 1), '550e8400-e29b-41d4-a716-446655440000'),
((SELECT id FROM posts WHERE content LIKE '%朝日を撮影%' LIMIT 1), '550e8400-e29b-41d4-a716-446655440002'),
((SELECT id FROM posts WHERE content LIKE '%朝日を撮影%' LIMIT 1), '550e8400-e29b-41d4-a716-446655440003'),

-- キャロルのデザイン投稿へのいいね
((SELECT id FROM posts WHERE content LIKE '%UI/UXデザイン%' LIMIT 1), '550e8400-e29b-41d4-a716-446655440000'),
((SELECT id FROM posts WHERE content LIKE '%UI/UXデザイン%' LIMIT 1), '550e8400-e29b-41d4-a716-446655440001'),
((SELECT id FROM posts WHERE content LIKE '%UI/UXデザイン%' LIMIT 1), '550e8400-e29b-41d4-a716-446655440003'),

-- エマの料理投稿へのいいね
((SELECT id FROM posts WHERE content LIKE '%トマトが実り%' LIMIT 1), '550e8400-e29b-41d4-a716-446655440001'),
((SELECT id FROM posts WHERE content LIKE '%トマトが実り%' LIMIT 1), '550e8400-e29b-41d4-a716-446655440002'),
((SELECT id FROM posts WHERE content LIKE '%トマトが実り%' LIMIT 1), '550e8400-e29b-41d4-a716-446655440003');

-- 4. フォローデータ
INSERT INTO follows (follower_id, following_id) VALUES
-- アリスがフォローしている人
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001'), -- ボブ
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002'), -- キャロル
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003'), -- デイビッド

-- ボブがフォローしている人
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000'), -- アリス
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'), -- キャロル
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004'), -- エマ

-- キャロルがフォローしている人
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000'), -- アリス
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003'), -- デイビッド
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004'), -- エマ

-- デイビッドがフォローしている人
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000'), -- アリス
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001'), -- ボブ
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004'), -- エマ

-- エマがフォローしている人
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001'), -- ボブ
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002'), -- キャロル
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003'); -- デイビッド

-- 5. いいね数の更新（トリガーがない場合の手動更新）
UPDATE posts SET likes_count = (
    SELECT COUNT(*) FROM likes WHERE post_id = posts.id
);

-- 成功メッセージ
SELECT 
    'Seed data inserted successfully!' as message,
    (SELECT COUNT(*) FROM profiles) as profiles_count,
    (SELECT COUNT(*) FROM posts) as posts_count,
    (SELECT COUNT(*) FROM likes) as likes_count,
    (SELECT COUNT(*) FROM follows) as follows_count; 