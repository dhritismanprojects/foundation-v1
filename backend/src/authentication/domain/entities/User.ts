import { Email } from '../value-objects/Email';

export class User {
  private constructor(
    public readonly id: string,
    public readonly email: Email,
    public readonly passwordHash: string,
    public readonly emailVerified: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(
    id: string,
    email: Email,
    passwordHash: string,
  ): User {
    const now = new Date();

    return new User(
      id,
      email,
      passwordHash,
      false,
      now,
      now,
    );
  }

  static reconstitute(
    id: string,
    email: Email,
    passwordHash: string,
    emailVerified: boolean,
    createdAt: Date,
    updatedAt: Date,
  ): User {
    return new User(
      id,
      email,
      passwordHash,
      emailVerified,
      createdAt,
      updatedAt,
    );
  }
}