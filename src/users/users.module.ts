import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User, UserSchema } from './user.schema';
import { UserMongooseRepository } from './repositories/user-mongoose.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [
    UsersService,
    {
      provide: 'UserRepository',
      useClass: UserMongooseRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
