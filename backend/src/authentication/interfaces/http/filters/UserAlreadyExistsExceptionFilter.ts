import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';

import { UserAlreadyExistsError } from '../../../domain/errors/UserAlreadyExistsError';

@Catch(UserAlreadyExistsError)
export class UserAlreadyExistsExceptionFilter
  implements ExceptionFilter
{
  catch(
    _exception: UserAlreadyExistsError,
    host: ArgumentsHost,
  ) {
    const response = host.switchToHttp().getResponse();

    response.status(409).json({
      statusCode: 409,
      message: 'User already exists',
    });
  }
}