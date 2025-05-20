import { Controller, Post, Get, Body, UnauthorizedException, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ summary: 'Registra um novo usuário' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto.email, registerDto.password);
  }

  @ApiOperation({ summary: 'Realiza o login do usuário' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto.email, loginDto.password);
    if (!token) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const user = await this.authService.getUserByEmail(loginDto.email);
     // remove password from user object
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    } else {}

    return { access_token: token, user: user }; // Retorna o token e os dados do usuário, sem a senha
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Retorna os dados do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Dados do usuário' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getMe(@Req() req: Request) { // req deve ser do tipo Express.Request
    // Linhas de debug:
    console.log('Cabeçalhos da requisição (verifique o header "Authorization"):\n', req.headers);
    console.log('Conteúdo de req.user (deve ser populado pelo JwtAuthGuard):\n', req.user);

    // A propriedade que contém o ID do usuário em req.user (ex: userId, sub, id)
    // depende do que sua JwtStrategy retorna no método validate().
    // Vamos supor que seja 'userId' por enquanto.
    const userIdFromToken = req.user?.userId;

    if (!userIdFromToken) {
      console.error('Falha ao obter userId de req.user. Conteúdo de req.user:', req.user);
      throw new UnauthorizedException('Não foi possível identificar o usuário a partir do token (userId não encontrado em req.user).');
    }

    console.log(`Buscando dados para o usuário com ID: ${userIdFromToken}`);
    const user = await this.authService.getUserById(userIdFromToken);

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado no banco de dados com o ID fornecido pelo token.');
    }

    // Se 'user' for um documento Mongoose ou similar, .toObject() é uma boa prática.
    // Certifique-se que 'password' existe no objeto 'user' antes de tentar desestruturá-lo.
    const userObject = user.toObject ? user.toObject() : user;
    const { password, ...result } = userObject; // Remove a senha do objeto retornado

    return result;
  }
}
