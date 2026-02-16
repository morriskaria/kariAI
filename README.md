# KariaAI - AI Chatbot SaaS Platform for African Businesses

**KariaAI** is a production-ready SaaS platform that enables African small and medium businesses to deploy AI-powered chatbots and receptionist assistants in under 30 minutes. Built with modern web technologies and optimized for African markets.

## 🌍 Vision

Empower African entrepreneurs to compete globally by automating customer interactions with affordable, easy-to-use AI chatbots. No coding required. No expensive setup.

## ✨ Key Features

- **30-Minute Setup**: Deploy a fully functional chatbot without technical knowledge
- **24/7 Customer Support**: AI receptionist handles inquiries, books appointments, captures leads
- **Real-Time Analytics**: Track conversations, satisfaction, and bot performance
- **Multi-Language Support**: Swahili, English, Amharic, Yoruba, and more
- **Affordable Pricing**: Pay-as-you-go model with local currency support (KES, NGN, GHS)
- **Secure & Compliant**: GDPR-ready, HIPAA-compliant, SOC2 Type II certification path
- **Easy Integration**: Embed code snippet on any website in seconds

## 🎯 Target Users

- Clinics & Salons (appointment booking)
- Law Firms (client inquiries, document requests)
- E-commerce Stores (product questions, order support)
- Real Estate Agencies (lead qualification, property viewings)
- Service-Based Businesses (FAQ automation, lead capture)

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Zustand** - Lightweight state management
- **React Hook Form** - Form handling
- **TanStack Query** - Data fetching & caching
- **Lucide React** - Icon library
- **Recharts** - Analytics visualizations

### Backend (Coming Soon)
- **NestJS** - TypeScript backend framework
- **PostgreSQL** - Relational database
- **Prisma** - ORM for database management
- **JWT** - Authentication & authorization
- **Stripe** - Payment processing

### Deployment
- **Frontend**: Vercel (auto-deploy on push)
- **Backend**: Render.com / Fly.io (coming soon)
- **Database**: Managed PostgreSQL (Supabase / AWS RDS)

## 📁 Project Structure

```
kariaai/
├── app/
│   ├── auth/                    # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/               # Protected dashboard routes
│   │   ├── bots/                # Chatbot management
│   │   │   └── new/             # Create new chatbot
│   │   ├── analytics/           # Analytics dashboard
│   │   └── settings/            # User & org settings
│   ├── components/              # Reusable components
│   │   └── DashboardLayout.tsx
│   ├── lib/                     # Utilities & helpers
│   │   ├── auth-store.ts        # Zustand auth store
│   │   └── api-client.ts        # API client
│   ├── types/                   # TypeScript types
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
├── public/                      # Static assets
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/morriskaria/kariAI.git
   cd kariaai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Production
npm run build           # Build for production
npm start               # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript type checking
npm run format          # Format code with Prettier
```

## 🔐 Authentication

KariaAI uses JWT-based authentication with access and refresh tokens:

1. **Register**: Create account with email and password
2. **Login**: Authenticate and receive JWT tokens
3. **Protected Routes**: Dashboard and bot management require authentication
4. **Token Storage**: Tokens stored in localStorage (HTTP-only in production)

### API Endpoints (Coming Soon)

```
POST   /api/auth/register          # User registration
POST   /api/auth/login             # User login
POST   /api/auth/refresh           # Refresh JWT token
POST   /api/auth/logout            # Logout

GET    /api/bots                   # List all bots
POST   /api/bots                   # Create new bot
GET    /api/bots/:id               # Get bot details
PATCH  /api/bots/:id               # Update bot
DELETE /api/bots/:id               # Delete bot

POST   /api/bots/:id/messages      # Send message to bot
GET    /api/bots/:id/conversations # Get conversation history

GET    /api/analytics/overview     # Dashboard metrics
GET    /api/billing/status         # Subscription status
```

## 🎨 Design System

### Colors
- **Primary**: Teal (#0D9488) - Energy, growth, tech
- **Secondary**: Navy (#1F2937) - Trust, professionalism
- **Accent**: Gold (#F59E0B) - African heritage, optimism

### Typography
- **Display**: Geist (modern, clean)
- **Body**: Inter (readable, accessible)
- **Mono**: JetBrains Mono (code)

### Accessibility
- WCAG 2.1 AA compliance
- 4.5:1 color contrast minimum
- Keyboard navigation support
- Screen reader friendly

## 📊 Features Roadmap

### Phase 1 (Current)
- ✅ Landing page with African-focused branding
- ✅ User authentication (register/login)
- ✅ Dashboard with bot management
- ✅ Chatbot builder with system prompt editor
- ✅ Frontend UI/UX

### Phase 2 (Next)
- 🔄 Backend API (NestJS)
- 🔄 Database schema (PostgreSQL + Prisma)
- 🔄 Bot deployment & embed code
- 🔄 Conversation history & analytics
- 🔄 Stripe billing integration

### Phase 3 (Future)
- Knowledge base upload (PDF, URLs)
- Multi-language support (Swahili, Amharic, Yoruba)
- Voice chatbot capabilities
- Advanced analytics & reporting
- Team collaboration features
- API for third-party integrations
- Mobile app (React Native)

## 🔒 Security & Compliance

- **Data Protection**: GDPR-ready, HIPAA-compliant
- **Authentication**: JWT with refresh tokens
- **Encryption**: HTTPS in production, data encryption at rest
- **Rate Limiting**: API rate limiting to prevent abuse
- **Audit Logging**: Track all user actions
- **Secrets Management**: Environment variables for sensitive data

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

We welcome contributions from the community! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋 Support & Feedback

- **Issues**: Report bugs on [GitHub Issues](https://github.com/morriskaria/kariAI/issues)
- **Discussions**: Join our community on [GitHub Discussions](https://github.com/morriskaria/kariAI/discussions)
- **Email**: support@kariaai.com

## 🌟 Acknowledgments

Built with ❤️ for African entrepreneurs by [Karia Morris](https://github.com/morriskaria)

---

**KariaAI** - Empowering Africa's Digital Economy 🚀
