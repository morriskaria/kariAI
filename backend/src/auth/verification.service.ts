import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class VerificationService {
    constructor(
        private prisma: PrismaService,
        private emailService: EmailService,
    ) { }

    async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
        if (!token) {
            throw new BadRequestException('Verification token is required');
        }

        const user = await this.prisma.user.findFirst({
            where: {
                verificationToken: token,
                verificationTokenExpires: {
                    gte: new Date(), // Token must not be expired
                },
            },
        });

        if (!user) {
            throw new BadRequestException('Invalid or expired verification token');
        }

        if (user.emailVerified) {
            return {
                success: true,
                message: 'Email already verified',
            };
        }

        // Update user to mark email as verified
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                verificationToken: null,
                verificationTokenExpires: null,
            },
        });

        // Send welcome email
        await this.emailService.sendWelcomeEmail(
            user.email,
            user.firstName || 'there',
        );

        return {
            success: true,
            message: 'Email verified successfully',
        };
    }

    async resendVerification(email: string): Promise<{ success: boolean; message: string }> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.emailVerified) {
            return {
                success: false,
                message: 'Email already verified',
            };
        }

        // Generate new verification token
        const crypto = require('crypto');
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpires = new Date();
        verificationTokenExpires.setHours(verificationTokenExpires.getHours() + 24);

        // Update user with new token
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                verificationToken,
                verificationTokenExpires,
            },
        });

        // Send verification email
        await this.emailService.sendVerificationEmail(
            user.email,
            user.firstName || 'there',
            verificationToken,
        );

        return {
            success: true,
            message: 'Verification email sent',
        };
    }
}
