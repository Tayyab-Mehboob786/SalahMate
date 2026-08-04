import { IsString, IsUrl } from 'class-validator';

export class UpdateAvatarDto {
  @IsString()
  @IsUrl({}, { message: 'Avatar must be a valid URL' })
  avatar: string;
}
