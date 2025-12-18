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

  // Rota para tasks service
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
      
      const result = await this.proxyService.forwardRequest(
        request.method,
        fullUrl,
        request.body,
        request.headers as any,
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
