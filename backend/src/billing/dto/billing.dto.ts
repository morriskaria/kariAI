import { IsString, IsEmail } from 'class-validator';

export class CreateCheckoutSessionDto {
  @IsString()
  plan: string; // 'starter', 'growth', 'enterprise'
}

export class SubscriptionStatusDto {
  id: string;
  plan: string;
  status: string;
  messagesUsed: number;
  messagesLimit: number;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  stripeCustomerId?: string;
}

export class WebhookEventDto {
  id: string;
  type: string;
  data: Record<string, any>;
}
