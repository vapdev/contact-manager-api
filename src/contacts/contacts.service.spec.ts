import { Test, TestingModule } from '@nestjs/testing';
import { ContactsService } from './contacts.service';
import { ContactRepository } from './interfaces/contact-repository.interface';

const mockContact = {
  _id: 'contact123',
  userId: 'user123',
  name: 'Contact Name',
  email: 'contact@email.com',
  phone: '123456789',
};

const mockContactRepository = {
  create: jest.fn().mockResolvedValue(mockContact),
  findAll: jest.fn().mockResolvedValue([mockContact]),
  update: jest.fn().mockResolvedValue(mockContact),
  findById: jest.fn().mockResolvedValue(mockContact),
  delete: jest.fn().mockResolvedValue(undefined),
};

describe('ContactsService', () => {
  let service: ContactsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        {
          provide: 'ContactRepository',
          useValue: mockContactRepository,
        },
      ],
    }).compile();
    service = module.get<ContactsService>(ContactsService);
  });

  it('should create a contact', async () => {
    const result = await service.create('user123', { name: 'Contact Name', email: 'contact@email.com', phone: '123456789' });
    expect(result).toEqual(mockContact);
  });

  it('should find all contacts', async () => {
    const result = await service.findAll('user123');
    expect(result).toEqual([mockContact]);
  });

  it('should update a contact', async () => {
    const result = await service.update('user123', 'contact123', { name: 'Updated' });
    expect(result).toEqual(mockContact);
  });

  it('should find a contact by id', async () => {
    const result = await service.findById('contact123');
    expect(result).toEqual(mockContact);
  });

  it('should delete a contact', async () => {
    await expect(service.delete('user123', 'contact123')).resolves.toBeUndefined();
  });
});
