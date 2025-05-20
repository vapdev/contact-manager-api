import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';

type MockModel<T = any> = Model<T> & {
  new (...args: any[]): T;
  findOne: jest.Mock;
  findById: jest.Mock;
};

describe('UsersService', () => {
  let service: UsersService;
  let model: MockModel<User>;
  let mockDocumentSave: jest.Mock;
  let mockQueryExec: jest.Mock;

  beforeEach(async () => {
    mockDocumentSave = jest.fn();
    mockQueryExec = jest.fn();
    const mockModelConstructor = jest.fn().mockImplementation((dto) => ({
      ...dto,
      save: mockDocumentSave,
    }));
    (mockModelConstructor as any).findOne = jest.fn().mockReturnValue({
      exec: mockQueryExec,
    });
    (mockModelConstructor as any).findById = jest.fn().mockReturnValue({
      exec: mockQueryExec,
    });
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockModelConstructor,
        },
      ],
    }).compile();
    service = moduleRef.get<UsersService>(UsersService);
    model = moduleRef.get<MockModel<User>>(getModelToken(User.name) as any);
    (model.findOne as jest.Mock).mockClear();
    (model.findById as jest.Mock).mockClear();
    mockDocumentSave.mockClear();
    mockQueryExec.mockClear();
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
      mockDocumentSave.mockResolvedValue(expectedSavedUser);
      const result = await service.create(createUserDto.email, createUserDto.password);
      expect(model).toHaveBeenCalledTimes(1);
      expect(model).toHaveBeenCalledWith(createUserDto);
      expect(mockDocumentSave).toHaveBeenCalledTimes(1);
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
      mockQueryExec.mockResolvedValueOnce(mockUserFromDb);
      const result = await service.findByEmail(emailToFind);
      expect(model.findOne).toHaveBeenCalledTimes(1);
      expect(model.findOne).toHaveBeenCalledWith({ email: emailToFind });
      expect(mockQueryExec).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUserFromDb);
    });

    it('should return null if user with the email does not exist', async () => {
      const emailToFind = 'nonexistent@example.com';
      mockQueryExec.mockResolvedValueOnce(null);
      const result = await service.findByEmail(emailToFind);
      expect(model.findOne).toHaveBeenCalledTimes(1);
      expect(model.findOne).toHaveBeenCalledWith({ email: emailToFind });
      expect(mockQueryExec).toHaveBeenCalledTimes(1);
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
      mockQueryExec.mockResolvedValueOnce(mockUserFromDb);
      const result = await service.findById(idToFind);
      expect(model.findById).toHaveBeenCalledTimes(1);
      expect(model.findById).toHaveBeenCalledWith(idToFind);
      expect(mockQueryExec).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUserFromDb);
    });

    it('should return null if user with the ID does not exist', async () => {
      const idToFind = 'nonExistentMongoId';
      mockQueryExec.mockResolvedValueOnce(null);
      const result = await service.findById(idToFind);
      expect(model.findById).toHaveBeenCalledTimes(1);
      expect(model.findById).toHaveBeenCalledWith(idToFind);
      expect(mockQueryExec).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });
  });
});
