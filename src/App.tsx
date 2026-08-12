import { useState, useEffect, useRef } from 'react';
import { Book, User, SystemLog, ViewType, Borrowing, UserRole, Category, LibrarySettings, Notification } from './types';
import { INITIAL_BOOKS as _INITIAL_BOOKS } from './data/books';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { 
  getBooks, saveBook, removeBook, getUserProfile, updateUserProfile, 
  updateUserBadge, makeBorrowing, returnBorrowing, extendBorrowing, 
  saveFavorite, getSystemLogs, addSystemLog, getAllUsers
} from './lib/db';

// Components
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import KatalogPage from './components/KatalogPage';
import DetailPage from './components/DetailPage';
import PinjamanPage from './components/PinjamanPage';
import FavoritPage from './components/FavoritPage';
import ProfilPage from './components/ProfilPage';
import AdminPage from './components/AdminPage';
import PinjamModal from './components/PinjamModal';
import ToastNotification, { Toast } from './components/ToastNotification';
import AILibrarianAssistant from './components/AILibrarianAssistant';

// Lucide Icons for dashboard shell
import { 
  BookOpen, LayoutDashboard, Layers, Clock, Heart, User as UserIcon, Shield, 
  LogOut, Menu, X, Award, ChevronRight, HelpCircle, ArrowRight
} from 'lucide-react';

// Role-specific Dashboards
import SiswaDashboard from './components/dashboard/SiswaDashboard';
import StaffDashboard from './components/dashboard/StaffDashboard';

