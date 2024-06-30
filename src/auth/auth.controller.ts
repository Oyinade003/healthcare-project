// Import necessary decorators and services from NestJS and related modules
import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../users/users.service';

// Define this class as a controller with the route prefix 'auth'
@Controller('auth')
export class AuthController {
  // Constructor to inject required services
  constructor(
    private authService: AuthService,    // Service handling authentication logic
    private usersService: UsersService,  // Service handling user-related operations
  ) {}

  // Define a POST endpoint for user registration at '/auth/register'
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    // Call the user service to create a new user
    // createUserDto contains the user details (e.g., email, password)
    return this.usersService.create(createUserDto);
  }

  // Define a POST endpoint for user login at '/auth/login'
  @UseGuards(AuthGuard('local'))  // Apply local authentication guard
  @Post('login')
  async login(@Request() req) {
    // The AuthGuard has already validated the user credentials
    // req.user contains the authenticated user

    // Call the auth service to generate a JWT token for the authenticated user
    return this.authService.login(req.user);
  }
}