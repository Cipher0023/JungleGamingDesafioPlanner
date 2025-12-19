import { Test, TestingModule } from '@nestjs/testing';
import { ProxyService } from './proxy.service';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosResponse, AxiosError } from 'axios';

describe('ProxyService', () => {
  let service: ProxyService;
  let httpService: HttpService;

  const mockHttpService = {
    request: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProxyService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<ProxyService>(ProxyService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('forwardRequest', () => {
    it('deve encaminhar requisição GET com sucesso', async () => {
      const mockResponse: AxiosResponse = {
        data: { id: '1', name: 'Test' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.request.mockReturnValue(of(mockResponse));

      const result = await service.forwardRequest(
        'GET',
        'http://test-service:3000/api/test',
        undefined,
        { authorization: 'Bearer token123' },
      );

      expect(mockHttpService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: 'http://test-service:3000/api/test',
        data: undefined,
        headers: { authorization: 'Bearer token123' },
      });
      expect(result).toEqual({ id: '1', name: 'Test' });
    });

    it('deve encaminhar requisição POST com body', async () => {
      const mockResponse: AxiosResponse = {
        data: { success: true },
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as any,
      };

      const requestBody = { title: 'New Task', description: 'Test' };

      mockHttpService.request.mockReturnValue(of(mockResponse));

      const result = await service.forwardRequest(
        'POST',
        'http://tasks-service:3003/api/tasks',
        requestBody,
        { 'content-type': 'application/json', 'x-user-id': 'user-123' },
      );

      expect(mockHttpService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: 'http://tasks-service:3003/api/tasks',
        data: requestBody,
        headers: { 
          'content-type': 'application/json',
          'x-user-id': 'user-123',
        },
      });
      expect(result).toEqual({ success: true });
    });

    it('deve lançar erro quando serviço falha', async () => {
      const axiosError = {
        response: {
          data: { message: 'Service error' },
          status: 500,
        },
      } as AxiosError;

      mockHttpService.request.mockReturnValue(throwError(() => axiosError));

      await expect(
        service.forwardRequest(
          'GET',
          'http://failing-service:3000/api/test',
          undefined,
          {},
        ),
      ).rejects.toThrow();
    });

    it('deve lidar com timeout de requisição', async () => {
      const timeoutError = {
        code: 'ECONNABORTED',
        message: 'timeout of 5000ms exceeded',
      } as AxiosError;

      mockHttpService.request.mockReturnValue(throwError(() => timeoutError));

      await expect(
        service.forwardRequest(
          'GET',
          'http://slow-service:3000/api/test',
          undefined,
          {},
        ),
      ).rejects.toThrow();
    });
  });
});
