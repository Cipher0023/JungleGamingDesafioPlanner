import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * JWT Strategy para validação de tokens JWT no tasks-service
 * Extrai e valida tokens gerados pelo auth-service
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET || 'default-secret-key-change-in-production',
    });
  }

  /**
   * Valida o payload do token
   * O usuário completo deve vir do auth-service via token
   */
  async validate(payload: any) {
    if (!payload.sub) {
      throw new UnauthorizedException('Token inválido');
    }

    // Retorna dados do usuário que serão anexados ao request.user
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
