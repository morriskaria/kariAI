import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
export declare class VerificationService {
    private prisma;
    private emailService;
    constructor(prisma: PrismaService, emailService: EmailService);
    verifyEmail(token: string): Promise<{
        success: boolean;
        message: string;
    }>;
    resendVerification(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
