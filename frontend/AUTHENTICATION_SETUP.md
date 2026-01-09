# Sportlin - Supabase Authentication Setup

## 🔐 Authentication System Overview

This project uses **Supabase** for authentication, providing secure user registration, login, and session management.

---

## 📋 Prerequisites

Before setting up authentication, you need:
1. A Supabase account (free tier works perfectly)
2. Node.js and npm installed
3. This Next.js project

---

## 🚀 Setup Instructions

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" and sign up/login
3. Click "New Project"
4. Fill in the details:
   - **Name**: Sportlin (or any name you prefer)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is sufficient
5. Click "Create new project" and wait 1-2 minutes for setup

### Step 2: Get Your Supabase Credentials

1. Once your project is ready, go to **Project Settings** (gear icon in sidebar)
2. Click on **API** in the left menu
3. You'll see two important values:
   - **Project URL** (starts with `https://`)
   - **anon public key** (long string starting with `eyJ...`)
4. Copy these values

### Step 3: Configure Environment Variables

1. Open the `.env.local` file in the `frontend` folder
2. Replace the placeholder values with your actual credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Example:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjE2MTYxNiwiZXhwIjoxOTMxNzM3NjE2fQ.example-signature
```

### Step 4: Configure Supabase Authentication Settings

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** provider is enabled (it should be by default)
3. Go to **Authentication** → **URL Configuration**
4. Add your site URL: `http://localhost:3000` (for development)
5. For production, add your actual domain

### Step 5: Set Up User Metadata (Optional)

If you want to store additional user info (first name, last name, role):

1. Go to **Authentication** → **Users** in Supabase dashboard
2. User metadata is automatically stored when users sign up
3. No additional configuration needed!

### Step 6: Run Your Application

```bash
cd frontend
npm run dev
```

Your app should now be running at `http://localhost:3000`

---

## ✅ Testing Authentication

### Test Sign Up:
1. Click "Get Started" in the navbar
2. Fill in the signup form:
   - First Name
   - Last Name
   - Email
   - Choose role (Athlete/Coach)
   - Password
3. Click "Create Account"
4. Check your email for verification (if email confirmation is enabled)
5. You should now be able to access all pages!

### Test Login:
1. Click the switch to "Sign in" link
2. Enter your email and password
3. Click "Sign In"
4. You should see your name in the navbar

### Test Protected Routes:
1. Sign out if you're logged in
2. Try to visit `/coaches`, `/players`, `/stadiums`, `/notifications`, or `/chat`
3. You should be redirected to the home page with an alert
4. The login modal should open automatically
5. Log in and try accessing those pages again - it should work!

### Test Logout:
1. Click "Sign Out" in the navbar
2. You should be logged out
3. Try accessing protected pages - you'll be redirected again

---

## 🔧 Authentication Features

### ✅ Implemented Features:
- ✅ Email/Password Registration
- ✅ Email/Password Login
- ✅ User Session Management
- ✅ Persistent Login (cookies)
- ✅ User Metadata (first name, last name, role)
- ✅ **Protected Routes (middleware)** - All pages except home require authentication
- ✅ Sign Out
- ✅ Auth State Management (React Context)
- ✅ Error Handling
- ✅ Loading States
- ✅ Automatic Redirect for Unauthenticated Users

### 🔒 Protected Pages:
All pages require authentication **except** the home page (`/`):
- 🔒 `/coaches` - Coaches listing and profiles
- 🔒 `/players` - Players listing and profiles  
- 🔒 `/notifications` - Events page
- 🔒 `/stadiums` - Venues/Stadiums page
- 🔒 `/chat` - AI Coach chat

**When users try to access protected pages without logging in:**
- They are automatically redirected to the home page
- A notification appears asking them to sign in
- The login modal opens automatically

### 🎨 UI Features:
- Beautiful login/signup modals
- Form validation
- Error messages
- Loading indicators
- Responsive design
- Smooth animations

---

## 📁 Project Structure

```
frontend/
├── app/
│   ├── layout.jsx                 # Root layout with AuthProvider
│   ├── page.jsx                   # Home page (public) with auth modals & alerts
│   ├── coaches/                   # 🔒 Protected: Coaches pages
│   ├── players/                   # 🔒 Protected: Players pages
│   ├── notifications/             # 🔒 Protected: Events page
│   ├── stadiums/                  # 🔒 Protected: Stadiums/Venues page
│   └── chat/                      # 🔒 Protected: AI Coach chat
├── components/
│   ├── Navbar.jsx                 # Navigation with auth state
│   └── home/
│       └── AuthModals.jsx         # Login/Signup modals
├── lib/
│   ├── components/
│   │   └── ProtectedRoute.jsx    # Reusable protected route wrapper
│   ├── context/
│   │   └── AuthContext.jsx        # Auth state & functions
│   └── supabase/
│       ├── client.js              # Browser Supabase client
│       ├── server.js              # Server Supabase client
│       └── middleware.js          # Session refresh + route protection
├── middleware.js                  # Next.js middleware (enforces auth)
└── .env.local                     # Environment variables
```

---

## 🔐 Security Features

1. **Secure Session Management**: Uses HTTP-only cookies
2. **Token Refresh**: Automatic token refresh via middleware
3. **Protected Routes**: Middleware checks auth on every request
4. **Environment Variables**: Credentials stored securely
5. **Server-Side Validation**: Auth verified on server

---

## 🐛 Troubleshooting

### Issue: "Invalid API key"
- **Solution**: Double-check your `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`

### Issue: "Failed to fetch"
- **Solution**: Verify your `NEXT_PUBLIC_SUPABASE_URL` is correct

### Issue: "Email not confirmed"
- **Solution**: 
  1. Check your email inbox for confirmation
  2. Or disable email confirmation in Supabase: **Authentication** → **Email Auth** → Toggle off "Enable email confirmations"

### Issue: User not showing after login
- **Solution**: Refresh the page or check browser console for errors

### Issue: Changes not reflecting
- **Solution**: Restart the dev server (`npm run dev`)

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Next.js Authentication](https://nextjs.org/docs/authentication)

---

## 🎯 Next Steps

Consider adding:
- [ ] Password reset functionality
- [ ] OAuth providers (Google, GitHub, etc.)
- [ ] Email verification flow
- [ ] Role-based access control
- [ ] User profile pages
- [ ] Social login buttons

---

## 💡 Usage in Your Code

### Get Current User:
```javascript
import { useAuth } from '../lib/context/AuthContext'

const { user, loading } = useAuth()
```

### Sign Up:
```javascript
const { signUp } = useAuth()
await signUp(email, password, metadata)
```

### Sign In:
```javascript
const { signIn } = useAuth()
await signIn(email, password)
```

### Sign Out:
```javascript
const { signOut } = useAuth()
await signOut()
```

---

## 🎉 You're All Set!

Your authentication system is now fully configured and ready to use. Users can sign up, log in, and access your application securely!
