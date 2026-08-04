import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PrayerTimesService } from '../service/prayer-times.service';
import { GetPrayerTimesDto } from '../dto/get-prayer-times.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('prayer-times')
@UseGuards(JwtAuthGuard)
export class PrayerTimesController {
  constructor(private readonly prayerTimesService: PrayerTimesService) {}

  @Get('today')
  async getTodayTimings(@Query() query: GetPrayerTimesDto) {
    const data = await this.prayerTimesService.getTodayTimings(
      query.lat,
      query.lng,
      query.method,
    );

    return {
      success: true,
      data,
    };
  }
}
