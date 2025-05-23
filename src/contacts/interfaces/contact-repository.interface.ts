import { Contact } from '../contact.schema';

export abstract class ContactRepository {
  abstract create(userId: string, dto: any): Promise<Contact>;
  abstract findAll(userId: string, search?: string): Promise<Contact[]>;
  abstract update(userId: string, id: string, dto: any): Promise<Contact>;
  abstract findById(id: string): Promise<Contact>;
  abstract delete(userId: string, id: string): Promise<void>;
}
