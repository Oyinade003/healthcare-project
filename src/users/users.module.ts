import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserResolver } from '../graphql/resolvers/user.resolver';
import { UsersController } from './users.controllers';
import { UsersService } from './users.service';
import { User, UserSchema } from './users.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService, UserResolver],
  exports: [UsersService],
})
export class UsersModule {}