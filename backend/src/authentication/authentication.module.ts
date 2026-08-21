import { Module } from '@nestjs/common';

import { AuthenticationController } from './interfaces/http/AuthenticationController';
import { RegisterUser } from './application/use-cases/RegisterUser/RegisterUser';
import { AUTHENTICATION_TOKENS } from './application/tokens';
import { DrizzleUserRepository } from './infrastructure/persistence/DrizzleUserRepository';
import { Argon2PasswordHasher } from './infrastructure/security/Argon2PasswordHasher';

@Module({
  controllers: [AuthenticationController],
  providers: [
    RegisterUser,
    {
      provide: AUTHENTICATION_TOKENS.USER_REPOSITORY,
      useClass: DrizzleUserRepository,
    },
    {
      provide: AUTHENTICATION_TOKENS.PASSWORD_HASHER,
      useClass: Argon2PasswordHasher,
    },
  ],
})
export class AuthenticationModule {}