# 🎨 Icon Assets Guide

## Cara Menggunakan Icon Custom

### 1. Upload Icon Anda
Letakkan file gambar icon di folder ini:
- Format: PNG, SVG, JPG, GIF, WebP
- Ukuran recommended: 512x512px atau lebih (untuk quality terbaik)
- Background: Transparent PNG atau SVG recommended

Contoh:
```
public/assets/icon/
  ├── bear-mascot.png
  ├── library-logo.svg
  └── book-icon.png
```

### 2. Import dan Gunakan di Component

#### Cara 1: Menggunakan AnimatedIcon Component

```tsx
import AnimatedIcon from '../components/AnimatedIcon';

// Di component Anda:
<AnimatedIcon 
  src="/assets/icon/bear-mascot.png"
  alt="Bear Mascot"
  size={48}
  animation="float" // pilihan: bounce, wave, pulse, rotate, float, wiggle
/>
```

#### Cara 2: Langsung Import Image

```tsx
import bearIcon from '/assets/icon/bear-mascot.png';

<img src={bearIcon} alt="Bear" className="w-12 h-12" />
```

### 3. Pilihan Animasi

- **bounce**: Melompat naik-turun
- **wave**: Bergoyang kiri-kanan
- **pulse**: Membesar-mengecil (breathing effect)
- **rotate**: Berputar 360°
- **float**: Mengambang lembut (paling natural)
- **wiggle**: Bergoyang-goyang lucu

### 4. Contoh Penggunaan

```tsx
// Icon di Navbar
<AnimatedIcon 
  src="/assets/icon/logo.png"
  alt="Logo"
  size={42}
  animation="float"
  className="hover:scale-110 transition-transform"
/>

// Icon di Sidebar
<AnimatedIcon 
  src="/assets/icon/menu-icon.svg"
  alt="Menu"
  size={32}
  animation="pulse"
/>

// Icon di Button
<button className="flex items-center gap-2">
  <AnimatedIcon 
    src="/assets/icon/book.png"
    alt="Book"
    size={20}
    animation="bounce"
  />
  <span>Buka Buku</span>
</button>
```

### 5. Bear Mascot Built-in

Aplikasi sudah punya Bear Mascot SVG built-in:

```tsx
import { BearMascotIcon } from '../components/AnimatedIcon';

<BearMascotIcon size={80} />
```

## 🎨 Tips Design

1. **Warna**: Gunakan warna yang konsisten dengan tema app (Biru #4A90E2, Oranye #C08B34, Hijau #20301F)
2. **Size**: Siapkan icon dalam berbagai ukuran untuk performa optimal
3. **Format**: SVG paling fleksibel untuk scale, PNG untuk detail foto
4. **Animation**: Jangan overuse animasi - pakai di tempat strategis saja

## 📁 Icon yang Sudah Ada

- ✅ Bear Mascot (SVG built-in) - Logo utama
- ➕ Tambahkan icon Anda di sini!

## 🚀 Next Steps

Ganti Bear Mascot dengan icon custom Anda:
1. Upload icon ke folder ini (contoh: `logo-custom.png`)
2. Edit `LandingPage.tsx` dan `UserDashboard.tsx`
3. Ganti:
   ```tsx
   <BearMascotIcon size={42} />
   ```
   Menjadi:
   ```tsx
   <AnimatedIcon 
     src="/assets/icon/logo-custom.png"
     alt="Logo"
     size={42}
     animation="float"
   />
   ```

Selesai! 🎉
