import { User } from './User';
import { Email } from '../value-objects/Email';

describe('User', () => {
  it('should create an unverified user', () => {
    const email = Email.create('user@example.com');

    const user = User.create(
      'user-123',
      email,
      'hashed-password',
    );

    expect(user.id).toBe('user-123');
    expect(user.email.value).toBe('user@example.com');
    expect(user.passwordHash).toBe('hashed-password');
    expect(user.emailVerified).toBe(false);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });
});