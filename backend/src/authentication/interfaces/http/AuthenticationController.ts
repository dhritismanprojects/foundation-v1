import {
  Body,
  Controller,
  Post,
  UseFilters,
} from '@nestjs/common';

import { RegisterUser } from '../../application/use-cases/RegisterUser/RegisterUser';
import { RegisterUserRequest } from './dtos/RegisterUserRequest';
import { UserAlreadyExistsExceptionFilter } from './filters/UserAlreadyExistsExceptionFilter';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly registerUser: RegisterUser,
  ) {}

  @Post('register')
  @UseFilters(UserAlreadyExistsExceptionFilter)
  async register(
    @Body()
    body: RegisterUserRequest,
  ) {
    const user = await this.registerUser.execute({
      id: crypto.randomUUID(),
      email: body.email,
      password: body.password,
    });

    return {
      id: user.id,
      email: user.email.value,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    };
  }
}