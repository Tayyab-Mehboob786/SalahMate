import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Prayer, PrayerStatus } from '@prisma/client';
import type { Prayer as IPrayer, PrayerStatus as IPrayerStatus } from '@prisma/client';

export class CreatePrayerLogDto {
  @IsEnum(Prayer)
  @IsNotEmpty()
  prayer: IPrayer;

  @IsEnum(PrayerStatus)
  @IsNotEmpty()
  status: IPrayerStatus;

  @IsString()
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in YYYY-MM-DD format',
  })
  date?: string;
}
