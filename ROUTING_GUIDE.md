# KariaAI - Routing & Authentication Guide

## Overview

KariaAI uses **Next.js 16 App Router** with JWT-based authentication. All routes are protected by authentication guards that redirect users based on their login status.

## Architecture

### Authentication System

- **JWT Tokens**: Stored in `localStorage` after successful login
- **Zustand Store**: Manages global auth state (`user`, `isLoading`, `error`)
- **Auth Guards**: 
  - `ProtectedRoute`: Wraps protected pages, redirects to `/auth/login` if not authenticated
  - `PublicRoute`: Wraps public pages, can redirect to `/dashboard` if already authenticated
- **Token Refresh**: Currently handled via axios interceptors (401 responses redirect to login)

### Route Structure

```
/                           → Landing page (public)
├── /features              → Features overview (public)
├── /pricing               → Pricing plans (public)
├── /blog                  → Blog posts (public)
├── /contact               → Contact form (public)
│
├── /auth
│   ├── /login            → Login page (public, redirects if authenticated)
│   └── /register         → Registration page (public, redirects if authenticated)
│
└── /dashboard            → Protected dashboard
    ├── /                 → Dashboard home (protected)
    ├── /bots             → Chatbot management (protected)
    │   └── /new         → Create new bot (protected)
    ├── /analytics        → Analytics dashboard (protected)
    ├── /profile          → User profile (protected)
    └── /settings         → Account settings (protected)
```

## Route Categories

### Public Routes (No Authentication Required)

These routes are accessible to all users, authenticated or not:

- `/` - Landing page with hero, features, CTA
- `/features` - Detailed feature descriptions
- `/pricing` - Pricing tiers and plans
- `/blog` - Blog posts and articles
- `/contact` - Contact form

**Navigation**: Uses the shared `<Navbar />` component that shows:
- **Not authenticated**: "Sign In" + "Get Started" buttons
- **Authenticated**: "Dashboard" button

### Auth Routes (Redirect If Authenticated)

These routes use `<PublicRoute redirectIfAuthenticated>`:

- `/auth/login` - Login form
- `/auth/register` - Registration form

**Behavior**: If a user is already logged in, they are redirected to `/dashboard`

### Protected Routes (Authentication Required)

These routes use `<ProtectedRoute>` wrapper:

- `/dashboard` - Main dashboard with stats and bot list
- `/dashboard/bots` - Manage chatbots
- `/dashboard/bots/new` - Create new chatbot
- `/dashboard/analytics` - View analytics and metrics
- `/dashboard/profile` - User profile information
- `/dashboard/settings` - Account settings (general, security, notifications, billing, privacy)

**Behavior**: If not authenticated, user is redirected to `/auth/login`

**Navigation**: Uses `<DashboardLayout />` with sidebar containing:
- Dashboard
- Chatbots
- Analytics
- Profile
- Settings
- Logout button

## Implementation Details

### 1. Protected Route Guard

```tsx
// app/components/auth/ProtectedRoute.tsx
export function ProtectedRoute({ children }) {
  const { user } = useAuthStore();
  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/auth/login');
    }
  }, [user, router]);
  
  return <>{children}</>;
}
```

**Usage**:
```tsx
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Your content */}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
```

### 2. Public Route Guard

```tsx
// app/components/auth/PublicRoute.tsx
export function PublicRoute({ children, redirectIfAuthenticated = false }) {
  const { user } = useAuthStore();
  const router = useRouter();
  
  useEffect(() => {
    if (redirectIfAuthenticated && user) {
      router.push('/dashboard');
    }
  }, [user, router, redirectIfAuthenticated]);
  
  return <>{children}</>;
}
```

**Usage**:
```tsx
export default function LoginPage() {
  return (
    <PublicRoute redirectIfAuthenticated>
      {/* Login form */}
    </PublicRoute>
  );
}
```

### 3. Authentication Flow

**Login:**
1. User submits email + password at `/auth/login`
2. API call to `POST /api/auth/login`
3. Receive JWT token and user data
4. Store token in `localStorage`
5. Update Zustand store with user data
6. Redirect to `/dashboard`

**Registration:**
1. User submits form at `/auth/register`
2. API call to `POST /api/auth/register`
3. Receive JWT token and user data
4. Store token in `localStorage`
5. Update Zustand store with user data
6. Redirect to `/dashboard`

