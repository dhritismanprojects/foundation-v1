import { Inject } from '@nestjs/common';

import { User } from '../../../domain/entities/User';
import { UserAlreadyExistsError } from '../../../domain/errors/UserAlreadyExistsError';
import { Email } from '../../../domain/value-objects/Email';
import type { UserRepository } from '../../repositories/UserRepository';
import type { PasswordHasher } from '../../services/PasswordHasher';
import { AUTHENTICATION_TOKENS } from '../../tokens';

export interface RegisterUserInput {
  id: string;
  email: string;
  password: string;
}

export class RegisterUser {
  constructor(
    @Inject(AUTHENTICATION_TOKENS.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(AUTHENTICATION_TOKENS.PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: RegisterUserInput): Promise<User> {
    const email = Email.create(input.email);

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new UserAlreadyExistsError();
    }

    const passwordHash = await this.passwordHasher.hash(
      input.password,
    );

    const user = User.create(
      input.id,
      email,
      passwordHash,
    );

    await this.userRepository.save(user);

    return user;
  }
}