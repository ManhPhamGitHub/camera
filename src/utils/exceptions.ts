import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCodes } from './errorCodes';

export class InternalServerException extends HttpException {
  constructor(
    message = 'ServerError',
    code: any = ErrorCodes.SERVER_ERROR,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    const data = {
      message: message,
      validateCode: code,
    };
    super(data, statusCode);
  }
}

export class ParamsException extends HttpException {
  constructor(
    message = 'Invalid Parameter',
    code: any = ErrorCodes.PARAMETER_ERROR,
    statusCode: number = HttpStatus.BAD_REQUEST,
  ) {
    const data = {
      message: message,
      validateCode: code,
    };
    super(data, statusCode);
  }
}

export class ForbiddenException extends HttpException {
  constructor(
    message = 'Forbidden',
    code: any = ErrorCodes.FORBIDDEN_ERROR,
    statusCode: number = HttpStatus.FORBIDDEN,
  ) {
    const data = {
      message: message,
      validateCode: code,
    };
    super(data, statusCode);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(
    message = 'Unauthorized',
    code: any = ErrorCodes.UNAUTHORIZED_ERROR,
    statusCode: number = HttpStatus.UNAUTHORIZED,
  ) {
    const data = {
      message: message,
      validateCode: code,
    };
    super(data, statusCode);
  }
}

export class NotFoundException extends HttpException {
  constructor(
    message = 'Not found',
    code: any = ErrorCodes.NOT_FOUND_ERROR,
    statusCode: number = HttpStatus.NOT_FOUND,
  ) {
    const data = {
      message: message,
      validateCode: code,
    };
    super(data, statusCode);
  }
}

export class ConflictException extends HttpException {
  constructor(
    message = 'Conflict error',
    code: any = ErrorCodes.CONFLICT_ERROR,
    statusCode: number = HttpStatus.CONFLICT,
  ) {
    const data = {
      message: message,
      validateCode: code,
    };
    super(data, statusCode);
  }
}
