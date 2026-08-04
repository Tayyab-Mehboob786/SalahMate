import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from '../mail/mail.service';
import { OtpService } from './otp.service';
import { PrismaService } from '../prisma/prisma.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import * as bcrypt from 'bcrypt';
import {
  SALT_ROUNDS,
  ACCESS_TOKEN_DEFAULT_EXPIRATION,
  REFRESH_TOKEN_DEFAULT_EXPIRATION,
} from './auth.constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
    private otpService: OtpService,
    private prisma: PrismaService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);

    const user = await this.usersService.create({
      email: registerDto.email,
      password: hashedPassword,
      fullName: registerDto.fullName,
    });

    const otp = this.otpService.generateOtp();
    const otpHash = await this.otpService.hashOtp(otp);

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    await this.prisma.emailVerification.create({
      data: {
        userId: user.id,
        otpHash,
        expiresAt,
        type: 'EMAIL_VERIFICATION',
      },
    });

    await this.mailService.sendVerificationOtp(user.email, user.fullName, otp);

    return {
      success: true,
      message: 'Registration successful. Please verify your email.',
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new ForbiddenException(
        'Account is locked due to too many failed login attempts. Please try again later.',
      );
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      const updatedUser = await this.usersService.incrementFailedAttempts(
        user.id,
      );
      if (updatedUser.failedLoginAttempts >= 5) {
        await this.usersService.lockAccount(user.id, 15 * 60 * 1000); // 15 minutes
      }
      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset on successful login
    if (user.failedLoginAttempts > 0 || user.lockedUntil) {
      await this.usersService.resetLockout(user.id);
    }

    if (!user.isEmailVerified) {
      throw new ForbiddenException(
        'Please verify your email before logging in.',
      );
    }

    return this.generateTokens(user.id, user.email);
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const user = await this.usersService.findByEmail(verifyEmailDto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const verificationRecord = await this.prisma.emailVerification.findFirst({
      where: {
        userId: user.id,
        verified: false,
        type: 'EMAIL_VERIFICATION',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!verificationRecord) {
      throw new BadRequestException('No pending verification found');
    }

    if (new Date() > verificationRecord.expiresAt) {
      throw new BadRequestException('OTP expired');
    }

    const isValid = await bcrypt.compare(
      verifyEmailDto.otp,
      verificationRecord.otpHash,
    );
    if (!isValid) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.usersService.markEmailVerified(user.id);

    // Invalidate all pending OTPs for this user
    await this.prisma.emailVerification.updateMany({
      where: {
        userId: user.id,
        verified: false,
        type: 'EMAIL_VERIFICATION',
      },
      data: {
        verified: true,
      },
    });

    return {
      success: true,
      message: 'Email verified successfully. Please login to continue.',
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);

    // Always return success regardless of if user exists
    if (!user) {
      return {
        success: true,
        message:
          'If an account with this email exists, a password reset code has been sent.',
      };
    }

    await this.checkOtpCooldown(user.id);

    const otp = this.otpService.generateOtp();
    const otpHash = await this.otpService.hashOtp(otp);

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    await this.prisma.emailVerification.create({
      data: {
        userId: user.id,
        type: 'PASSWORD_RESET',
        otpHash,
        expiresAt,
      },
    });

    await this.mailService.sendPasswordResetOtp(user.email, user.fullName, otp);

    return {
      success: true,
      message:
        'If an account with this email exists, a password reset code has been sent.',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.findByEmail(resetPasswordDto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const verificationRecord = await this.prisma.emailVerification.findFirst({
      where: {
        userId: user.id,
        verified: false,
        type: 'PASSWORD_RESET',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!verificationRecord) {
      throw new BadRequestException('No pending password reset found');
    }

    if (new Date() > verificationRecord.expiresAt) {
      throw new BadRequestException('OTP expired');
    }

    const isValid = await bcrypt.compare(
      resetPasswordDto.otp,
      verificationRecord.otpHash,
    );
    if (!isValid) {
      throw new BadRequestException('Invalid OTP');
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(
      resetPasswordDto.newPassword,
      salt,
    );

    await this.usersService.updatePassword(user.id, hashedPassword);

    await this.prisma.emailVerification.updateMany({
      where: {
        userId: user.id,
        verified: false,
        type: 'PASSWORD_RESET',
      },
      data: {
        verified: true,
      },
    });

    return {
      success: true,
      message: 'Password has been reset successfully.',
    };
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findByIdSafe(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      // 1. Verify refresh JWT.
      const payload = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        },
      );

      // 2. Find user.
      const user = await this.usersService.findById(payload.sub);
      if (!user || !user.hashedRefreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // 3. Compare incoming refresh token with stored bcrypt hash.
      const isRefreshTokenValid = await bcrypt.compare(
        refreshTokenDto.refreshToken,
        user.hashedRefreshToken,
      );

      // 4. If invalid -> Unauthorized.
      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // 5,6,7,8,9. Generate NEW tokens (which also hashes and saves the new refresh token).
      return this.generateTokens(user.id, user.email);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.usersService.updateHashedRefreshToken(userId, null);

    return {
      success: true,
      message: 'Logged out successfully.',
    };
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { email, sub: userId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: (this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN') ||
          ACCESS_TOKEN_DEFAULT_EXPIRATION) as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: (this.configService.get<string>(
          'REFRESH_TOKEN_EXPIRES_IN',
        ) || REFRESH_TOKEN_DEFAULT_EXPIRATION) as any,
      }),
    ]);

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    await this.usersService.updateHashedRefreshToken(
      userId,
      hashedRefreshToken,
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: userId,
        email,
      },
    };
  }

  private async checkOtpCooldown(userId: string) {
    const lastOtp = await this.prisma.emailVerification.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (lastOtp) {
      const timeDiff = Date.now() - lastOtp.createdAt.getTime();
      if (timeDiff < 60000) {
        // 60 seconds
        throw new HttpException(
          'Please wait 60 seconds before requesting another code.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }
  }

  async resendOtp(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Don't leak user existence
      return {
        success: true,
        message:
          'If an account with this email exists, a new verification code has been sent.',
      };
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified.');
    }

    await this.checkOtpCooldown(user.id);

    const otp = this.otpService.generateOtp();
    const otpHash = await this.otpService.hashOtp(otp);

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    await this.prisma.emailVerification.create({
      data: {
        userId: user.id,
        otpHash,
        expiresAt,
        type: 'EMAIL_VERIFICATION',
      },
    });

    await this.mailService.sendVerificationOtp(user.email, user.fullName, otp);

    return {
      success: true,
      message:
        'If an account with this email exists, a new verification code has been sent.',
    };
  }
}
