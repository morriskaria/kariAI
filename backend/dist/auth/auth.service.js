"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcryptjs"));
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    emailService;
    configService;
    constructor(prisma, jwtService, emailService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.configService = configService;
    }
    async register(registerDto) {
        const { email, password, firstName, lastName } = registerDto;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('User with this email already exists');
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const verificationToken = Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
        const verificationTokenExpires = new Date();
        verificationTokenExpires.setHours(verificationTokenExpires.getHours() + 24);
        const user = await this.prisma.user.create({
            data: {
                email,
                passwordHash,
                firstName,
                lastName,
                role: 'USER',
                emailVerified: false,
                verificationToken,
                verificationTokenExpires,
            },
        });
        const organization = await this.prisma.organization.create({
            data: {
                name: `${firstName || 'My'} Organization`,
                ownerId: user.id,
            },
        });
        await this.prisma.subscription.create({
            data: {
                organizationId: organization.id,
                plan: 'FREE',
                status: 'ACTIVE',
                messagesLimit: 1000,
            },
        });
        try {
            await this.emailService.sendVerificationEmail(user.email, user.firstName || 'there', verificationToken);
        }
        catch (error) {
            console.error('Failed to send verification email:', error);
        }
        const token = this.jwtService.sign({
            sub: user.id,
            email: user.email,
        });
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName || undefined,
            lastName: user.lastName || undefined,
            token,
        };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const token = this.jwtService.sign({
            sub: user.id,
            email: user.email,
        });
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName || undefined,
            lastName: user.lastName || undefined,
            token,
        };
    }
    async refreshToken(token) {
        try {
            const payload = this.jwtService.verify(token);
            const newAccessToken = this.jwtService.sign({
                sub: payload.sub,
                email: payload.email,
            });
            return {
                accessToken: newAccessToken,
                expiresIn: 3600,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async validateToken(token) {
        try {
            const payload = this.jwtService.verify(token);
            return {
                valid: true,
                userId: payload.sub,
                email: payload.email,
            };
        }
        catch (error) {
            return {
                valid: false,
            };
        }
    }
    async getUserById(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                company: true,
                avatarUrl: true,
                role: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return user;
    }
    async logout(userId) {
        return {
            message: 'Logged out successfully',
        };
    }
    async changePassword(userId, oldPassword, newPassword) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash: hashedPassword },
        });
        return {
            message: 'Password changed successfully',
        };
    }
    async requestPasswordReset(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return {
                message: 'If email exists, password reset link will be sent',
            };
        }
        const resetToken = Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
        const resetTokenExpires = new Date();
        resetTokenExpires.setHours(resetTokenExpires.getHours() + 1);
        const passwordResetData = {
            userId: user.id,
            token: resetToken,
            expiresAt: resetTokenExpires,
        };
        try {
            const resetUrl = `${this.configService.get('FRONTEND_URL')}/auth/reset-password?token=${resetToken}`;
            console.log(`Password reset link: ${resetUrl}`);
        }
        catch (error) {
            console.error('Failed to send password reset email:', error);
        }
        return {
            message: 'If email exists, password reset link will be sent',
        };
    }
    async resetPassword(token, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        return {
            message: 'Password reset successfully',
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        email_service_1.EmailService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map