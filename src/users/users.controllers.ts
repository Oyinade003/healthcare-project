import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// Define this class as a controller with the route prefix 'users'
@Controller('users')
export class UsersController {
  // Constructor to inject the UsersService
  constructor(private readonly usersService: UsersService) {}

  // POST endpoint to create a new user
  // Route: POST /users
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    // Call the usersService to create a new user
    // createUserDto contains the user details (e.g., email, password)
    return this.usersService.create(createUserDto);
  }

  // GET endpoint to retrieve all users
  // Route: GET /users
  @UseGuards(JwtAuthGuard)  // Apply JWT authentication guard
  @Get()
  async findAll() {
    // Call the usersService to retrieve all users
    return this.usersService.findAll();
  }
}