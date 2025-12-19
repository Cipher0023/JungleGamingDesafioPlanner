import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';

/**
 * JWT Strategy para validação de tokens JWT
 * Extrai o token do header Authorization e valida a assinatura
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'secret',
    });
  }

  /**
   * Valida o payload do token e retorna o usuário
   * Este método é chamado automaticamente após a validação do token
   */
  async validate(payload: any) {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      select: ['id', 'email', 'username'],
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // O objeto retornado aqui será anexado ao request.user
    return {
      id: user.id,
      email: user.email,
      username: user.username,
    };
  }
}
