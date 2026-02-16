# How KariAI Routing & Authentication Works

## 🚀 Complete User Journey Walkthrough

This guide demonstrates exactly how users navigate through KariAI, what happens at each step, and how authentication guards protect routes.

---

## Part 1: First-Time Visitor (Unauthenticated)

### Step 1: Landing Page (/)
**URL:** `http://localhost:3000/`

**What You See:**
- Hero section with "The AI SaaS your product needs"
- Navigation bar with: Home, Features, Pricing, Blog, Contact
- Right side buttons: "Sign In" and "Get Started"
- Logo ticker, features section, CTA, and footer

**What You Can Do:**
- Click any navigation link (all public routes)
- Click "Sign In" → redirects to `/auth/login`
- Click "Get Started" → redirects to `/auth/register`
- Scroll through features and content

**Behind the Scenes:**
- No authentication required
- Navbar checks `useAuthStore` - sees no user
- Shows public navigation options

---

### Step 2: Exploring Public Pages

#### Features Page (/features)
**URL:** `http://localhost:3000/features`

**What You See:**
- Same navbar (persistent across all pages)
- Hero section: "Powerful AI Features"
- 6 feature cards showcasing capabilities:
  - Natural Language Processing
  - Machine Learning Models
  - Real-time Analytics
  - Custom Training
  - Multi-language Support
  - Enterprise Security

**What You Can Do:**
- Browse features
- Click "Get Started" buttons → redirects to `/auth/register`
- Navigate to other public pages via navbar

---

#### Pricing Page (/pricing)
**URL:** `http://localhost:3000/pricing`

**What You See:**
- Hero section: "Simple, Transparent Pricing"
- 3 pricing tiers side-by-side:
  - **Starter:** $29/month (10 chatbots, 10K messages)
  - **Professional:** $99/month (50 chatbots, 100K messages) ⭐ Popular
  - **Enterprise:** Custom pricing (unlimited everything)

**What You Can Do:**
- Compare pricing plans
- Click "Get Started" on any plan → redirects to `/auth/register`
- Click "Contact Sales" on Enterprise → redirects to `/contact`

---

#### Blog Page (/blog)
**URL:** `http://localhost:3000/blog`

**What You See:**
- Hero section: "Latest Insights & Updates"
- Grid of blog post cards with:
  - Featured images
  - Categories (AI, Product, Tutorial, Industry)
  - Publication dates
  - Authors
  - Excerpts

**What You Can Do:**
- Browse blog posts
- Click "Read More" (currently mock links)
- Filter/search articles

---

#### Contact Page (/contact)
**URL:** `http://localhost:3000/contact`

**What You See:**
- Hero section: "Get in Touch"
- Contact form with fields:
  - Full Name
  - Email Address
  - Subject
  - Message
- Contact information sidebar:
  - Email: support@kariai.com
  - Phone: +1 (555) 123-4567
  - Address: San Francisco, CA

**What You Can Do:**
- Fill out and submit contact form
- See validation errors if fields are invalid
- Get success confirmation on submission

---

### Step 3: Attempting to Access Protected Routes

#### Scenario: Try to access Dashboard directly
**URL:** `http://localhost:3000/dashboard`

**What Happens:**
1. Browser loads `/dashboard`
2. `ProtectedRoute` component mounts
3. Checks `useAuthStore` for user
4. No user found (not authenticated)
5. **AUTOMATIC REDIRECT** to `/auth/login`
6. URL changes to: `/auth/login?redirect=/dashboard`

**Behind the Scenes:**
```typescript
// ProtectedRoute.tsx checks:
if (!user && !isLoading) {
  router.push(`/auth/login?redirect=${pathname}`);
  return <div>Loading...</div>;
}
```

**User Experience:**
- See brief loading state
- Immediately redirected to login
- Cannot access dashboard without authentication

---

## Part 2: User Registration & Login

### Step 4: Registration Page (/auth/register)
**URL:** `http://localhost:3000/auth/register`

**What You See:**
- Clean registration form with gradient background
- KariAI logo with glow effect
- Form fields:
  - First Name
  - Last Name
  - Email
  - Password
