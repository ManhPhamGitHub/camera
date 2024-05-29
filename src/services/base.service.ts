import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class BaseService {
  private baseUrl: string;
  private readonly httpService: HttpService;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.httpService = new HttpService();
  }

  private getUrl(path: string) {
    return `${this.baseUrl}${path}`;
  }

  get<T>(path: string, config?: AxiosRequestConfig<any>) {
    return firstValueFrom(
      this.httpService.get<T>(this.getUrl(path), config).pipe(
        catchError((err) => {
          console.log('ERR => ', err.response.data, path);
          throw new HttpException(
            { code: 500, message: `Get ${path} error` },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }),
      ),
    );
  }

  post<T>(path: string, data?: any, config?: AxiosRequestConfig<any>) {
    return firstValueFrom(
      this.httpService.post<T>(this.getUrl(path), data, config).pipe(
        catchError((err) => {
          console.log('ERR => ', err.response.data, data);

          throw new HttpException(
            {
              code: 500,
              message:
                err.response?.data?.error?.message ||
                err.response?.data?.errorMessage ||
                `Post ${path} error`,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }),
      ),
    );
  }

  put<T>(path: string, data?: any, config?: AxiosRequestConfig<any>) {
    return firstValueFrom(
      this.httpService.put<T>(this.getUrl(path), data, config).pipe(
        catchError((err) => {
          console.log('ERR => ', err.response.data, data);
          throw new HttpException(
            {
              code: 500,
              message:
                err.response?.data?.error?.message || `Put ${path} error`,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }),
      ),
    );
  }

  delete<T>(path: string, config?: AxiosRequestConfig<any>) {
    return firstValueFrom(
      this.httpService.delete<T>(this.getUrl(path), config).pipe(
        catchError((err) => {
          console.log('ERR => ', err.response.data, path);
          throw new HttpException(
            {
              code: 500,
              message:
                err.response?.data?.error?.message || `Get ${path} error`,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }),
      ),
    );
  }

  request<T>(config: AxiosRequestConfig<any>) {
    return firstValueFrom(
      this.httpService.request<T>(config).pipe(
        catchError((err) => {
          console.log('ERR => ', err.response.data);
          throw new HttpException(
            { code: 500, message: `${config.method}: ${config.url} error` },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }),
      ),
    );
  }
}
