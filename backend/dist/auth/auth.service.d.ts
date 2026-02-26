import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private emailService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, emailService: EmailService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    refreshToken(token: string): Promise<{
        accessToken: string;
        expiresIn: number;
    }>;
    validateToken(token: string): Promise<{
        valid: boolean;
        userId: any;
        email: any;
    } | {
        valid: boolean;
        userId?: undefined;
        email?: undefined;
    }>;
    getUserById(userId: string): Promise<{
        email: string;
        firstName: string | null;
        lastName: string | null;
        id: string;
        passwordHash: string;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    changePassword(userId: string, oldPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    requestPasswordReset(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}
