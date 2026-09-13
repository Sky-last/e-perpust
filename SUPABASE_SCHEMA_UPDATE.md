# 🗄️ Supabase Schema Update - Remove Borrowing System

## 📋 Overview

Karena aplikasi **tidak menggunakan sistem peminjaman** lagi, kita perlu update schema Supabase untuk:
- ✅ Remove borrowing-related columns
- ✅ Simplify profiles table
- ✅ Keep only essential fields

---

## 🔄 Schema Changes

### **Before (With Borrowing):**
```sql
profiles table:
- borrowings (array/json) ❌ HAPUS
- downloads (array/json) ✅ KEEP (untuk track download history)
- read_books (array/json) ✅ KEEP (untuk track reading progress)

books table:
- stock (integer) ❌ TIDAK ADA (sudah dihapus)
- status (text) ❌ TIDAK PERLU
```

### **After (No Borrowing):**
```sql
profiles table:
- id (uuid)
- name (text)
- email (text)
- role (text)
- badge (text)
- avatar (text)
- auth_provider (text)
- phone (text)
- identity_number (text)
- member_category (text)
- institution (text)
- is_profile_completed (boolean)
- favorites (jsonb) ✅ Array of book IDs
- downloads (jsonb) ✅ Array of download records
- read_books (jsonb) ✅ Array of reading progress
- created_at (timestamp)
- updated_at (timestamp)

books table:
- id (text)
- title (text)
- author (text)
- category (text)
- publisher (text)
- isbn (text)
- description (text)
- year (integer)
- rating (numeric)
- cover_color (text)
- cover_url (text)
- pdf_url (text)
- created_at (timestamp)
- updated_at (timestamp)
```

---

## 🛠️ SQL Migration Script

### **Option 1: Clean Start (Recommended for Development)**

Jika Anda masih development dan belum ada data penting:

```sql
-- 1. Drop existing tables (WARNING: This deletes all data!)
DROP TABLE IF EXISTS public.borrowings CASCADE;
DROP TABLE IF EXISTS public.books CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.system_logs CASCADE;

-- 2. Create profiles table (simplified, no borrowings)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'user',
  badge TEXT DEFAULT 'Reguler',
  avatar TEXT,
  auth_provider TEXT DEFAULT 'email',
  phone TEXT,
  identity_number TEXT,
  member_category TEXT,
  institution TEXT,
  is_profile_completed BOOLEAN DEFAULT FALSE,
  favorites JSONB DEFAULT '[]'::jsonb,
  downloads JSONB DEFAULT '[]'::jsonb,
  read_books JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create books table (no stock, no status)
CREATE TABLE public.books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  publisher TEXT,
  isbn TEXT,
  description TEXT,
  year INTEGER,
  rating NUMERIC(3,2) DEFAULT 4.5,
  cover_color TEXT,
  cover_url TEXT,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create system_logs table
CREATE TABLE public.system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  action_type TEXT NOT NULL,
  book_title TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies for profiles
CREATE POLICY "Users can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- 7. Create RLS Policies for books
CREATE POLICY "Anyone can view books" 
  ON public.books FOR SELECT 
  USING (true);

CREATE POLICY "Admins can insert books" 
  ON public.books FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update books" 
  ON public.books FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete books" 
  ON public.books FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- 8. Create RLS Policies for system_logs
CREATE POLICY "Admins can view all logs" 
  ON public.system_logs FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Anyone can insert logs" 
  ON public.system_logs FOR INSERT 
  WITH CHECK (true);

-- 9. Create indexes for performance
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_books_category ON public.books(category);
CREATE INDEX idx_books_title ON public.books(title);
CREATE INDEX idx_system_logs_timestamp ON public.system_logs(timestamp DESC);

-- 10. Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at 
  BEFORE UPDATE ON public.books 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
```

---

### **Option 2: Migration (Keep Existing Data)**

Jika Anda sudah punya data users/books yang mau dipertahankan:

