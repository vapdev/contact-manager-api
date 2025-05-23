import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Contact, ContactSchema } from './contact.schema';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { ContactMongooseRepository } from './repositories/contact-mongoose.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }])],
  controllers: [ContactsController],
  providers: [
    ContactsService,
    {
      provide: 'ContactRepository',
      useClass: ContactMongooseRepository,
    }
  ],
})
export class ContactsModule {}
