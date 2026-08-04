import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetPrayerTimesDto {
  @IsNumber()
  @Type(() => Number)
  lat: number;

  @IsNumber()
  @Type(() => Number)
  lng: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  method?: number = 1;
}
