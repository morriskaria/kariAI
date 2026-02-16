# KariaAI - Routing Architecture Diagram

## System Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                         KariaAI Application                        │
│                       Next.js 16 App Router                        │
└────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │   Root Layout (layout.tsx)│
                    │   - Global styles         │
                    │   - Font configuration    │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
         ┌──────────▼──────────┐    ┌──────────▼──────────┐
         │   PUBLIC ROUTES     │    │  PROTECTED ROUTES   │
         │   (No Auth)         │    │  (Auth Required)    │
         └──────────┬──────────┘    └──────────┬──────────┘
                    │                           │
        ┌───────────┴───────────┐   ┌──────────┴──────────┐
        │                       │   │                     │
┌───────▼────────┐  ┌──────────▼───▼──────┐  ┌──────────▼──────────┐
│ LANDING PAGES  │  │   AUTH PAGES        │  │  DASHBOARD PAGES    │
│ - Navbar       │  │   - PublicRoute     │  │  - ProtectedRoute   │
│ - Footer       │  │     (redirect if    │  │    (redirect if not │
│                │  │      authenticated) │  │     authenticated)  │
└────────────────┘  └─────────────────────┘  └─────────────────────┘
```

---

## Detailed Route Tree

```
KariaAI Root (/)
│
├── 🌐 PUBLIC ROUTES (Accessible to all)
│   │
│   ├── / (Landing Page)
│   │   ├── <Navbar />
│   │   ├── <Hero />
│   │   ├── <LogoTicker />
│   │   ├── <Features />
│   │   ├── CTA Section
│   │   └── <Footer />
│   │
│   ├── /features
│   │   ├── <Navbar />
│   │   ├── Hero Section
│   │   ├── 6 Feature Cards
│   │   ├── CTA Section
│   │   └── <Footer />
│   │
│   ├── /pricing
│   │   ├── <Navbar />
│   │   ├── Hero Section
│   │   ├── 3 Pricing Cards (Starter, Pro, Enterprise)
│   │   ├── FAQ Section
│   │   └── <Footer />
│   │
│   ├── /blog
│   │   ├── <Navbar />
│   │   ├── Hero Section
│   │   ├── Blog Post Grid (6 posts)
│   │   ├── Newsletter Section
│   │   └── <Footer />
│   │
│   └── /contact
│       ├── <Navbar />
│       ├── Hero Section
│       ├── Contact Form + Info
│       └── <Footer />
│
├── 🔐 AUTH ROUTES (Public but redirect if authenticated)
│   │
│   ├── /auth/login
│   │   └── <PublicRoute redirectIfAuthenticated>
│   │       └── Login Form
│   │           ├── Email input
│   │           ├── Password input
│   │           ├── Remember me checkbox
│   │           ├── Forgot password link
│   │           └── Sign up link
│   │
│   └── /auth/register
│       └── <PublicRoute redirectIfAuthenticated>
│           └── Registration Form
│               ├── First/Last name inputs
│               ├── Email input
│               ├── Password input (with strength indicator)
│               ├── Confirm password input
│               ├── Terms checkbox
│               └── Sign in link
│
└── 🛡️ PROTECTED ROUTES (Authentication required)
    │
    └── /dashboard (All wrapped in <ProtectedRoute>)
        │
        ├── <DashboardLayout>
        │   │
        │   ├── Sidebar Navigation
        │   │   ├── Logo
        │   │   ├── Dashboard link
        │   │   ├── Chatbots link
        │   │   ├── Analytics link
        │   │   ├── Profile link
        │   │   ├── Settings link
        │   │   ├── User info
        │   │   └── Logout button
        │   │
        │   └── Top Bar
        │       ├── Sidebar toggle
        │       └── User welcome
        │
        ├── /dashboard (Home)
        │   ├── Welcome header
        │   ├── Stats Grid (3 cards)
        │   │   ├── Total Chatbots
        │   │   ├── Active Conversations
        │   │   └── Total Messages
        │   ├── Chatbot List/Grid
        │   └── Quick Start Guide
        │
        ├── /dashboard/bots
        │   └── (To be implemented - Bot management)
        │
        ├── /dashboard/bots/new
        │   └── (Existing - Create new bot)
        │
        ├── /dashboard/analytics
        │   ├── Metrics Grid (4 cards)
        │   │   ├── Total Conversations
        │   │   ├── Active Users
        │   │   ├── Avg Response Time
        │   │   └── Satisfaction Rate
        │   ├── Conversations Chart
        │   ├── Top Performing Bots
        │   ├── User Engagement Chart
        │   └── Recent Activity Feed
        │
        ├── /dashboard/profile
        │   ├── Profile Card
        │   │   ├── Avatar
        │   │   ├── Name
        │   │   ├── Email
        │   │   └── Join date
        │   ├── Personal Information
        │   ├── Account Statistics (4 metrics)
        │   └── Recent Activity
        │
        └── /dashboard/settings
            └── Tabbed Settings Panel
                ├── General Tab
                │   ├── Email (read-only)
                │   ├── First name
                │   └── Last name
                ├── Security Tab
                │   ├── Current password
                │   ├── New password
                │   └── Confirm password
                ├── Notifications Tab
                │   └── 5 notification toggles
                ├── Billing Tab
                │   ├── Current plan info
                │   └── Payment method
                └── Privacy Tab
                    ├── Data export
                    └── Delete account
