import * as argon2 from 'argon2';

import { PasswordHasher } from '../../application/services/PasswordHasher';

export class Argon2PasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
    });
  }
}