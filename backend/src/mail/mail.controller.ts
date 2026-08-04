import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendTestEmailDto } from './dto/send-test-email.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('test')
  @HttpCode(HttpStatus.OK)
  async sendTestEmail(@Body() dto: SendTestEmailDto) {
    return this.mailService.sendTestEmail(dto.email);
  }
}