**Logout:**
1. User clicks "Logout" in dashboard sidebar
2. Call `logout()` from Zustand store
3. Remove token from `localStorage`
4. Clear user data from store
5. Redirect to `/auth/login`

**Token Expiration:**
- Axios interceptor catches 401 responses
- Automatically removes token
- Redirects to `/auth/login`

### 4. Persistent Navigation

**Landing Navbar** (`<Navbar />`):
- Visible on: `/`, `/features`, `/pricing`, `/blog`, `/contact`
- Sticky positioning
- Shows authentication status
- Links to all public pages

**Dashboard Sidebar** (`<DashboardLayout />`):
- Visible on all `/dashboard/*` routes
- Collapsible sidebar
- Active route highlighting
- User info and logout button

## Adding New Routes

### Adding a Public Route

1. Create page file: `app/your-route/page.tsx`
2. Import `<Navbar />` and `<Footer />`
3. Optionally wrap with `<PublicRoute>` (no redirect)

```tsx
// app/about/page.tsx
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      {/* Your content */}
      <Footer />
    </main>
  );
}
```

### Adding a Protected Route

1. Create page file: `app/dashboard/your-route/page.tsx`
2. Wrap with `<ProtectedRoute>` and `<DashboardLayout>`

```tsx
// app/dashboard/billing/page.tsx
import DashboardLayout from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function BillingPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Your content */}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
```

3. Add to sidebar navigation in `DashboardLayout.tsx`:

```tsx
const navItems = [
  // ... existing items
  { href: '/dashboard/billing', icon: CreditCard, label: 'Billing' },
];
```

## Environment Variables

Required environment variables (add to `.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## API Endpoints (Backend)

The frontend expects these API endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token (optional)

### Bots
- `GET /api/bots` - List all bots
- `POST /api/bots` - Create new bot
- `GET /api/bots/:id` - Get bot details
- `PATCH /api/bots/:id` - Update bot
- `DELETE /api/bots/:id` - Delete bot

### Analytics
- `GET /api/analytics/bots/:id` - Get bot analytics

### Billing
- `GET /api/billing/status` - Get subscription status
- `POST /api/billing/checkout` - Create checkout session

## Running the Application

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

The app will be available at `http://localhost:3000`

## Testing Authentication Flow

1. **Visit Landing Page**: `http://localhost:3000` → Navbar shows "Sign In" + "Get Started"
2. **Click "Get Started"**: Redirects to `/auth/register`
3. **Register Account**: Fill form → Redirects to `/dashboard`
4. **Verify Protection**: Try accessing `/dashboard` without login → Redirects to `/auth/login`
5. **Test Logout**: Click "Logout" in sidebar → Redirects to `/auth/login`
6. **Test Auto-Redirect**: Visit `/auth/login` while logged in → Redirects to `/dashboard`

## Troubleshooting

### "Redirect loop" or "Maximum update depth exceeded"
- Check that `useEffect` dependencies are correct in auth guards
- Ensure token is being stored/retrieved from localStorage correctly

### Routes not protected
- Verify `<ProtectedRoute>` is wrapping the page component
- Check that `useAuthStore` has the correct user state

### Navbar not updating after login
- Ensure Zustand store is updated after successful login
- Check that `<Navbar />` is using `useAuthStore()` hook

### Token not persisting across refreshes
- Implement token restoration from localStorage on app init
- Add initialization logic to auth store or root layout

## Future Improvements

- [ ] Implement refresh token rotation
- [ ] Add token expiration checking
- [ ] Server-side authentication with middleware
- [ ] Role-based access control (RBAC)
- [ ] OAuth providers (Google, GitHub)
- [ ] Remember me functionality
- [ ] Email verification
- [ ] Password reset flow
- [ ] Session timeout warnings

## Security Considerations

1. **Token Storage**: Currently using `localStorage` (upgrade to HTTP-only cookies in production)
2. **HTTPS**: Always use HTTPS in production
3. **Token Expiration**: Implement proper token expiration handling
4. **CSRF Protection**: Add CSRF tokens for state-changing operations
5. **Rate Limiting**: Implement rate limiting on auth endpoints
6. **Input Validation**: Always validate user inputs on both client and server
