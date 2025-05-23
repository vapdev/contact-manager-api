import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async register(email: string, password: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('E-mail já está em uso.');
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await this.usersService.create(email, hash);
    const payload = { sub: user._id };
    const access_token = this.jwtService.sign(payload);
    return { access_token, user };
  }

  async login(email: string, password: string): Promise<string | null> {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const payload = { sub: user._id };
        return this.jwtService.sign(payload);
      }
    }
    return null;
  }

  async getUserById(userId: string) {
    return this.usersService.findById(userId);
  }

  async getUserByEmail(email: string) {
    return this.usersService.findByEmail(email);
  }
}


