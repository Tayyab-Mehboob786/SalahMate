import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PrayersService } from './prayers.service';
import { CreatePrayerLogDto } from './dto/create-prayer-log.dto';
import { UpdatePrayerLogDto } from './dto/update-prayer-log.dto';
import { PaginationDto } from './dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';


@Controller('prayers')
@UseGuards(JwtAuthGuard)
export class PrayersController {
  constructor(private readonly prayersService: PrayersService) {}

  @Post()
  create(
    @CurrentUser() user: { userId: string; email: string },
    @Body() createPrayerLogDto: CreatePrayerLogDto,
  ) {
    return this.prayersService.create(user.userId, createPrayerLogDto);
  }

  @Get('streak')
  getStreak(@CurrentUser() user: { userId: string; email: string }) {
    return this.prayersService.getStreak(user.userId);
  }

  @Get('today')
  getToday(@CurrentUser() user: { userId: string; email: string }) {
    return this.prayersService.getToday(user.userId);
  }

  @Get('history')
  getHistory(@CurrentUser() user: { userId: string; email: string }, @Query() paginationDto: PaginationDto) {
    return this.prayersService.getHistory(user.userId, paginationDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { userId: string; email: string },
    @Body() updatePrayerLogDto: UpdatePrayerLogDto,
  ) {
    return this.prayersService.update(id, user.userId, updatePrayerLogDto);
  }

  @Get('analytics')
  getAnalytics(
    @CurrentUser() user: { userId: string; email: string },
    @Query('period') period?: string,
  ) {
    return this.prayersService.getAnalytics(user.userId, period || '7d');
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: { userId: string; email: string }) {
    return this.prayersService.remove(id, user.userId);
  }
}
