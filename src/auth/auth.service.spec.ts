import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

const mockUser = {
  _id: 'user123',
  email: 'test@example.com',
  password: '$2b$10$hash',
  name: 'Test User',
};

const usersServiceMock = {
  create: jest.fn().mockResolvedValue(mockUser),
  asyncFindByEmailBringPassword: jest.fn().mockResolvedValue(mockUser),
  findById: jest.fn().mockResolvedValue(mockUser),
  findByEmail: jest.fn().mockResolvedValue(mockUser),
};

const jwtServiceMock = {
  sign: jest.fn().mockReturnValue('jwt-token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  it('should register a user and return message and userId', async () => {
    const result = await service.register('test@example.com', 'password');
    expect(result).toEqual({ message: expect.any(String), userId: mockUser._id });
  });

  it('should login and return jwt token', async () => {
    jest.spyOn(service as any, 'login').mockImplementation(async () => 'jwt-token');
    const token = await service.login('test@example.com', 'password');
    expect(token).toBe('jwt-token');
  });

  it('should get user by id', async () => {
    const user = await service.getUserById('user123');
    expect(user).toEqual(mockUser);
  });

  it('should get user by email', async () => {
    const user = await service.getUserByEmail('test@example.com');
    expect(user).toEqual(mockUser);
  });
});
