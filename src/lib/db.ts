import { supabase, isSupabaseConfigured } from './supabase';
import { Book, User, SystemLog, Borrowing } from '../types';
import { INITIAL_BOOKS } from '../data/books';

// Helper to format date
const getFormattedDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
};

// ==========================================
// 1. BOOKS APIS
// ==========================================

export async function getBooks(): Promise<Book[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // If database is empty, seed it with INITIAL_BOOKS
      if (!data || data.length === 0) {
        const insertData = INITIAL_BOOKS.map(b => ({
          id: b.id,
          title: b.title,
          author: b.author,
          category: b.category,
          publisher: b.publisher,
          isbn: b.isbn,
          description: b.description,
          year: b.year,
          rating: b.rating,
          status: b.status,
          stock: b.stock,
          cover_color: b.coverColor,
          cover_url: b.coverUrl,
          is_ai_generated: b.isAiGenerated || false
        }));

        const { error: seedError } = await supabase.from('books').insert(insertData);
        if (seedError) console.error('Failed to seed books:', seedError);
        return INITIAL_BOOKS;
      }

      return data.map(b => ({
        id: b.id,
        title: b.title,
        author: b.author,
        category: b.category,
        publisher: b.publisher,
        isbn: b.isbn,
        description: b.description,
        year: b.year,
        rating: Number(b.rating),
        status: b.status as 'Tersedia' | 'Sedang Dipinjam',
        stock: b.stock,
        coverColor: b.cover_color,
        coverUrl: b.cover_url || undefined,
        isAiGenerated: b.is_ai_generated
      }));
    } catch (e) {
      console.error('Supabase error fetching books, falling back to local:', e);
    }
  }

  // LocalStorage fallback
  const stored = localStorage.getItem('digital_library_books');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('digital_library_books', JSON.stringify(INITIAL_BOOKS));
  return INITIAL_BOOKS;
}

export async function saveBook(book: Omit<Book, 'status'>, isNew: boolean): Promise<Book> {
  const fullBook: Book = {
    ...book,
    status: book.stock > 0 ? 'Tersedia' : 'Sedang Dipinjam'
  };

  if (isSupabaseConfigured) {
    try {
      const dbPayload = {
        id: fullBook.id,
        title: fullBook.title,
        author: fullBook.author,
        category: fullBook.category,
        publisher: fullBook.publisher,
        isbn: fullBook.isbn,
        description: fullBook.description,
        year: fullBook.year,
        rating: fullBook.rating,
        status: fullBook.status,
        stock: fullBook.stock,
        cover_color: fullBook.coverColor,
        cover_url: fullBook.coverUrl || null,
        is_ai_generated: fullBook.isAiGenerated || false
      };

      if (isNew) {
        const { error } = await supabase.from('books').insert(dbPayload);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('books').update(dbPayload).eq('id', fullBook.id);
        if (error) throw error;
      }
      return fullBook;
    } catch (e) {
      console.error('Supabase error saving book:', e);
    }
  }

  // LocalStorage fallback
  const stored = localStorage.getItem('digital_library_books');
  const list: Book[] = stored ? JSON.parse(stored) : INITIAL_BOOKS;
  let updatedList: Book[];
  if (isNew) {
    updatedList = [fullBook, ...list];
  } else {
    updatedList = list.map(b => b.id === fullBook.id ? fullBook : b);
  }
  localStorage.setItem('digital_library_books', JSON.stringify(updatedList));
  return fullBook;
}

export async function removeBook(id: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('books').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('Supabase error deleting book:', e);
    }
  }

  // LocalStorage fallback
  const stored = localStorage.getItem('digital_library_books');
  if (stored) {
    const list: Book[] = JSON.parse(stored);
    const updated = list.filter(b => b.id !== id);
    localStorage.setItem('digital_library_books', JSON.stringify(updated));
    return true;
  }
  return false;
}

// ==========================================
// 2. USERS & PROFILE APIS
// ==========================================

