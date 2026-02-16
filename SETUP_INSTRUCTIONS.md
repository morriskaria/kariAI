# KariaAI - Setup & Run Instructions

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the app.

## Complete Setup Guide

### Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **npm** or **pnpm** package manager
- **Git** for version control
- A code editor (VS Code recommended)

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/morriskaria/kariAI.git
cd kariAI

# Install dependencies
npm install
# or
pnpm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Optional: Add other environment variables as needed
# NEXT_PUBLIC_STRIPE_KEY=your_stripe_key
# DATABASE_URL=your_database_url
```

### 3. Run Development Server

```bash
npm run dev
# or
pnpm dev
```

The application will start at `http://localhost:3000`

### 4. Backend Setup (Optional)

If you want to connect to the backend API:

```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Run backend server
npm run start:dev
```

The backend will run at `http://localhost:3001`

## Project Structure

```
kariaai/
├── app/                          # Next.js App Router pages
│   ├── (public routes)
│   │   ├── page.tsx             # Landing page
│   │   ├── features/            # Features page
│   │   ├── pricing/             # Pricing page
│   │   ├── blog/                # Blog page
│   │   └── contact/             # Contact page
│   │
│   ├── auth/                    # Authentication pages
│   │   ├── login/               # Login page
│   │   └── register/            # Registration page
│   │
│   ├── dashboard/               # Protected dashboard routes
│   │   ├── page.tsx            # Dashboard home
│   │   ├── bots/               # Bot management
│   │   ├── analytics/          # Analytics page
│   │   ├── profile/            # User profile
│   │   └── settings/           # Account settings
│   │
│   ├── components/              # Reusable components
│   │   ├── auth/               # Auth guards
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── PublicRoute.tsx
│   │   ├── landing/            # Landing page components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   └── Footer.tsx
│   │   ├── ui/                 # shadcn/ui components
│   │   └── DashboardLayout.tsx
│   │
│   ├── lib/                     # Utilities & helpers
│   │   ├── auth-store.ts       # Zustand auth store
│   │   ├── api-client.ts       # API client (axios)
│   │   └── utils.ts            # Utility functions
│   │
│   ├── globals.css             # Global styles
│   └── layout.tsx              # Root layout
│
├── public/                      # Static assets
│   └── main logo.png
│
├── backend/                     # NestJS backend (optional)
│   └── src/
│
├── ROUTING_GUIDE.md            # Routing documentation
├── SETUP_INSTRUCTIONS.md       # This file
├── README.md                   # Project overview
├── package.json
├── tsconfig.json
└── next.config.ts
```

## Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload (port 3000)

# Production
npm run build           # Build for production
npm start               # Start production server
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript type checking
```

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19.2** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Lucide React** - Icons

### Backend (Optional)
- **NestJS** - TypeScript backend framework
- **PostgreSQL** - Database
- **Prisma** - ORM
- **JWT** - Authentication

## Features Overview

### Public Pages (No Auth Required)

1. **Landing Page** (`/`)
   - Hero section with CTA
   - Feature highlights
   - Logo ticker
   - Call-to-action sections

2. **Features Page** (`/features`)
   - Detailed feature cards
   - Benefits overview
   - CTA section

3. **Pricing Page** (`/pricing`)
   - 3 pricing tiers (Starter, Professional, Enterprise)
   - Feature comparisons
   - FAQ section

4. **Blog Page** (`/blog`)
   - Blog post grid
   - Categories and filters
   - Newsletter signup

5. **Contact Page** (`/contact`)
   - Contact form
   - Contact information
   - Office hours

### Authentication Pages

6. **Login** (`/auth/login`)
   - Email/password login
   - Remember me option
   - Forgot password link

7. **Register** (`/auth/register`)
   - User registration form
   - Password strength indicator
   - Terms acceptance

### Protected Dashboard Pages (Auth Required)

8. **Dashboard Home** (`/dashboard`)
   - Overview statistics
   - Bot list
   - Quick actions
   - Quick start guide

9. **Analytics** (`/dashboard/analytics`)
   - Performance metrics
   - Conversation stats
   - User engagement charts
   - Recent activity

10. **Profile** (`/dashboard/profile`)
    - User information
    - Account statistics
    - Recent activity

11. **Settings** (`/dashboard/settings`)
    - General settings
    - Security (password change)
    - Notifications preferences
    - Billing information
    - Privacy & data management

## Authentication System

### How It Works

1. **Registration/Login**: User submits credentials → API returns JWT token + user data
2. **Token Storage**: JWT stored in `localStorage` (and persisted in Zustand store)
3. **Auto-Authentication**: On page load, token is read from storage and user is authenticated
4. **Protected Routes**: `ProtectedRoute` component checks for token, redirects to login if missing
5. **Token Expiration**: Axios interceptor catches 401 responses and redirects to login
6. **Logout**: Clears token from localStorage and Zustand store

### Route Guards

**ProtectedRoute**: Wraps protected pages
```tsx
<ProtectedRoute>
  <DashboardLayout>
    {/* Your protected content */}
  </DashboardLayout>
