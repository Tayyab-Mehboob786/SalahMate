import { IsString, IsOptional, IsObject } from 'class-validator';

export class ChatRequestDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  conversationId?: string;

  @IsOptional()
  @IsObject()
  context?: Record<string, any>;
}
