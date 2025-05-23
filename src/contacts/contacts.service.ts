import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { ContactRepository } from './interfaces/contact-repository.interface';

@Injectable()
export class ContactsService {
  constructor(
    @Inject('ContactRepository') private readonly contactRepository: ContactRepository,
  ) {}

  async create(userId: string, dto: any) {
    return this.contactRepository.create(userId, dto);
  }

  async findAll(userId: string, search?: string) {
    return this.contactRepository.findAll(userId, search);
  }

  async update(userId: string, id: string, dto: any) {
    return this.contactRepository.update(userId, id, dto);
  }

  async findById(id: string) {
    return this.contactRepository.findById(id);
  }

  async delete(userId: string, id: string) {
    return this.contactRepository.delete(userId, id);
  }
}
