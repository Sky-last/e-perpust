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
  rating?: number;        // Average rating (calculated from ratings table)
  ratingCount?: number;   // Number of ratings
  status: 'Tersedia';
  coverColor: string;     // Gradient class or background hex
  coverUrl?: string;      // base64 or URL
  pdfUrl?: string;        // Path to PDF file for reading e-books
  pdfFile?: File | null;  // Temporary file object for upload
  isAiGenerated?: boolean;
  isActive?: boolean;     // For filtering deleted books
  rackLocation?: string;  // For StaffDashboard
}

export interface Rating {
  id: string;
  userId: string;
  bookId: string;
  rating: number;         // 1.0 to 5.0
  review?: string;        // Optional text review
  createdAt: string;
  updatedAt: string;
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
  libraryName?: string;
  maxBorrowBooks: number;
  maxBorrowDays?: number;
  finePerDay?: number;
}

export interface SiteSettings {
  // 1. Identitas & Hero
  libraryName: string;
  libraryTagline: string;
  heroBadge: string;
  heroSubtitle: string;
  heroCtaExplore?: string;
  heroCtaRegister?: string;

  // 2. Angka Statistik Pencapaian (Stats Bar)
  statsMembersCount?: string;
  statsBorrowCount?: string;
  statsRatingText?: string;

  // 3. Rak Buku & Etalase 3D
  bookshelfTitle?: string;
  showcaseBadge?: string;
  showcaseTitle?: string;
  showcaseSubtitle?: string;

  // 4. Koleksi Populer
  popularBadge?: string;
  popularTitle?: string;

  // 5. Tentang Kami & 3 Fitur Unggulan
  aboutBadge?: string;
  aboutTitle?: string;
  aboutDescription?: string;
  aboutFeature1Title?: string;
  aboutFeature1Desc?: string;
  aboutFeature2Title?: string;
  aboutFeature2Desc?: string;
  aboutFeature3Title?: string;
  aboutFeature3Desc?: string;

  // 6. Kontak & Jam Layanan
  contactBadge?: string;
  contactTitle?: string;
  contactSubtitle?: string;
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  serviceHours: string;

  // 7. Banner Pengumuman
  announcementEnabled: boolean;
  announcementText: string;
  announcementLink?: string;

  // 8. Footer & Hak Cipta
  footerCopyright: string;
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
  readBooks?: string[];  // Book IDs that user has fully read
  phone?: string;
  class?: string;
  nisn?: string;
  nip?: string;
  memberCategory?: string;  // e.g. 'Masyarakat Umum', 'Pelajar/Mahasiswa', 'Profesional'
  identityNumber?: string;  // NIK / KTP / No Identitas
  occupation?: string;      // Pekerjaan
  address?: string;         // Alamat
  institution?: string;     // Jurusan / Fakultas / Sekolah / Instansi
  isProfileCompleted?: boolean; // True jika profil sudah lengkap
  authProvider?: 'google' | 'email' | 'demo';
  emailVerified?: boolean;
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
  | 'email-verification'
  | 'dashboard'
  | 'katalog'
  | 'detail-buku'
  | 'favorit'
  | 'profil'
  | 'admin';

export interface RouteState {
  view: ViewType;
  selectedBookId?: string;
}

export interface UserFeedback {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

// ==========================================
// LIVE CHAT TYPES
// ==========================================
export interface ChatMessage {
  id: string;
  sessionId: string;     // userId (satu sesi per user)
  senderId: string;      // userId atau 'admin'
  senderName: string;
  senderRole: 'user' | 'admin';
  text: string;
  timestamp: string;     // ISO string
  isRead: boolean;
}

export interface ChatSession {
  id: string;            // same as userId
  userId: string;
  userName: string;
  userEmail: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadByAdmin: number;
  unreadByUser: number;
  isActive: boolean;
}