```

---

## Authentication Flow Diagram

```
┌─────────────┐
│   Landing   │
│   Page (/)  │
└──────┬──────┘
       │
       │ Click "Get Started"
       │
       ▼
┌─────────────────┐
│  /auth/register │
│  (PublicRoute)  │
└──────┬──────────┘
       │
       │ Submit form
       │
       ▼
┌─────────────────────────┐
│ POST /api/auth/register │
│                         │
│ Returns:                │
│ - JWT token            │
│ - User data            │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Store in localStorage:  │
│ - authToken             │
│                         │
│ Store in Zustand:       │
│ - user object           │
└──────┬──────────────────┘
       │
       │ Redirect
       │
       ▼
┌─────────────┐
│  /dashboard │
│  (Protected)│
└──────┬──────┘
       │
       │ User can navigate
       │
       ▼
┌─────────────────────────┐
│ Dashboard Pages:        │
│ - /dashboard/analytics  │
│ - /dashboard/profile    │
│ - /dashboard/settings   │
│                         │
│ All wrapped in          │
│ <ProtectedRoute>        │
└─────────────────────────┘
```

### Logout Flow

```
┌─────────────┐
│  Dashboard  │
│  Sidebar    │
└──────┬──────┘
       │
       │ Click "Logout"
       │
       ▼
┌─────────────────────────┐
│ Clear from localStorage:│
│ - authToken             │
│                         │
│ Clear from Zustand:     │
│ - user object           │
└──────┬──────────────────┘
       │
       │ Redirect
       │
       ▼
┌─────────────┐
│ /auth/login │
└─────────────┘
```

### Protected Route Check

```
User navigates to /dashboard/analytics
       │
       ▼
┌─────────────────────────┐
│ <ProtectedRoute> checks:│
│ - Is token in storage?  │
│ - Is user in Zustand?   │
└──────┬──────────────────┘
       │
       ├── YES ─────────────┐
       │                    │
       │                    ▼
       │          ┌─────────────────┐
       │          │ Render page     │
       │          │ (Analytics)     │
       │          └─────────────────┘
       │
       └── NO ──────────────┐
                            │
                            ▼
                  ┌─────────────────┐
                  │ Redirect to     │
                  │ /auth/login     │
                  └─────────────────┘
```

---

## Component Hierarchy

### Public Pages

```
Page Component
 └── <main>
      ├── <Navbar />
      │    ├── Logo
      │    ├── Navigation links
      │    └── Auth buttons (dynamic)
      │         ├── Not logged in: [Sign In] [Get Started]
      │         └── Logged in: [Dashboard]
      │
      ├── Page Content
      │    └── (Hero, Features, etc.)
      │
      └── <Footer />
           ├── Company info
           ├── Quick links
           └── Social links
```

### Protected Pages

```
Page Component
 └── <ProtectedRoute>
      └── <DashboardLayout>
           ├── Sidebar
           │    ├── Logo
           │    ├── Navigation
           │    │    ├── Dashboard
           │    │    ├── Chatbots
           │    │    ├── Analytics (← highlighted if active)
           │    │    ├── Profile
           │    │    └── Settings
           │    ├── User info
           │    └── Logout button
           │
           ├── Top Bar
           │    ├── Sidebar toggle
           │    └── User greeting
           │
           └── Main Content Area
                └── {children} (page content)
