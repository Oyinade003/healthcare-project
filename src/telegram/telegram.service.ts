import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramService {
  private bot: Telegraf;

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    // Retrieve the Telegram bot token from environment variables
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) {
      throw new Error(
        'TELEGRAM_BOT_TOKEN is not defined in the environment variables',
      );
    }
    // Initialize the Telegram bot with the token
    this.bot = new Telegraf(token);
    // Set up bot commands and launch it
    this.setupBot();
  }

  private setupBot() {
    // Handle the /start command
    this.bot.command('start', (ctx) => {
      ctx.reply('Welcome! Use /link to link your account.');
    });

    // Handle the /link command
    this.bot.command('link', async (ctx) => {
      // Get the Telegram user ID
      const telegramId = ctx.from.id.toString();
      // Generate a random verification code
      const verificationCode = Math.random().toString(36).substring(7);
      // Store the verification code for this Telegram ID
      await this.usersService.storeVerificationCode(
        telegramId,
        verificationCode,
      );
      // Send the verification code to the user
      ctx.reply(`Your verification code is: ${verificationCode}`);
    });

    // Launch the bot
    this.bot.launch();
  }

  // Method to link a Telegram account with a user account
  async linkAccount(email: string, verificationCode: string) {
    // Find the user by email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    // Retrieve the stored verification code for this user's Telegram ID
    const storedCode = await this.usersService.getVerificationCode(
      user.telegramId,
    );
    // Check if the provided code matches the stored code
    if (verificationCode !== storedCode) {
      throw new Error('Invalid verification code');
    }

    // Update the user's record with their Telegram ID
    await this.usersService.updateUser(user.email, {
      telegramId: user.telegramId,
    });
    return { message: 'Account linked successfully' };
  }
}