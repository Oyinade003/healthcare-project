import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { User, UserDocument } from '../users/users.schema';
import * as bcrypt from 'bcryptjs';

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<UserDocument>;

  const mockUserModel = {
    create: jest.fn().mockImplementation((dto) => ({
      ...dto,
      save: jest.fn().mockResolvedValue(dto),
    })),
    findOne: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should hash password and create a new user', async () => {
      const createUserDto = { email: 'test@example.com', password: 'password' };
      const hashedPassword = 'hashedPassword';
      const createdUser = { ...createUserDto, password: hashedPassword };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      
      const result = await service.create(createUserDto);
      
      expect(result).toEqual(expect.objectContaining(createdUser));
      expect(mockUserModel.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
    });
  });


  describe('findOne', () => {
    it('should find a user by email', async () => {
      const user = { email: 'test@example.com', password: 'hashedPassword' };
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      });

      const result = await service.findOne('test@example.com');
      expect(result).toEqual(user);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    });
  });

  // Add more tests for other methods...
});