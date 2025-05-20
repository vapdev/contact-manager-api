import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    // Cria usuário e faz login para obter token
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'usere2e@example.com', password: '123456' });
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'usere2e@example.com', password: '123456' });
    jwtToken = loginRes.body.access_token;
  });

  it('/auth/me (GET) - deve retornar dados do usuário autenticado', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('email', 'usere2e@example.com');
  });

  afterAll(async () => {
    await app.close();
  });
});
