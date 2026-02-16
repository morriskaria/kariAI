# KariaAI Testing Guide

This guide covers unit testing, integration testing, and end-to-end (E2E) testing for KariaAI.

## Table of Contents

1. [Testing Setup](#testing-setup)
2. [Unit Tests](#unit-tests)
3. [Integration Tests](#integration-tests)
4. [E2E Tests](#e2e-tests)
5. [Test Coverage](#test-coverage)
6. [CI/CD Integration](#cicd-integration)

---

## Testing Setup

### Backend Testing

Install testing dependencies:

```bash
cd backend
npm install --save-dev jest @types/jest ts-jest @nestjs/testing
```

### Frontend Testing

Install testing dependencies:

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```

---

## Unit Tests

### Backend Unit Tests

#### Example: Auth Service Test

Create `backend/src/auth/auth.service.spec.ts`:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
            organization: {
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'SecurePassword123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue({
        id: 'user_id',
        email: registerDto.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        password: hashedPassword,
      });

      jest.spyOn(jwtService, 'sign').mockReturnValue('token');

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('token');
      expect(result.email).toBe(registerDto.email);
    });

    it('should throw error if user already exists', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'SecurePassword123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
        id: 'user_id',
        email: registerDto.email,
      });

      await expect(service.register(registerDto)).rejects.toThrow('User already exists');
    });
  });

  describe('login', () => {
    it('should login a user with correct credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'SecurePassword123!',
      };

      const hashedPassword = await bcrypt.hash(loginDto.password, 10);

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
        id: 'user_id',
        email: loginDto.email,
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
      });

      jest.spyOn(jwtService, 'sign').mockReturnValue('token');

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('token');
      expect(result.email).toBe(loginDto.email);
    });

    it('should throw error with incorrect password', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'WrongPassword',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
        id: 'user_id',
        email: loginDto.email,
        password: await bcrypt.hash('CorrectPassword', 10),
      });

      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
  });
});
```

#### Example: Bot Service Test

Create `backend/src/bots/bots.service.spec.ts`:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { BotsService } from './bots.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BotsService', () => {
  let service: BotsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BotsService,
        {
          provide: PrismaService,
          useValue: {
            bot: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            organization: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<BotsService>(BotsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createBot', () => {
    it('should create a new bot', async () => {
      const userId = 'user_id';
      const createBotDto = {
        name: 'Support Bot',
        description: 'Customer support chatbot',
        systemPrompt: 'You are a helpful assistant',
        model: 'gpt-4-turbo',
        temperature: 0.7,
      };

      jest.spyOn(prismaService.organization, 'findUnique').mockResolvedValue({
        id: 'org_id',
        ownerId: userId,
      });

      jest.spyOn(prismaService.bot, 'create').mockResolvedValue({
        id: 'bot_id',
        organizationId: 'org_id',
        ...createBotDto,
        status: 'DRAFT',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.createBot(userId, createBotDto);

      expect(result.name).toBe(createBotDto.name);
      expect(result.model).toBe(createBotDto.model);
    });
  });

  describe('getBots', () => {
    it('should return all bots for a user', async () => {
      const userId = 'user_id';

      jest.spyOn(prismaService.organization, 'findUnique').mockResolvedValue({
        id: 'org_id',
        ownerId: userId,
      });

      jest.spyOn(prismaService.bot, 'findMany').mockResolvedValue([
        {
          id: 'bot_1',
          name: 'Bot 1',
          organizationId: 'org_id',
          deletedAt: null,
        },
        {
          id: 'bot_2',
          name: 'Bot 2',
          organizationId: 'org_id',
          deletedAt: null,
        },
      ]);

      const result = await service.getBots(userId);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Bot 1');
    });
  });
});
```

### Frontend Unit Tests

Create `components/Button.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByText('Click me');
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

---

## Integration Tests

### Backend Integration Tests

Create `backend/test/auth.integration.spec.ts`:

```typescript
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth Integration Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'SecurePassword123!',
          firstName: 'John',
          lastName: 'Doe',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('token');
          expect(res.body.email).toBe('test@example.com');
        });
    });

    it('should reject invalid email', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'SecurePassword123!',
          firstName: 'John',
          lastName: 'Doe',
        })
        .expect(400);
    });

    it('should reject weak password', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: '123',
          firstName: 'John',
          lastName: 'Doe',
        })
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    it('should login with correct credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'SecurePassword123!',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('token');
        });
    });

    it('should reject invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword',
        })
        .expect(401);
    });
  });
});
```

---

## E2E Tests

### Backend E2E Tests

Create `backend/test/e2e/bot-flow.e2e-spec.ts`:

```typescript
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Bot E2E Flow', () => {
  let app: INestApplication;
  let authToken: string;
  let botId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should complete full bot workflow', async () => {
    // 1. Register user
    const registerRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'e2e@example.com',
        password: 'SecurePassword123!',
        firstName: 'E2E',
        lastName: 'Test',
      })
      .expect(201);

    authToken = registerRes.body.token;

    // 2. Create bot
    const createBotRes = await request(app.getHttpServer())
      .post('/bots')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'E2E Test Bot',
        description: 'Bot for E2E testing',
        systemPrompt: 'You are a helpful assistant',
        model: 'gpt-4-turbo',
        temperature: 0.7,
      })
      .expect(201);

    botId = createBotRes.body.id;

    // 3. Get bot details
    await request(app.getHttpServer())
      .get(`/bots/${botId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toBe('E2E Test Bot');
      });

    // 4. Update bot
    await request(app.getHttpServer())
      .patch(`/bots/${botId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        status: 'ACTIVE',
      })
      .expect(200);

    // 5. Get embed code
    await request(app.getHttpServer())
      .get(`/bots/${botId}/embed-code`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.embedCode).toContain('<script>');
      });

    // 6. Get all bots
    await request(app.getHttpServer())
      .get('/bots')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBeGreaterThan(0);
      });

    // 7. Delete bot
    await request(app.getHttpServer())
      .delete(`/bots/${botId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(204);
  });
});
```

### Frontend E2E Tests

Create `e2e/auth-flow.spec.ts` (using Playwright):

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should register and login', async ({ page }) => {
    // Navigate to app
    await page.goto('http://localhost:3000');

    // Click register button
    await page.click('text=Register');

    // Fill registration form
    await page.fill('input[name="email"]', 'e2e@example.com');
    await page.fill('input[name="password"]', 'SecurePassword123!');
    await page.fill('input[name="firstName"]', 'E2E');
    await page.fill('input[name="lastName"]', 'Test');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('http://localhost:3000/dashboard');

    // Should see dashboard content
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should login with existing credentials', async ({ page }) => {
    // Navigate to login
    await page.goto('http://localhost:3000/auth/login');

    // Fill login form
    await page.fill('input[name="email"]', 'e2e@example.com');
    await page.fill('input[name="password"]', 'SecurePassword123!');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
  });
});
```

---

## Test Coverage

### Generate Coverage Report

Backend:

```bash
cd backend
npm run test -- --coverage
```

Frontend:

```bash
npm run test -- --coverage
```

### Coverage Targets

- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

---

## CI/CD Integration

Tests run automatically on:

1. **Pull Requests**: All tests must pass before merge
2. **Commits to main**: Tests run before deployment
3. **Scheduled**: Daily test runs at 2 AM UTC

View test results in GitHub Actions tab.

---

## Running Tests Locally

### Backend

```bash
# Run all tests
cd backend
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run specific test file
npm run test -- auth.service.spec.ts

# Generate coverage
npm run test -- --coverage
```

### Frontend

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run specific test file
npm run test -- components/Button.test.tsx

# Generate coverage
npm run test -- --coverage
```

---

## Best Practices

1. **Write tests as you code** - Don't leave testing for later
2. **Test behavior, not implementation** - Focus on what the code does
3. **Use descriptive test names** - Make it clear what's being tested
4. **Keep tests isolated** - Each test should be independent
5. **Mock external dependencies** - Don't call real APIs in tests
6. **Test edge cases** - Invalid inputs, errors, boundary conditions
7. **Maintain test data** - Use factories or fixtures for consistency

---

**Last Updated**: February 2026
