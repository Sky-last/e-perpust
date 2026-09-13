# 🔄 Google OAuth + Email Verification Flow

## 📊 Complete User Flow

---

## Flow 1: New User - Register with Google

```
┌─────────────────────────────────────────────────────────┐
│                   USER ACTION                           │
└─────────────────────────────────────────────────────────┘

1. User opens app → Landing Page
2. Click "Masuk" → Login Page
3. Click "Masuk dengan Google" button

┌─────────────────────────────────────────────────────────┐
│                   OAUTH FLOW                            │
└─────────────────────────────────────────────────────────┘

4. Redirect to Google OAuth consent screen
5. User select Google account
6. User approve permissions (email, profile)
7. Google redirect back to app

┌─────────────────────────────────────────────────────────┐
│              SUPABASE AUTHENTICATION                    │
└─────────────────────────────────────────────────────────┘

8. Supabase receives OAuth callback
9. Create user in auth.users table
10. Check: email_confirmed_at = NULL (not verified)

┌─────────────────────────────────────────────────────────┐
│            EMAIL VERIFICATION REQUIRED                  │
└─────────────────────────────────────────────────────────┘

11. App detects: email NOT verified
12. Trigger: supabase.auth.resend() → send verification email
13. Show toast: "📧 Email verifikasi telah dikirim..."
14. Redirect to: EmailVerificationPage
15. Logout user (cannot proceed without verification)

┌─────────────────────────────────────────────────────────┐
│               USER VERIFIES EMAIL                       │
└─────────────────────────────────────────────────────────┘

16. User opens email inbox
17. Find email: "Verifikasi Email - Perpustakaan Kita"
18. Click verification link
19. Browser opens: Supabase callback URL

┌─────────────────────────────────────────────────────────┐
│           EMAIL CONFIRMED - AUTO LOGIN                  │
└─────────────────────────────────────────────────────────┘

20. Supabase marks: email_confirmed_at = NOW()
21. onAuthStateChange fires: event = 'SIGNED_IN'
22. Check: email verified? ✅ YES
23. Create user profile in profiles table
24. Extract avatar from Google metadata
25. Check profile completion (phone, identity, etc.)
26. Show: CompleteProfileModal (if incomplete)
27. After completion → Dashboard ✅

┌─────────────────────────────────────────────────────────┐
│                    SUCCESS                              │
└─────────────────────────────────────────────────────────┘

User successfully logged in with Google + Email verified!
```

---

## Flow 2: Existing User - Login with Google

```
1. User click "Masuk dengan Google"
2. Select Google account
3. OAuth callback → Supabase

4. Check: email_confirmed_at exists?
   
   ✅ YES (Email already verified)
   → Load existing profile
   → Redirect to Dashboard
   → Success! 🎉

   ❌ NO (Email not verified yet)
   → Redirect to EmailVerificationPage
   → User must verify email first
```

---

## Flow 3: Regular Email Registration

```
1. User fill registration form
2. Submit form → supabase.auth.signUp()
3. Supabase sends verification email
4. User clicks link in email
5. Email verified → Can login
6. Login → Dashboard
```

---

## 🔍 Code Flow in App.tsx

### Step 1: User Clicks Google Button
```typescript
// LoginPage.tsx
<button onClick={handleGoogleLogin}>
  Masuk dengan Google
</button>

const handleGoogleLogin = async () => {
  await onGoogleAuth(); // Call handler from App.tsx
};
```

### Step 2: Google OAuth Handler
```typescript
// App.tsx
const handleGoogleAuth = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
  
  // User will be redirected to Google...
};
```

### Step 3: OAuth Callback Handler
```typescript
// App.tsx - useEffect with onAuthStateChange
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    const isGoogleProvider = session.user.app_metadata?.provider === 'google';
    
    // CHECK: Email verified?
    const isEmailVerified = Boolean(
      session.user.email_confirmed_at ||
      session.user.user_metadata?.email_verified
    );
    
    const isGoogleEmailVerified = isGoogleProvider && 
                                  session.user.user_metadata?.email_verified;
    
    // NOT VERIFIED → Send email
    if (!isEmailVerified && !isGoogleEmailVerified) {
      if (isGoogleProvider) {
        await supabase.auth.resend({
          type: 'signup',
          email: session.user.email || ''
        });
      }
      
      // Redirect to verification page
      setCurrentView('email-verification');
      await supabase.auth.signOut();
      return;
    }
    
    // VERIFIED → Proceed to dashboard
    let profile = await getUserProfile(session.user.id);
    
    if (!profile) {
      // Create new profile for Google user
      profile = createGoogleProfile(session.user);
      await saveProfileToSupabase(profile);
    }
    
    setCurrentUser(profile);
    setCurrentView('dashboard');
  }
});
```

