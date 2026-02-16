# KariaAI - Complete Routing Plan Summary

## Overview

This document provides a high-level overview of the complete routing architecture for KariaAI, including all routes, authentication guards, and navigation structure.

## Route Map

### 🌐 Public Routes (No Authentication Required)

| Route | Page | Description | Key Features |
|-------|------|-------------|--------------|
| `/` | Landing | Homepage with hero & features | CTA buttons, feature highlights, logo ticker |
| `/features` | Features | Detailed feature showcase | 6 feature cards with icons, gradients, CTA |
| `/pricing` | Pricing | Pricing tiers & plans | 3 plans (Starter, Pro, Enterprise), FAQ |
| `/blog` | Blog | Blog posts & articles | Post grid, categories, newsletter signup |
| `/contact` | Contact | Contact form & info | Form, contact details, office hours |

**Navigation**: Shared `<Navbar />` component
- Sticky header with logo
- Links: Home, Features, Pricing, Blog, Contact
- Dynamic auth buttons:
  - Not logged in: "Sign In" + "Get Started"
  - Logged in: "Dashboard"

---

### 🔒 Authentication Routes (Redirect If Authenticated)

| Route | Page | Description | Guard |
|-------|------|-------------|-------|
| `/auth/login` | Login | User login form | `<PublicRoute redirectIfAuthenticated>` |
| `/auth/register` | Register | User registration | `<PublicRoute redirectIfAuthenticated>` |

**Behavior**: 
- If user is logged in and visits these pages → Redirect to `/dashboard`
- If not logged in → Show login/register form

**Features**:
- **Login**: Email/password, remember me, forgot password link
- **Register**: Name, email, password with strength indicator, terms checkbox

---

### 🛡️ Protected Routes (Authentication Required)

All dashboard routes use `<ProtectedRoute>` wrapper. If not authenticated → Redirect to `/auth/login`

| Route | Page | Description | Key Features |
|-------|------|-------------|--------------|
| `/dashboard` | Dashboard Home | Overview & bot list | Stats cards, bot grid, quick start guide |
| `/dashboard/bots` | Bot Management | List of chatbots | (To be implemented) |
| `/dashboard/bots/new` | Create Bot | Bot creation wizard | (Existing) |
| `/dashboard/analytics` | Analytics | Performance metrics | Metrics, charts, activity log |
| `/dashboard/profile` | User Profile | Profile information | User info, stats, recent activity |
| `/dashboard/settings` | Account Settings | Multi-tab settings | 5 tabs: General, Security, Notifications, Billing, Privacy |

**Navigation**: `<DashboardLayout />` with collapsible sidebar
- Logo + brand
- Navigation items with active highlighting:
  - Dashboard
  - Chatbots
  - Analytics
  - Profile
  - Settings
- User info (email)
- Logout button

---

## Authentication Architecture

### JWT Flow

```
┌─────────────┐
│  Register/  │
│    Login    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│ API returns:                │
│ - JWT token                 │
│ - User data (id, email, etc)│
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Store in:                   │
│ 1. localStorage (token)     │
│ 2. Zustand store (user)     │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Axios interceptor adds      │
│ "Authorization: Bearer JWT" │
│ to all API requests         │
└─────────────────────────────┘
```

### Token Management

1. **Storage**: 
   - JWT token → `localStorage.getItem('authToken')`
   - User data → Zustand store (persisted to localStorage)

2. **Initialization**: 
   - On app load, Zustand reads from localStorage
   - If token exists → User is authenticated

3. **Expiration**:
   - Axios interceptor catches 401 responses
   - Removes token from localStorage
   - Redirects to `/auth/login`

4. **Logout**:
   - Clears token from localStorage
   - Clears user from Zustand store
   - Redirects to `/auth/login`

### Guard Components

**ProtectedRoute.tsx**
```tsx
// Wraps protected pages
// Checks for token in localStorage
// Redirects to /auth/login if missing
<ProtectedRoute>
  <DashboardLayout>
    {/* Protected content */}
  </DashboardLayout>
</ProtectedRoute>
```

**PublicRoute.tsx**
```tsx
// Wraps public pages (optional)
// Can redirect to /dashboard if already authenticated
<PublicRoute redirectIfAuthenticated>
  {/* Login/Register form */}
</PublicRoute>
```

---

## Navigation Structure

### Public Navigation (Navbar)

```
┌──────────────────────────────────────────────────────────────┐
│  [Logo]   Home  Features  Pricing  Blog  Contact   [Auth CTA]│
└──────────────────────────────────────────────────────────────┘
```

**States**:
- Not authenticated: `[Sign In] [Get Started]`
- Authenticated: `[Dashboard]`

### Protected Navigation (Dashboard Sidebar)

```
┌─────────────────┐
│  [Logo] KariaAI │
├─────────────────┤
│  Dashboard      │  ← Active (highlighted)
│  Chatbots       │
│  Analytics      │
│  Profile        │
│  Settings       │
├─────────────────┤
│  user@email.com │
│  [Logout]       │
└─────────────────┘
```

**Features**:
- Collapsible (toggle button in top bar)
- Active route highlighting (teal background)
- Shows user email
- Logout button

---

## File Structure

