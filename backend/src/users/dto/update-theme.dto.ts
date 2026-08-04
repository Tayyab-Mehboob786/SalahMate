import { IsEnum } from 'class-validator';
import { Theme } from '@prisma/client';

export class UpdateThemeDto {
  @IsEnum(Theme, { message: 'Theme must be LIGHT, DARK, or SYSTEM' })
  theme: Theme;
}
