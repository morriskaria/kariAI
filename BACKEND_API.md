# KariaAI Backend API Documentation

## Overview

The KariaAI backend is a NestJS application that provides a complete REST API for managing AI chatbots, conversations, analytics, and billing.

**Base URL**: `http://localhost:3001/api`

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are obtained by registering or logging in.

---

## API Endpoints

### Authentication

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}

Response (201):
{
  "id": "user_id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

Response (200):
{
  "id": "user_id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Validate Token
```
POST /auth/validate
Content-Type: application/json
Authorization: Bearer <token>

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (200):
{
  "sub": "user_id",
  "email": "user@example.com",
  "iat": 1708077600,
  "exp": 1708081200
}
```

---

### Bot Management

#### Create Chatbot
```
POST /bots
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Customer Support Bot",
  "description": "Handles customer inquiries",
  "systemPrompt": "You are a helpful customer support assistant...",
  "model": "gpt-4-turbo",
  "temperature": 0.7,
  "tone": "professional"
}

Response (201):
{
  "id": "bot_id",
  "organizationId": "org_id",
  "name": "Customer Support Bot",
  "description": "Handles customer inquiries",
  "systemPrompt": "You are a helpful customer support assistant...",
  "model": "gpt-4-turbo",
  "temperature": 0.7,
  "status": "DRAFT",
  "tone": "professional",
  "createdAt": "2026-02-16T10:00:00Z",
  "updatedAt": "2026-02-16T10:00:00Z"
}
```

#### Get All Bots
```
GET /bots
Authorization: Bearer <token>

Response (200):
[
  {
    "id": "bot_id",
    "organizationId": "org_id",
    "name": "Customer Support Bot",
    "status": "ACTIVE",
    "createdAt": "2026-02-16T10:00:00Z",
    "updatedAt": "2026-02-16T10:00:00Z"
  }
]
```

#### Get Bot Details
```
GET /bots/:botId
Authorization: Bearer <token>

Response (200):
{
  "id": "bot_id",
  "organizationId": "org_id",
  "name": "Customer Support Bot",
  "description": "Handles customer inquiries",
  "systemPrompt": "You are a helpful customer support assistant...",
  "model": "gpt-4-turbo",
  "temperature": 0.7,
  "status": "ACTIVE",
  "tone": "professional",
  "createdAt": "2026-02-16T10:00:00Z",
  "updatedAt": "2026-02-16T10:00:00Z"
}
```

#### Update Bot
```
PATCH /bots/:botId
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Updated Bot Name",
  "systemPrompt": "Updated system prompt...",
  "status": "ACTIVE"
}

Response (200):
{
  "id": "bot_id",
  "name": "Updated Bot Name",
  "systemPrompt": "Updated system prompt...",
  "status": "ACTIVE",
  ...
}
```

#### Delete Bot
```
DELETE /bots/:botId
Authorization: Bearer <token>

Response (204): No Content
```

#### Get Embed Code
```
GET /bots/:botId/embed-code
Authorization: Bearer <token>

Response (200):
{
  "embedCode": "<script>...</script>"
}
```

---

### Conversations

#### Send Message
```
POST /bots/:botId/conversations/:conversationId/messages
Content-Type: application/json
Authorization: Bearer <token>

{
  "content": "Hello, I need help with my order",
  "userIdentifier": "user@example.com"
}

Response (201):
{
  "conversationId": "conv_id",
  "message": {
    "id": "msg_id",
    "conversationId": "conv_id",
    "role": "ASSISTANT",
    "content": "Thank you for contacting us...",
    "timestamp": "2026-02-16T10:00:00Z"
  }
}
```

#### Get Conversations
```
GET /bots/:botId/conversations?limit=50&offset=0
Authorization: Bearer <token>

Response (200):
[
  {
    "id": "conv_id",
    "botId": "bot_id",
    "userIdentifier": "user@example.com",
    "messages": [
      {
        "id": "msg_id",
        "role": "USER",
        "content": "Hello",
        "timestamp": "2026-02-16T10:00:00Z"
      }
    ],
    "satisfaction": 5,
    "createdAt": "2026-02-16T10:00:00Z",
    "updatedAt": "2026-02-16T10:00:00Z"
  }
]
```

#### Get Conversation Details
```
GET /bots/:botId/conversations/:conversationId
Authorization: Bearer <token>

Response (200):
{
  "id": "conv_id",
  "botId": "bot_id",
  "userIdentifier": "user@example.com",
  "messages": [...],
  "satisfaction": 5,
  "createdAt": "2026-02-16T10:00:00Z",
  "updatedAt": "2026-02-16T10:00:00Z"
}
```

#### Rate Conversation
```
POST /bots/:botId/conversations/:conversationId/rate
Content-Type: application/json
Authorization: Bearer <token>

{
  "satisfaction": 5
}

Response (200):
{
  "id": "conv_id",
  "satisfaction": 5,
  "message": "Thank you for your feedback!"
}
```

#### Get Conversation Stats
```
GET /bots/:botId/conversations/stats
Authorization: Bearer <token>

Response (200):
{
  "totalConversations": 42,
  "totalMessages": 156,
  "avgSatisfaction": 4.3,
  "ratedConversations": 28
}
```

---

### Analytics

#### Get Dashboard Overview
```
GET /analytics/overview
Authorization: Bearer <token>

Response (200):
{
  "totalBots": 5,
  "totalConversations": 128,
  "totalMessages": 512,
  "avgSatisfaction": 4.2,
  "ratedConversations": 85
}
```

#### Get Bot Analytics
```
GET /analytics/bots/:botId
Authorization: Bearer <token>

Response (200):
{
  "bot": {
    "id": "bot_id",
    "name": "Customer Support Bot",
    "status": "ACTIVE"
  },
  "metrics": {
    "totalConversations": 42,
    "totalMessages": 156,
    "uniqueUsers": 38,
    "avgSatisfaction": 4.3,
    "ratedConversations": 28
  },
  "dailyMetrics": [
    {
      "date": "2026-02-10",
      "conversations": 5,
      "messages": 18
    }
  ]
}
```

#### Get Conversation Analytics
```
GET /analytics/conversations
Authorization: Bearer <token>

Response (200):
{
  "totalConversations": 128,
  "satisfactionDistribution": {
    "5": 45,
    "4": 28,
    "3": 12,
    "2": 5,
    "1": 2
  },
  "avgMessagesPerConversation": 4.0,
  "ratedConversations": 92
}
```

---

### Billing

#### Get Subscription Status
```
GET /billing/status
Authorization: Bearer <token>

Response (200):
{
  "id": "sub_id",
  "plan": "STARTER",
  "status": "ACTIVE",
  "messagesUsed": 2500,
  "messagesLimit": 10000,
  "currentPeriodStart": "2026-02-01T00:00:00Z",
  "currentPeriodEnd": "2026-03-01T00:00:00Z",
  "stripeCustomerId": "cus_..."
}
```

#### Create Checkout Session
```
POST /billing/checkout
Content-Type: application/json
Authorization: Bearer <token>

{
  "plan": "growth"
}

Response (200):
{
  "sessionId": "cs_...",
  "url": "https://checkout.stripe.com/pay/cs_..."
}
```

#### Record Message Usage
```
POST /billing/usage/:botId
Content-Type: application/json
Authorization: Bearer <token>

{
  "tokens": 150
}

Response (200):
{
  "messagesUsed": 2650,
  "messagesLimit": 10000,
  "percentageUsed": 26.5
}
```

#### Webhook (Stripe Events)
```
POST /billing/webhook
Content-Type: application/json
X-Stripe-Signature: <signature>

Handles:
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_succeeded
```

---

## Error Responses

All errors follow this format:

```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "BadRequest"
}
```

### Common Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created
- `204 No Content` - Request successful, no content
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authentication**: 5 requests per minute
- **Bot Management**: 100 requests per minute
- **Conversations**: 500 requests per minute
- **Analytics**: 100 requests per minute
- **Billing**: 10 requests per minute

---

## Webhooks

### Stripe Webhook Events

KariaAI listens for the following Stripe events:

#### customer.subscription.created
Triggered when a customer creates a subscription.

#### customer.subscription.updated
Triggered when a subscription is updated.

#### customer.subscription.deleted
Triggered when a subscription is cancelled.

#### invoice.payment_succeeded
Triggered when an invoice payment succeeds.

**Webhook URL**: `POST /api/billing/webhook`

**Setup**: Configure in Stripe Dashboard → Webhooks

---

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/kariaai_db"

# JWT
JWT_SECRET="your_super_secret_jwt_key"
JWT_EXPIRATION=3600

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Frontend
FRONTEND_URL="http://localhost:3000"

# Server
PORT=3001
NODE_ENV=development
```

---

## Development

### Start Development Server
```bash
npm run start:dev
```

### Run Tests
```bash
npm run test
```

### Run E2E Tests
```bash
npm run test:e2e
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm run start:prod
```

---

## Database

### Run Migrations
```bash
npm run prisma:migrate
```

### Generate Prisma Client
```bash
npm run prisma:generate
```

### Open Prisma Studio
```bash
npm run prisma:studio
```

---

## Deployment

### Docker

Build and run with Docker:

```bash
docker build -t kariaai-backend .
docker run -p 3001:3001 --env-file .env kariaai-backend
```

### Environment Setup

For production deployment:

1. Set secure JWT_SECRET
2. Configure PostgreSQL on AWS RDS or Supabase
3. Set Stripe API keys
4. Configure CORS for your frontend domain
5. Enable HTTPS
6. Set up monitoring and logging

---

## Support

For API issues or questions:
- GitHub Issues: https://github.com/morriskaria/kariAI/issues
- Email: support@kariaai.com

---

**Last Updated**: February 2026
**API Version**: 1.0.0
