import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  it('/auth/register (POST) - should fail with invalid data', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: '', password: '' })
      .expect(400);
  });

  // Para rodar o teste de registro e login real, seria necessário um banco de dados de teste limpo.
  // Aqui está um exemplo de como seria:
  // it('/auth/register (POST) - should register', async () => {
  //   const res = await request(app.getHttpServer())
  //     .post('/auth/register')
  //     .send({ email: 'e2e@example.com', password: '123456' });
  //   expect(res.status).toBe(201);
  //   expect(res.body).toHaveProperty('userId');
  // });

  afterAll(async () => {
    await app.close();
  });
});
