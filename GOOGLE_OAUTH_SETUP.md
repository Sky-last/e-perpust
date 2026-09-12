# 🔐 Google OAuth Setup Guide - Supabase

## Step 1: Create Google Cloud Project

1. **Buka Google Cloud Console:**
   - https://console.cloud.google.com/

2. **Create New Project:**
   - Klik dropdown project (top bar)
   - Klik "New Project"
   - Name: `Perpustakaan Digital`
   - Klik "Create"

3. **Select Project:**
   - Pastikan project yang baru dibuat sudah selected

---

## Step 2: Enable Google+ API

1. **Go to APIs & Services:**
   - Sidebar → "APIs & Services" → "Library"

2. **Search & Enable:**
   - Search: "Google+ API"
   - Klik "Google+ API"
   - Klik "Enable"

---

## Step 3: Create OAuth Credentials

1. **Go to Credentials:**
   - Sidebar → "APIs & Services" → "Credentials"

2. **Configure OAuth Consent Screen:**
   - Klik "Configure Consent Screen"
   - Select "External"
   - Klik "Create"

3. **Fill OAuth Consent Screen:**
   ```
   App name: Perpustakaan Kita
   User support email: your-email@example.com
   Developer contact: your-email@example.com
   ```
   - Klik "Save and Continue"
   - Skip "Scopes" → Klik "Save and Continue"
   - Skip "Test users" → Klik "Save and Continue"

4. **Create OAuth Client ID:**
   - Kembali ke "Credentials"
   - Klik "+ Create Credentials"
   - Select "OAuth client ID"
   
5. **Configure OAuth Client:**
   ```
   Application type: Web application
   Name: Perpustakaan Kita Web Client
   
   Authorized JavaScript origins:
   - http://localhost:5173
   - https://your-domain.com
   
   Authorized redirect URIs:
   - https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
   ```
   
   **⚠️ PENTING:** Dapatkan Supabase callback URL di step berikutnya!

6. **Copy Credentials:**
   ```
   Client ID: xxxxx.apps.googleusercontent.com
   Client Secret: xxxxx
   ```
   **SIMPAN INI!** ✅

---

## Step 4: Add to Supabase

1. **Buka Supabase Dashboard:**
   - https://app.supabase.com
   - Select your project

2. **Go to Authentication:**
   - Sidebar → "Authentication" → "Providers"

3. **Enable Google Provider:**
   - Scroll ke "Google"
   - Toggle ON "Enable Sign in with Google"

4. **Copy Callback URL:**
   ```
   Callback URL (for Google):
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```
   **Copy URL ini!**

5. **Paste Google Credentials:**
   ```
   Client ID: [paste dari Google Cloud]
   Client Secret: [paste dari Google Cloud]
   ```

6. **Klik "Save"** ✅

---

## Step 5: Add Callback URL to Google Cloud

1. **Kembali ke Google Cloud Console:**
   - APIs & Services → Credentials
   - Klik OAuth Client yang tadi dibuat

2. **Add Authorized redirect URI:**
   ```
   Paste Supabase callback URL:
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```

3. **Klik "Save"** ✅

---

## Step 6: Configure Supabase Redirect URLs

1. **Di Supabase Dashboard:**
   - Authentication → URL Configuration

2. **Add Site URL:**
   ```
   Site URL: http://localhost:5173
   ```

3. **Add Redirect URLs:**
   ```
   http://localhost:5173
   http://localhost:5173/**
   https://your-domain.com
   https://your-domain.com/**
   ```

4. **Klik "Save"** ✅

---

## ✅ Verification Checklist:

- [ ] Google Cloud Project created
- [ ] Google+ API enabled
- [ ] OAuth Consent Screen configured
- [ ] OAuth Client ID created
- [ ] Client ID & Secret copied
- [ ] Google Provider enabled di Supabase
- [ ] Credentials added to Supabase
- [ ] Callback URL added to Google Cloud
- [ ] Redirect URLs configured di Supabase

---

## 🧪 Test OAuth:

Setelah setup selesai, test di:
```
Supabase Dashboard → Authentication → Providers → Google
→ Klik "Test Configuration"
```

---

## ⚠️ Common Issues:

### Issue: "redirect_uri_mismatch"
**Solution:** 
- Pastikan redirect URI di Google Cloud EXACTLY match dengan Supabase callback URL
- Tunggu 5-10 menit untuk propagasi

### Issue: "Access blocked: This app's request is invalid"
**Solution:**
- Pastikan Google+ API sudah enabled
- Pastikan OAuth Consent Screen sudah published

### Issue: "Error 400: invalid_request"
**Solution:**
- Cek Client ID & Secret di Supabase (no extra spaces)
- Re-save credentials

---

## 🔒 Security Notes:

- ✅ Client Secret adalah **RAHASIA** - jangan commit ke Git!
- ✅ Gunakan environment variables untuk production
- ✅ Enable email verification untuk extra security
- ✅ Review OAuth scopes yang diminta

---

✅ **Setup Complete!** Lanjut ke implementasi kode.
