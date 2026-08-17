import { eq } from 'drizzle-orm';

import { UserRepository } from '../../application/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import { Email } from '../../domain/value-objects/Email';
import { db } from '../database/database';
import { users } from './UserSchema';

export class DrizzleUserRepository implements UserRepository {
  async save(user: User): Promise<void> {
    await db.insert(users).values({
      id: user.id,
      email: user.email.value,
      passwordHash: user.passwordHash,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async findByEmail(email: Email): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email.value))
      .limit(1);

    const user = result[0];

    if (!user) {
      return null;
    }

    return User.reconstitute(
      user.id,
      Email.create(user.email),
      user.passwordHash,
      user.emailVerified,
      user.createdAt,
      user.updatedAt,
    );
  }
}