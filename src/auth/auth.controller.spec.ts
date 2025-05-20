import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserResponseDto } from './dto/user-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { ExecutionContext } from '@nestjs/common';

const mockAuthService = {
  register: jest.fn().mockResolvedValue({ message: 'Usuário registrado com sucesso', userId: 'user123' }),
  login: jest.fn().mockResolvedValue('jwt-token'),
  getUserByEmail: jest.fn().mockResolvedValue({ _id: 'user123', email: 'test@example.com', name: 'Test User' }),
  getUserById: jest.fn().mockResolvedValue({ _id: 'user123', email: 'test@example.com', name: 'Test User' }),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: (context: ExecutionContext) => true })
      .compile();
    controller = module.get<AuthController>(AuthController);
  });

  it('should register a user', async () => {
    const dto = { email: 'test@example.com', password: 'password' };
    const result = await controller.register(dto);
    expect(result).toBeInstanceOf(RegisterResponseDto);
    expect(result.userId).toBe('user123');
  });

  it('should login a user', async () => {
    const dto = { email: 'test@example.com', password: 'password' };
    const result = await controller.login(dto);
    expect(result).toBeInstanceOf(LoginResponseDto);
    expect(result.access_token).toBe('jwt-token');
  });

  it('should return current user', async () => {
    const req = { user: { userId: 'user123' } } as any;
    const result = await controller.getMe(req);
    expect(result).toBeInstanceOf(UserResponseDto);
    expect(result.email).toBe('test@example.com');
  });
});