```

---

## Navigation State Management

```
┌──────────────────────────────────────┐
│        Zustand Auth Store            │
│  (app/lib/auth-store.ts)            │
├──────────────────────────────────────┤
│  State:                              │
│  - user: User | null                 │
│  - isLoading: boolean                │
│  - error: string | null              │
│  - isInitialized: boolean            │
│                                      │
│  Actions:                            │
│  - setUser(user)                     │
│  - setLoading(loading)               │
│  - setError(error)                   │
│  - logout()                          │
│  - initialize()                      │
│                                      │
│  Persistence:                        │
│  - localStorage ("auth-storage")     │
│  - Automatically syncs user data     │
└──────────────────────────────────────┘
         │
         │ Used by:
         │
         ├─── <Navbar /> (shows/hides auth buttons)
         ├─── <ProtectedRoute /> (checks auth status)
         ├─── <PublicRoute /> (checks for redirect)
         ├─── <DashboardLayout /> (shows user info)
         └─── All dashboard pages (access user data)
```

---

## API Integration Points

```
Frontend                    Backend API
(Next.js)                  (NestJS)

/auth/login       ────────► POST /api/auth/login
/auth/register    ────────► POST /api/auth/register
Dashboard         ────────► GET /api/bots
Analytics         ────────► GET /api/analytics/bots/:id
Settings          ────────► PATCH /api/users/:id
Logout            ────────► POST /api/auth/logout

                    ▲
                    │
                    │ JWT Token in header:
                    │ Authorization: Bearer {token}
                    │
           ┌────────┴────────┐
           │ Axios Interceptor│
           │ (api-client.ts)  │
           │                  │
           │ - Adds token     │
           │ - Handles 401s   │
           └──────────────────┘
```

---

## File Organization

```
app/
├── page.tsx                    # Landing (/)
├── features/page.tsx           # /features
├── pricing/page.tsx            # /pricing
├── blog/page.tsx              # /blog
├── contact/page.tsx           # /contact
│
├── auth/
│   ├── login/page.tsx         # /auth/login
│   └── register/page.tsx      # /auth/register
│
├── dashboard/
│   ├── page.tsx               # /dashboard
│   ├── analytics/page.tsx     # /dashboard/analytics
│   ├── profile/page.tsx       # /dashboard/profile
│   └── settings/page.tsx      # /dashboard/settings
│
├── components/
│   ├── auth/
│   │   ├── ProtectedRoute.tsx # Auth guard for protected routes
│   │   └── PublicRoute.tsx    # Auth guard for public routes
│   │
│   ├── landing/
│   │   ├── Navbar.tsx         # Public navigation
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   └── Footer.tsx
│   │
│   ├── ui/                    # shadcn/ui components
│   └── DashboardLayout.tsx    # Dashboard layout with sidebar
│
└── lib/
    ├── auth-store.ts          # Zustand auth state
    └── api-client.ts          # Axios API client
```

---

## Summary

### Total Routes: **11**

**Public Routes (5):**
- `/` - Landing
- `/features` - Features
- `/pricing` - Pricing
- `/blog` - Blog
- `/contact` - Contact

**Auth Routes (2):**
- `/auth/login` - Login
- `/auth/register` - Register

**Protected Routes (4 new + 2 existing = 6):**
- `/dashboard` - Dashboard Home
- `/dashboard/bots` - Bot Management (existing, to implement)
- `/dashboard/bots/new` - Create Bot (existing)
- `/dashboard/analytics` - Analytics (new)
- `/dashboard/profile` - Profile (new)
- `/dashboard/settings` - Settings (new)

### Authentication Guards: **2**
- `<ProtectedRoute>` - For dashboard pages
- `<PublicRoute>` - For auth pages

### Navigation Components: **2**
- `<Navbar />` - Public pages
- `<DashboardLayout />` - Dashboard pages with sidebar

### State Management: **1**
- Zustand store with localStorage persistence

---

This architecture provides a complete, production-ready routing system with proper authentication, navigation, and user experience patterns.
