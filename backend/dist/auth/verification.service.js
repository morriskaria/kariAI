"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
let VerificationService = class VerificationService {
    prisma;
    emailService;
    constructor(prisma, emailService) {
        this.prisma = prisma;
        this.emailService = emailService;
    }
    async verifyEmail(token) {
        if (!token) {
            throw new common_1.BadRequestException('Verification token is required');
        }
        const user = await this.prisma.user.findFirst({
            where: {
                verificationToken: token,
                verificationTokenExpires: {
                    gte: new Date(),
                },
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('Invalid or expired verification token');
        }
        if (user.emailVerified) {
            return {
                success: true,
                message: 'Email already verified',
            };
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                verificationToken: null,
                verificationTokenExpires: null,
            },
        });
        await this.emailService.sendWelcomeEmail(user.email, user.firstName || 'there');
        return {
            success: true,
            message: 'Email verified successfully',
        };
    }
    async resendVerification(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.emailVerified) {
            return {
                success: false,
                message: 'Email already verified',
            };
        }
        const crypto = require('crypto');
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpires = new Date();
        verificationTokenExpires.setHours(verificationTokenExpires.getHours() + 24);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                verificationToken,
                verificationTokenExpires,
            },
        });
        await this.emailService.sendVerificationEmail(user.email, user.firstName || 'there', verificationToken);
        return {
            success: true,
            message: 'Verification email sent',
        };
    }
};
exports.VerificationService = VerificationService;
exports.VerificationService = VerificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService])
], VerificationService);
//# sourceMappingURL=verification.service.js.map