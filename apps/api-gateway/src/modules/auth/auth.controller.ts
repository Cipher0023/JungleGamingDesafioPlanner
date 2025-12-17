import { Controller, All, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @All('*path')
  async proxy(@Req() req: Request) {
    const path = `/auth/${req.params.path ?? ''}`;

    return this.authService.forward(req.method as any, path, req.body, {
      ...req.headers,
      host: undefined,
      'content-length': undefined,
      connection: undefined,
    });
  }
}
