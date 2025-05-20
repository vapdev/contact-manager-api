import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './user.schema';

const mockUser = {
  _id: 'user123',
  email: 'test@example.com',
  password: 'hashed',
  name: 'Test User',
};

const userModelMock = {
  save: jest.fn().mockResolvedValue(mockUser),
  findOne: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockUser) }),
  findById: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockUser) }),
};

function userModelFactory() {
  return function (data: any) {
    return { ...data, save: userModelMock.save };
  };
}

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useFactory: userModelFactory },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });

  it('should create a user', async () => {
    const result = await service.create('test@example.com', 'hashed');
    expect(result).toEqual(mockUser);
  });

  it('should find user by email', async () => {
    const result = await service.findByEmail('test@example.com');
    expect(result).toEqual(mockUser);
  });

  it('should find user by id', async () => {
    const result = await service.findById('user123');
    expect(result).toEqual(mockUser);
  });
});
