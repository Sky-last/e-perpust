export enum UserRole {
  ADMIN = 'admin',
  PETUGAS = 'staf',
  SISWA = 'siswa'
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  categoryId?: string;    // For dashboard components
  publisher: string;
  isbn: string;
  description: string;
  synopsis?: string;      // For StaffDashboard form
  year: number;
  rating: number;
  status: 'Tersedia' | 'Sedang Dipinjam';
  stock: number;
  totalStock?: number;    // For StaffDashboard
  coverColor: string;     // Gradient class or background hex
  coverUrl?: string;      // base64 or URL
  pdfUrl?: string;        // Path to PDF file for reading e-books
  pdfFile?: File | null;  // Temporary file object for upload
  isAiGenerated?: boolean;
  rackLocation?: string;  // For StaffDashboard
}

export interface Borrowing {
  id: string;
  studentId?: string; // references user.id
  userId?: string; // references user.id
  bookId: string;
  bookTitle: string;
  coverColor: string;
  coverUrl?: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'Sedang Dipinjam' | 'Dikembalikan' | 'Terlambat' | 'pending' | 'approved' | 'rejected' | 'overdue' | 'returned';
  notes?: string;
  fineAmount?: number;
  finePaid?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface LibrarySettings {
  maxBorrowDays: number;
  maxBorrowBooks: number;
  finePerDay: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole | 'admin' | 'staf' | 'siswa';
  badge?: 'Premium' | 'Reguler';
  avatar?: string;
  avatarUrl?: string;
  favorites: string[]; // Book IDs
  borrowings: Borrowing[];
  phone?: string;
  class?: string;
  nisn?: string;
  nip?: string;
  status?: string;
}

export interface SystemLog {
  id: string;
  type: 'pinjam' | 'kembali' | 'perpanjang' | 'register' | 'update_profile';
  userName: string;
  userEmail: string;
  bookTitle?: string;
  date: string;
  details?: string;
}

export type ViewType =
  | 'landing'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'katalog'
  | 'detail-buku'
  | 'pinjaman'
  | 'favorit'
  | 'profil'
  | 'admin';

export interface RouteState {
  view: ViewType;
  selectedBookId?: string;
}
