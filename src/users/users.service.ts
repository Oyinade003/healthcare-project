import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  // In-memory storage for Telegram verification codes
  private verificationCodes: Map<string, string> = new Map();

  constructor(
    // Inject the Mongoose model for User
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  // Create a new user
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    // Create a new user with the hashed password
    const createdUser = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return createdUser;
  }

  // Find a user by email
  async findOne(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  // Retrieve all users
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // Find a user by email (alternative method)
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  // Update a user's information
  async updateUser(id: string, updateData: Partial<User>): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  // Find a user by their ID
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  // Store a verification code for a Telegram user
  async storeVerificationCode(telegramId: string, code: string): Promise<void> {
    this.verificationCodes.set(telegramId, code);
  }

  // Retrieve a verification code for a Telegram user
  async getVerificationCode(telegramId: string): Promise<string | undefined> {
    return this.verificationCodes.get(telegramId);
  }
}