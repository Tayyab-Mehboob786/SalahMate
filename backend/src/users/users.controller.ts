import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: { userId: string; email: string }) {
    const profile = await this.usersService.getProfile(user.userId);
    if (!profile) {
      throw new NotFoundException('User not found');
    }
    return profile;
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: { userId: string; email: string },
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const updatedUser = await this.usersService.updateProfile(
      user.userId,
      updateProfileDto,
    );
    return {
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    };
  }

  @Patch('theme')
  async updateTheme(
    @CurrentUser() user: { userId: string; email: string },
    @Body() updateThemeDto: UpdateThemeDto,
  ) {
    const updatedUser = await this.usersService.updateTheme(
      user.userId,
      updateThemeDto,
    );
    return {
      success: true,
      message: 'Theme updated successfully',
      data: updatedUser,
    };
  }

  @Patch('avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req: any, file, cb) => {
          const userId = req.user?.userId || 'unknown';
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `avatar-${userId}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(
            new BadRequestException(
              'Only JPG, JPEG, and PNG files are allowed',
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async updateAvatar(
    @CurrentUser() user: { userId: string; email: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Avatar file is required');
    }
    const avatarUrl = `/uploads/avatars/${file.filename}`;
    await this.usersService.updateAvatar(user.userId, { avatar: avatarUrl });
    return {
      success: true,
      message: 'Avatar updated successfully',
      data: {
        avatar: avatarUrl,
      },
    };
  }
}
