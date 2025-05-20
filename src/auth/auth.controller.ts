import { Controller, Post, Get, Body, UnauthorizedException, Req, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';
import { UserResponseDto } from './dto/user-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor) 
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ summary: 'Registra um novo usuário' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso.', type: RegisterResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponseDto> {
    const result = await this.authService.register(registerDto.email, registerDto.password);
    return plainToInstance(RegisterResponseDto, result);
  }

  @ApiOperation({ summary: 'Realiza o login do usuário' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    const token = await this.authService.login(loginDto.email, loginDto.password);
    if (!token) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const user = await this.authService.getUserByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    return plainToInstance(LoginResponseDto, {
      access_token: token,
      user: plainToInstance(UserResponseDto, user.toObject ? user.toObject() : user),
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Retorna os dados do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Dados do usuário', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getMe(@Req() req: Request): Promise<UserResponseDto> {
    const userIdFromToken = req.user?.userId;
    if (!userIdFromToken) {
      throw new UnauthorizedException('Não foi possível identificar o usuário a partir do token (userId não encontrado em req.user).');
    }
    const user = await this.authService.getUserById(userIdFromToken);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado no banco de dados com o ID fornecido pelo token.');
    }
    return plainToInstance(UserResponseDto, user.toObject ? user.toObject() : user);
  }
}
