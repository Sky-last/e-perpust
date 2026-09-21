import { supabase, isSupabaseConfigured } from './supabase';
import { Book, User, SystemLog, Borrowing, SiteSettings } from '../types';
import { INITIAL_BOOKS } from '../data/books';
import { DEFAULT_SITE_SETTINGS } from '../data/seedData';
import { BOOK_PDF_MAP, resolveBookPdfUrl } from '../utils/pdfResolver';

// Helper to format date
const getFormattedDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
};

// ==========================================
// 1. BOOKS APIS
// ==========================================

export async function getBooks(): Promise<Book[]> {
  // Always base our digital library catalog on INITIAL_BOOKS (the 111 authentic digital books from assets/buku digital)
  let catalogBooks: Book[] = INITIAL_BOOKS.map(b => ({
    ...b,
    pdfUrl: resolveBookPdfUrl(b),
    coverUrl: b.coverUrl || `/buku_sampul/cover_${b.id}.jpg`,
    isActive: true
  }));

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        // Merge any Supabase updates for custom books
        catalogBooks = catalogBooks.map(initBook => {
          const remote = data.find(r => r.id === initBook.id);
          if (remote) {
            return { ...initBook };
          }
          return initBook;
        });

        // If there are custom admin-added books in Supabase (excluding old dummy 'eb-' books):
        const customRemoteBooks: Book[] = data
          .filter(r => !r.id.startsWith('eb-') && !catalogBooks.some(cb => cb.id === r.id))
          .map(b => ({
            id: b.id,
            title: b.title,
            author: b.author,
            category: b.category,
            publisher: b.publisher,
            isbn: b.isbn,
            description: b.description,
            year: b.year,
            rating: Number(b.rating || 4.5),
            status: 'Tersedia' as const,
            coverColor: b.cover_color,
            coverUrl: b.cover_url || `/buku_sampul/cover_${b.id}.jpg`,
            pdfUrl: b.pdf_url || resolveBookPdfUrl(b),
            isAiGenerated: b.is_ai_generated,
            isActive: true
          }));

        catalogBooks = [...catalogBooks, ...customRemoteBooks];
      }
    } catch (e) {
      console.error('Supabase error fetching books, using full digital catalog:', e);
    }
  }

  // Also merge any local storage modifications
  const stored = localStorage.getItem('digital_library_books');
  if (stored) {
    try {
      const parsed: Book[] = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        catalogBooks = catalogBooks.map(initBook => {
          const found = parsed.find(b => b.id === initBook.id);
          if (found) {
            return { ...initBook };
          }
          return initBook;
        });

        const customLocal = parsed.filter(b =>
          !b.id.startsWith('eb-') &&
          !catalogBooks.some(cb => cb.id === b.id) &&
          b.isActive !== false
        );
        catalogBooks = [...catalogBooks, ...customLocal];
      }
    } catch (e) { }
  }

  localStorage.setItem('digital_library_books', JSON.stringify(catalogBooks));
  return catalogBooks;
}

export async function saveBook(book: Partial<Book>, isNew: boolean): Promise<Book> {
  const fullBook: Book = {
    ...book,
    status: 'Tersedia' // Default status for Book type compatibility
  } as Book;

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
        cover_color: fullBook.coverColor,
        cover_url: fullBook.coverUrl || null,
        pdf_url: fullBook.pdfUrl || null,
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
  const stored = localStorage.getItem('digital_library_books');
  if (stored) {
    try {
      const list: Book[] = JSON.parse(stored);
      const updated = list.filter(b => b.id !== id);
      localStorage.setItem('digital_library_books', JSON.stringify(updated));
    } catch (e) {}
  }

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('books').delete().eq('id', id);
      if (error) {
        console.warn('Supabase error deleting book:', error);
      }
      return true;
    } catch (e) {
      console.warn('Supabase error deleting book:', e);
    }
  }

  return true;
}

// ==========================================
// 2. USERS & PROFILE APIS
// ==========================================

