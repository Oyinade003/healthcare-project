import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findOne: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return null if user is not found', async () => {
      mockUsersService.findOne.mockResolvedValue(null);
      const result = await authService.validateUser('test@example.com', 'password');
      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      const user = { email: 'test@example.com', password: await bcrypt.hash('password', 10) };
      mockUsersService.findOne.mockResolvedValue(user);
      const result = await authService.validateUser('test@example.com', 'wrongpassword');
      expect(result).toBeNull();
    });

    it('should return user without password if validation is successful', async () => {
      const user = { email: 'test@example.com', password: await bcrypt.hash('password', 10) };
      mockUsersService.findOne.mockResolvedValue(user);
      const result = await authService.validateUser('test@example.com', 'password');
      expect(result).toEqual({ email: 'test@example.com' });
    });
  });

  describe('login', () => {
    it('should return access token when login is successful', async () => {
      const user = { email: 'test@example.com', id: '1' };
      mockJwtService.sign.mockReturnValue('mocked_token');
      const result = await authService.login(user);
      expect(result).toEqual({ access_token: 'mocked_token' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({ email: user.email, sub: user.id });
    });
  });
});