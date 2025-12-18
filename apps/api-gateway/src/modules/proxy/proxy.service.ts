import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProxyService {
  constructor(private httpService: HttpService) {}

  async forwardRequest(
    method: string,
    url: string,
    data?: any,
    headers?: any,
  ) {
    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method: method as any,
          url,
          data,
          headers: {
            ...headers,
            host: undefined, // Remove host header to avoid conflicts
          },
        }),
      );

      return response.data;
    } catch (error: any) {
      const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.response?.data?.message || error.message;
      throw new HttpException(message, status);
    }
  }
}
