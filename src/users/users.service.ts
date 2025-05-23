import { Inject, Injectable } from '@nestjs/common';
import { User } from './user.schema';
import { UserRepository } from './interfaces/user-repository.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async create(email: string, password: string): Promise<User> {
    const dto: CreateUserDto = { email, password };
    return this.userRepository.create(dto);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
