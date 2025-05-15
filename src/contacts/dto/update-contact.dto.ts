import { IsOptional, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateContactDto {
  @ApiPropertyOptional({ example: 'João Silva' })
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({ example: 'joao@email.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+55 11 91234-5678' })
  @IsOptional()
  phone?: string;
}
