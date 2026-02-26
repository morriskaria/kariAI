import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  /**
   * Register a new user
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const verificationTokenExpires = new Date();
    verificationTokenExpires.setHours(verificationTokenExpires.getHours() + 24);

    // Create user
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

    // Create organization for user
    const organization = await this.prisma.organization.create({
      data: {
        name: `${firstName || 'My'} Organization`,
        ownerId: user.id,
      },
    });

    // Create subscription record
    await this.prisma.subscription.create({
      data: {
        organizationId: organization.id,
        plan: 'FREE',
        status: 'ACTIVE',
        messagesLimit: 1000,
      },
    });

    // Send verification email
    try {
      await this.emailService.sendVerificationEmail(
        user.email,
        user.firstName || 'there',
        verificationToken,
      );
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Continue even if email fails
    }

    // Generate JWT token
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

  /**
   * Login user
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token
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

  /**
   * Refresh access token
   */
  async refreshToken(token: string) {
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
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Validate token
   */
  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return {
        valid: true,
        userId: payload.sub,
        email: payload.email,
      };
    } catch (error) {
      return {
        valid: false,
      };
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
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
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  /**
   * Logout user
   */
  async logout(userId: string) {
    // In a real implementation, you might invalidate tokens here
    // For now, logout is handled on the client side
    return {
      message: 'Logged out successfully',
    };
  }

  /**
   * Change password
   */
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);

    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword },
    });

    return {
      message: 'Password changed successfully',
    };
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists for security
      return {
        message: 'If email exists, password reset link will be sent',
      };
    }

    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const resetTokenExpires = new Date();
    resetTokenExpires.setHours(resetTokenExpires.getHours() + 1);

    // Store reset token (in a real app, use a separate table)
    // For now, we'll use a simple approach
    const passwordResetData = {
      userId: user.id,
      token: resetToken,
      expiresAt: resetTokenExpires,
    };

    // TODO: Store in database (PasswordReset table)
    // await this.prisma.passwordReset.create({ data: passwordResetData });

    // Send password reset email
    try {
      const resetUrl = `${this.configService.get('FRONTEND_URL')}/auth/reset-password?token=${resetToken}`;
      // await this.emailService.sendPasswordResetEmail(
      //   user.email,
      //   user.firstName || 'there',
      //   resetToken,
      // );
      console.log(`Password reset link: ${resetUrl}`);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
    }

    return {
      message: 'If email exists, password reset link will be sent',
    };
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string) {
    // TODO: Verify token from PasswordReset table
    // const resetToken = await this.prisma.passwordReset.findFirst({
    //   where: {
    //     token,
    //     expiresAt: { gt: new Date() },
    //   },
    // });

    // if (!resetToken) {
    //   throw new UnauthorizedException('Invalid or expired reset token');
    // }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // TODO: Update user password and delete reset token
    // await this.prisma.user.update({
    //   where: { id: resetToken.userId },
    //   data: { passwordHash: hashedPassword },
    // });

    // await this.prisma.passwordReset.delete({
    //   where: { id: resetToken.id },
    // });

    return {
      message: 'Password reset successfully',
    };
  }
}
