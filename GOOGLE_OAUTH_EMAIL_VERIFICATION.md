# 🔐 Google OAuth + Email Verification Setup

## 🎯 Goal
User yang login/register dengan Google **HARUS verifikasi email terlebih dahulu** sebelum bisa masuk ke dashboard.

---

## 📋 Setup di Supabase Dashboard

### Step 1: Enable Email Confirmation untuk Semua Provider

1. **Buka Supabase Dashboard**: https://app.supabase.com
2. Pilih project Anda
3. Klik **Authentication** → **Providers**
4. Scroll ke **Email Provider**
5. ✅ **Enable** toggle: **"Confirm email"**
6. ✅ **Enable** toggle: **"Secure email change"**
7. Klik **Save**

---

### Step 2: Configure Google Provider

1. Masih di **Authentication** → **Providers**
2. Scroll ke **Google**
3. ✅ **Enable** Google provider
4. Masukkan **Client ID** dan **Client Secret** dari Google Cloud
5. ⚠️ **PENTING:** Di bagian **Advanced Settings** (expand):
   - ✅ Check: **"Skip nonce check"** (optional, untuk compatibility)
   - ✅ **TIDAK check**: "Auto-confirm email" ← **INI KUNCINYA!**
6. Klik **Save**

> **Catatan:** Jika "Auto-confirm email" di-check, Google user akan langsung login tanpa verifikasi. Pastikan **TIDAK di-check**!

---

### Step 3: Setup Redirect URLs

1. Klik **Authentication** → **URL Configuration**
2. **Site URL:** `http://localhost:5173` (development) atau `https://your-domain.com` (production)
3. **Redirect URLs** (tambahkan semua):
   ```
   http://localhost:5173
   http://localhost:5173/**
   http://localhost:5173/auth/callback
   https://your-domain.com
   https://your-domain.com/**
   https://your-domain.com/auth/callback
   ```
4. Klik **Save**

---

### Step 4: Email Template untuk Google Users (Optional)

1. Klik **Authentication** → **Email Templates**
2. Pilih **Confirm signup**
3. Customize template:

```html
<h2>Verifikasi Email - Perpustakaan Kita</h2>

<p>Halo <strong>{{ .Name }}</strong>,</p>

<p>Terima kasih telah mendaftar menggunakan akun Google Anda!</p>

<p>Untuk mengaktifkan akses penuh ke Perpustakaan Kita, silakan verifikasi email Anda dengan klik tombol di bawah:</p>

<a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
  ✅ Verifikasi Email Saya
</a>

<p style="color: #64748b; font-size: 12px; margin-top: 24px;">
  Link ini akan kadaluarsa dalam 24 jam.<br>
  Jika Anda tidak mendaftar, abaikan email ini.
</p>

<hr style="margin: 32px 0; border: none; border-top: 1px solid #e2e8f0;">

<p style="color: #64748b; font-size: 11px;">
  © 2026 Perpustakaan Kita. All rights reserved.
</p>
```

4. Klik **Save**

---

## 💻 Code Implementation (Already Done)

Code sudah diupdate di `src/App.tsx`:

```typescript
// Auth state listener
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    const isGoogleProvider = session.user.app_metadata?.provider === 'google';
    
    // Check email verification
    const isEmailVerified = Boolean(
      session.user.email_confirmed_at ||
      session.user.user_metadata?.email_verified
    );
    
    const isGoogleEmailVerified = isGoogleProvider && session.user.user_metadata?.email_verified;
    
    if (!isEmailVerified && !isGoogleEmailVerified) {
      // For Google users: send verification email
      if (isGoogleProvider) {
        await supabase.auth.resend({
          type: 'signup',
          email: session.user.email || ''
        });
        addToast('📧 Email verifikasi telah dikirim...', 'info');
      }
      
      // Redirect to verification page
      setCurrentView('email-verification');
      await supabase.auth.signOut();
      return;
    }
    
    // Email verified → proceed to dashboard
    // ... (create profile, login, etc.)
  }
});
```

---

## 🧪 Testing Flow

### Scenario 1: New Google User (First Time)

