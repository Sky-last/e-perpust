# 📖 PANDUAN LENGKAP & DOKUMENTASI FITUR PERPUSTAKAAN DIGITAL

> **Versi Dokumen:** 2.0.0 | **Tahun:** 2026  
> **Aplikasi:** Perpustakaan Kita (*E-Perpustakaan Digital*)  
> **Format PDF Tersedia:** [`Dokumentasi_Fitur_Perpustakaan_Digital.pdf`](./Dokumentasi_Fitur_Perpustakaan_Digital.pdf)

---

## 📑 DAFTAR ISI
1. [Pengenalan Aplikasi & Peran Pengguna](#1-pengenalan-aplikasi--peran-pengguna)
2. [Fitur Halaman Utama (Website / Landing Page)](#2-fitur-halaman-utama-website--landing-page)
3. [Fitur Autentikasi (Login, Register & Lupa Password)](#3-fitur-autentikasi-login-register--lupa-password)
4. [Fitur Dashboard Pengguna (User / Pemustaka)](#4-fitur-dashboard-pengguna-user--pemustaka)
5. [Fitur Dashboard Administrator (Admin)](#5-fitur-dashboard-administrator-admin)
6. [Fitur Khusus & Proteksi Keamanan Sistem](#6-fitur-khusus--proteksi-keamanan-sistem)

---

## 1. PENGENALAN APLIKASI & PERAN PENGGUNA

**Perpustakaan Digital (*Perpustakaan Kita*)** adalah sistem aplikasi perpustakaan berbasis web modern yang dirancang untuk mempermudah pencarian, peminjaman, dan pembacaan e-book secara interaktif. Sistem ini menggabungkan visual 3D (tiga dimensi), animasi maskot yang responsif, serta integrasi database cloud real-time via **Supabase**.

### Pembagian Peran (*User Roles*):
Sistem ini menggunakan 2 peran utama:

| Peran (*Role*) | Deskripsi Singkat | Halaman yang Diakses |
| :--- | :--- | :--- |
| 🧑‍🎓 **User (Pemustaka)** | Anggota perpustakaan yang dapat membaca buku digital, menandai favorit, mengunduh bahan bacaan, dan memiliki kartu anggota digital. | Landing Page & User Dashboard |
| 👨‍💼 **Administrator (Admin)** | Pengelola perpustakaan yang mengontrol koleksi buku, data kategori, data seluruh anggota, pesan kritik/saran, dan laporan resmi. | Staff / Admin Dashboard |

---

## 2. FITUR HALAMAN UTAMA (WEBSITE / LANDING PAGE)

Halaman ini merupakan tampilan publik yang dapat dilihat oleh siapa saja:

1. **Navigasi Cepat & Switch Mode Gelap / Terang (*Dark/Light Mode*)**
   - **Kegunaan:** Memudahkan berpindah ke bagian koleksi, kontak, atau login. Pengunjung juga bisa memilih tema tampilan gelap yang ramah mata atau terang sesuai kenyamanan.
2. **Hero Section Dinamis & Animasi Partikel 3D**
   - **Kegunaan:** Menyambut pengunjung dengan visual modern, partikel berkilau yang interaktif, serta ringkasan angka statistik (total koleksi buku, jumlah pembaca aktif, dan rating).
3. **Etalase Rak Buku 3D (*BookShelf 3D & Library 3D Room*)**
   - **Kegunaan:** Menampilkan buku dalam bentuk 3D yang dapat diputar (360 derajat) seperti melihat buku fisik di rak perpustakaan nyata.
4. **Pembaca E-Book Interaktif 3D (*Interactive 3D Flipbook*)**
   - **Kegunaan:** Memungkinkan pengunjung membaca lembaran buku PDF langsung di browser dengan efek buka-tutup halaman seperti buku asli, fitur pembesar teks (zoom), dan fitur suara (*Text-to-Speech*).
5. **Formulir Pesan & Masukan (*Feedbacks*)**
   - **Kegunaan:** Formulir bagi pengunjung untuk mengirim kritik, saran, permohonan buku, atau pertanyaan. Pesan otomatis tersimpan ke cloud Supabase dan langsung muncul di Dashboard Admin secara real-time.
6. **Banner Pengumuman Resmi (*Announcement Bar*)**
   - **Kegunaan:** Menampilkan info penting di bagian paling atas website (misal: jam operasional libur, event literasi, dsb.) yang dapat diedit langsung oleh Admin.

---

## 3. FITUR AUTENTIKASI (LOGIN, REGISTER & LUPA PASSWORD)

Fitur untuk mengamankan akun dan mempermudah akses anggota:

1. **Halaman Masuk (*Login Page*) & Maskot Beruang Interaktif**
   - **Kegunaan:** Tempat pengguna memasukkan Email & Password. Dilengkapi maskot kartun yang bereaksi lucu: memperhatikan saat mengetik email, menutup mata saat mengetik password, dan tersenyum ketika berhasil masuk.
2. **Alert Khusus Salah Password / Email Belum Terdaftar**
   - **Kegunaan:** Jika pengguna salah mengetik password, muncul banner merah beranimasi getar (*shake*) disertai suara buzzer peringatan, sehingga pengguna langsung tahu bagian mana yang salah.
3. **Fitur Lupa Password (*Reset Kata Sandi Modal*)**
   - **Kegunaan:** Tombol dengan ikon kunci 🔑 **"Lupa password?"** membuka pop-up pemulihan:
     - **Mode Online (Supabase):** Mengirimkan email resmi berisi tautan pemulihan kata sandi ke kotak masuk pengguna.
     - **Mode Akun Demo/Lokal:** Membuka formulir instan untuk membuat password baru langsung di layar tanpa repot membuka email.
4. **Masuk Cepat dengan Google (*Google Sign-In 1-Klik*)**
   - **Kegunaan:** Pilihan masuk praktis tanpa perlu mengingat password, terhubung langsung dengan akun Google resmi.
5. **Pendaftaran Akun Baru (*Register Page*)**
   - **Kegunaan:** Calon anggota dapat mendaftarkan diri secara gratis hanya dengan mengisi Nama Lengkap, Email, dan Password baru.

---

## 4. FITUR DASHBOARD PENGGUNA (USER / PEMUSTAKA)

Setelah masuk dengan akun User, pemustaka diarahkan ke Dashboard Pengguna:

1. **Tab Beranda (*Home*)**
   - **Kegunaan:** Menyapa pengguna dengan ucapan ramah waktu (Pagi/Siang/Malam), memperlihatkan buku yang sedang dibaca, buku favorit, dan rekomendasi buku pilihan.
2. **Tab Koleksi Buku (*Books Catalog*)**
   - **Kegunaan:** Katalog buku lengkap yang dapat dicari secara instan berdasarkan judul, penulis, atau ISBN, serta difilter per kategori genre.
3. **Ruang Baca Digital & Unduhan (*Offline Reading*)**
   - **Kegunaan:** Membaca e-book kapan saja dengan riwayat halaman terakhir yang tersimpan otomatis, serta opsi unduh (*download*) berkas e-book untuk dibaca saat tidak ada internet.
4. **Kartu Anggota Digital (*Digital Member Pass*)**
   - **Kegunaan:** Identitas resmi anggota perpustakaan yang dilengkapi **Nomor Anggota Unik** (misal: `PK-2026-583739`), barcode, foto profil, dan tombol **Cetak Kartu**.
5. **Pengaturan Profil Anggota (*Profile Completion*)**
   - **Kegunaan:** Tempat melengkapi biodata seperti NIK/No. Identitas, No. Telepon WhatsApp, Asal Sekolah/Instansi, dan Kategori Pemustaka (Pelajar atau Masyarakat Umum).

---

## 5. FITUR DASHBOARD ADMINISTRATOR (ADMIN)

Pusat kendali operasional bagi petugas dan administrator perpustakaan:

1. **Ringkasan Analitik (*Dashboard Overview*)**
   - **Kegunaan:** Memberikan gambaran ringkas data perpustakaan melalui kartu statistik: Total Buku, Total Anggota, Total Bacaan, dan Jumlah Pesan Masukan yang Belum Dibaca.
2. **Kelola Buku (*CRUD Koleksi*)**
   - **Tambah Buku Baru:** Menginput judul, penulis, penerbit, nomor ISBN, sinopsis, tahun terbit, dan lokasi rak.
   - **Upload File PDF & Sampul:** Memasukkan berkas e-book agar bisa diakses oleh pembaca.
   - **Edit & Hapus Buku:** Mengubah informasi buku atau menghapus buku yang sudah usang.
   - **Cetak Laporan Buku:** Mengekspor daftar katalog buku ke format cetak.
3. **Kelola Anggota & Ganti Role Pengguna (*Role Management*)**
   - **Kegunaan:** Menampilkan tabel seluruh pengguna terdaftar. Admin dapat mengubah hak akses anggota secara instan lewat dropdown:
     - **Administrator (Admin):** Membuka akses menu staf & admin.
     - **User (Pemustaka):** Menjadikan akun sebagai pengguna biasa.
   - Perubahan role langsung tersinkronisasi ke cloud database Supabase.
4. **Kotak Masuk Pesan & Masukan Pengunjung (*Feedbacks Inbox*)**
   - **Kegunaan:** Menampung semua kritik dan saran yang dikirim dari formulir kontak landing page. Dilengkapi tanda status dibaca, tombol tandai selesai dibaca, dan tombol hapus. Data diperbarui otomatis (*real-time*).
5. **Pengaturan Website (*CMS Site Settings*)**
   - **Kegunaan:** Mengubah teks nama perpustakaan, kalimat slogan (tagline), isi banner pengumuman, alamat perpustakaan, nomor telepon, dan jam buka perpustakaan secara mandiri tanpa perlu menyentuh kode program.
6. **Cetak Laporan Resmi (*Official Print Report*)**
   - **Kegunaan:** Mencetak laporan resmi rekapitulasi data perpustakaan dengan kop surat, tabel terstruktur, dan kolom tanda tangan pengesahan.

---

## 6. FITUR KHUSUS & PROTEKSI KEAMANAN SISTEM

1. **Proteksi Tombol Back Browser (*Anti-Close Tab Guard*)**
   - **Kegunaan:** Mencegah tab browser tertutup secara tiba-tiba ketika pengguna atau pengunjung menekan tombol *Back* pada browser atau mengusap layar kembali (*swipe back*) pada HP. Jika ada jendela/modal terbuka, tombol Back akan menutup jendela tersebut terlebih dahulu secara aman.
2. **Keamanan Data dengan Row Level Security (RLS)**
   - **Kegunaan:** Memastikan data penting di Supabase terlindungi, di mana pengguna hanya dapat mengedit akun mereka sendiri, sementara Admin memiliki izin untuk mengelola seluruh data sistem.
3. **Penyimpanan Ganda (*Dual Storage Fallback*)**
   - **Kegunaan:** Sistem tetap dapat berjalan lancar menggunakan `localStorage` lokal jika koneksi internet terputus atau saat Supabase sedang dalam pemeliharaan.
