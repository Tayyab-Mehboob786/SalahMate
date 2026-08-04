import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User, Theme } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findByIdSafe(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatar: true,
        theme: true,
        country: true,
        city: true,
        timezone: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });
  }

  async markEmailVerified(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { isEmailVerified: true },
    });
  }

  async updatePassword(id: string, password: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { password },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updateHashedRefreshToken(
    id: string,
    hashedRefreshToken: string | null,
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { hashedRefreshToken },
    });
  }

  async incrementFailedAttempts(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        failedLoginAttempts: {
          increment: 1,
        },
      },
    });
  }

  async lockAccount(id: string, lockDurationMs: number): Promise<User> {
    const lockedUntil = new Date(Date.now() + lockDurationMs);
    return this.prisma.user.update({
      where: { id },
      data: {
        lockedUntil,
      },
    });
  }

  async resetLockout(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
  }

  async getProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatar: true,
        theme: true,
        country: true,
        city: true,
        timezone: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.user.update({
      where: { id },
      data: updateProfileDto,
      select: {
        id: true,
        fullName: true,
        email: true,
        avatar: true,
        theme: true,
        country: true,
        city: true,
        timezone: true,
        createdAt: true,
      },
    });
  }

  async updateTheme(id: string, updateThemeDto: UpdateThemeDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.user.update({
      where: { id },
      data: { theme: updateThemeDto.theme },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatar: true,
        theme: true,
        country: true,
        city: true,
        timezone: true,
        createdAt: true,
      },
    });
  }

  async updateAvatar(id: string, updateAvatarDto: UpdateAvatarDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.user.update({
      where: { id },
      data: { avatar: updateAvatarDto.avatar },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatar: true,
        theme: true,
        country: true,
        city: true,
        timezone: true,
        createdAt: true,
      },
    });
  }
}
