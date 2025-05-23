import { User } from '../user.schema';
import { CreateUserDto } from '../dto/create-user.dto';

export abstract class UserRepository {
  abstract create(data: CreateUserDto): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract findAll(): Promise<User[]>;
}
