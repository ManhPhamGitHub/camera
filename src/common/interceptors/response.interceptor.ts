import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { formatSuccessResponse } from '../utils';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { originalUrl, method } = context.switchToHttp().getRequest();
    this.logger.log(`[Logging] Request to ${originalUrl} method ${method}`);

    return next.handle().pipe(
      map((value) => {
        return formatSuccessResponse(null, 'Success', value);
      }),
    );
  }
}