export async function getUserProfile(userId: string): Promise<User | null> {
  if (isSupabaseConfigured) {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Fetch borrowings
      const { data: borrowingsData } = await supabase
        .from('borrowings')
        .select('*')
        .eq('user_id', userId);

      const borrowings: Borrowing[] = (borrowingsData || []).map(b => ({
        id: b.id,
        bookId: b.book_id,
        bookTitle: b.book_title,
        coverColor: b.cover_color,
        coverUrl: b.cover_url || undefined,
        borrowDate: b.borrow_date,
        dueDate: b.due_date,
        returnDate: b.return_date || undefined,
        status: b.status as any
      }));

      // Fetch favorites
      const { data: favsData } = await supabase
        .from('favorites')
        .select('book_id')
        .eq('user_id', userId);

      const favorites = (favsData || []).map(f => f.book_id);

      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: (profile.role || 'siswa') as 'admin' | 'staf' | 'siswa',
        badge: profile.badge as 'Premium' | 'Reguler',
        avatar: profile.avatar || undefined,
        favorites,
        borrowings
      };
    } catch (e) {
      console.error('Supabase error loading user profile:', e);
    }
  }
  return null;
}

export async function updateUserProfile(userId: string, name: string, email: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name, email })
        .eq('id', userId);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('Supabase error updating user profile:', e);
      return false;
    }
  }
  return false;
}

export async function getAllUsers(): Promise<User[]> {
  if (isSupabaseConfigured) {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const userList: User[] = [];
      for (const p of profiles || []) {
        // Fetch borrowings
        const { data: borrowingsData } = await supabase
          .from('borrowings')
          .select('*')
          .eq('user_id', p.id);

        const borrowings: Borrowing[] = (borrowingsData || []).map(b => ({
          id: b.id,
          bookId: b.book_id,
          bookTitle: b.book_title,
          coverColor: b.cover_color,
          coverUrl: b.cover_url || undefined,
          borrowDate: b.borrow_date,
          dueDate: b.due_date,
          returnDate: b.return_date || undefined,
          status: b.status as any
        }));

        userList.push({
          id: p.id,
          name: p.name,
          email: p.email,
          password: '••••••••',
          role: p.role as any,
          badge: p.badge as any,
          avatar: p.avatar || undefined,
          favorites: [],
          borrowings
        });
      }
      return userList;
    } catch (e) {
      console.error('Supabase error getting all users:', e);
    }
  }

  // LocalStorage fallback
  const stored = localStorage.getItem('digital_library_users');
  return stored ? JSON.parse(stored) : [];
}

export async function updateUserBadge(userId: string, badge: 'Premium' | 'Reguler'): Promise<boolean> {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ badge })
        .eq('id', userId);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('Supabase error updating badge:', e);
      return false;
    }
  }
  return false;
}

// ==========================================
// 3. BORROWINGS APIS
// ==========================================

