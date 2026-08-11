import { Controller, Post, Get, Body, Req, Query, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { ChatRequestDto } from './dto/chat-request.dto';
import { ChatResponseDto } from './dto/chat-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(@Req() req: any, @Body() body: ChatRequestDto): Promise<ChatResponseDto> {
    const userId = req.user.id;
    return this.aiService.chat(userId, body);
  }

  @Get('insight')
  async getInsight(@Req() req: any, @Query('lat') lat?: string, @Query('lng') lng?: string) {
    const userId = req.user.id;
    const context = (lat && lng) ? { lat: Number(lat), lng: Number(lng) } : undefined;
    return this.aiService.getInsight(userId, context);
  }
}