</ProtectedRoute>
```

**PublicRoute**: Wraps public pages that should redirect if authenticated
```tsx
<PublicRoute redirectIfAuthenticated>
  {/* Login/Register form */}
</PublicRoute>
```

## Testing the Application

### 1. Test Public Routes

Visit these URLs without logging in:
- `http://localhost:3000` (Landing)
- `http://localhost:3000/features`
- `http://localhost:3000/pricing`
- `http://localhost:3000/blog`
- `http://localhost:3000/contact`

### 2. Test Authentication

1. Click "Get Started" → Should go to `/auth/register`
2. Fill registration form → Should redirect to `/dashboard`
3. Logout → Should redirect to `/auth/login`
4. Login again → Should redirect to `/dashboard`

### 3. Test Protected Routes

Try accessing these URLs without logging in (should redirect to login):
- `http://localhost:3000/dashboard`
- `http://localhost:3000/dashboard/analytics`
- `http://localhost:3000/dashboard/profile`
- `http://localhost:3000/dashboard/settings`

### 4. Test Navigation

- **Public Navbar**: Should show "Sign In" + "Get Started" when logged out
- **Public Navbar**: Should show "Dashboard" button when logged in
- **Dashboard Sidebar**: Should highlight active route
- **Dashboard Sidebar**: Should show user email
- **Dashboard Sidebar**: Logout button should work

## Common Issues & Solutions

### Issue: "Module not found" errors

**Solution**: Run `npm install` to ensure all dependencies are installed

### Issue: Port 3000 already in use

**Solution**: 
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Issue: Auth token not persisting

**Solution**: 
- Check browser console for errors
- Verify localStorage is working (`localStorage.setItem('test', '1')`)
- Clear browser cache and try again

### Issue: API calls failing

**Solution**:
- Ensure backend is running on port 3001
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify CORS is enabled in backend

### Issue: Styles not loading

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

### Deploy Backend

Options:
- **Render.com** (recommended for PostgreSQL apps)
- **Fly.io** (good for Docker deployments)
- **Railway** (easy PostgreSQL integration)
- **AWS/DigitalOcean** (full control)

## Next Steps

1. **Connect Backend**: Set up the NestJS backend and database
2. **Implement Real API**: Replace mock data with actual API calls
3. **Add Stripe**: Integrate payment processing
4. **Deploy**: Deploy to production (Vercel + backend hosting)
5. **Add Features**: Build out bot builder, conversation history, etc.

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://zustand.surge.sh/)
- [React Hook Form](https://react-hook-form.com/)
- [Routing Guide](./ROUTING_GUIDE.md) - Detailed routing documentation

## Support

For issues or questions:
- Check [GitHub Issues](https://github.com/morriskaria/kariAI/issues)
- Read the [README.md](./README.md)
- Contact: support@kariaai.com

---

**Happy Coding!** 🚀
