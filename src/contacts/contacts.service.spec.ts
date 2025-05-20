import { Test, TestingModule } from '@nestjs/testing';
import { ContactsService } from './contacts.service';
import { getModelToken } from '@nestjs/mongoose';
import { Contact } from './contact.schema';

const mockContact = {
  _id: 'contact123',
  userId: 'user123',
  name: 'Contact Name',
  email: 'contact@email.com',
  phone: '123456789',
};

const contactModelMock = {
  create: jest.fn().mockResolvedValue(mockContact),
  find: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([mockContact]) }),
  findOneAndUpdate: jest.fn().mockResolvedValue(mockContact),
  findOne: jest.fn().mockResolvedValue(mockContact),
  findOneAndDelete: jest.fn().mockResolvedValue(mockContact),
};

describe('ContactsService', () => {
  let service: ContactsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        { provide: getModelToken(Contact.name), useValue: contactModelMock },
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
