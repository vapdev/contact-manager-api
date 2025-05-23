import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user.schema';
import { UserRepository } from '../interfaces/user-repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserMongooseRepository implements UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(data: CreateUserDto): Promise<User> {
    return this.userModel.create(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }
}
