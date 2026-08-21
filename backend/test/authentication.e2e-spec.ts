import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '../src/app.module';
import { pool } from '../src/authentication/infrastructure/database/database';

describe('Authentication (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await pool.end();
  });

  it('POST /auth/register should register a user', async () => {
    const email = `e2e-${Date.now()}@example.com`;

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email,
        password: 'MySecurePassword123',
      })
      .expect(201);

    expect(response.body).toMatchObject({
      email,
      emailVerified: false,
    });

    expect(response.body.id).toEqual(expect.any(String));
    expect(response.body.createdAt).toEqual(expect.any(String));
    expect(response.body.passwordHash).toBeUndefined();
  });

  it('POST /auth/register should reject invalid input', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'not-an-email',
        password: '123',
      })
      .expect(400);

    expect(response.body).toMatchObject({
      statusCode: 400,
      message: [
        'email must be an email',
        'password must be longer than or equal to 8 characters',
      ],
    });
  });

  it('POST /auth/register should reject a duplicate email', async () => {
    const email = `duplicate-${Date.now()}@example.com`;

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email,
        password: 'MySecurePassword123',
      })
      .expect(201);

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email,
        password: 'AnotherSecurePassword123',
      })
      .expect(409);

    expect(response.body).toEqual({
      statusCode: 409,
      message: 'User already exists',
    });
  });
});