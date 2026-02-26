import { ConfigService } from '@nestjs/config';
export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    from?: string;
}
export declare class EmailService {
    private configService;
    private readonly logger;
    private resend;
    private emailFrom;
    constructor(configService: ConfigService);
    sendEmail(options: EmailOptions): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    sendVerificationEmail(email: string, firstName: string, verificationToken: string): Promise<void>;
    sendWelcomeEmail(email: string, firstName: string): Promise<void>;
}