export async function getUserProfile(userId: string): Promise<User | null> {
  if (isSupabaseConfigured) {
    try {
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        console.warn('Supabase profile query warning:', profileError);
      }

      // If profile row doesn't exist in Supabase profiles table, attempt auto-creation from auth session
      if (!profile) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user && user.id === userId) {
            const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'Anggota';
            const userRole = user.user_metadata?.role || 'user';

            const newProfile = {
              id: userId,
              name: userName,
              email: user.email || '',
              role: userRole,
              badge: 'Reguler',
              avatar: undefined
            };

            await supabase.from('profiles').upsert(newProfile);
            profile = newProfile;
          }
        } catch (err) {
          console.error('Error auto-creating profile row:', err);
        }
      }

      if (!profile) return null;

      // Fetch favorites from favorites table
      const { data: favsData } = await supabase
        .from('favorites')
        .select('book_id')
        .eq('user_id', userId);

      const favorites = (favsData || []).map(f => f.book_id);

      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: (profile.role || 'user') as 'admin' | 'user',
        badge: (profile.badge || 'Reguler') as 'Premium' | 'Reguler',
        avatar: profile.avatar || undefined,
        avatarUrl: profile.avatar || undefined,
        phone: profile.phone || undefined,
        memberCategory: profile.member_category || profile.class || 'Masyarakat Umum',
        class: profile.member_category || profile.class || 'Masyarakat Umum',
        identityNumber: profile.identity_number || profile.nisn || undefined,
        nisn: profile.identity_number || profile.nisn || undefined,
        institution: profile.institution || undefined,
        address: profile.address || undefined,
        isProfileCompleted: Boolean(
          (profile.identity_number || profile.nisn) &&
          profile.phone &&
          (profile.member_category || profile.class)
        ),
        downloads: profile.downloads || [],
        readBooks: profile.read_books || [],
        favorites,
        borrowings: [] // No more borrowings system
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

