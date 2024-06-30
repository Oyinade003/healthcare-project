import { Test, TestingModule } from '@nestjs/testing';
import { TelegramService } from './telegram.service';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

jest.mock('telegraf');

describe('TelegramService', () => {
  let service: TelegramService;
  let usersService: UsersService;

  const mockUsersService = {
    storeVerificationCode: jest.fn(),
    findByEmail: jest.fn(),
    getVerificationCode: jest.fn(),
    updateUser: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('mock_token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelegramService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<TelegramService>(TelegramService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('linkAccount', () => {
    it('should throw an error if user is not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.linkAccount('test@example.com', '123456')).rejects.toThrow('User not found');
    });

    it('should throw an error if verification code is invalid', async () => {
      const user = { email: 'test@example.com', telegramId: '123' };
      mockUsersService.findByEmail.mockResolvedValue(user);
      mockUsersService.getVerificationCode.mockResolvedValue('654321');

      await expect(service.linkAccount('test@example.com', '123456')).rejects.toThrow('Invalid verification code');
    });

    it('should link account successfully', async () => {
      const user = { _id: '1', email: 'test@example.com', telegramId: '123' };
      mockUsersService.findByEmail.mockResolvedValue(user);
      mockUsersService.getVerificationCode.mockResolvedValue('123456');
      mockUsersService.updateUser.mockResolvedValue(user);

      const result = await service.linkAccount('test@example.com', '123456');
      expect(result).toEqual({ message: 'Account linked successfully' });
      expect(mockUsersService.updateUser).toHaveBeenCalledWith('1', { telegramId: '123' });
    });
  });

});