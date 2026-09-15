# SQL SCRIPT UNTUK SISTEM NOTIFIKASI

Jalankan di Supabase SQL Editor:

```sql
-- ============================================
-- CREATE NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('admin_new_book', 'user_review', 'user_download', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  book_id TEXT,
  book_title TEXT,
  from_user_name TEXT,
  from_user_email TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- Index
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
```

## Penjelasan Notifications:

- **admin_new_book**: Admin nambah buku baru → notif ke semua user
- **user_review**: User kasih review → notif ke admin
- **user_download**: User download buku → notif ke admin
- **system**: Notifikasi sistem lainnya
