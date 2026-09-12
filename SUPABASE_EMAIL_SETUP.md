# 📧 Supabase Email Verification Setup Guide

## 1️⃣ Setup di Supabase Dashboard (WAJIB)

### A. Enable Email Confirmation
1. Buka **Supabase Dashboard**: https://app.supabase.com
2. Pilih project Anda
3. Klik **Authentication** di sidebar kiri
4. Klik tab **Providers**
5. Scroll ke bagian **Email**
6. **Enable** toggle "Confirm email"
7. Klik **Save**

### B. Setup Email Templates (Optional tapi Recommended)
1. Masih di **Authentication** → Klik tab **Email Templates**
2. Pilih **Confirm signup**
3. Customize email template (contoh di bawah):

```html
<h2>Selamat Datang di Perpustakaan Kita!</h2>
<p>Terima kasih telah mendaftar. Klik tombol di bawah untuk verifikasi email Anda:</p>
<a href="{{ .ConfirmationURL }}">Verifikasi Email Saya</a>
<p>Link ini akan kadaluarsa dalam 24 jam.</p>
```

4. Klik **Save**

### C. Setup Redirect URLs
1. Klik **Authentication** → **URL Configuration**
2. Tambahkan di **Redirect URLs**:
   - `http://localhost:5173/auth/callback` (untuk development)
   - `https://your-domain.com/auth/callback` (untuk production)
3. Klik **Save**

### D. Optional: Custom SMTP (Recommended untuk Production)
Default pakai Supabase email (limited 3-4 emails/hour).

Untuk production, gunakan:
- **SendGrid** (Free 100 emails/day)
- **AWS SES** 
- **Mailgun**

Setup di **Project Settings** → **Auth** → **SMTP Settings**

---

## 2️⃣ Update Environment Variables

File: `.env.local`

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=http://localhost:5173
```

---

## 3️⃣ Testing

### Test Flow:
1. Register dengan email baru
2. Cek inbox email (juga spam folder!)
3. Klik link verifikasi
4. Akan redirect ke `/auth/callback`
5. Login berhasil!

### Common Issues:
- **Email tidak masuk**: Cek spam folder, atau gunakan email domain yang sudah verified
- **Link expired**: Link valid 24 jam, minta resend verification
- **Redirect error**: Pastikan URL di Supabase match dengan app URL

---

## 4️⃣ Rate Limits

**Supabase Default Email:**
- 3-4 emails per hour
- Untuk testing OK, tapi production harus pakai custom SMTP

**Custom SMTP (SendGrid Free):**
- 100 emails/day
- Recommended untuk production

---

✅ Setelah setup di Supabase Dashboard, lanjut ke code implementation!
