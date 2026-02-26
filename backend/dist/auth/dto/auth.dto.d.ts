export declare class RegisterDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
export declare class ChangePasswordDto {
    oldPassword: string;
    newPassword: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    token: string;
    newPassword: string;
}
export declare class AuthResponseDto {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    token: string;
    refreshToken?: string;
}
export declare class UserResponseDto {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    company?: string;
    avatarUrl?: string;
    role: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class TokenResponseDto {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
}
export declare class ValidateTokenResponseDto {
    valid: boolean;
    userId?: string;
    email?: string;
}
