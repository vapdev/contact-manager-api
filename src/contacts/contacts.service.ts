import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Contact } from './contact.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class ContactsService {
  constructor(@InjectModel(Contact.name) private contactModel: Model<Contact>) {}

  async create(userId: string, dto: any): Promise<Contact> {
    return this.contactModel.create({ ...dto, userId });
  }

  async findAll(userId: string, search?: string): Promise<Contact[]> {
    const filter: any = { userId: userId };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    return this.contactModel.find(filter).exec();
  }

  async update(userId: string, id: string, dto: any): Promise<Contact> {
    const contact = await this.contactModel.findOneAndUpdate(
      { _id: id, userId },
      dto,
      { new: true },
    );
    if (!contact) throw new NotFoundException('Contato não encontrado');
    return contact;
  }

  async findById(id: string): Promise<Contact> {
    const contact = await this.contactModel.findOne({ _id: id });
    if (!contact) throw new NotFoundException('Contato não encontrado');
    return contact;
  }

  async delete(userId: string, id: string): Promise<void> {
    const result = await this.contactModel.findOneAndDelete({ _id: id, userId });
    if (!result) throw new NotFoundException('Contato não encontrado');
  }
}