import { DEFAULT_CATEGORIES, DEFAULT_SETTINGS, DEFAULT_USERS } from './data/seedData';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  // Navigation & Core state
  const [currentView, setCurrentView] = useState<ViewType>('landing');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset scroll to top on any view navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' as any });
    }
  }, [currentView]);
  
  // Database state
  const [books, setBooks] = useState<Book[]>(_INITIAL_BOOKS);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>(() => {
    const stored = localStorage.getItem('digital_library_categories');
    return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
  });
  const [settings, setSettings] = useState<LibrarySettings>(() => {
    const stored = localStorage.getItem('digital_library_settings');
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  });
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const stored = localStorage.getItem('digital_library_notifications');
    return stored ? JSON.parse(stored) : [];
  });
  void setNotifications; // prevent unused warning
  
  // Interaction state
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [pinjamModalOpen, setPinjamModalOpen] = useState(false);
  const [selectedPinjamBook, setSelectedPinjamBook] = useState<Book | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar toggle

  // LOAD DATABASE ON MOUNT
  useEffect(() => {
    async function initData() {
      // 1. Books Initialization
      const booksList = await getBooks();
      setBooks(booksList);

      // 2. System Logs Initialization
      const logsList = await getSystemLogs();
      setLogs(logsList);

      // 3. Users Initialization (Local fallback)
      if (!isSupabaseConfigured) {
        const storedUsers = localStorage.getItem('digital_library_users');
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers));
        } else {
          setUsers(DEFAULT_USERS);
          localStorage.setItem('digital_library_users', JSON.stringify(DEFAULT_USERS));
        }
      }

      // 4. Session restoration check
      let restored = false;
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session && session.user) {
            let profile = await getUserProfile(session.user.id);
            if (!profile) {
              profile = {
                id: session.user.id,
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Anggota',
                email: session.user.email || '',
                role: (session.user.user_metadata?.role as any) || UserRole.SISWA,
                badge: 'Reguler',
                favorites: [],
                borrowings: []
              };
            }
            setCurrentUser(profile);
            setFavorites(profile.favorites || []);
            localStorage.setItem('digital_library_active_user', profile.email);
            localStorage.setItem('digital_library_active_user_data', JSON.stringify(profile));
            setCurrentView('dashboard');
            restored = true;
          }
        } catch (e) {
          console.error('Failed to restore session:', e);
        }
      }

      // LocalStorage session restoration fallback (works for demo logins or if Supabase session is idle)
      if (!restored) {
        const activeUserData = localStorage.getItem('digital_library_active_user_data');
        const activeUserEmail = localStorage.getItem('digital_library_active_user');

        if (activeUserData) {
          try {
            const parsedUser = JSON.parse(activeUserData);
            setCurrentUser(parsedUser);
            setFavorites(parsedUser.favorites || []);
            setCurrentView('dashboard');
            restored = true;
          } catch (e) {}
        }

        if (!restored && activeUserEmail) {
          const storedUsersRaw = localStorage.getItem('digital_library_users');
          const localUsersList = storedUsersRaw ? JSON.parse(storedUsersRaw) : DEFAULT_USERS;
          const found = localUsersList.find((u: User) => u.email.toLowerCase() === activeUserEmail.toLowerCase()) || DEFAULT_USERS.find((u: User) => u.email.toLowerCase() === activeUserEmail.toLowerCase());
          
          if (found) {
            setCurrentUser(found);
            setCurrentView('dashboard');
            const userFavs = localStorage.getItem(`digital_library_favorites_${activeUserEmail}`);
            if (userFavs) {
              setFavorites(JSON.parse(userFavs));
            }
          }
        }
      }
    }

    initData();
  }, []);

  // LOAD ALL USERS IF ADMIN OR STAF
  useEffect(() => {
    async function loadAdminData() {
      if (currentUser && ['admin', 'staf', UserRole.ADMIN, UserRole.PETUGAS].includes(currentUser.role as any)) {
        const usersList = await getAllUsers();
        setUsers(usersList);
      }
    }
    loadAdminData();
  }, [currentUser]);

  // TOAST WRAPPERS
  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // NAVIGATION WRAPPER
  const handleNavigate = (view: ViewType, selectedId?: string) => {
    setCurrentView(view);
    if (selectedId) {
      setSelectedBookId(selectedId);
    }
    setSidebarOpen(false); // Close mobile panel on navigate
    window.scrollTo(0, 0); // Reset scroll to top
  };

  // SYSTEM LOG PUSHER
  const pushLog = async (email: string, name: string, type: 'pinjam' | 'kembali' | 'perpanjang' | 'register' | 'update_profile', bookTitle: string) => {
    const newLog = await addSystemLog(email, name, type, bookTitle);
    setLogs(prev => [newLog, ...prev]);
  };

  // ADD USER HANDLER — registers in Supabase Auth + saves to local state
  const handleAddUser = async (user: User) => {
    if (isSupabaseConfigured) {
      try {
        // Register in Supabase Auth so the user can actually log in
        const { data, error } = await supabase.auth.admin
          ? await (supabase as any).auth.admin.createUser({
              email: user.email,
              password: user.password || 'password123',
              email_confirm: true,
              user_metadata: { name: user.name }
            })
          : await supabase.auth.signUp({
              email: user.email,
              password: user.password || 'password123',
              options: { data: { name: user.name } }
            });

        if (error) {
          addToast(`Gagal mendaftarkan ${user.name} ke Supabase: ${error.message}`, 'error');
        } else {
          // Update role in profiles table if not default 'siswa'
          if (data?.user && user.role !== 'siswa') {
            await supabase
              .from('profiles')
              .update({ role: user.role, name: user.name })
              .eq('id', data.user.id);
          }
          addToast(`Pengguna ${user.name} berhasil ditambahkan ke Supabase!`, 'success');
        }
      } catch (err: any) {
        addToast(`Error Supabase: ${err.message}`, 'error');
      }
    }
    // Always also save to local state / LocalStorage as fallback
    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    localStorage.setItem('digital_library_users', JSON.stringify(updatedUsers));
    if (!isSupabaseConfigured) {
      addToast(`Pengguna ${user.name} berhasil ditambahkan!`, 'success');
    }
  };

  // AUTHENTICATION LOGICS
  const handleLogin = async (email: string, pass: string): Promise<boolean> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: pass
        });

        if (error) {
          // Check local fallback users for demo credentials (admin / staf / siswa)
          const localUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
          if (localUser) {
            setCurrentUser(localUser);
            localStorage.setItem('digital_library_active_user', localUser.email);
            setFavorites(localUser.favorites || []);
            addToast('Berhasil masuk ke Pustaka Digital (Sesi Demo)!', 'success');
            setCurrentView('dashboard');
            return true;
          }

          addToast(error.message || 'Email atau password yang Anda masukkan tidak sesuai!', 'error');
          return false;
        }

        if (data.user) {
          let profile = await getUserProfile(data.user.id);
          if (!profile) {
            // Fallback profile if Supabase profile row isn't found
            profile = {
              id: data.user.id,
              name: data.user.user_metadata?.name || email.split('@')[0],
              email: data.user.email || email,
              role: UserRole.SISWA,
              badge: 'Reguler',
              favorites: [],
              borrowings: []
            };
          }
          setCurrentUser(profile);
          setFavorites(profile.favorites || []);
          localStorage.setItem('digital_library_active_user', profile.email);
          localStorage.setItem('digital_library_active_user_data', JSON.stringify(profile));
          addToast('Berhasil masuk ke Pustaka Digital!', 'success');
          setCurrentView('dashboard');
          return true;
        }
        return false;
      } catch (err: any) {
        addToast(err.message || 'Terjadi kesalahan saat login', 'error');
        return false;
      }
    }

    // LocalStorage fallback
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
    if (foundUser) {
      setCurrentUser(foundUser);
      localStorage.setItem('digital_library_active_user', foundUser.email);
      localStorage.setItem('digital_library_active_user_data', JSON.stringify(foundUser));
      
      // Load favorites
      const userFavs = localStorage.getItem(`digital_library_favorites_${foundUser.email}`);
      if (userFavs) {
        setFavorites(JSON.parse(userFavs));
      } else {
        setFavorites([]);
      }
      addToast('Berhasil masuk ke Pustaka Digital!', 'success');
      setCurrentView('dashboard');
      return true;
    }
    return false;
  };

  const handleRegister = async (name: string, email: string, pass: string): Promise<boolean> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: {
            data: { name }
          }
        });

        if (error) {
          addToast(error.message, 'error');
          return false;
        }

        if (data.user) {
          // Create profile row in Supabase
          try {
            await supabase.from('profiles').upsert({
              id: data.user.id,
              name,
              email,
              role: 'siswa',
              badge: 'Reguler'
            });
          } catch (e) {
            console.error('Failed to insert profile row:', e);
          }

          // Jika session null -> Supabase memerlukan verifikasi email terlebih dahulu
          if (!data.session) {
            addToast(
              `📧 Link verifikasi dikirim ke ${email}. Silakan cek inbox Anda untuk mengaktifkan akun.`,
              'info'
            );
            setCurrentView('login');
            return true;
          }

          // Jika session langsung aktif
          let profile = await getUserProfile(data.user.id);
          if (!profile) {
            profile = {
              id: data.user.id,
              name,
              email,
              role: UserRole.SISWA,
              badge: 'Reguler',
              favorites: [],
              borrowings: []
            };
          }
          setCurrentUser(profile);
          setFavorites([]);
          localStorage.setItem('digital_library_active_user', profile.email);
          localStorage.setItem('digital_library_active_user_data', JSON.stringify(profile));
          addToast('Registrasi berhasil! Selamat datang di Pustaka Digital.', 'success');
          setCurrentView('dashboard');
          await pushLog(email, name, 'register', '');
          return true;
        }
        return false;
      } catch (err: any) {
        addToast(err.message || 'Pendaftaran gagal', 'error');
        return false;
      }
    }

    // LocalStorage fallback
    const isExist = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (isExist) return false;

    const newUser: User = {
      id: 'u_' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      password: pass,
      role: UserRole.SISWA,
      badge: 'Reguler',
      favorites: [],
      borrowings: []
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('digital_library_users', JSON.stringify(updatedUsers));
    
    setCurrentUser(newUser);
    localStorage.setItem('digital_library_active_user', newUser.email);
    localStorage.setItem('digital_library_active_user_data', JSON.stringify(newUser));
    setFavorites([]);
    
    await pushLog(email, name, 'register', '');
    return true;
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    setFavorites([]);
    localStorage.removeItem('digital_library_active_user');
    localStorage.removeItem('digital_library_active_user_data');
    setCurrentView('landing');
    addToast('Anda berhasil keluar dari sesi Pustaka Digital.', 'success');
  };

  // PROFILE UPDATES
  const handleUpdateProfile = async (data: { name?: string; email?: string; phone?: string; class?: string; avatarUrl?: string }) => {
    if (!currentUser) return;

    const newName     = data.name     ?? currentUser.name;
    const newEmail    = data.email    ?? currentUser.email;
    const newPhone    = data.phone    ?? currentUser.phone;
    const newClass    = data.class    ?? currentUser.class;
    const newAvatar   = data.avatarUrl ?? currentUser.avatarUrl;

    if (isSupabaseConfigured) {
      const success = await updateUserProfile(currentUser.id, newName, newEmail);
      if (success) {
        const activeUser = { ...currentUser, name: newName, email: newEmail, phone: newPhone, class: newClass, avatarUrl: newAvatar };
        setCurrentUser(activeUser);
        localStorage.setItem('digital_library_active_user_data', JSON.stringify(activeUser));
        await pushLog(newEmail, newName, 'update_profile', '');
        addToast('Informasi profil berhasil diperbarui!', 'success');
      } else {
        addToast('Gagal memperbarui profil.', 'error');
      }
      return;
    }

    // LocalStorage fallback — update semua field
    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, name: newName, email: newEmail, phone: newPhone, class: newClass, avatarUrl: newAvatar };
      }
      return u;
    });

    const activeUser = { ...currentUser, name: newName, email: newEmail, phone: newPhone, class: newClass, avatarUrl: newAvatar };
    setCurrentUser(activeUser);
    setUsers(updatedUsers);
    localStorage.setItem('digital_library_users', JSON.stringify(updatedUsers));
    localStorage.setItem('digital_library_active_user', newEmail);
    localStorage.setItem('digital_library_active_user_data', JSON.stringify(activeUser));

    await pushLog(newEmail, newName, 'update_profile', '');
    addToast('Informasi profil berhasil diperbarui!', 'success');
  };

  const handleChangePassword = async (password: string) => {
    if (!currentUser) return;

    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        addToast(error.message, 'error');
      } else {
        addToast('Kata sandi berhasil diubah dengan aman!', 'success');
      }
      return;
    }

    // LocalStorage fallback
    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, password };
      }
      return u;
    });

    setCurrentUser({ ...currentUser, password });
    setUsers(updatedUsers);
    localStorage.setItem('digital_library_users', JSON.stringify(updatedUsers));
    addToast('Kata sandi berhasil diubah dengan aman!', 'success');
  };

  // FAVORITES ACCUMULATORS
  const handleToggleFavorite = async (bookId: string) => {
    if (!currentUser) {
      addToast('Silakan masuk terlebih dahulu untuk menyimpan buku favorit!', 'info');
      setCurrentView('login');
      return;
    }

    let updatedFavs: string[] = [];
    const isFav = favorites.includes(bookId);
    if (isFav) {
      updatedFavs = favorites.filter(id => id !== bookId);
      addToast('Buku berhasil dihapus dari daftar favorit.', 'info');
    } else {
      updatedFavs = [...favorites, bookId];
      addToast('Buku berhasil disimpan ke daftar favorit!', 'success');
    }

    setFavorites(updatedFavs);

    if (isSupabaseConfigured) {
      await saveFavorite(currentUser.id, bookId, !isFav);
    } else {
      localStorage.setItem(`digital_library_favorites_${currentUser.email}`, JSON.stringify(updatedFavs));
    }
  };

  // BORROWING OPERATIONS
  const handleOpenPinjamModal = (book: Book) => {
    setSelectedPinjamBook(book);
    setPinjamModalOpen(true);
  };

  const handleConfirmPinjam = async (bookId: string, durationDays: number, bookObj?: Book) => {
    const targetBook = bookObj || selectedPinjamBook || books.find(b => b.id === bookId);
    if (!currentUser || !targetBook) return;

    // Validation: Max borrowing check (Reguler 3, Premium 5)
    const activeBorrowings = (currentUser.borrowings || []).filter(b => b.status === 'Sedang Dipinjam' || b.status === 'approved' || b.status === 'pending');
    const maxAllowed = currentUser.badge === 'Premium' ? 5 : 3;

    if (activeBorrowings.length >= maxAllowed) {
      addToast(`Gagal! Batas pinjaman aktif anggota ${currentUser.badge} adalah ${maxAllowed} buku.`, 'error');
      setPinjamModalOpen(false);
      return;
    }

    if (isSupabaseConfigured) {
      try {
        const borrowRes = await makeBorrowing(
          currentUser.id, 
          bookId, 
          targetBook.title, 
          targetBook.coverColor, 
          targetBook.coverUrl, 
          durationDays
        );

        if (borrowRes) {
          // Refresh books and profile
          const booksList = await getBooks();
          setBooks(booksList);
          const profile = await getUserProfile(currentUser.id);
          if (profile) {
            setCurrentUser(profile);
            localStorage.setItem('digital_library_active_user_data', JSON.stringify(profile));
          }

          await pushLog(currentUser.email, currentUser.name, 'pinjam', targetBook.title);
          addToast(`Peminjaman buku "${targetBook.title}" dikonfirmasi!`, 'success');
        } else {
          addToast('Gagal memproses peminjaman di database.', 'error');
        }
      } catch (err: any) {
        addToast(err.message || 'Terjadi kesalahan peminjaman', 'error');
      }
      setPinjamModalOpen(false);
      setSelectedPinjamBook(null);
      return;
    }

    // LocalStorage fallback
    const now = new Date();
    const formattedBorrowDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    const returnDueDate = new Date();
    returnDueDate.setDate(now.getDate() + durationDays);
    const formattedDueDate = `${returnDueDate.getFullYear()}-${String(returnDueDate.getMonth() + 1).padStart(2, '0')}-${String(returnDueDate.getDate()).padStart(2, '0')}`;

    // Update User borrowings
    const newBorrow: Borrowing = {
      id: 'brw_' + Math.random().toString(36).substr(2, 9),
      bookId: targetBook.id,
      bookTitle: targetBook.title,
      coverColor: targetBook.coverColor,
      coverUrl: targetBook.coverUrl,
      borrowDate: formattedBorrowDate,
      dueDate: formattedDueDate,
      status: 'approved'
    };

    const updatedUserBorrowings = [newBorrow, ...(currentUser.borrowings || [])];
    const updatedCurrentUser = { ...currentUser, borrowings: updatedUserBorrowings };

    const updatedUsersList = users.map(u => {
      if (u.id === currentUser.id) {
        return updatedCurrentUser;
      }
      return u;
    });

    // Update Book stock (decrement by 1)
    const updatedBooksList = books.map(b => {
      if (b.id === bookId) {
        return { ...b, stock: Math.max(0, b.stock - 1) };
      }
      return b;
    });

    // Save states
    setCurrentUser(updatedCurrentUser);
    setUsers(updatedUsersList);
    setBooks(updatedBooksList);

    localStorage.setItem('digital_library_users', JSON.stringify(updatedUsersList));
    localStorage.setItem('digital_library_active_user_data', JSON.stringify(updatedCurrentUser));
    localStorage.setItem('digital_library_books', JSON.stringify(updatedBooksList));

    await pushLog(currentUser.email, currentUser.name, 'pinjam', targetBook.title);

    addToast(`Peminjaman buku "${targetBook.title}" dikonfirmasi!`, 'success');
    setPinjamModalOpen(false);
    setSelectedPinjamBook(null);
  };

  const handleReturnBook = async (borrowingId: string) => {
    if (!currentUser) return;

    const targetBorrow = currentUser.borrowings.find(b => b.id === borrowingId);
    if (!targetBorrow) return;

    if (isSupabaseConfigured) {
      try {
        const returnDate = await returnBorrowing(borrowingId, targetBorrow.bookId);
        if (returnDate) {
          // Refresh books and profile
          const booksList = await getBooks();
          setBooks(booksList);
          const profile = await getUserProfile(currentUser.id);
          if (profile) setCurrentUser(profile);

          await pushLog(currentUser.email, currentUser.name, 'kembali', targetBorrow.bookTitle);
          addToast(`Buku "${targetBorrow.bookTitle}" berhasil dikembalikan!`, 'success');
        } else {
          addToast('Gagal memproses pengembalian buku.', 'error');
        }
      } catch (err: any) {
        addToast(err.message || 'Terjadi kesalahan pengembalian', 'error');
      }
      return;
    }

    // LocalStorage fallback
    const now = new Date();
    const formattedReturnDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // Update User borrowing item status
    const updatedUserBorrowings = currentUser.borrowings.map(b => {
      if (b.id === borrowingId) {
        return { ...b, status: 'Dikembalikan' as const, returnDate: formattedReturnDate };
      }
      return b;
    });

    const updatedCurrentUser = { ...currentUser, borrowings: updatedUserBorrowings };

    const updatedUsersList = users.map(u => {
      if (u.id === currentUser.id) {
        return updatedCurrentUser;
      }
      return u;
    });

    // Update Book stock (increment by 1)
    const updatedBooksList = books.map(b => {
      if (b.id === targetBorrow.bookId) {
        return { ...b, stock: b.stock + 1 };
      }
      return b;
    });

    // Save states
    setCurrentUser(updatedCurrentUser);
    setUsers(updatedUsersList);
    setBooks(updatedBooksList);

    localStorage.setItem('digital_library_users', JSON.stringify(updatedUsersList));
    localStorage.setItem('digital_library_books', JSON.stringify(updatedBooksList));

    await pushLog(currentUser.email, currentUser.name, 'kembali', targetBorrow.bookTitle);

    addToast(`Buku "${targetBorrow.bookTitle}" berhasil dikembalikan!`, 'success');
  };

  const handleExtendBook = async (borrowingId: string) => {
    if (!currentUser) return;

    const targetBorrow = currentUser.borrowings.find(b => b.id === borrowingId);
    if (!targetBorrow) return;

    if (isSupabaseConfigured) {
      try {
        const newDueDate = await extendBorrowing(borrowingId, targetBorrow.dueDate);
        if (newDueDate) {
          // Refresh profile
          const profile = await getUserProfile(currentUser.id);
          if (profile) setCurrentUser(profile);

          await pushLog(currentUser.email, currentUser.name, 'perpanjang', targetBorrow.bookTitle);
          addToast(`Tenggat buku "${targetBorrow.bookTitle}" berhasil diperpanjang 7 hari!`, 'success');
        } else {
          addToast('Gagal memperpanjang tenggat pinjaman.', 'error');
        }
      } catch (err: any) {
        addToast(err.message || 'Terjadi kesalahan perpanjangan', 'error');
      }
      return;
    }

    // LocalStorage fallback
    const currentDue = new Date(targetBorrow.dueDate);
    currentDue.setDate(currentDue.getDate() + 7);
    const formattedNewDueDate = `${currentDue.getFullYear()}-${String(currentDue.getMonth() + 1).padStart(2, '0')}-${String(currentDue.getDate()).padStart(2, '0')}`;

    const updatedUserBorrowings = currentUser.borrowings.map(b => {
      if (b.id === borrowingId) {
        return { ...b, dueDate: formattedNewDueDate };
      }
      return b;
    });

    const updatedCurrentUser = { ...currentUser, borrowings: updatedUserBorrowings };

    const updatedUsersList = users.map(u => {
      if (u.id === currentUser.id) {
        return updatedCurrentUser;
      }
      return u;
    });

    setCurrentUser(updatedCurrentUser);
    setUsers(updatedUsersList);

    localStorage.setItem('digital_library_users', JSON.stringify(updatedUsersList));

    await pushLog(currentUser.email, currentUser.name, 'perpanjang', targetBorrow.bookTitle);

    addToast(`Tenggat buku "${targetBorrow.bookTitle}" berhasil diperpanjang 7 hari!`, 'success');
  };

  // ADMIN SPECIFIC CALLBACKS
  const handleAddBook = async (bookData: Omit<Book, 'id' | 'status' | 'category' | 'description' | 'rating' | 'coverColor'> & { status?: Book['status'], category?: string, description?: string, rating?: number, coverColor?: string }) => {
    const newBook: Book = {
      category: bookData.categoryId ? (categories.find(c => c.id === bookData.categoryId)?.name || '') : '',
      description: bookData.synopsis || '',
      rating: bookData.rating ?? 0,
      coverColor: bookData.coverColor || 'from-blue-600 to-indigo-900',
      ...bookData,
      id: 'b_' + Math.random().toString(36).substr(2, 9),
      status: bookData.status || (bookData.stock > 0 ? 'Tersedia' : 'Sedang Dipinjam')
    };

    if (isSupabaseConfigured) {
      await saveBook(newBook, true);
      const booksList = await getBooks();
      setBooks(booksList);
      addToast(`Buku "${newBook.title}" berhasil ditambahkan ke database!`, 'success');
      return;
    }

    // LocalStorage fallback
    const updatedBooks = [newBook, ...books];
    setBooks(updatedBooks);
    localStorage.setItem('digital_library_books', JSON.stringify(updatedBooks));
    addToast(`Buku "${newBook.title}" berhasil ditambahkan!`, 'success');
  };

  const handleEditBook = async (updatedBook: Book) => {
    if (isSupabaseConfigured) {
      await saveBook(updatedBook, false);
      const booksList = await getBooks();
      setBooks(booksList);
      addToast(`Buku "${updatedBook.title}" berhasil diperbarui!`, 'success');
      return;
    }

    // LocalStorage fallback
    const updatedBooks = books.map(b => {
      if (b.id === updatedBook.id) return updatedBook;
      return b;
    });

    setBooks(updatedBooks);
    localStorage.setItem('digital_library_books', JSON.stringify(updatedBooks));
    addToast(`Buku "${updatedBook.title}" berhasil diperbarui!`, 'success');
  };

  const handleDeleteBook = async (id: string) => {
    const targetBook = books.find(b => b.id === id);
    const title = targetBook ? targetBook.title : 'Buku';

    if (isSupabaseConfigured) {
      const ok = await removeBook(id);
      if (ok) {
        const booksList = await getBooks();
        setBooks(booksList);
        addToast(`Buku "${title}" berhasil dihapus dari database!`, 'success');
      } else {
        addToast('Gagal menghapus buku.', 'error');
      }
      return;
    }

    // LocalStorage fallback
    const updatedBooks = books.filter(b => b.id !== id);
    setBooks(updatedBooks);
    localStorage.setItem('digital_library_books', JSON.stringify(updatedBooks));
    addToast(`Buku "${title}" berhasil dihapus!`, 'success');
  };

  const handleUpdateUserRole = async (email: string, badge: 'Premium' | 'Reguler') => {
    if (isSupabaseConfigured) {
      const target = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (target) {
        const ok = await updateUserBadge(target.id, badge);
        if (ok) {
          const usersList = await getAllUsers();
          setUsers(usersList);
          if (currentUser && target.id === currentUser.id) {
            const profile = await getUserProfile(currentUser.id);
            if (profile) setCurrentUser(profile);
          }
          addToast(`Status keanggotaan ${email} berhasil diubah menjadi ${badge}!`, 'success');
        } else {
          addToast('Gagal mengubah status keanggotaan.', 'error');
        }
      }
      return;
    }

    // LocalStorage fallback
    const updatedUsers = users.map(u => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        const updated = { ...u, badge };
        if (currentUser && u.email === currentUser.email) {
          setCurrentUser(updated);
        }
        return updated;
      }
      return u;
    });

    setUsers(updatedUsers);
    localStorage.setItem('digital_library_users', JSON.stringify(updatedUsers));
    addToast(`Status keanggotaan ${email} berhasil diubah menjadi ${badge}!`, 'success');
  };

  const handleDeleteUser = async (userId: string) => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('profiles').delete().eq('id', userId);
        if (error) throw error;
      } catch (err: any) {
        addToast(err.message || 'Gagal menghapus anggota dari database', 'error');
        return;
      }
    }

    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('digital_library_users', JSON.stringify(updatedUsers));
    addToast('Anggota berhasil dihapus!', 'success');
  };

  // TRANSACTION VERIFICATION & LOGIC HANDLERS
  const handleVerifyBorrow = (borrowingId: string, approve: boolean) => {
    const updatedUsers = users.map(u => {
      const targetBorrow = u.borrowings.find(b => b.id === borrowingId);
      if (targetBorrow) {
        const updatedBorrowings = u.borrowings.map(b => {
          if (b.id === borrowingId) {
            return { ...b, status: (approve ? 'approved' : 'rejected') as any };
          }
          return b;
        });

        if (approve) {
          // Decrement book stock
          const updatedBooks = books.map(bk => {
            if (bk.id === targetBorrow.bookId) {
              return { ...bk, stock: Math.max(0, bk.stock - 1) };
            }
            return bk;
          });
          setBooks(updatedBooks);
          localStorage.setItem('digital_library_books', JSON.stringify(updatedBooks));
        }

        const updatedUser = { ...u, borrowings: updatedBorrowings };
        if (currentUser && u.id === currentUser.id) {
          setCurrentUser(updatedUser);
        }
        return updatedUser;
      }
      return u;
    });

    setUsers(updatedUsers);
    localStorage.setItem('digital_library_users', JSON.stringify(updatedUsers));
    addToast(approve ? 'Peminjaman buku berhasil disetujui!' : 'Peminjaman buku ditolak.', approve ? 'success' : 'info');
  };

  const handleVerifyReturn = (borrowingId: string) => {
    const updatedUsers = users.map(u => {
      const targetBorrow = u.borrowings.find(b => b.id === borrowingId);
      if (targetBorrow) {
        const updatedBorrowings = u.borrowings.map(b => {
          if (b.id === borrowingId) {
            return { 
              ...b, 
              status: 'returned' as any, 
              returnDate: new Date().toISOString().split('T')[0] 
            };
          }
          return b;
        });

        // Increment book stock
        const updatedBooks = books.map(bk => {
          if (bk.id === targetBorrow.bookId) {
            return { ...bk, stock: bk.stock + 1 };
          }
          return bk;
        });
        setBooks(updatedBooks);
        localStorage.setItem('digital_library_books', JSON.stringify(updatedBooks));

        const updatedUser = { ...u, borrowings: updatedBorrowings };
        if (currentUser && u.id === currentUser.id) {
          setCurrentUser(updatedUser);
        }
        return updatedUser;
      }
      return u;
    });

    setUsers(updatedUsers);
    localStorage.setItem('digital_library_users', JSON.stringify(updatedUsers));
    addToast('Pengembalian buku berhasil diverifikasi!', 'success');
  };

  const handlePayFine = (borrowingId: string) => {
    const updatedUsers = users.map(u => {
      const targetBorrow = u.borrowings.find(b => b.id === borrowingId);
      if (targetBorrow) {
        const updatedBorrowings = u.borrowings.map(b => {
          if (b.id === borrowingId) {
            return { ...b, finePaid: true };
          }
          return b;
        });
        const updatedUser = { ...u, borrowings: updatedBorrowings };
        if (currentUser && u.id === currentUser.id) {
          setCurrentUser(updatedUser);
        }
        return updatedUser;
      }
      return u;
    });

    setUsers(updatedUsers);
    localStorage.setItem('digital_library_users', JSON.stringify(updatedUsers));
    addToast('Pembayaran denda berhasil diverifikasi!', 'success');
  };

  const handleRequestReturn = (borrowingId: string) => {
    if (!currentUser) return;
    
    const targetBorrow = currentUser.borrowings.find(b => b.id === borrowingId);
    if (!targetBorrow) return;

    const updatedBorrowings = currentUser.borrowings.map(b => {
      if (b.id === borrowingId) {
        return { 
          ...b, 
          status: 'returned' as any, 
          returnDate: new Date().toISOString().split('T')[0] 
        };
      }
      return b;
    });

    const updatedCurrentUser = { ...currentUser, borrowings: updatedBorrowings };
    const updatedUsers = users.map(u => u.id === currentUser.id ? updatedCurrentUser : u);

    // Increment book stock
    const updatedBooks = books.map(bk => {
      if (bk.id === targetBorrow.bookId) {
        return { ...bk, stock: bk.stock + 1 };
      }
      return bk;
    });
    setBooks(updatedBooks);
    localStorage.setItem('digital_library_books', JSON.stringify(updatedBooks));

    setCurrentUser(updatedCurrentUser);
    setUsers(updatedUsers);
    localStorage.setItem('digital_library_users', JSON.stringify(updatedUsers));
    addToast('Buku berhasil dikembalikan!', 'success');
  };

  // RENDERING ENGINE
  const renderViewContent = () => {
    switch (currentView) {
      case 'landing':
        return (
          <LandingPage 
            books={books} 
            onNavigate={handleNavigate} 
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      case 'login':
        return (
          <LoginPage 
            onNavigate={handleNavigate} 
            onLogin={handleLogin} 
            addToast={addToast}
          />
        );
      case 'register':
        return (
          <RegisterPage 
            onNavigate={handleNavigate} 
            onRegister={handleRegister} 
            addToast={addToast}
          />
        );
      case 'dashboard':
        if (!currentUser) return null;
        // Route to role-specific dashboard
        if (['siswa', UserRole.SISWA].includes(currentUser.role as any)) {
          return (
            <SiswaDashboard
              currentUser={currentUser}
              onLogout={handleLogout}
              books={books}
              categories={categories}
              borrowings={(currentUser.borrowings || []).map(b => ({ ...b, studentId: currentUser.id }))}
              notifications={notifications}
              settings={settings}
              onRequestBorrow={(bookId, days, _notes) => {
                const book = books.find(b => b.id === bookId);
                if (book) {
                  setSelectedPinjamBook(book);
                  handleConfirmPinjam(bookId, days, book);
                }
              }}
              onRequestReturn={handleRequestReturn}
              onUpdateProfile={(data) => handleUpdateProfile(data)}
              onMarkNotifRead={(notifId) => console.log('notif read:', notifId)}
            />
          );
        }
        if (['staf', UserRole.PETUGAS].includes(currentUser.role as any)) {
          return (
            <StaffDashboard
              currentUser={currentUser}
              onLogout={handleLogout}
              books={books}
              categories={categories}
              borrowings={users.flatMap(u => u.borrowings.map(b => ({ ...b, studentId: u.id })))}
              users={users}
              settings={settings}
              onAddBook={handleAddBook}
              onUpdateBook={handleEditBook}
              onDeleteBook={handleDeleteBook}
              onAddCategory={(cat) => {
                const updated = [...categories, cat];
                setCategories(updated);
                localStorage.setItem('digital_library_categories', JSON.stringify(updated));
                addToast(`Kategori ${cat.name} ditambahkan`, 'success');
              }}
              onUpdateCategory={(cat) => {
                const updated = categories.map(c => c.id === cat.id ? cat : c);
                setCategories(updated);
                localStorage.setItem('digital_library_categories', JSON.stringify(updated));
                addToast(`Kategori ${cat.name} diperbarui`, 'success');
              }}
              onDeleteCategory={(id) => {
                const updated = categories.filter(c => c.id !== id);
                setCategories(updated);
                localStorage.setItem('digital_library_categories', JSON.stringify(updated));
                addToast('Kategori dihapus', 'success');
              }}
              onVerifyBorrow={handleVerifyBorrow}
              onVerifyReturn={(borrowingId, approve) => {
                if (approve) handleVerifyReturn(borrowingId);
              }}
              onUpdateUser={(userId, data) => {
                const updatedUsers = users.map(u => u.id === userId ? { ...u, ...data } : u);
                setUsers(updatedUsers);
                localStorage.setItem('digital_library_users', JSON.stringify(updatedUsers));
                addToast('Data pengguna diperbarui!', 'success');
              }}
              onAddUser={handleAddUser}
              onDeleteUser={handleDeleteUser}
              onUpdateSettings={(s) => {
                setSettings(s);
                localStorage.setItem('digital_library_settings', JSON.stringify(s));
                addToast('Pengaturan diperbarui', 'success');
              }}
              onPayFine={handlePayFine}
            />
          );
        }
        if (['admin', UserRole.ADMIN].includes(currentUser.role as any)) {
          return (
            <StaffDashboard
              currentUser={currentUser}
              onLogout={handleLogout}
              books={books}
              categories={categories}
              borrowings={users.flatMap(u => u.borrowings.map(b => ({ ...b, studentId: u.id })))}
              users={users}
              settings={settings}
              onAddBook={handleAddBook}
              onUpdateBook={handleEditBook}
              onDeleteBook={handleDeleteBook}
              onAddCategory={(cat) => {
                const updated = [...categories, cat];
                setCategories(updated);
                localStorage.setItem('digital_library_categories', JSON.stringify(updated));
                addToast(`Kategori ${cat.name} ditambahkan`, 'success');
              }}
              onUpdateCategory={(cat) => {
                const updated = categories.map(c => c.id === cat.id ? cat : c);
                setCategories(updated);
                localStorage.setItem('digital_library_categories', JSON.stringify(updated));
                addToast(`Kategori ${cat.name} diperbarui`, 'success');
              }}
              onDeleteCategory={(id) => {
                const updated = categories.filter(c => c.id !== id);
                setCategories(updated);
                localStorage.setItem('digital_library_categories', JSON.stringify(updated));
                addToast('Kategori dihapus', 'success');
              }}
              onVerifyBorrow={handleVerifyBorrow}
              onVerifyReturn={(borrowingId, approve) => {
                if (approve) handleVerifyReturn(borrowingId);
              }}
              onUpdateUser={(userId, data) => {
                const updatedUsers = users.map(u => u.id === userId ? { ...u, ...data } : u);
                setUsers(updatedUsers);
                localStorage.setItem('digital_library_users', JSON.stringify(updatedUsers));
                addToast('Data pengguna diperbarui!', 'success');
              }}
              onAddUser={handleAddUser}
              onDeleteUser={handleDeleteUser}
              onUpdateSettings={(s) => {
                setSettings(s);
                localStorage.setItem('digital_library_settings', JSON.stringify(s));
                addToast('Pengaturan diperbarui', 'success');
              }}
              onPayFine={handlePayFine}
            />
          );
        }
        // Fallback to generic dashboard
        return (
          <DashboardPage 
            currentUser={currentUser} 
            books={books} 
            logs={logs}
            onNavigate={handleNavigate}
            favorites={favorites}
          />
        );
      case 'katalog':
        return (
          <KatalogPage 
            books={books} 
            onNavigate={handleNavigate} 
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onOpenPinjamModal={handleOpenPinjamModal}
            currentUser={currentUser}
          />
        );
      case 'detail-buku':
        const selectedBook = books.find(b => b.id === selectedBookId) || null;
        return (
          <DetailPage 
            book={selectedBook} 
            onNavigate={handleNavigate} 
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onOpenPinjamModal={handleOpenPinjamModal}
            currentUser={currentUser}
          />
        );
      case 'pinjaman':
        if (!currentUser) return null;
        return (
          <PinjamanPage 
            currentUser={currentUser} 
            onNavigate={handleNavigate} 
            onReturnBook={handleReturnBook}
            onExtendBook={handleExtendBook}
            addToast={addToast}
          />
        );
      case 'favorit':
        if (!currentUser) return null;
        return (
          <FavoritPage 
            currentUser={currentUser} 
            books={books} 
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onOpenPinjamModal={handleOpenPinjamModal}
            onNavigate={handleNavigate}
          />
        );
      case 'profil':
        if (!currentUser) return null;
        return (
          <ProfilPage 
            currentUser={currentUser} 
            onUpdateProfile={handleUpdateProfile}
            onChangePassword={handleChangePassword}
            favoritesCount={favorites.length}
            addToast={addToast}
          />
        );
      case 'admin':
        if (!currentUser || currentUser.role !== 'admin') return null;
        return (
          <AdminPage 
            books={books} 
            users={users} 
            logs={logs}
            onAddBook={handleAddBook}
            onEditBook={handleEditBook}
            onDeleteBook={handleDeleteBook}
            onUpdateUserRole={handleUpdateUserRole}
            addToast={addToast}
          />
        );
      default:
        return null;
    }
  };

  // CHECK IF VIEW IS OUTSIDE THE SECURE SHELL
  const isOuterPage = ['landing', 'login', 'register'].includes(currentView) || (!currentUser && ['katalog', 'detail-buku'].includes(currentView));

  if (isOuterPage) {
    const showHeader = currentView === 'detail-buku';
    return (
      <div className="relative min-h-screen bg-slate-50 overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
        {showHeader && (
          <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center space-x-2.5 cursor-pointer group" onClick={() => handleNavigate('landing')}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white shadow-lg shadow-blue-200/50">
                    <BookOpen className="w-5 h-5" />
                  </div>
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  Pustaka<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Digital</span>
                </span>
              </div>

              {/* Desktop Nav Links */}
              <div className="hidden md:flex items-center space-x-1">
                <button onClick={() => handleNavigate('landing')} className="relative px-4 py-2 text-sm font-semibold transition-all cursor-pointer rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-50">Home</button>
                <button onClick={() => handleNavigate('katalog')} className="relative px-4 py-2 text-sm font-semibold transition-all cursor-pointer rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-50">Katalog</button>
                <button onClick={() => { handleNavigate('landing'); setTimeout(() => document.getElementById('tentang')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all cursor-pointer rounded-xl">Tentang</button>
                <button onClick={() => { handleNavigate('landing'); setTimeout(() => document.getElementById('kontak')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all cursor-pointer rounded-xl">Kontak</button>
              </div>

              {/* Right Actions (desktop) */}
              <div className="hidden md:flex items-center space-x-3">
                {currentUser ? (
                  <div className="flex items-center space-x-3">
                    <button onClick={() => handleNavigate(['admin', UserRole.ADMIN].includes(currentUser.role as any) ? 'admin' : 'dashboard')} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center space-x-2 group">
                      <span>{['admin', UserRole.ADMIN].includes(currentUser.role as any) ? 'Admin Panel' : 'Dashboard'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button onClick={handleLogout} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl text-sm font-semibold transition-all cursor-pointer">Keluar</button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <button onClick={() => handleNavigate('login')} className="px-4 py-2 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-all cursor-pointer">Masuk</button>
                    <button onClick={() => handleNavigate('register')} className="relative group px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold overflow-hidden transition-all cursor-pointer shadow-lg shadow-blue-200/50 hover:shadow-xl hover:scale-105">
                      <span className="relative z-10">Daftar</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile: Masuk & Hamburger */}
              <div className="flex md:hidden items-center space-x-2">
                {!currentUser && (
                  <button onClick={() => handleNavigate('login')} className="px-3 py-1.5 text-sm font-semibold text-blue-600 border border-blue-200 rounded-lg">Masuk</button>
                )}
                {currentUser && (
                  <button onClick={() => handleNavigate('dashboard')} className="px-3 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg">Dashboard</button>
                )}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200"
                >
                  {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mobile Nav Drawer */}
            {sidebarOpen && (
              <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl px-4 py-4 space-y-1 shadow-lg">
                <button onClick={() => { handleNavigate('landing'); setSidebarOpen(false); }} className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">Home</button>
                <button onClick={() => { handleNavigate('katalog'); setSidebarOpen(false); }} className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">Katalog Buku</button>
                <button onClick={() => { handleNavigate('landing'); setTimeout(() => document.getElementById('tentang')?.scrollIntoView({ behavior: 'smooth' }), 150); setSidebarOpen(false); }} className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">Tentang</button>
                <button onClick={() => { handleNavigate('landing'); setTimeout(() => document.getElementById('kontak')?.scrollIntoView({ behavior: 'smooth' }), 150); setSidebarOpen(false); }} className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">Kontak</button>
                <div className="pt-2 border-t border-slate-100">
                  {!currentUser ? (
                    <button onClick={() => { handleNavigate('register'); setSidebarOpen(false); }} className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg mt-1">Daftar Gratis Sekarang</button>
                  ) : (
                    <button onClick={() => { handleLogout(); setSidebarOpen(false); }} className="w-full py-3 text-red-600 font-semibold text-sm hover:bg-red-50 rounded-xl transition-all">Keluar Akun</button>
                  )}
                </div>
              </div>
            )}
          </nav>
        )}
        <div className={showHeader ? "pt-16 w-full min-h-screen" : "w-full min-h-screen"}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView + (selectedBookId || '')}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {renderViewContent()}
            </motion.div>
          </AnimatePresence>
        </div>
        <ToastNotification toasts={toasts} onDismiss={handleDismissToast} />
      </div>
    );
  }

  // ELSE, RENDER WITHIN THE HIGH-PERFORMANCE DASHBOARD SHELL
  // For siswa/staf/admin — they have their own full-screen dashboard, render without the legacy shell
  const isFullScreenDashboard = currentUser && currentView === 'dashboard';

  if (isFullScreenDashboard) {
    return (
      <div className="relative h-screen overflow-hidden">
        {renderViewContent()}
        <ToastNotification toasts={toasts} onDismiss={handleDismissToast} />
        <AILibrarianAssistant books={books} onNavigate={handleNavigate} onOpenPinjamModal={handleOpenPinjamModal} />
        <PinjamModal 
          isOpen={pinjamModalOpen} 
          onClose={() => setPinjamModalOpen(false)}
          book={selectedPinjamBook}
          currentUser={currentUser}
          onConfirmPinjam={handleConfirmPinjam}
        />
      </div>
    );
  }

  const sidebarLinks = [
    { id: 'dashboard', label: 'Ringkasan', icon: LayoutDashboard },
    { id: 'katalog', label: 'Katalog Buku', icon: Layers },
    { id: 'pinjaman', label: 'Riwayat Pinjam', icon: Clock },
    { id: 'favorit', label: 'Favorit Saya', icon: Heart },
    { id: 'profil', label: 'Profil Saya', icon: UserIcon }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800 selection:bg-blue-100 selection:text-blue-900">
      
      {/* MOBILE HEADER (Always visible on mobile) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 z-30 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-100">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-slate-900 tracking-tight text-sm">Pustaka Digital</span>
        </div>
        
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-slate-50 rounded-xl border border-slate-200/50 text-slate-600 cursor-pointer"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* SIDEBAR NAVIGATION LAYER */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 w-72 bg-slate-50/50 border-r border-slate-100/80 z-40 p-8 flex flex-col justify-between transition-transform duration-300 transform
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-8">
          {/* Logo brand */}
          <div className="flex items-center justify-between">
            <div 
              onClick={() => handleNavigate('landing')} 
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/50 group-hover:scale-105 transition-transform duration-300">
                <BookOpen className="w-5.5 h-5.5" />
              </div>
              <div className="leading-tight">
                <span className="text-lg font-bold tracking-tight text-slate-800">Pustaka<span className="text-blue-600 text-sm font-black font-mono ml-0.5 uppercase tracking-wider">v3</span></span>
                <p className="text-[9px] text-slate-400 font-bold font-mono uppercase tracking-wider">Sleek Interface</p>
              </div>
            </div>

            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* User profile snippet inside sidebar */}
          {currentUser && (
            <div className="bg-white border border-slate-100 rounded-[16px] p-4 flex items-center space-x-3 relative overflow-hidden shadow-xs">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 font-extrabold text-sm rounded-xl flex items-center justify-center uppercase shadow-xs">
                {currentUser.name.substring(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-slate-800 text-xs truncate leading-tight">{currentUser.name}</h4>
                <span className="text-[10px] text-slate-400 font-medium truncate block">{currentUser.email}</span>
                <span className="inline-flex items-center space-x-0.5 mt-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-[9px] font-bold">
                  <Award className="w-2.5 h-2.5 fill-current" />
                  <span>{currentUser.badge}</span>
                </span>
              </div>
            </div>
          )}

          {/* Links list */}
          <div>
            <h3 className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-4">Menu Utama</h3>
            <nav className="flex flex-col gap-1.5">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = currentView === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavigate(link.id as any)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-[12px] text-xs font-bold transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? 'bg-white border border-slate-100 text-blue-600 shadow-xs' 
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span>{link.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                );
              })}

              {/* Admin control route (Conditional) */}
              {currentUser && currentUser.role === 'admin' && (
                <button
                  onClick={() => handleNavigate('admin')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-[12px] text-xs font-bold transition-all duration-200 mt-3 border cursor-pointer ${
                    currentView === 'admin' 
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs' 
                      : 'bg-amber-50/40 border-amber-200/30 text-amber-800 hover:bg-amber-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Shield className="w-4.5 h-4.5 text-amber-500" />
                    <span>Admin Panel</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Dynamic Limit Pinjaman Upgrade Card inside Sidebar */}
        <div className="space-y-6">
          {currentUser && (
            <div className="p-5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-[20px] text-white shadow-lg shadow-blue-100/50">
              <p className="text-[10px] uppercase tracking-wider font-semibold opacity-80 mb-0.5">Limit Pinjaman</p>
              <h4 className="text-lg font-bold mb-3">
                {(currentUser.borrowings || []).filter(b => b.status === 'Sedang Dipinjam').length} / {currentUser.badge === 'Premium' ? 5 : 3} Buku
              </h4>
              <div className="w-full bg-blue-400/30 h-1.5 rounded-full">
                <div 
                  className="bg-white h-full rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-500"
                  style={{ 
                    width: `${Math.min(100, (((currentUser.borrowings || []).filter(b => b.status === 'Sedang Dipinjam').length) / (currentUser.badge === 'Premium' ? 5 : 3)) * 100)}%` 
                  }}
                ></div>
              </div>
              {currentUser.badge !== 'Premium' && (
                <button 
                  onClick={() => handleNavigate('profil')}
                  className="mt-4 w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-xs rounded-xl text-[10px] font-bold transition-colors cursor-pointer"
                >
                  Upgrade Ke Premium
                </button>
              )}
            </div>
          )}

          {/* Sidebar Footer logout */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <button
              onClick={() => handleNavigate('landing')}
              className="w-full flex items-center space-x-3 px-3 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Lihat Landing Page</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-xs font-bold text-red-400 hover:text-red-600 rounded-xl cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar Akun</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN SCREEN AREA */}
      <main className="flex-1 flex flex-col min-w-0 pt-16 lg:pt-0">
        
        {/* TOP BAR / BREADCRUMB (Desktop only) */}
        <header className="hidden lg:flex h-16 bg-white border-b border-slate-200 items-center justify-between px-8 z-10 flex-shrink-0 shadow-sm sticky top-0">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400">
            <span>Pustaka Digital</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-700 font-bold capitalize">{currentView === 'detail-buku' ? 'Detail Buku' : currentView}</span>
          </div>

          <div className="text-xs text-slate-400 font-mono font-bold">
            Waktu Server: <span className="text-slate-600">UTC-7 (PDT)</span>
          </div>
        </header>

        {/* CONTAINER CONTENT */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-5 md:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView + (selectedBookId || '')}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {renderViewContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Pinjam modal */}
      <PinjamModal 
        isOpen={pinjamModalOpen} 
        onClose={() => setPinjamModalOpen(false)}
        book={selectedPinjamBook}
        currentUser={currentUser}
        onConfirmPinjam={handleConfirmPinjam}
      />

      {/* Toast notifications */}
      <ToastNotification toasts={toasts} onDismiss={handleDismissToast} />

      {/* Interactive AI Librarian Assistant */}
      <AILibrarianAssistant
        books={books}
        onNavigate={handleNavigate}
        onOpenPinjamModal={handleOpenPinjamModal}
      />
    </div>
  );
}
