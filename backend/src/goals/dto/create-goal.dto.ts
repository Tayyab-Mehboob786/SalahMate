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

export class CreateGoalDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  @IsEnum(GoalCategory)
  category: GoalCategory;

  @IsOptional()
  @IsEnum(Prayer)
  prayerTarget?: Prayer;

  @IsDateString()
  startDate: string;

  @IsDateString()
  targetDate: string;

  @IsInt()
  @IsPositive()
  totalUnits: number;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  unitLabel: string;

  @IsOptional()
  @IsObject()
  reminderConfig?: any;
}
