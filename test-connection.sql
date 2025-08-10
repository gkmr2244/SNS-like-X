-- Supabase接続テスト

-- 1. 基本的な接続確認
SELECT 'Database connection successful!' as status, version() as db_version;

-- 2. 既存のテーブル確認
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 3. auth.usersテーブルの存在確認
SELECT EXISTS(
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'auth' AND table_name = 'users'
) as auth_users_exists; 