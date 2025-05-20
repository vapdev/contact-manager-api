import { Controller, Post, Get, Put, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactResponseDto } from './dto/contact-response.dto';
import { DeleteContactResponseDto } from './dto/delete-contact-response.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('Contacts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @ApiOperation({ summary: 'Cria um novo contato' })
  @ApiResponse({ status: 201, description: 'Contato criado com sucesso', type: ContactResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @Post()
  async create(@Req() req: Request, @Body() body: CreateContactDto): Promise<ContactResponseDto> {
    const userId = req.user['userId'];
    const contact = await this.contactsService.create(userId, body);
    return plainToInstance(ContactResponseDto, contact.toObject ? contact.toObject() : contact);
  }

  @ApiOperation({ summary: 'Lista todos os contatos do usuário' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Termo de busca para filtrar contatos' })
  @ApiResponse({ status: 200, description: 'Lista de contatos', type: [ContactResponseDto] })
  @Get()
  async findAll(@Req() req: Request, @Query('search') search?: string): Promise<ContactResponseDto[]> {
    const userId = req.user['userId'];
    const contacts = await this.contactsService.findAll(userId, search);
    return contacts.map(contact => plainToInstance(ContactResponseDto, contact.toObject ? contact.toObject() : contact));
  }

  @ApiOperation({ summary: 'Busca um contato pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do contato' })
  @ApiResponse({ status: 200, description: 'Contato encontrado', type: ContactResponseDto })
  @ApiResponse({ status: 404, description: 'Contato não encontrado' })
  @Get(':id')
  async findById(@Param('id') id: string): Promise<ContactResponseDto> {
    const contact = await this.contactsService.findById(id);
    return plainToInstance(ContactResponseDto, contact.toObject ? contact.toObject() : contact);
  }

  @ApiOperation({ summary: 'Atualiza um contato existente' })
  @ApiParam({ name: 'id', description: 'ID do contato a ser atualizado' })
  @ApiResponse({ status: 200, description: 'Contato atualizado com sucesso', type: ContactResponseDto })
  @ApiResponse({ status: 404, description: 'Contato não encontrado' })
  @Put(':id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() body: UpdateContactDto): Promise<ContactResponseDto> {
    const userId = req.user['userId'];
    const contact = await this.contactsService.update(userId, id, body);
    return plainToInstance(ContactResponseDto, contact.toObject ? contact.toObject() : contact);
  }

  @ApiOperation({ summary: 'Remove um contato' })
  @ApiParam({ name: 'id', description: 'ID do contato a ser removido' })
  @ApiResponse({ status: 200, description: 'Contato removido com sucesso', type: DeleteContactResponseDto })
  @ApiResponse({ status: 404, description: 'Contato não encontrado' })
  @Delete(':id')
  async delete(@Req() req: Request, @Param('id') id: string): Promise<DeleteContactResponseDto> {
    const userId = req.user['userId'];
    await this.contactsService.delete(userId, id);
    return plainToInstance(DeleteContactResponseDto, { message: 'Contato removido com sucesso' });
  }
}
