import { AuthService } from './auth.service';
import { VerificationService } from './verification.service';
import { RegisterDto, LoginDto, AuthResponseDto, RefreshTokenDto, ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    private verificationService;
    constructor(authService: AuthService, verificationService: VerificationService);
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
        expiresIn: number;
    }>;
    getCurrentUser(req: any): Promise<{
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
    logout(req: any): Promise<{
        message: string;
    }>;
    verifyEmail(token: string): Promise<{
        success: boolean;
        message: string;
    }>;
    resendVerification(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    changePassword(req: any, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    validate(token: string): Promise<{
        valid: boolean;
        userId: any;
        email: any;
    } | {
        valid: boolean;
        userId?: undefined;
        email?: undefined;
    }>;
}
