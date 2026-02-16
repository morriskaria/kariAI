# KariaAI Deployment Guide

This guide covers deploying KariaAI to production with a focus on African-friendly infrastructure and cost optimization.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Monitoring & Logging](#monitoring--logging)
7. [Scaling & Performance](#scaling--performance)
8. [Security Checklist](#security-checklist)

---

## Prerequisites

- GitHub account with repository access
- Stripe account (for payments)
- API keys for AI models (OpenAI, Claude, Gemini)
- Domain name (optional but recommended)
- Credit card for cloud services

---

## Database Setup

### Option 1: Supabase (Recommended for Africa)

Supabase is a PostgreSQL-based backend with excellent African region support.

**Steps:**

1. Go to [supabase.com](https://supabase.com)
2. Sign up and create a new project
3. Choose a region close to your users (Africa: South Africa, Egypt)
4. Get your connection string from `Settings > Database > Connection String`
5. Copy the connection string to your `.env` file:

```env
DATABASE_URL="postgresql://user:password@db.supabase.co:5432/postgres"
```

6. Run migrations:

```bash
cd backend
npm run prisma:migrate
```

### Option 2: AWS RDS

For larger deployments with more control.

1. Go to AWS Console > RDS
2. Create a new PostgreSQL database
3. Choose `db.t3.micro` for cost optimization
4. Enable "Public accessibility"
5. Get the endpoint and configure `.env`:

```env
DATABASE_URL="postgresql://admin:password@kariaai-db.xxxxx.rds.amazonaws.com:5432/kariaai"
```

### Option 3: Railway.app

Simple one-click PostgreSQL deployment.

1. Go to [railway.app](https://railway.app)
2. Create new project > Add PostgreSQL
3. Railway automatically provides `DATABASE_URL` in environment

---

## Backend Deployment

### Option 1: Render.com (Recommended)

Render is Africa-friendly with good performance.

**Steps:**

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Create new Web Service
4. Connect your GitHub repository
5. Configure build and start commands:

```
Build Command: npm run build
Start Command: npm run start:prod
```

6. Add environment variables:

```
DATABASE_URL=your_supabase_url
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_claude_key
GOOGLE_API_KEY=your_gemini_key
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
FRONTEND_URL=https://your-frontend-domain.com
NODE_ENV=production
```

7. Deploy! Render will automatically deploy on every push to main

**Cost**: ~$7/month for starter tier

### Option 2: Railway.app

Another excellent option with good African performance.

1. Go to [railway.app](https://railway.app)
2. Create new project > Deploy from GitHub
3. Select your repository
4. Add environment variables
5. Deploy

**Cost**: ~$5/month for starter tier

### Option 3: Fly.io

Global deployment with edge computing.

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Create app: `fly launch` (in your backend directory)
4. Set secrets:

```bash
fly secrets set DATABASE_URL=your_url
fly secrets set JWT_SECRET=your_secret
# ... add other secrets
```

5. Deploy: `fly deploy`

**Cost**: ~$3/month for starter tier

---

## Frontend Deployment

### Vercel (Already Configured)

Your frontend is already deployed on Vercel. To update:

1. Push to GitHub main branch
2. Vercel automatically deploys
3. Update environment variables in Vercel dashboard:

```
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

### Alternative: Netlify

1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add environment variables
6. Deploy

---

## Environment Configuration

### Backend .env File

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/kariaai"

# JWT
JWT_SECRET="your-super-secret-key-min-32-chars"
JWT_EXPIRATION=3600

# OpenAI
OPENAI_API_KEY="sk-..."

# Anthropic Claude
ANTHROPIC_API_KEY="sk-ant-..."

# Google Gemini
GOOGLE_API_KEY="AIzaSy..."

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Frontend
FRONTEND_URL="https://kariaai.com"

# Server
PORT=3001
NODE_ENV=production

# Optional: Monitoring
SENTRY_DSN="https://..."
```

### Frontend .env.local

```env
NEXT_PUBLIC_API_URL=https://api.kariaai.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## Monitoring & Logging

### Option 1: Sentry (Error Tracking)

1. Go to [sentry.io](https://sentry.io)
2. Create new project (Node.js)
3. Get your DSN
4. Add to backend `.env`:

```env
SENTRY_DSN="https://xxx@xxx.ingest.sentry.io/xxx"
```

5. Install Sentry in backend:

```bash
npm install @sentry/node
```

6. Initialize in `main.ts`:

```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Option 2: LogRocket (Frontend Monitoring)

1. Go to [logrocket.com](https://logrocket.com)
2. Create new project
3. Add to frontend:

```bash
npm install logrocket
```

4. Initialize in your app

### Option 3: Datadog (Full Stack)

For comprehensive monitoring across frontend and backend.

1. Go to [datadoghq.com](https://datadoghq.com)
2. Create account
3. Follow integration guides for Node.js and React

---

## Scaling & Performance

### Database Optimization

1. **Enable connection pooling** (Supabase):
   - Use PgBouncer for connection pooling
   - Set pool size to 20-30

2. **Add indexes** to frequently queried fields:

```sql
CREATE INDEX idx_bot_organization ON bot(organization_id);
CREATE INDEX idx_conversation_bot ON conversation(bot_id);
CREATE INDEX idx_message_conversation ON message(conversation_id);
```

3. **Archive old conversations** (after 90 days):

```sql
DELETE FROM message WHERE conversation_id IN (
  SELECT id FROM conversation WHERE created_at < NOW() - INTERVAL '90 days'
);
DELETE FROM conversation WHERE created_at < NOW() - INTERVAL '90 days';
```

### Backend Optimization

1. **Enable caching** (Redis):

```bash
npm install redis @nestjs/cache-manager
```

2. **Implement rate limiting**:

```bash
npm install @nestjs/throttler
```

3. **Use CDN for static assets** (Cloudflare):
   - Add your domain to Cloudflare
   - Enable caching for `/api` routes

### Frontend Optimization

1. **Enable image optimization** (Next.js automatic)
2. **Use dynamic imports** for large components
3. **Enable ISR** (Incremental Static Regeneration)

---

## Security Checklist

### Backend Security

- [ ] Enable HTTPS only
- [ ] Set secure JWT secret (min 32 characters)
- [ ] Enable CORS only for your frontend domain
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting on auth endpoints
- [ ] Implement request validation
- [ ] Use CSRF protection
- [ ] Enable SQL injection prevention (Prisma does this)
- [ ] Set secure password requirements
- [ ] Enable 2FA for admin accounts

### Database Security

- [ ] Enable SSL connections
- [ ] Use strong database passwords
- [ ] Enable automated backups
- [ ] Restrict database access by IP
- [ ] Enable encryption at rest
- [ ] Regular security updates

### Frontend Security

- [ ] Enable HTTPS only
- [ ] Set Content Security Policy headers
- [ ] Sanitize user input
- [ ] Use HTTPS for all API calls
- [ ] Enable secure cookies (HttpOnly, Secure, SameSite)
- [ ] Regular dependency updates

### API Security

- [ ] Implement API key rotation
- [ ] Use OAuth 2.0 for third-party access
- [ ] Enable webhook signature verification
- [ ] Implement request signing for sensitive operations
- [ ] Use API versioning

---

## Deployment Checklist

Before going live:

- [ ] Database backups configured
- [ ] Environment variables set correctly
- [ ] SSL certificate installed
- [ ] Domain DNS configured
- [ ] Email notifications working
- [ ] Monitoring and logging enabled
- [ ] Error tracking configured
- [ ] Performance metrics baseline established
- [ ] Security scan completed
- [ ] Load testing done
- [ ] Rollback plan documented
- [ ] Support team trained

---

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
npm run prisma:db push

# Check logs
npm run prisma:migrate status
```

### Backend Won't Start

```bash
# Check logs
npm run build
npm run start:dev

# Verify environment variables
echo $DATABASE_URL
```

### Frontend Not Connecting to Backend

```bash
# Check API URL
console.log(process.env.NEXT_PUBLIC_API_URL)

# Test API endpoint
curl https://your-api-domain.com/api/health
```

---

## Cost Estimation (Monthly)

| Service | Tier | Cost |
|---------|------|------|
| Database (Supabase) | Starter | $25 |
| Backend (Render) | Starter | $7 |
| Frontend (Vercel) | Pro | $20 |
| Stripe | Pay-as-you-go | 2.9% + $0.30 |
| Monitoring (Sentry) | Starter | $29 |
| **Total** | | **~$81** |

---

## Support

For deployment issues:
- GitHub Issues: https://github.com/morriskaria/kariAI/issues
- Email: support@kariaai.com

---

**Last Updated**: February 2026
