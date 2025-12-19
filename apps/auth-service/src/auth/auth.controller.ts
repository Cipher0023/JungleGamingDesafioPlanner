import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dtos/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

/**
 * Controller responsável por autenticação e gerenciamento de tokens
 */
@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registrar novo usuário',
    description:
      'Cria uma nova conta de usuário com email único, username e senha criptografada',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    schema: {
      example: {
        id: '5b55f461-ca06-404a-b7ef-64f3af956dc4',
        email: 'usuario@example.com',
        username: 'johndoe',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou email já existe',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login de usuário',
    description: 'Autentica usuário e retorna access token e refresh token JWT',
  })
  @ApiResponse({
    status: 200,
    description: 'Login bem-sucedido',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '5b55f461-ca06-404a-b7ef-64f3af956dc4',
          email: 'usuario@example.com',
          username: 'johndoe',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Renovar access token',
    description:
      'Usa refresh token para obter novo access token sem precisar fazer login novamente',
  })
  @ApiResponse({
    status: 200,
    description: 'Token renovado com sucesso',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido ou expirado',
  })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obter perfil do usuário autenticado',
    description:
      '🔒 Rota protegida - Retorna dados do usuário logado baseado no token JWT',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil retornado com sucesso',
    schema: {
      example: {
        id: '5b55f461-ca06-404a-b7ef-64f3af956dc4',
        email: 'usuario@example.com',
        username: 'johndoe',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token JWT ausente ou inválido' })
  async getProfile(@Request() req) {
    return req.user;
  }
}
