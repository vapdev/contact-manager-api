import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { ContactsService } from '../contacts/contacts.service';
import * as mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const contactsService = app.get(ContactsService);

  // Limpa as coleções
  await mongoose.connection.collection('users').deleteMany({});
  await mongoose.connection.collection('contacts').deleteMany({});

  // Cria usuário
  const user = await usersService.create('seeder@exemplo.com', 'senha123');
  const userId = (user._id as mongoose.Types.ObjectId).toString();

  // Cria contatos
  await contactsService.create(userId, {
    name: 'João da Silva',
    email: 'joao@exemplo.com',
    phone: '+55 11 91234-5678',
  });
  await contactsService.create(userId, {
    name: 'Maria Oliveira',
    email: 'maria@exemplo.com',
    phone: '+55 21 99876-5432',
  });
  await contactsService.create(userId, {
    name: 'Carlos Souza',
    email: 'carlos@exemplo.com',
    phone: '+55 31 98765-4321',
  });

  console.log('Seed concluído! Usuário: seeder@exemplo.com | senha: senha123');
  await app.close();
}

bootstrap();