export async function updateUserInDb(userId: string, updatedData: Partial<User>): Promise<boolean> {
  if (isSupabaseConfigured) {
    try {
      const payload: Record<string, any> = {};
      if (updatedData.name !== undefined) payload.name = updatedData.name;
      if (updatedData.email !== undefined) payload.email = updatedData.email;
      if (updatedData.role !== undefined) payload.role = updatedData.role;
      if (updatedData.badge !== undefined) payload.badge = updatedData.badge;
      if (updatedData.avatarUrl !== undefined || updatedData.avatar !== undefined) payload.avatar = updatedData.avatarUrl || updatedData.avatar;
      if (updatedData.phone !== undefined) payload.phone = updatedData.phone;
      if (updatedData.memberCategory !== undefined) payload.member_category = updatedData.memberCategory;
      if (updatedData.class !== undefined && !payload.member_category) payload.member_category = updatedData.class;
      if (updatedData.identityNumber !== undefined) payload.identity_number = updatedData.identityNumber;
      if (updatedData.nisn !== undefined && !payload.identity_number) payload.identity_number = updatedData.nisn;
      if (updatedData.institution !== undefined) payload.institution = updatedData.institution;
      if (updatedData.address !== undefined) payload.address = updatedData.address;
      if (updatedData.downloads !== undefined) payload.downloads = updatedData.downloads;
      if (updatedData.readBooks !== undefined) payload.read_books = updatedData.readBooks;

      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', userId);

      if (error) {
        console.error('Supabase error updating user profile:', error);
        // Fallback for role constraint (if DB constraint uses 'siswa' instead of 'user' or vice versa)
        if (updatedData.role === 'user') {
          const altRole = updatedData.role === 'user' ? 'siswa' : 'user';
          const { error: err2 } = await supabase
            .from('profiles')
            .update({ ...payload, role: altRole })
            .eq('id', userId);
          if (!err2) return true;
        }
        return false;
      }
      return true;
    } catch (e) {
      console.error('Supabase error updating user profile:', e);
      return false;
    }
  }
  return true;
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
        userList.push({
          id: p.id,
          name: p.name,
          email: p.email,
          password: '••••••••',
          role: p.role as any,
          badge: p.badge as any,
          avatar: p.avatar || undefined,
          avatarUrl: p.avatar || undefined,
          phone: p.phone || undefined,
          memberCategory: p.member_category || p.class || 'Masyarakat Umum',
          class: p.member_category || p.class || 'Masyarakat Umum',
          identityNumber: p.identity_number || p.nisn || undefined,
          nisn: p.identity_number || p.nisn || undefined,
          downloads: p.downloads || [],
          readBooks: p.read_books || [],
          favorites: [],
          borrowings: [] // No more borrowings system
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
// 3. BORROWINGS APIS (DEPRECATED - No longer used)
// ==========================================

// System peminjaman sudah dihapus - semua buku digital gratis tanpa peminjaman
export async function makeBorrowing(
  userId: string,
  bookId: string,
  bookTitle: string,
  coverColor: string,
  coverUrl: string | undefined,
  durationDays: number
): Promise<Borrowing | null> {
  console.warn('makeBorrowing: Borrowing system deprecated');
  return null;
}

export async function returnBorrowing(borrowingId: string, bookId: string): Promise<string | null> {
  console.warn('returnBorrowing: Borrowing system deprecated');
  return null;
}

export async function extendBorrowing(borrowingId: string, currentDueDate: string): Promise<string | null> {
  console.warn('extendBorrowing: Borrowing system deprecated');
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

// ==========================================
// 7. AVATAR / FOTO PROFIL
// ==========================================

export async function uploadAvatar(userId: string, file: File): Promise<string | null> {
  const getBase64 = (f: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(f);
    });
  };

  if (isSupabaseConfigured) {
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const filePath = `${userId}/avatar_${Date.now()}.${ext}`;

      // Upload ke bucket 'avatars' di Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (!uploadError) {
        // Ambil public URL dari file yang diupload
        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        const publicUrl = data.publicUrl;

        // Simpan URL ke tabel profiles
        await supabase
          .from('profiles')
          .update({ avatar: publicUrl })
          .eq('id', userId);

        return publicUrl;
      } else {
        console.warn('Supabase storage upload error, using base64 fallback:', uploadError);
      }
    } catch (e) {
      console.warn('Error uploading avatar to Supabase storage, using base64 fallback:', e);
    }
  }

  // LocalStorage / Base64 fallback
  try {
    const base64 = await getBase64(file);
    localStorage.setItem(`digital_library_avatar_${userId}`, base64);
    return base64;
  } catch (err) {
    console.error('FileReader error:', err);
    return null;
  }
}

export async function uploadEbook(bookId: string, file: File): Promise<string | null> {
  if (isSupabaseConfigured) {
    try {
      const ext = file.name.split('.').pop();
      const filePath = `ebooks/${bookId}_${Date.now()}.${ext}`;

      // Upload ke bucket 'avatars' (karena biasanya bucket ini yang memiliki public RLS read/write di project user)
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Ambil public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (e) {
      console.error('Error uploading ebook:', e);
      return null;
    }
  }

  // LocalStorage fallback: kembalikan temporary object URL (atau link simulasi)
  return new Promise((resolve) => {
    // Sebagai fallback local, kita bisa membuat Object URL sementara untuk sesi berjalan
    try {
      const url = URL.createObjectURL(file);
      resolve(url);
    } catch (err) {
      resolve('/buku_digital/Advice_for_the_Muslim.pdf');
    }
  });
}


// ==========================================
// 8. NOTIFICATIONS APIS
// ==========================================

export interface Notification {
  id: string;
  userId: string;
  type: 'admin_new_book' | 'user_review' | 'user_download' | 'system';
  title: string;
  message: string;
  bookId?: string;
  bookTitle?: string;
  fromUserName?: string;
  fromUserEmail?: string;
  isRead: boolean;
  createdAt: string;
}

export async function getNotifications(userId: string): Promise<Notification[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return (data || []).map(n => ({
        id: n.id,
        userId: n.user_id,
        type: n.type,
        title: n.title,
        message: n.message,
        bookId: n.book_id,
        bookTitle: n.book_title,
        fromUserName: n.from_user_name,
        fromUserEmail: n.from_user_email,
        isRead: n.is_read,
        createdAt: n.created_at
      }));
    } catch (e) {
      console.error('Supabase error fetching notifications:', e);
    }
  }
  return [];
}

