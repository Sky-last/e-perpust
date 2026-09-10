export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
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
  status: 'Tersedia';
  coverColor: string;     // Gradient class or background hex
  coverUrl?: string;      // base64 or URL
  pdfUrl?: string;        // Path to PDF file for reading e-books
  pdfFile?: File | null;  // Temporary file object for upload
  isAiGenerated?: boolean;
  rackLocation?: string;  // For StaffDashboard
}

export interface DownloadedBook {
  id: string;
  bookId: string;
  bookTitle: string;
  author?: string;
  category?: string;
  coverUrl?: string;
  coverColor?: string;
  downloadDate: string;
  pdfUrl?: string;
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
  dueDate?: string;
  returnDate?: string;
  status: 'Sedang Dipinjam' | 'Dikembalikan' | 'pending' | 'approved' | 'rejected' | 'returned' | 'overdue';
  notes?: string;
  extended?: boolean; // Flag to track if book has been extended (max 1x)
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface LibrarySettings {
  maxBorrowBooks: number;
  maxBorrowDays?: number;
  finePerDay?: number;
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
  role: UserRole | 'admin' | 'user';
  badge?: 'Premium' | 'Reguler';
  avatar?: string;
  avatarUrl?: string;
  favorites: string[]; // Book IDs
  borrowings: Borrowing[];
  downloads?: DownloadedBook[];
  phone?: string;
  class?: string;
  nisn?: string;
  nip?: string;
  memberCategory?: string;  // e.g. 'Masyarakat Umum', 'Pelajar/Mahasiswa', 'Profesional'
  identityNumber?: string;  // NIK / KTP / No Identitas
  occupation?: string;      // Pekerjaan
  address?: string;         // Alamat
  status?: string;
}

export interface SystemLog {
  id: string;
  type: 'pinjam' | 'kembali' | 'perpanjang' | 'register' | 'update_profile' | 'download';
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