1. User klik **"Masuk dengan Google"**
2. Pilih akun Google
3. Approve permissions
4. Supabase detect: email **not confirmed yet**
5. ✅ Auto-send email verification
6. Redirect ke **EmailVerificationPage**
7. User cek inbox → klik link verifikasi
8. Callback → SIGNED_IN event
9. Email verified → **Dashboard** 🎉

---

### Scenario 2: Existing Google User (Return)

1. User klik **"Masuk dengan Google"**
2. Pilih akun Google yang sama
3. Check: `email_confirmed_at` exists?
   - ✅ **Yes** → Langsung dashboard
   - ❌ **No** → Redirect ke verification page

---

### Scenario 3: Regular Email User

1. User register dengan email/password
2. Supabase kirim email verification
3. User klik link di email
4. Email verified → Login → Dashboard

---

## 🔍 Verify Setup

### Check 1: Google Provider Settings
```
Supabase Dashboard → Authentication → Providers → Google
→ "Auto-confirm email" = ❌ UNCHECKED
```

### Check 2: Email Confirmation Enabled
```
Authentication → Providers → Email
→ "Confirm email" = ✅ CHECKED
```

### Check 3: Redirect URLs
```
Authentication → URL Configuration
→ Redirect URLs contains: http://localhost:5173/**
```

---

## 🐛 Troubleshooting

### Issue 1: Google user langsung masuk tanpa verifikasi
**Cause:** "Auto-confirm email" di-check di Google provider settings  
**Fix:** Uncheck "Auto-confirm email" di Supabase → Google settings

### Issue 2: Email verification tidak terkirim untuk Google user
**Cause:** Email rate limit (Supabase default: 3-4/hour)  
**Fix:** Setup custom SMTP (SendGrid, AWS SES)

### Issue 3: "email_verified" selalu false
**Cause:** Google Cloud Console OAuth scope tidak include email verification  
**Fix:** Add scope `email` dan `profile` di Google Cloud Console

### Issue 4: Redirect loop setelah verifikasi
**Cause:** Redirect URL tidak match  
**Fix:** Pastikan redirect URL di Supabase match dengan `window.location.origin`

---

## 🔐 Security Best Practices

1. ✅ **Always verify email** - Bahkan untuk Google users
2. ✅ **Use HTTPS** - Di production, gunakan HTTPS untuk callback URL
3. ✅ **Rate limiting** - Setup custom SMTP untuk production
4. ✅ **Email templates** - Customize untuk brand consistency
5. ✅ **Monitor logs** - Check Supabase logs untuk failed auth attempts

---

## 📊 Flow Diagram

```
┌─────────────────────┐
│  User Clicks        │
│  "Login with Google"│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Google OAuth       │
│  Consent Screen     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Callback to        │
│  Supabase           │
└──────────┬──────────┘
           │
           ▼
    ┌──────────────┐
    │ Email        │
    │ Verified?    │
    └──┬────────┬──┘
       │        │
      Yes      No
       │        │
       │        ▼
       │   ┌──────────────────┐
       │   │ Send Verification│
       │   │ Email            │
       │   └────────┬─────────┘
       │            │
       │            ▼
       │   ┌──────────────────┐
       │   │ EmailVerification│
       │   │ Page             │
       │   └────────┬─────────┘
       │            │
       │            │ Click link
       │            │
       │            ▼
       │   ┌──────────────────┐
       │   │ Email Confirmed  │
       │   └────────┬─────────┘
       │            │
       └────────────┘
                    │
                    ▼
           ┌──────────────────┐
           │ Login Success    │
           │ → Dashboard      │
           └──────────────────┘
```

---

## ✅ Checklist

Before deploying to production:

- [ ] Google Provider: "Auto-confirm email" = UNCHECKED
- [ ] Email Provider: "Confirm email" = CHECKED
- [ ] Redirect URLs configured correctly
- [ ] Email template customized
- [ ] Custom SMTP setup (production)
- [ ] Test full flow: Google login → email verification → dashboard
- [ ] Test resend verification email
- [ ] Test email expiration (24h)
- [ ] Monitor Supabase logs

---

🎉 **Setup Complete!** Google users sekarang **WAJIB verifikasi email** sebelum bisa akses dashboard.
