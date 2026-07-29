import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
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

    return this.generateTokens(user.id, user.email);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id, user.email);
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
      const payload = await this.jwtService.verifyAsync(refreshTokenDto.refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const newPayload = { email: payload.email, sub: payload.sub };

      const accessToken = await this.jwtService.signAsync(newPayload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: (this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN') || ACCESS_TOKEN_DEFAULT_EXPIRATION) as any,
      });

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    // TODO: Future Implementation Phase (Refresh Token Revocation)
    // 1. Locate the hashed refresh token in the database for this userId.
    // 2. Delete or invalidate the refresh token record.
    // 3. This ensures the user is securely logged out across all tracked sessions.
    
    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { email, sub: userId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: (this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN') || ACCESS_TOKEN_DEFAULT_EXPIRATION) as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: (this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') || REFRESH_TOKEN_DEFAULT_EXPIRATION) as any,
      }),
    ]);

    // TODO: Future Implementation Phase (Refresh Token Persistence)
    // 1. Hash the generated refreshToken using bcrypt.
    // 2. Store the hashed refresh token in the database against the userId.
    // 3. This will enable token revocation and multi-device session tracking.

    return {
      accessToken,
      refreshToken,
      user: {
        id: userId,
        email,
      },
    };
  }
}