export async function createNotification(
  userId: string,
  type: 'admin_new_book' | 'user_review' | 'user_download' | 'system',
  title: string,
  message: string,
  bookId?: string,
  bookTitle?: string,
  fromUserName?: string,
  fromUserEmail?: string
): Promise<boolean> {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          message,
          book_id: bookId || null,
          book_title: bookTitle || null,
          from_user_name: fromUserName || null,
          from_user_email: fromUserEmail || null,
          is_read: false
        });

      if (error) throw error;
      return true;
    } catch (e) {
      console.error('Supabase error creating notification:', e);
    }
  }
  return false;
}

export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (e) {
      console.error('Supabase error marking notification as read:', e);
    }
  }
  return false;
}

export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return true;
    } catch (e) {
      console.error('Supabase error marking all notifications as read:', e);
    }
  }
  return false;
}

// Helper: Notify all users when admin adds new book
export async function notifyAllUsersNewBook(bookTitle: string, bookId: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      // Get all non-admin users
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')
        .neq('role', 'admin');

      if (profiles && profiles.length > 0) {
        const notifications = profiles.map(p => ({
          user_id: p.id,
          type: 'admin_new_book',
          title: '📚 Buku Baru Tersedia!',
          message: `"${bookTitle}" baru saja ditambahkan ke perpustakaan digital.`,
          book_id: bookId,
          book_title: bookTitle,
          is_read: false
        }));

        await supabase.from('notifications').insert(notifications);
      }
    } catch (e) {
      console.error('Failed to notify users about new book:', e);
    }
  }
}

// Helper: Notify admin when user downloads book
export async function notifyAdminUserDownload(userName: string, userEmail: string, bookTitle: string, bookId: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      // Get all admin users
      const { data: admins } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin');

      if (admins && admins.length > 0) {
        const notifications = admins.map(admin => ({
          user_id: admin.id,
          type: 'user_download',
          title: '⬇️ Buku Diunduh',
          message: `${userName} mengunduh "${bookTitle}"`,
          book_id: bookId,
          book_title: bookTitle,
          from_user_name: userName,
          from_user_email: userEmail,
          is_read: false
        }));

        await supabase.from('notifications').insert(notifications);
      }
    } catch (e) {
      console.error('Failed to notify admin about download:', e);
    }
  }
}

// ==========================================
// 8. SITE SETTINGS / CMS APIS
// ==========================================

export async function getSiteSettings(): Promise<SiteSettings> {
  let currentSettings: SiteSettings = DEFAULT_SITE_SETTINGS;
  const localData = localStorage.getItem('digital_library_site_settings');
  if (localData) {
    try {
      currentSettings = { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(localData) };
    } catch (e) {
      console.error('Failed to parse local site settings', e);
    }
  }

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'global')
        .maybeSingle();

      if (!error && data) {
        const remoteSettings = data.settings || data;
        const merged: SiteSettings = { ...currentSettings, ...remoteSettings };
        localStorage.setItem('digital_library_site_settings', JSON.stringify(merged));
        return merged;
      }
    } catch (e) {
      console.warn('Could not fetch site_settings from Supabase (using local):', e);
    }
  }

  return currentSettings;
}

export async function updateSiteSettings(newSettings: SiteSettings): Promise<{ success: boolean; error?: string }> {
  // Always update local storage first
  localStorage.setItem('digital_library_site_settings', JSON.stringify(newSettings));

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: 'global',
          settings: newSettings,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (error) {
        console.warn('Supabase site_settings upsert error:', error.message);
        return { success: true };
      }
    } catch (e: any) {
      console.warn('Failed to upsert site_settings to Supabase:', e);
      return { success: true };
    }
  }

  return { success: true };
}