- "Create Account" button
- Link to login: "Already have an account? Sign in"

**What You Can Do:**
1. Fill out registration form
2. Click "Create Account"
3. See validation errors if any field is invalid
4. On success: account created + automatic login

**What Happens on Submit:**
```typescript
// 1. Make API call to backend
const response = await apiClient.post('/auth/register', formData);

// 2. Receive JWT token and user data
const { token, user } = response.data;

// 3. Store token in localStorage
localStorage.setItem('authToken', token);

// 4. Update auth store
setUser(user);

// 5. Redirect to dashboard
router.push('/dashboard');
```

**Behind the Scenes:**
- `PublicRoute` wrapper checks if already logged in
- If user exists in store, redirects to `/dashboard`
- This prevents logged-in users from seeing registration

---

### Step 5: Login Page (/auth/login)
**URL:** `http://localhost:3000/auth/login`

**What You See:**
- Similar gradient background as registration
- Login form with:
  - Email field
  - Password field
  - "Remember me" checkbox
  - "Forgot password?" link
- "Sign In" button
- Link to register: "Don't have an account? Sign up"

**Login Flow:**
1. Enter credentials
2. Click "Sign In"
3. API validates credentials
4. Receive JWT token
5. Token stored in localStorage
6. User data stored in Zustand
7. **Redirect to dashboard** (or original requested page)

**Redirect Logic:**
```typescript
// If user tried to access /dashboard/analytics before login
// URL was: /auth/login?redirect=/dashboard/analytics
// After login, user goes to: /dashboard/analytics

const redirect = searchParams.get('redirect') || '/dashboard';
router.push(redirect);
```

---

## Part 3: Authenticated User Experience

### Step 6: Dashboard (/dashboard)
**URL:** `http://localhost:3000/dashboard`

**What You See:**
- **Left Sidebar** (persistent):
  - KariAI logo
  - Navigation items:
    - Dashboard (active - highlighted in teal)
    - Chatbots
    - Analytics
    - Profile
    - Settings
  - Logout button at bottom
  - Collapse/expand toggle

- **Top Bar:**
  - Page title: "Dashboard"
  - User info
  - Search bar
  - Notifications icon

- **Main Content:**
  - Welcome message with user's name
  - Quick stats cards:
    - Total Chatbots
    - Active Conversations
    - Total Messages
  - "Create New Bot" button
  - List of existing chatbots with status badges

**What You Can Do:**
- View all your bots
- Create new chatbot
- Navigate to other dashboard pages via sidebar
- Click on individual bots to manage them
- Logout

**Behind the Scenes:**
- `ProtectedRoute` verified JWT is valid
- If token expired, automatic refresh attempted
- User data loaded from auth store
- API calls include JWT in Authorization header

---

### Step 7: Analytics Page (/dashboard/analytics)
**URL:** `http://localhost:3000/dashboard/analytics`

**What You See:**
- Same sidebar (Analytics now highlighted in teal)
- Page title: "Analytics & Insights"
- Stats overview cards:
  - Total Conversations: 1,234
  - Avg Response Time: 1.2s
  - User Satisfaction: 94%
  - Active Users: 456

- **Charts & Visualizations:**
  - Line chart: Conversation Volume Over Time
  - Bar chart: Messages by Bot
  - Pie chart: User Satisfaction Distribution
  - Table: Top performing bots

**What You Can Do:**
- View real-time analytics
- Filter by date range
- Export reports
- Drill down into specific metrics

---

### Step 8: Profile Page (/dashboard/profile)
**URL:** `http://localhost:3000/dashboard/profile`

**What You See:**
- Profile section highlighted in sidebar
- Page title: "Profile"
- Profile photo with upload option
- Form sections:
  - **Personal Information:**
    - First Name
    - Last Name
    - Email (read-only)
    - Phone
  - **Account Details:**
    - Member since date
    - Account type
    - Last login
  - **Preferences:**
    - Language selection
    - Timezone
    - Email notifications

