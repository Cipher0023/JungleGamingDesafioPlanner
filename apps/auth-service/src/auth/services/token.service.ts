import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  async generateAccessToken(userId: string, email: string): Promise<string> {
    const payload: any = { sub: userId, email };
    return this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });
  }

  async generateRefreshToken(userId: string): Promise<string> {
    const payload: any = { sub: userId };
    return this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });
  }

  async verifyAccessToken(token: string) {
    return this.jwtService.verifyAsync(token);
  }

  async verifyRefreshToken(token: string) {
    return this.jwtService.verifyAsync(token);
  }
}
