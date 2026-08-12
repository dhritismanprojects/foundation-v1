import { Email } from './Email';
import { InvalidEmailError } from '../errors/InvalidEmailError';

describe('Email', () => {
  it('should normalize a valid email', () => {
    const email = Email.create('  User@Example.COM  ');

    expect(email.value).toBe('user@example.com');
  });

  it('should reject an invalid email', () => {
    expect(() => Email.create('invalid-email')).toThrow(
      InvalidEmailError,
    );
  });
});