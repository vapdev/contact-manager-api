import { Test, TestingModule } from '@nestjs/testing';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ContactResponseDto } from './dto/contact-response.dto';
import { DeleteContactResponseDto } from './dto/delete-contact-response.dto';
import { ExecutionContext } from '@nestjs/common';

const mockContact = {
  _id: 'contact123',
  name: 'Contact Name',
  email: 'contact@email.com',
  phone: '123456789',
  toObject: function () { return this; },
};

const contactsServiceMock = {
  create: jest.fn().mockResolvedValue(mockContact),
  findAll: jest.fn().mockResolvedValue([mockContact]),
  findById: jest.fn().mockResolvedValue(mockContact),
  update: jest.fn().mockResolvedValue(mockContact),
  delete: jest.fn().mockResolvedValue(undefined),
};

describe('ContactsController', () => {
  let controller: ContactsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactsController],
      providers: [
        { provide: ContactsService, useValue: contactsServiceMock },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: (context: ExecutionContext) => true })
      .compile();
    controller = module.get<ContactsController>(ContactsController);
  });

  it('should create a contact', async () => {
    const req = { user: { userId: 'user123' } } as any;
    const dto = { name: 'Contact Name', email: 'contact@email.com', phone: '123456789' };
    const result = await controller.create(req, dto);
    expect(result).toBeInstanceOf(ContactResponseDto);
    expect(result.name).toBe('Contact Name');
  });

  it('should list all contacts', async () => {
    const req = { user: { userId: 'user123' } } as any;
    const result = await controller.findAll(req);
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toBeInstanceOf(ContactResponseDto);
  });

  it('should get a contact by id', async () => {
    const result = await controller.findById('contact123');
    expect(result).toBeInstanceOf(ContactResponseDto);
    expect(result.id).toBe('contact123');
  });

  it('should update a contact', async () => {
    const req = { user: { userId: 'user123' } } as any;
    const dto = { name: 'Updated' };
    const result = await controller.update(req, 'contact123', dto);
    expect(result).toBeInstanceOf(ContactResponseDto);
    expect(result.name).toBe('Contact Name');
  });

  it('should delete a contact', async () => {
    const req = { user: { userId: 'user123' } } as any;
    const result = await controller.delete(req, 'contact123');
    expect(result).toBeInstanceOf(DeleteContactResponseDto);
    expect(result.message).toBe('Contato removido com sucesso');
  });
});
