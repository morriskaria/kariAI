import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}

export class ChangePasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  newPassword: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  newPassword: string;
}

export class AuthResponseDto {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  token: string;
  refreshToken?: string;
}

export class UserResponseDto {
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

export class TokenResponseDto {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

export class ValidateTokenResponseDto {
  valid: boolean;
  userId?: string;
  email?: string;
}
