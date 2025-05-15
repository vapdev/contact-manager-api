import { Controller, Post, Get, Put, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@ApiTags('Contacts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @ApiOperation({ summary: 'Cria um novo contato' })
  @ApiResponse({ status: 201, description: 'Contato criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @Post()
  async create(@Req() req: Request, @Body() body: CreateContactDto) {
    const userId = req.user['userId'];
    return this.contactsService.create(userId, body);
  }

  @ApiOperation({ summary: 'Lista todos os contatos do usuário' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Termo de busca para filtrar contatos' })
  @ApiResponse({ status: 200, description: 'Lista de contatos' })
  @Get()
  async findAll(@Req() req: Request, @Query('search') search?: string) {
    const userId = req.user['userId'];
    return this.contactsService.findAll(userId, search);
  }

  @ApiOperation({ summary: 'Atualiza um contato existente' })
  @ApiParam({ name: 'id', description: 'ID do contato a ser atualizado' })
  @ApiResponse({ status: 200, description: 'Contato atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Contato não encontrado' })
  @Put(':id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() body: UpdateContactDto) {
    const userId = req.user['userId'];
    return this.contactsService.update(userId, id, body);
  }

  @ApiOperation({ summary: 'Remove um contato' })
  @ApiParam({ name: 'id', description: 'ID do contato a ser removido' })
  @ApiResponse({ status: 200, description: 'Contato removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Contato não encontrado' })
  @Delete(':id')
  async delete(@Req() req: Request, @Param('id') id: string) {
    const userId = req.user['userId'];
    await this.contactsService.delete(userId, id);
    return { message: 'Contato removido com sucesso' };
  }
}
