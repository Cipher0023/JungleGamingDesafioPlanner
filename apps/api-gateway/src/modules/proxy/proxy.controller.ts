import {
  Controller,
  All,
  Req,
  Res,
} from '@nestjs/common';
import { ProxyService } from './proxy.service';
import type { Request, Response } from 'express';

@Controller()
export class ProxyController {
  constructor(private proxyService: ProxyService) {}

  // Rota para auth service
  @All('auth/*')
  async handleAuthRequests(
    @Req() request: Request,
    @Res() response: Response,
  ) {
    // Extract path after /api/auth, e.g. /api/auth/register -> /register
    const path = request.url.replace(/^\/api\/auth/, '/api/auth');
    return this.forwardRequest(request, response, 'http://auth-service:3002', path);
  }

  // Rota para users (lista de usuários) - base
  @All('users')
  async handleUsersBaseRequests(
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const path = request.url.replace(/^\/api/, '');
    return this.forwardRequest(request, response, 'http://auth-service:3002', `/api${path}`);
  }

  // Rota para users (lista de usuários) - sub-rotas
  @All('users/*path')
  async handleUsersRequests(
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const path = request.url.replace(/^\/api/, '');
    return this.forwardRequest(request, response, 'http://auth-service:3002', `/api${path}`);
  }

  // Rota para tasks service (base)
  @All('tasks')
  async handleTasksBaseRequests(
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const path = request.url.replace(/^\/api/, '');
    return this.forwardRequest(request, response, 'http://tasks-service:3003', `/api${path}`);
  }

  // Rota para tasks service (sub-rotas)
  @All('tasks/*')
  async handleTasksRequests(
    @Req() request: Request,
    @Res() response: Response,
  ) {
    // Extract path after /api/tasks, e.g. /api/tasks/1 -> /1
    const path = request.url.replace(/^\/api\/tasks/, '/api/tasks');
    return this.forwardRequest(request, response, 'http://tasks-service:3003', path);
  }

  private async forwardRequest(
    request: Request,
    response: Response,
    targetUrl: string,
    path: string,
  ) {    
    try {
      const fullUrl = `${targetUrl}${path}`;
      
      // Extract userId from JWT if present
      const headers: Record<string, string | string[] | undefined> = { ...request.headers };
      const authHeader = request.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
          // Simple JWT decode (base64)
          const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
          headers['x-user-id'] = payload.sub || payload.id || payload.userId;
        } catch (e) {
          // If JWT decode fails, continue without user id
        }
      }
      
      const result = await this.proxyService.forwardRequest(
        request.method,
        fullUrl,
        request.body,
        headers,
      );

      response.send(result);
    } catch (error: any) {
      response.status(error.status || 500).json({
        message: error.message || 'Internal Server Error',
        status: error.status || 500,
      });
    }
  }
}