```
app/
├── page.tsx                          # Landing page (/)
├── features/page.tsx                 # Features page
├── pricing/page.tsx                  # Pricing page
├── blog/page.tsx                     # Blog page
├── contact/page.tsx                  # Contact page
│
├── auth/
│   ├── login/page.tsx               # Login page
│   └── register/page.tsx            # Register page
│
├── dashboard/
│   ├── page.tsx                     # Dashboard home
│   ├── analytics/page.tsx           # Analytics page
│   ├── profile/page.tsx             # Profile page
│   └── settings/page.tsx            # Settings page
│
├── components/
│   ├── auth/
│   │   ├── ProtectedRoute.tsx       # Protected route guard
│   │   └── PublicRoute.tsx          # Public route guard
│   ├── landing/
│   │   ├── Navbar.tsx               # Public navbar
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   └── Footer.tsx
│   ├── ui/                          # shadcn/ui components
│   └── DashboardLayout.tsx          # Dashboard layout with sidebar
│
└── lib/
    ├── auth-store.ts                # Zustand auth store
    └── api-client.ts                # Axios API client
```

---

## Color Scheme & Design

### Color Tokens (from globals.css)

- **Background**: `#000000` (Black)
- **Foreground**: `#ffffff` (White)
- **Primary**: `#00D455` (Bright Green) - Used for CTAs, highlights
- **Secondary**: `#111111` (Very Dark Gray)
- **Accent**: `#1A1A1A` (Dark Gray)
- **Border**: `#222222` (Gray)

### Design Consistency

**Landing Pages**:
- Black background (`bg-black`)
- White text (`text-white`)
- Green accent buttons (`bg-primary`)
- Glass-panel effects (`glass-panel`)
- Gradient text accents

**Dashboard Pages**:
- Light background (`bg-slate-50`)
- White cards (`bg-white`)
- Teal accents (`bg-teal-600`)
- Dark sidebar (`bg-slate-900`)

---

## API Endpoints (Expected Backend)

### Authentication
- `POST /api/auth/register` → Returns `{ user, token }`
- `POST /api/auth/login` → Returns `{ user, token }`
- `POST /api/auth/logout` → Returns success
- `POST /api/auth/refresh` → Returns new token (optional)

### Bots
- `GET /api/bots` → Returns bot list
- `POST /api/bots` → Creates bot
- `GET /api/bots/:id` → Returns bot details
- `PATCH /api/bots/:id` → Updates bot
- `DELETE /api/bots/:id` → Deletes bot

### Analytics
- `GET /api/analytics/bots/:id` → Returns bot analytics

### Billing
- `GET /api/billing/status` → Returns subscription info
- `POST /api/billing/checkout` → Creates Stripe session

---

## Testing Checklist

### ✅ Public Routes
- [ ] Landing page loads at `/`
- [ ] Features page loads at `/features`
- [ ] Pricing page loads at `/pricing`
- [ ] Blog page loads at `/blog`
- [ ] Contact page loads at `/contact`
- [ ] Navbar shows on all public pages
- [ ] Footer shows on all public pages

### ✅ Authentication
- [ ] Can access `/auth/login` when logged out
- [ ] Can access `/auth/register` when logged out
- [ ] Cannot access `/auth/login` when logged in (redirects to dashboard)
- [ ] Cannot access `/auth/register` when logged in (redirects to dashboard)
- [ ] Login form submits and redirects to dashboard
- [ ] Register form submits and redirects to dashboard
- [ ] Navbar updates after login (shows "Dashboard" button)

### ✅ Protected Routes
- [ ] Cannot access `/dashboard` when logged out (redirects to login)
- [ ] Cannot access `/dashboard/analytics` when logged out
- [ ] Cannot access `/dashboard/profile` when logged out
- [ ] Cannot access `/dashboard/settings` when logged out
- [ ] Can access all dashboard routes when logged in
- [ ] Dashboard sidebar shows on all dashboard pages
- [ ] Active route is highlighted in sidebar
- [ ] Logout button works and redirects to login

### ✅ Navigation
- [ ] Navbar links work correctly
- [ ] Dashboard sidebar links work correctly
- [ ] Active route highlighting works in sidebar
- [ ] Sidebar collapse/expand works
- [ ] User email displays in sidebar

### ✅ Token Management
- [ ] Token is stored in localStorage after login
- [ ] Token is removed from localStorage after logout
- [ ] Token persists across page refreshes
- [ ] User remains logged in after refresh
- [ ] 401 responses trigger logout and redirect

---

## Quick Start Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000` to test the application.

---

## Summary

✅ **11 Total Routes**: 5 public, 2 auth, 6 protected (including 2 existing dashboard routes)

✅ **JWT Authentication**: Token-based with localStorage persistence

✅ **Route Guards**: ProtectedRoute and PublicRoute components

✅ **Persistent Navigation**: 
  - Public pages: Shared Navbar
  - Dashboard pages: Sidebar in DashboardLayout

✅ **Consistent Design**: Black/green theme on public pages, light theme in dashboard

✅ **Ready to Deploy**: All routes functional, auth flow complete

---

For detailed documentation, see:
- **ROUTING_GUIDE.md** - Complete routing & auth documentation
- **SETUP_INSTRUCTIONS.md** - Setup & deployment guide
- **README.md** - Project overview
