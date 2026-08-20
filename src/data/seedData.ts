import { Category, LibrarySettings, User, UserRole } from '../types';

// Default categories for the library
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Teknologi', description: 'Buku-buku tentang teknologi dan informatika' },
  { id: 'cat-2', name: 'Novel', description: 'Karya sastra fiksi dan non-fiksi' },
  { id: 'cat-3', name: 'Pendidikan', description: 'Buku pendidikan dan pengajaran' },
  { id: 'cat-4', name: 'Bisnis', description: 'Buku bisnis dan kewirausahaan' },
  { id: 'cat-5', name: 'Komputer', description: 'Ilmu komputer dan pemrograman' },
  { id: 'cat-6', name: 'Sejarah', description: 'Sejarah Indonesia dan dunia' },
  { id: 'cat-7', name: 'Agama', description: 'Buku-buku keagamaan' },
  { id: 'cat-8', name: 'Sains', description: 'Ilmu pengetahuan alam' },
];

// Default library settings (Bebas durasi & Tanpa Denda)
export const DEFAULT_SETTINGS: LibrarySettings = {
  maxBorrowBooks: 5,
  maxBorrowDays: 7
};

// Default seed users (Admin & User demo accounts)
export const DEFAULT_USERS: User[] = [
  {
    id: 'u1',
    name: 'Admin Pustaka',
    email: 'admin@pustaka.com',
    password: 'admin',
    role: UserRole.ADMIN,
    badge: 'Premium',
    favorites: [],
    borrowings: [],
    nip: '197801012005011001',
    phone: '081234567890',
  },
  {
    id: 'u3',
    name: 'Hana Alvira',
    email: 'user@pustaka.com',
    password: 'user',
    role: UserRole.USER,
    badge: 'Reguler',
    favorites: [],
    memberCategory: 'Masyarakat Umum',
    identityNumber: '3201928301920001',
    phone: '081298765432',
    borrowings: [
      {
        id: 'brw_1',
        bookId: '1',
        bookTitle: 'Arsitektur Microservices Modern',
        coverColor: 'from-blue-600 to-indigo-900',
        borrowDate: '2026-06-25',
        status: 'approved'
      },
      {
        id: 'brw_2',
        bookId: '4',
        bookTitle: 'Web Development dengan React dan Next.js',
        coverColor: 'from-cyan-600 to-blue-800',
        borrowDate: '2026-06-10',
        returnDate: '2026-06-23',
        status: 'Dikembalikan'
      }
    ]
  }
];

