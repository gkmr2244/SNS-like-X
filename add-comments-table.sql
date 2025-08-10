-- コメントテーブルの追加
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) <= 280),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- インデックスの作成
CREATE INDEX comments_user_id_idx ON comments(user_id);
CREATE INDEX comments_post_id_idx ON comments(post_id);
CREATE INDEX comments_created_at_idx ON comments(created_at DESC);

-- RLS (Row Level Security) の有効化
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- コメントのポリシー
CREATE POLICY "Comments are viewable by everyone" 
ON comments FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own comments" 
ON comments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" 
ON comments FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" 
ON comments FOR DELETE 
USING (auth.uid() = user_id);

-- トリガーの設定
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- コメント数を更新する関数
CREATE OR REPLACE FUNCTION increment_replies_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE posts SET replies_count = replies_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION decrement_replies_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE posts SET replies_count = replies_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
END;
$$ language 'plpgsql';

-- コメント数の自動更新トリガー
CREATE TRIGGER comments_insert_trigger AFTER INSERT ON comments 
FOR EACH ROW EXECUTE PROCEDURE increment_replies_count();

CREATE TRIGGER comments_delete_trigger AFTER DELETE ON comments 
FOR EACH ROW EXECUTE PROCEDURE decrement_replies_count(); 