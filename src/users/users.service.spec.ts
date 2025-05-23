import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from './interfaces/user-repository.interface';

describe('UsersService', () => {
  let service: UsersService;
  let mockUserRepository: Partial<UserRepository>;

  beforeEach(async () => {
    mockUserRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'UserRepository',
          useValue: mockUserRepository,
        },
      ],
    }).compile();
    service = moduleRef.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user and return it', async () => {
      const createUserDto = { email: 'test@example.com', password: 'password123' };
      const expectedSavedUser = {
        _id: 'aGeneratedMongoId',
        ...createUserDto,
      };
      (mockUserRepository.create as jest.Mock).mockResolvedValue(expectedSavedUser);
      const result = await service.create(createUserDto.email, createUserDto.password);
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedSavedUser);
    });
  });

  describe('findByEmail', () => {
    it('should find and return a user by email if they exist', async () => {
      const emailToFind = 'test@example.com';
      const mockUserFromDb = {
        _id: 'someId',
        email: emailToFind,
        password: 'hashedPassword',
      };
      (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue(mockUserFromDb);
      const result = await service.findByEmail(emailToFind);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(emailToFind);
      expect(result).toEqual(mockUserFromDb);
    });

    it('should return null if user with the email does not exist', async () => {
      const emailToFind = 'nonexistent@example.com';
      (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue(null);
      const result = await service.findByEmail(emailToFind);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(emailToFind);
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find and return a user by ID if they exist', async () => {
      const idToFind = 'someValidMongoId';
      const mockUserFromDb = {
        _id: idToFind,
        email: 'user@example.com',
        password: 'hashedPassword',
      };
      (mockUserRepository.findById as jest.Mock).mockResolvedValue(mockUserFromDb);
      const result = await service.findById(idToFind);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(idToFind);
      expect(result).toEqual(mockUserFromDb);
    });

    it('should return null if user with the ID does not exist', async () => {
      const idToFind = 'nonExistentMongoId';
      (mockUserRepository.findById as jest.Mock).mockResolvedValue(null);
      const result = await service.findById(idToFind);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(idToFind);
      expect(result).toBeNull();
    });
  });
  
  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { _id: 'id1', email: 'user1@example.com', password: 'hash1' },
        { _id: 'id2', email: 'user2@example.com', password: 'hash2' },
      ];
      (mockUserRepository.findAll as jest.Mock).mockResolvedValue(mockUsers);
      const result = await service.findAll();
      expect(mockUserRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });
});