```sql
-- 1. Backup first! (Download data dari Supabase Dashboard)

-- 2. Remove borrowings column from profiles (if exists)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS borrowings CASCADE;

-- 3. Remove stock column from books (if exists)
ALTER TABLE public.books DROP COLUMN IF EXISTS stock CASCADE;

-- 4. Remove status column from books (if exists)
ALTER TABLE public.books DROP COLUMN IF EXISTS status CASCADE;

-- 5. Add missing columns if not exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS downloads JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS read_books JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_profile_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS auth_provider TEXT DEFAULT 'email';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS institution TEXT;

-- 6. Update existing users to have empty arrays
UPDATE public.profiles SET downloads = '[]'::jsonb WHERE downloads IS NULL;
UPDATE public.profiles SET read_books = '[]'::jsonb WHERE read_books IS NULL;
UPDATE public.profiles SET favorites = '[]'::jsonb WHERE favorites IS NULL;

-- 7. Drop borrowings table if exists
DROP TABLE IF EXISTS public.borrowings CASCADE;
```

---

## 🎯 How to Execute

### **Method 1: Supabase SQL Editor**

1. Buka **Supabase Dashboard**: https://app.supabase.com
2. Pilih project Anda
3. Klik **SQL Editor** di sidebar kiri
4. Klik **"+ New query"**
5. **Copy-paste** script SQL di atas (pilih Option 1 atau 2)
6. Klik **"Run"** atau `Ctrl + Enter`

---

### **Method 2: Supabase CLI** (Advanced)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to project
supabase link --project-ref ssfwcicixgkyptxbarsz

# Run migration
supabase db push
```

---

## ✅ Verification Checklist

After running migration, verify:

- [ ] `profiles` table tidak ada column `borrowings`
- [ ] `profiles` table ada column `downloads`, `read_books`, `favorites`
- [ ] `books` table tidak ada column `stock` atau `status`
- [ ] RLS policies aktif
- [ ] Test insert profile baru (via register)
- [ ] Test insert book baru (via admin dashboard)
- [ ] Test favorites (add/remove)
- [ ] Test download tracking

---

## 🔍 Check Current Schema

Untuk cek schema sekarang:

```sql
-- Check profiles columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public';

-- Check books columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'books' 
AND table_schema = 'public';

-- Check if borrowings table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'borrowings' 
AND table_schema = 'public';
```

---

## 📊 Data Types

```typescript
// TypeScript types (already in src/types.tsx)

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  badge: 'Premium' | 'Reguler';
  avatar?: string;
  avatarUrl?: string;
  authProvider?: 'email' | 'google';
  phone?: string;
  identityNumber?: string;
  memberCategory?: string;
  institution?: string;
  isProfileCompleted?: boolean;
  favorites: string[]; // Array of book IDs
  downloads?: DownloadedBook[]; // Array of download records
  readBooks?: ReadBook[]; // Array of reading progress
  // NO MORE: borrowings ❌
}

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  publisher?: string;
  isbn?: string;
  description?: string;
  year?: number;
  rating?: number;
  coverColor?: string;
  coverUrl?: string;
  pdfUrl?: string;
  // NO MORE: stock ❌
  // NO MORE: status ❌
}
```

---

## 🚨 Important Notes

1. **Backup Data First!**
   - Export profiles data
   - Export books data
   - Download dari Supabase Dashboard → Table Editor

2. **Test on Development First**
   - Jangan langsung run di production
   - Test semua functionality setelah migration

3. **Update Frontend Code**
   - Code sudah di-update (tidak ada borrowing logic)
   - Types sudah clean
   - UI sudah clean

---

## 🎉 Benefits After Migration

✅ **Simpler schema** - Tidak ada kompleksitas borrowing  
✅ **Faster queries** - Tidak ada join ke borrowings table  
✅ **Cleaner code** - Tidak ada borrowing logic  
✅ **Better performance** - Less data to process  

---

## 📚 Related Files Updated

- ✅ `src/types.tsx` - User & Book interfaces (no borrowings)
- ✅ `src/lib/db.ts` - Database functions (no borrowing functions)
- ✅ `src/App.tsx` - Main logic (no borrowing handlers)
- ✅ `src/components/AdminPage.tsx` - UI cleanup (no borrowing stats)
- ✅ `src/components/UserDashboard.tsx` - UI (no borrowing section)

---

**Ready to migrate? Choose Option 1 (clean) or Option 2 (keep data) dan execute di Supabase SQL Editor!** 🚀
