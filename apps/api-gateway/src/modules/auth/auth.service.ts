import { Injectable } from '@nestjs/common';
import axios, { Method } from 'axios';

@Injectable()
export class AuthService {
  private readonly baseUrl = 'http://auth-service:3002';

  async forward(method: Method, path: string, body?: any, headers?: any) {
    try {
      console.log('[GATEWAY] Forwarding:', {
        method,
        url: `${this.baseUrl}${path}`,
        body,
      });

      const response = await axios.request({
        method,
        url: `${this.baseUrl}${path}`,
        data: body,
        headers,
        timeout: 5000,
      });

      return response.data;
    } catch (error: any) {
      console.error('[GATEWAY ERROR]', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      throw error;
    }
  }
}
