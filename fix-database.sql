-- Posts tablosuna eksik kolonları ekle
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS cover_url TEXT,
ADD COLUMN IF NOT EXISTS date DATE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Mevcut kayıtlar için created_at değerini güncelle
UPDATE posts 
SET created_at = NOW() 
WHERE created_at IS NULL;

-- Mevcut kayıtlar için updated_at değerini güncelle
UPDATE posts 
SET updated_at = NOW() 
WHERE updated_at IS NULL;

-- Örnek yazı ekle (eğer tablo boşsa)
INSERT INTO posts (title, description, content, cover_url, date) 
SELECT 'Hoş Geldiniz!', 'Bu blog yazısına hoş geldiniz.', '<h1>Hoş Geldiniz!</h1><p>Bu blog yazısına hoş geldiniz. Admin panelinden yeni yazılar ekleyebilir, mevcut yazıları düzenleyebilir veya silebilirsiniz.</p>', 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800', CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM posts LIMIT 1);