---

## 🎨 UI States

### State 1: EmailVerificationPage
```
┌─────────────────────────────────────┐
│  📧 Verifikasi Email Anda           │
│                                     │
│  Email verifikasi telah dikirim ke: │
│  user@gmail.com                     │
│                                     │
│  Silakan cek inbox Anda dan klik   │
│  link verifikasi.                   │
│                                     │
│  Countdown: 60 detik                │
│  [Kirim Ulang Email] (disabled)     │
│                                     │
│  [← Kembali ke Login]               │
└─────────────────────────────────────┘
```

### State 2: CompleteProfileModal (after verification)
```
┌─────────────────────────────────────┐
│  👋 Selamat Datang!                 │
│                                     │
│  Mohon lengkapi data profil:        │
│                                     │
│  [Input: Nomor Telepon]             │
│  [Input: Nomor Identitas]           │
│  [Select: Kategori Anggota]         │
│  [Input: Institusi]                 │
│                                     │
│  [Simpan & Lanjutkan]               │
└─────────────────────────────────────┘
```

---

## 🔐 Security Checks

### Check 1: Email Verification
```typescript
if (!session.user.email_confirmed_at) {
  // ❌ NOT VERIFIED → Block access
  await supabase.auth.signOut();
  setCurrentView('email-verification');
}
```

### Check 2: Profile Completion
```typescript
if (isProfileIncomplete(profile)) {
  // ⚠️ INCOMPLETE → Show modal
  setNeedsProfileCompletion(true);
  // User can continue but with limited features
}
```

### Check 3: Auth Provider Tracking
```typescript
profile.authProvider = session.user.app_metadata?.provider === 'google' 
  ? 'google' 
  : 'email';

// Useful for analytics:
// - How many users use Google vs Email?
// - Different UX for Google vs Email users?
```

---

## 📊 Database Tables

### auth.users (Supabase Built-in)
```sql
id                 | uuid
email              | text
email_confirmed_at | timestamp  ← NULL until verified
user_metadata      | jsonb      ← Google: avatar_url, name, etc.
app_metadata       | jsonb      ← provider: 'google' or 'email'
```

### public.profiles (Custom)
```sql
id                | uuid (foreign key → auth.users.id)
name              | text
email             | text
role              | text (USER, ADMIN)
badge             | text
avatar            | text      ← From Google
auth_provider     | text      ← 'google' or 'email'
phone             | text
identity_number   | text
member_category   | text
is_profile_completed | boolean
```

---

## 🧪 Test Cases

### Test Case 1: New Google User
```
Input: New Google account (never logged in before)
Expected:
1. OAuth success
2. Email verification sent
3. Redirect to EmailVerificationPage
4. After verification → CompleteProfileModal
5. After completion → Dashboard

Result: ✅ PASS
```

### Test Case 2: Existing Google User
```
Input: Google account that already verified email
Expected:
1. OAuth success
2. Check email_confirmed_at → EXISTS
3. Load profile from database
4. Redirect to Dashboard (skip verification)

Result: ✅ PASS
```

### Test Case 3: Google User with Unverified Email (edge case)
```
Input: Google account but email_confirmed_at = NULL
Expected:
1. OAuth success
2. Send verification email
3. Redirect to EmailVerificationPage
4. User must verify before proceeding

Result: ✅ PASS
```

---

## ⚡ Performance Optimization

### Optimization 1: Cache Profile
```typescript
// After login, save to localStorage
localStorage.setItem('digital_library_active_user_data', 
  JSON.stringify(profile)
);

// On app load, restore from cache
const cachedProfile = localStorage.getItem('digital_library_active_user_data');
if (cachedProfile) {
  setCurrentUser(JSON.parse(cachedProfile));
}
```

### Optimization 2: Debounce Auth State Changes
```typescript
// Prevent multiple rapid auth state changes
let authChangeTimeout: NodeJS.Timeout;
supabase.auth.onAuthStateChange((event, session) => {
  clearTimeout(authChangeTimeout);
  authChangeTimeout = setTimeout(() => {
    handleAuthChange(event, session);
  }, 300);
});
```

---

## 🎉 Success Metrics

✅ **Flow Complete When:**
- Google user receives verification email
- Email is verified within 24 hours
- User completes profile
- User can access dashboard
- User can return and login instantly (no verification again)

---

📚 **Related Docs:**
- `GOOGLE_OAUTH_SETUP.md` - Initial Google setup
- `GOOGLE_OAUTH_EMAIL_VERIFICATION.md` - Detailed config
- `SETUP_CHECKLIST.md` - Quick reference
