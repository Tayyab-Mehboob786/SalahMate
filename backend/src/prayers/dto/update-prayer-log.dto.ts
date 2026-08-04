import { IsEnum, IsNotEmpty } from 'class-validator';
import { PrayerStatus } from '@prisma/client';
import type { PrayerStatus as IPrayerStatus } from '@prisma/client';

export class UpdatePrayerLogDto {
  @IsEnum(PrayerStatus)
  @IsNotEmpty()
  status: IPrayerStatus;
}
