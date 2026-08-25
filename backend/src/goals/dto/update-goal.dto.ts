import {
  IsString,
  IsEnum,
  IsInt,
  IsPositive,
  IsOptional,
  IsDateString,
  IsObject,
  MinLength,
  MaxLength,
} from 'class-validator';
import { GoalCategory, Prayer } from '@prisma/client';

export class UpdateGoalDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsEnum(GoalCategory)
  category?: GoalCategory;

  @IsOptional()
  @IsEnum(Prayer)
  prayerTarget?: Prayer;

  @IsOptional()
  @IsDateString()
  targetDate?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  totalUnits?: number;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  unitLabel?: string;

  @IsOptional()
  @IsObject()
  reminderConfig?: any;
}
