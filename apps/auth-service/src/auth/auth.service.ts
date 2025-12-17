import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  async login({ email, password }: any) {
    // mock temporário
    if (email === 'test@test.com' && password === '123') {
      return {
        access_token: 'fake-jwt-token',
        user: { email },
      };
    }

    throw new UnauthorizedException('Invalid credentials');
  }
}
