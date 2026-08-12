import { InvalidEmailError } from '../errors/InvalidEmailError';

export class Email {
  private constructor(public readonly value: string) {}

  static create(value: string): Email {
    const normalizedValue = value.trim().toLowerCase();

    if (!normalizedValue || !normalizedValue.includes('@')) {
      throw new InvalidEmailError();
    }

    return new Email(normalizedValue);
  }
}