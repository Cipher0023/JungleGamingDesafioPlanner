import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para registro de novos usuários
 * Valida email único, username e senha forte
 */
export class RegisterDto {
  @ApiProperty({
    description: 'Email do usuário (deve ser único)',
    example: 'usuario@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Nome de usuário (mínimo 3 caracteres)',
    example: 'johndoe',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo 6 caracteres)',
    example: 'senha123',
    minLength: 6,
    format: 'password',
  })
  @IsString()
  @MinLength(6)
  password: string;
}

/**
 * DTO para login de usuários existentes
 * Requer email e senha para autenticação
 */
export class LoginDto {
  @ApiProperty({
    description: 'Email cadastrado do usuário',
    example: 'usuario@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senha123',
    format: 'password',
  })
  @IsString()
  password: string;
}

/**
 * DTO para renovação de tokens
 * Usa refresh token para obter novo access token
 */
export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token JWT válido',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  refreshToken: string;
}
