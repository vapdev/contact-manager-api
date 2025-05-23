import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

const mockUser = {
  _id: 'user123',
  email: 'test@example.com',
  password: '$2b$10$hash',
};

const usersServiceMock = {
  create: jest.fn().mockResolvedValue(mockUser),
  findByEmail: jest.fn(),
  findById: jest.fn().mockResolvedValue(mockUser),
};

const jwtServiceMock = {
  sign: jest.fn().mockReturnValue('jwt-token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should throw an error if email already exists', async () => {
      usersServiceMock.findByEmail.mockResolvedValueOnce(mockUser);
      
      await expect(service.register('test@example.com', 'password'))
        .rejects.toThrow(BadRequestException);
    });
    
    it('should create user and return token with user data', async () => {
      usersServiceMock.findByEmail.mockResolvedValueOnce(null);
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashed_password');
      
      const result = await service.register('test@example.com', 'password');
      
      expect(usersServiceMock.create).toHaveBeenCalledWith('test@example.com', 'hashed_password');
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({ sub: mockUser._id });
      expect(result).toEqual({
        access_token: 'jwt-token',
        user: mockUser
      });
    });
  });

  describe('login', () => {
    it('should return null if user not found', async () => {
      usersServiceMock.findByEmail.mockResolvedValueOnce(null);
      
      const result = await service.login('wrong@email.com', 'password');
      
      expect(result).toBeNull();
    });
    
    it('should return null if password is invalid', async () => {
      usersServiceMock.findByEmail.mockResolvedValueOnce(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
      
      const result = await service.login('test@example.com', 'wrong_password');
      
      expect(result).toBeNull();
    });
    
    it('should return token if credentials are valid', async () => {
      usersServiceMock.findByEmail.mockResolvedValueOnce(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      
      const result = await service.login('test@example.com', 'correct_password');
      
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({ sub: mockUser._id });
      expect(result).toBe('jwt-token');
    });
  });

  it('should get user by id', async () => {
    const user = await service.getUserById('user123');
    expect(usersServiceMock.findById).toHaveBeenCalledWith('user123');
    expect(user).toEqual(mockUser);
  });

  it('should get user by email', async () => {
    usersServiceMock.findByEmail.mockResolvedValueOnce(mockUser);
    
    const user = await service.getUserByEmail('test@example.com');
    
    expect(usersServiceMock.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(user).toEqual(mockUser);
  });
});
