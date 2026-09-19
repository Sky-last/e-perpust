import { Category, LibrarySettings, SiteSettings, User, UserRole } from '../types';

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

// Default site settings (CMS Web)
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  // 1. Identitas & Hero
  libraryName: 'Perpustakaan Kita',
  libraryTagline: 'Eksplorasi Dunia Lewat',
  heroBadge: 'Platform Literasi Digital Modern',
  heroSubtitle: 'Akses koleksi buku dengan e-reader page flip interaktif serta ruang etalase koleksi unggulan.',
  heroCtaExplore: 'Jelajahi Katalog',
  heroCtaRegister: 'Daftar Gratis',

  // 2. Angka Statistik Pencapaian (Stats Bar)
  statsMembersCount: '12,480+',
  statsBorrowCount: '48,930+',
  statsRatingText: '4.9/5',

  // 3. Rak Buku & Etalase 3D
  bookshelfTitle: 'Drag rak buku untuk memilih koleksi',
  showcaseBadge: 'Panggung Visualisasi Buku',
  showcaseTitle: 'Etalase Koleksi Unggulan',
  showcaseSubtitle: 'Sorotan buku digital interaktif dengan efek rotasi dan detail lengkap.',

  // 4. Koleksi Populer
  popularBadge: 'Koleksi Pilihan',
  popularTitle: 'Buku Terpopuler',

  // 5. Tentang Kami & 3 Fitur Unggulan
  aboutBadge: 'Tentang Platform',
  aboutTitle: 'Misi Kami: Literasi untuk Semua',
  aboutDescription: 'Perpustakaan Kita adalah platform perpustakaan online modern. Dengan animasi buku interaktif, e-reader flipbook, serta efek suara futuristik.',
  aboutFeature1Title: 'Animasi Buku Terbuka',
  aboutFeature1Desc: 'Visualisasi cover buku berputar dan membungkus halaman secara dinamis.',
  aboutFeature2Title: 'E-Reader Page Flip',
  aboutFeature2Desc: 'Membaca e-book PDF dengan efek membalik halaman dan suara kertas yang sintetis.',
  aboutFeature3Title: 'Showcase Room',
  aboutFeature3Desc: 'Putar kamera 360° untuk melihat panggung buku pada pedestal bercahaya.',

  // 6. Kontak & Jam Layanan
  contactBadge: 'Hubungi Kami',
  contactTitle: 'Layanan Informasi & Layanan Anggota',
  contactSubtitle: 'Punya pertanyaan mengenai koleksi e-book, peminjaman fisik, atau akun keanggotaan? Tim pustakawan kami siap membantu Anda.',
  contactAddress: 'Jl. Pemuda No. 123, Kompleks Pendidikan Utama, Jakarta Pusat 10110',
  contactPhone: '+62 812-3456-7890 / (021) 555-0192',
  contactEmail: 'layanan@pustakadigital.sch.id / info@pustakadigital.id',
  serviceHours: 'Senin - Jumat: 07.30 - 16.00 WIB | Sabtu: 08.00 - 13.00 WIB',

  // 7. Banner Pengumuman
  announcementEnabled: false,
  announcementText: '🎉 Selamat datang di Perpustakaan Kita! Nikmati ratusan koleksi buku digital interaktif.',
  announcementLink: '',

  // 8. Footer & Hak Cipta
  footerCopyright: '© 2026 Perpustakaan Kita Indonesia. Hak Cipta Dilindungi.'
};

// Default seed users (Admin & User demo accounts)
export const DEFAULT_USERS: User[] = [
  {
    id: 'u1',
    name: 'Admin Perpustakaan Kita',
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

