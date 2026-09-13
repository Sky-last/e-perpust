# ✅ Complete Setup Checklist

## 🎯 Quick Setup Guide untuk Google OAuth + Email Verification

---

## 1️⃣ Supabase Dashboard Setup

### A. Email Provider (WAJIB)
```
Authentication → Providers → Email
→ ✅ Enable "Confirm email"
→ ✅ Enable "Secure email change"
→ Save
```

### B. Google Provider (WAJIB)
```
Authentication → Providers → Google
→ ✅ Enable Google
→ Masukkan Client ID & Client Secret
→ Advanced Settings:
   ❌ UNCHECK "Auto-confirm email" ← PENTING!
→ Save
```

> **PENTING:** Jangan check "Auto-confirm email" agar Google user tetap harus verifikasi!

### C. Redirect URLs
```
Authentication → URL Configuration
→ Site URL: http://localhost:5173
→ Redirect URLs:
   - http://localhost:5173/**
   - http://localhost:5173/auth/callback
→ Save
```

---

## 2️⃣ Google Cloud Console Setup

### A. Create Project
1. https://console.cloud.google.com/
2. Create New Project: "Perpustakaan Digital"

### B. Enable API
```
APIs & Services → Library
→ Search "Google+ API"
→ Enable
```

### C. OAuth Consent Screen
```
APIs & Services → OAuth consent screen
→ External
→ App name: Perpustakaan Kita
→ User support email: your-email@gmail.com
→ Save
```

### D. Create Credentials
```
APIs & Services → Credentials
→ + Create Credentials → OAuth client ID
→ Application type: Web application
→ Name: Perpustakaan Kita Web

Authorized JavaScript origins:
- http://localhost:5173
- https://your-domain.com

Authorized redirect URIs:
- https://[your-project].supabase.co/auth/v1/callback

→ Create
→ Copy Client ID & Secret ✅
```

---

## 3️⃣ Environment Variables

File: `.env.local`
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 4️⃣ Testing Flow

### Test 1: Email Registration
```
1. Register dengan email baru
2. Cek inbox → klik link verifikasi
3. Login → Dashboard ✅
```

### Test 2: Google Login (New User)
```
1. Click "Masuk dengan Google"
2. Pilih akun Google
3. Email verification sent 📧
4. Cek inbox → klik link verifikasi
5. Login → Dashboard ✅
```

### Test 3: Google Login (Existing User)
```
1. Click "Masuk dengan Google"
2. Email already verified → Langsung dashboard ✅
```

---

## 5️⃣ Common Issues

| Issue | Solution |
|-------|----------|
| Google user langsung masuk tanpa verifikasi | Uncheck "Auto-confirm email" di Google provider |
| Email tidak terkirim | Cek spam folder, atau setup custom SMTP |
| redirect_uri_mismatch | Pastikan redirect URI di Google match dengan Supabase |
| Email rate limit | Supabase default: 3-4 emails/hour. Use custom SMTP for production |

---

## 6️⃣ Production Checklist

- [ ] Setup custom domain
- [ ] Update Google Cloud redirect URIs dengan production domain
- [ ] Update Supabase redirect URLs dengan production domain
- [ ] Setup custom SMTP (SendGrid/AWS SES)
- [ ] Customize email templates
- [ ] Test full flow di production
- [ ] Monitor Supabase auth logs

---

## 📚 Detailed Documentation

| Doc | Purpose |
|-----|---------|
| `GOOGLE_OAUTH_SETUP.md` | Step-by-step Google Cloud Console setup |
| `SUPABASE_EMAIL_SETUP.md` | Email verification configuration |
| `GOOGLE_OAUTH_EMAIL_VERIFICATION.md` | Combined flow: Google + Email verification |
| `GOOGLE_OAUTH_COMPLETE.md` | Complete implementation guide |

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup .env.local
cp .env.example .env.local
# Edit .env.local dengan Supabase credentials

# 3. Run dev server
npm run dev

# 4. Test
# - Navigate to http://localhost:5173
# - Try register dengan email
# - Try login dengan Google
```

---

## ✅ Success Indicators

Anda berhasil jika:
- ✅ Register dengan email → terima verification email
- ✅ Login dengan Google → terima verification email
- ✅ Setelah klik link verifikasi → bisa masuk dashboard
- ✅ Login ulang dengan Google → langsung masuk (no verification lagi)
- ✅ Tidak ada error di console

---

🎉 **Setup Complete!** Aplikasi siap digunakan dengan Google OAuth + Email Verification.