export async function makeBorrowing(
  userId: string, 
  bookId: string, 
  bookTitle: string, 
  coverColor: string, 
  coverUrl: string | undefined, 
  durationDays: number
): Promise<Borrowing | null> {
  const now = new Date();
  const borrowDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const due = new Date();
  due.setDate(now.getDate() + durationDays);
  const dueDate = `${due.getFullYear()}-${String(due.getMonth() + 1).padStart(2, '0')}-${String(due.getDate()).padStart(2, '0')}`;

  if (isSupabaseConfigured) {
    try {
      // 1. Insert borrowing
      const { data, error } = await supabase
        .from('borrowings')
        .insert({
          user_id: userId,
          book_id: bookId,
          book_title: bookTitle,
          cover_color: coverColor,
          cover_url: coverUrl || null,
          borrow_date: borrowDate,
          due_date: dueDate,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // 2. Decrement book stock in Supabase
      const { data: bookData } = await supabase.from('books').select('stock').eq('id', bookId).single();
      if (bookData) {
        const newStock = Math.max(0, bookData.stock - 1);
        await supabase
          .from('books')
          .update({ 
            stock: newStock,
            status: newStock > 0 ? 'Tersedia' : 'Sedang Dipinjam'
          })
          .eq('id', bookId);
      }

      return {
        id: data.id,
        bookId: data.book_id,
        bookTitle: data.book_title,
        coverColor: data.cover_color,
        coverUrl: data.cover_url || undefined,
        borrowDate: data.borrow_date,
        dueDate: data.due_date,
        status: (data.status || 'pending') as any
      };
    } catch (e) {
      console.error('Supabase error borrowing book:', e);
    }
  }
  return null;
}

export async function returnBorrowing(borrowingId: string, bookId: string): Promise<string | null> {
  const now = new Date();
  const returnDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  if (isSupabaseConfigured) {
    try {
      // 1. Update status
      const { error } = await supabase
        .from('borrowings')
        .update({ status: 'Dikembalikan', return_date: returnDate })
        .eq('id', borrowingId);

      if (error) throw error;

      // 2. Increment book stock in Supabase
      const { data: bookData } = await supabase.from('books').select('stock').eq('id', bookId).single();
      if (bookData) {
        const newStock = bookData.stock + 1;
        await supabase
          .from('books')
          .update({ 
            stock: newStock,
            status: 'Tersedia'
          })
          .eq('id', bookId);
      }

      return returnDate;
    } catch (e) {
      console.error('Supabase error returning book:', e);
    }
  }
  return null;
}

export async function extendBorrowing(borrowingId: string, currentDueDate: string): Promise<string | null> {
  const dateObj = new Date(currentDueDate);
  dateObj.setDate(dateObj.getDate() + 7); // extend 7 days
  const newDueDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('borrowings')
        .update({ due_date: newDueDate })
        .eq('id', borrowingId);

      if (error) throw error;
      return newDueDate;
    } catch (e) {
      console.error('Supabase error extending borrowing:', e);
    }
  }
  return null;
}

// ==========================================
// 4. FAVORITES APIS
// ==========================================

export async function saveFavorite(userId: string, bookId: string, isFav: boolean): Promise<boolean> {
  if (isSupabaseConfigured) {
    try {
      if (isFav) {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: userId, book_id: bookId });
        if (error && error.code !== '23505') throw error; // ignore duplicate key
      } else {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('book_id', bookId);
        if (error) throw error;
      }
      return true;
    } catch (e) {
      console.error('Supabase error toggling favorite:', e);
    }
  }
  return false;
}

// ==========================================
// 5. SYSTEM LOG APIS
// ==========================================

export async function getSystemLogs(): Promise<SystemLog[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('system_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(l => ({
        id: l.id,
        type: l.type as any,
        userName: l.user_name,
        userEmail: l.user_email,
        bookTitle: l.book_title || undefined,
        date: l.date,
        details: l.details || undefined
      }));
    } catch (e) {
      console.error('Supabase error fetching system logs:', e);
    }
  }

  // LocalStorage fallback
  const stored = localStorage.getItem('digital_library_logs');
  return stored ? JSON.parse(stored) : [];
}

export async function addSystemLog(
  email: string, 
  name: string, 
  type: 'pinjam' | 'kembali' | 'perpanjang' | 'register' | 'update_profile', 
  bookTitle: string
): Promise<SystemLog> {
  const formattedDate = getFormattedDate();
  const logData = {
    id: 'log_' + Math.random().toString(36).substr(2, 9),
    userEmail: email,
    userName: name,
    type,
    bookTitle,
    date: formattedDate
  };

  if (isSupabaseConfigured) {
    try {
      await supabase.from('system_logs').insert({
        type,
        user_name: name,
        user_email: email,
        book_title: bookTitle || null,
        date: formattedDate
      });
    } catch (e) {
      console.error('Supabase error inserting log:', e);
    }
  }

  // Sync to local anyway as cache
  const stored = localStorage.getItem('digital_library_logs');
  const logsList: SystemLog[] = stored ? JSON.parse(stored) : [];
  const updatedLogs = [logData, ...logsList];
  localStorage.setItem('digital_library_logs', JSON.stringify(updatedLogs));

  return logData;
}
