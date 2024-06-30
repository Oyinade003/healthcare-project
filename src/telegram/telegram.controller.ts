import { Controller, Post, Body } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('link')
  async linkAccount(@Body() body: { email: string; verificationCode: string }) {
    return this.telegramService.linkAccount(body.email, body.verificationCode);
  }
}