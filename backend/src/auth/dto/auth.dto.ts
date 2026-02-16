import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
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

export class AuthResponseDto {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  token: string;
  refreshToken?: string;
}
