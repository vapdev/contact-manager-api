import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setupTestApp } from './app.e2e-setup';

describe('ContactsController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const { app: testApp } = await setupTestApp();
    app = testApp;

    // Cria usuário e faz login para obter token
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'contacte2e@example.com', password: '123456' });
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'contacte2e@example.com', password: '123456' });
    jwtToken = loginRes.body.access_token;
  });

  it('/contacts (POST) - deve criar contato', async () => {
    const res = await request(app.getHttpServer())
      .post('/contacts')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ name: 'Contato E2E', email: 'contato@e2e.com', phone: '123456789' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('/contacts (GET) - deve listar contatos', async () => {
    const res = await request(app.getHttpServer())
      .get('/contacts')
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  afterAll(async () => {
    await app.close();
  });
});