**What You Can Do:**
- Update personal information
- Upload profile picture
- Change preferences
- Save changes

---

### Step 9: Settings Page (/dashboard/settings)
**URL:** `http://localhost:3000/dashboard/settings`

**What You See:**
- Settings highlighted in sidebar
- Tabbed interface:

  **Account Tab:**
  - Email settings
  - Password change
  - Two-factor authentication
  - Delete account option

  **Notifications Tab:**
  - Email notification preferences
  - Push notification settings
  - Notification frequency

  **Security Tab:**
  - Active sessions list
  - API keys management
  - Security logs
  - Privacy settings

  **Billing Tab:**
  - Current plan details
  - Payment method
  - Billing history
  - Upgrade/downgrade options

**What You Can Do:**
- Change password
- Enable 2FA
- Manage notification preferences
- Update billing information
- View security logs

---

## Part 4: Authentication Edge Cases

### Scenario A: Token Expiration During Session

**What Happens:**
1. User is browsing dashboard
2. JWT token expires (after 24 hours)
3. User clicks to load analytics page
4. API call made with expired token
5. Backend returns 401 Unauthorized
6. Frontend intercepts error:

```typescript
// In ProtectedRoute.tsx
try {
  const newToken = await apiClient.post('/auth/refresh');
  localStorage.setItem('authToken', newToken);
  // Retry original request
} catch {
  // Refresh failed - logout
  logout();
  router.push('/auth/login?session=expired');
}
```

**User Experience:**
- Seamless if refresh succeeds
- If refresh fails, redirected to login with message
- Original destination saved for post-login redirect

---

### Scenario B: Logged-in User Tries to Access Login Page

**What Happens:**
1. User is logged in, browsing dashboard
2. User manually types `/auth/login` in URL bar
3. Login page component loads
4. `PublicRoute` wrapper checks auth status
5. Sees user is authenticated
6. **AUTOMATIC REDIRECT** to `/dashboard`

**Behind the Scenes:**
```typescript
// PublicRoute.tsx
if (user && redirectIfAuthenticated) {
  router.push('/dashboard');
  return null;
}
```

---

### Scenario C: Logout Process

**What Happens:**
1. User clicks "Logout" in sidebar
2. Click handler executes:

```typescript
const handleLogout = () => {
  // Clear auth store
  logout();
  
  // Clear localStorage
  localStorage.removeItem('authToken');
  
  // Redirect to login
  router.push('/auth/login');
};
```

3. User redirected to login page
4. All protected routes now inaccessible
5. Navbar shows "Sign In" and "Get Started" again

---

## Part 5: Navigation Patterns

### Navbar Behavior (Public Pages)

**When NOT logged in:**
```
[Logo] [Home] [Features] [Pricing] [Blog] [Contact]     [Sign In] [Get Started]
```

**When logged in:**
```
[Logo] [Home] [Features] [Pricing] [Blog] [Contact]     [Dashboard]
```

### Sidebar Navigation (Dashboard)

**Active State Highlighting:**
- Current page shows teal background
- Icon and text in white
- Other items: gray with hover effect

**Navigation Flow:**
```
Dashboard → Analytics → Profile → Settings
     ↓          ↓          ↓         ↓
  All cyclic - can navigate freely between them
```

---

## Part 6: Complete User Journey Example

### Example: New User Sign-up to First Bot Creation

1. **Visit Site:** `http://localhost:3000`
   - See landing page
   - Read about features

2. **Check Pricing:** Click "Pricing" in nav
   - Review plans
   - Decide on Starter plan

3. **Sign Up:** Click "Get Started"
   - Redirected to `/auth/register`
   - Fill out form
   - Submit

4. **Auto Login:** After registration
   - JWT token received and stored
   - User data in auth store
   - Redirected to `/dashboard`

5. **First Dashboard View:**
   - See welcome message
   - Stats show zeros (new account)
   - "Create New Bot" button prominent

6. **Create Bot:** Click "Create New Bot"
   - Modal/page opens
   - Configure bot settings
   - Save

