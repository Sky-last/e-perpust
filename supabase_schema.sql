-- SCHEMA UNTUK SUPABASE DATABASE PERPUSTAKAAN DIGITAL

-- 1. Tabel Profil (menghubungkan ke tabel bawaan auth.users Supabase)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'siswa' CHECK (role IN ('admin', 'staf', 'siswa')),
  badge TEXT NOT NULL DEFAULT 'Reguler' CHECK (badge IN ('Premium', 'Reguler')),
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Mengaktifkan Row Level Security (RLS) untuk profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Kebijakan akses (Policies) untuk profiles
CREATE POLICY "Semua orang bisa melihat profil" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Pengguna bisa mengubah profil mereka sendiri" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. Tabel Buku (Books)
CREATE TABLE public.books (
  id TEXT PRIMARY KEY, -- menggunakan text karena id berupa string acak/dari uuid
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  publisher TEXT NOT NULL,
  isbn TEXT NOT NULL,
  description TEXT NOT NULL,
  year INTEGER NOT NULL,
  rating NUMERIC(3,2) NOT NULL DEFAULT 4.5,
  status TEXT NOT NULL DEFAULT 'Tersedia' CHECK (status IN ('Tersedia', 'Sedang Dipinjam')),
  stock INTEGER NOT NULL DEFAULT 1,
  cover_color TEXT NOT NULL DEFAULT 'from-blue-600 to-indigo-900',
  cover_url TEXT,
  is_ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Semua orang bisa melihat buku" ON public.books
  FOR SELECT USING (true);

CREATE POLICY "Hanya admin yang bisa memodifikasi buku" ON public.books
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
    )
  );

-- 3. Tabel Peminjaman (Borrowings)
CREATE TABLE public.borrowings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  book_id TEXT REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  book_title TEXT NOT NULL,
  cover_color TEXT NOT NULL,
  cover_url TEXT,
  borrow_date TEXT NOT NULL,
  due_date TEXT NOT NULL,
  return_date TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('Sedang Dipinjam', 'Dikembalikan', 'Terlambat', 'pending', 'approved', 'rejected', 'overdue')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.borrowings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pengguna bisa melihat peminjaman mereka sendiri" ON public.borrowings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin dan Staf bisa melihat semua peminjaman" ON public.borrowings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = auth.uid() AND public.profiles.role IN ('admin', 'staf')
    )
  );

CREATE POLICY "Pengguna bisa membuat peminjaman" ON public.borrowings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Pengguna/Admin/Staf bisa memperbarui peminjaman" ON public.borrowings
  FOR UPDATE USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = auth.uid() AND public.profiles.role IN ('admin', 'staf')
    )
  );

-- 4. Tabel Favorit (Favorites)
CREATE TABLE public.favorites (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  book_id TEXT REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (user_id, book_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pengguna bisa melihat favorit mereka sendiri" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Pengguna bisa mengelola favorit mereka sendiri" ON public.favorites
  FOR ALL USING (auth.uid() = user_id);

-- 5. Tabel Log Sistem (System Logs)
CREATE TABLE public.system_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('pinjam', 'kembali', 'perpanjang', 'register', 'update_profile')),
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  book_title TEXT,
  date TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hanya admin yang bisa melihat log sistem" ON public.system_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
    )
  );

CREATE POLICY "Semua pengguna bisa mengirim log sistem" ON public.system_logs
  FOR INSERT WITH CHECK (true);


-- 6. Trigger Otomatis untuk Membuat Profil saat User Baru Mendaftar di Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, badge)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'Anggota Baru'),
    new.email,
    CASE 
      WHEN new.email = 'admin@pustaka.com' THEN 'admin'
      ELSE 'siswa'
    END,
    'Reguler'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
