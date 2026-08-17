import { User } from '../../../domain/entities/User';
import { Email } from '../../../domain/value-objects/Email';
import { UserRepository } from '../../repositories/UserRepository';

export interface RegisterUserInput {
  id: string;
  email: string;
  passwordHash: string;
}

export class RegisterUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: RegisterUserInput): Promise<User> {
    const email = Email.create(input.email);

    const user = User.create(
      input.id,
      email,
      input.passwordHash,
    );

    await this.userRepository.save(user);

    return user;
  }
}