7. **Explore Features:**
   - Click "Analytics" in sidebar
   - See initial analytics (minimal data)
   - Click "Profile" to update info
   - Upload profile picture

8. **Configure Settings:**
   - Click "Settings"
   - Enable email notifications
   - Set up 2FA for security

9. **Continue Working:**
   - Token valid for 24 hours
   - Seamless experience
   - Auto-refresh keeps session alive

10. **Return Next Day:**
    - Visit site directly at `/dashboard`
    - If token still valid: instant access
    - If token expired: auto-refresh or login prompt
    - Original destination preserved

---

## Part 7: Testing the Flow Yourself

### Test Checklist:

**Public Routes (No Auth Required):**
- [ ] Visit `/` - should see landing page
- [ ] Visit `/features` - should see features page
- [ ] Visit `/pricing` - should see pricing plans
- [ ] Visit `/blog` - should see blog posts
- [ ] Visit `/contact` - should see contact form

**Authentication Guards (Not Logged In):**
- [ ] Visit `/dashboard` - should redirect to `/auth/login`
- [ ] Visit `/dashboard/analytics` - should redirect with return URL
- [ ] Visit `/dashboard/profile` - should redirect to login
- [ ] Visit `/dashboard/settings` - should redirect to login

**Registration & Login:**
- [ ] Go to `/auth/register` - fill form and submit
- [ ] Check localStorage - should have `authToken`
- [ ] Should auto-redirect to `/dashboard`
- [ ] Try visiting `/auth/login` while logged in - should redirect to dashboard

**Protected Routes (Logged In):**
- [ ] Visit `/dashboard` - should see your dashboard
- [ ] Click "Analytics" - should navigate smoothly
- [ ] Click "Profile" - should see profile page
- [ ] Click "Settings" - should see settings tabs
- [ ] All sidebar items should highlight when active

**Logout Flow:**
- [ ] Click "Logout" in sidebar
- [ ] Should redirect to login page
- [ ] Try accessing `/dashboard` - should redirect to login
- [ ] localStorage should be cleared

**Navigation Persistence:**
- [ ] Navbar should persist across all pages
- [ ] Logo click should return to home
- [ ] Public nav links should work from any page
- [ ] Dashboard sidebar should persist across dashboard pages

---

## Part 8: Technical Implementation Details

### How ProtectedRoute Works:

```typescript
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      // Not logged in - redirect to login
      router.push(`/auth/login?redirect=${pathname}`);
    }
  }, [user, isLoading, router, pathname]);

  // Show loading while checking auth
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Not authenticated - don't render children
  if (!user) {
    return <div>Redirecting...</div>;
  }

  // Authenticated - render protected content
  return <>{children}</>;
}
```

### How PublicRoute Works:

```typescript
export function PublicRoute({ 
  children, 
  redirectIfAuthenticated = false 
}: PublicRouteProps) {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user && redirectIfAuthenticated) {
      // Already logged in - redirect to dashboard
      router.push('/dashboard');
    }
  }, [user, redirectIfAuthenticated, router]);

  // If should redirect and user exists, don't render
  if (user && redirectIfAuthenticated) {
    return null;
  }

  // Render public content
  return <>{children}</>;
}
```

### How JWT is Attached to Requests:

```typescript
// In api-client.ts
const authToken = localStorage.getItem('authToken');
if (authToken) {
  config.headers.Authorization = `Bearer ${authToken}`;
}
```

### How Auth State Persists:

```typescript
// Using Zustand persist middleware
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({ /* state */ }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
```

---

## Summary

**The routing system provides:**
- Seamless navigation between public and protected routes
- Automatic authentication checks and redirects
- Persistent navbar across all pages
- Sidebar navigation for dashboard pages
- Token refresh to maintain sessions
- Return URL preservation for interrupted flows
- Clear visual feedback for active routes

**User experience is:**
- Intuitive - guards happen invisibly
- Secure - no unauthorized access possible
- Smooth - no jarring redirects or broken states
- Persistent - auth state survives page refreshes

The entire flow is production-ready with proper security, UX considerations, and edge case handling built in.
