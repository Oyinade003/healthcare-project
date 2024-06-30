import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

// Mark this class as injectable so it can be used as a provider in NestJS
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,  // Inject UsersService to handle user-related operations
    private jwtService: JwtService,      // Inject JwtService to handle JWT operations
  ) {}

  // Method to validate user credentials
  async validateUser(email: string, password: string): Promise<any> {
    // Find the user by email
    const user = await this.usersService.findOne(email);
    
    // If user exists and the provided password matches the stored hashed password
    if (user && await bcrypt.compare(password, user.password)) {
      // If authentication is successful, remove the password from the user object
      // This is a security measure to avoid sending the password back to the client
      const { password, ...result } = user;
      return result;
    }
    
    // If authentication fails, return null
    return null;
  }

  // Method to generate a JWT token for a logged-in user
  async login(user: any) {
    // Create a payload for the JWT
    // This payload will be encoded in the JWT
    const payload = { email: user.email, sub: user.id };
    
    // Return an object containing the JWT
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}