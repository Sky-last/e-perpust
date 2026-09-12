# 🐻 Password Mascot - Cute Bear Animation

## 🎭 Fitur

**Bear mascot yang interaktif** di halaman Login & Register:

### Animasi:
1. **Eyes Open (Default)** 👀
   - Bear mata terbuka dengan animasi berkedip
   - Pupil bergerak-gerak (looking around)
   - Expression: Happy smile

2. **Eyes Closed (Password Visible)** 🙈
   - Bear **tutup mata dengan tangan** (covering eyes with paws)
   - Pipi lebih merah (embarrassed/shy)
   - Paws bergoyang sedikit
   - Expression: Worried/shy

### Kapan Bear Tutup Mata?
- Saat user **klik icon Eye** (show password)
- `showPassword = true` → Bear tutup mata
- `showPassword = false` → Bear buka mata

## 🎨 Komponen

**File:** `src/components/PasswordMascot.tsx`

**Usage:**
```tsx
import PasswordMascot from './PasswordMascot';

<PasswordMascot 
  isPasswordVisible={showPassword} 
  size={100} 
/>
```

**Props:**
- `isPasswordVisible`: boolean - Password terlihat atau tidak
- `size`: number (optional, default 80) - Ukuran mascot dalam px

## 📍 Lokasi Implementasi

✅ **LoginPage** - Line ~170
✅ **RegisterPage** - Line ~196

## 🎯 Behavior

| User Action | Bear Reaction |
|-------------|---------------|
| Normal (password hidden) | 👀 Eyes open, looking around |
| Click eye icon (show password) | 🙈 Covers eyes with paws, blush |
| Click eye icon again (hide password) | 👀 Opens eyes again |

## 🎨 Customization

Edit `PasswordMascot.tsx` untuk:
- Ganti warna bear (line 12-13: `fill="#4A90E2"`)
- Ganti warna telinga/pipi (line 17-18: `fill="#FF7BA9"`)
- Ubah animasi (duration, repeat di motion props)
- Tambah expression lain (edit SVG paths)

## 💡 Fun Details

- Bear punya **blinking animation** saat mata terbuka
- **Cheeks blush more** saat mata tertutup (malu)
- **Paws wiggle** sedikit saat menutupi mata
- **Smooth transition** antara open/closed (0.2s)

---

**Created with Framer Motion** ✨
Animasi smooth dengan AnimatePresence untuk transisi eye states.
