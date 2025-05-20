# Contact Manager API

API RESTful para gerenciamento de usuários e contatos, construída com NestJS, MongoDB (Mongoose) e JWT.

## Como rodar o projeto

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure as variáveis de ambiente (exemplo: `.env`):
   ```env
   MONGO_URI=mongodb://localhost:27017/contact-manager
   JWT_SECRET=sua_chave_secreta
   ```
3. Inicie o servidor em modo desenvolvimento:
   ```bash
   npm run start:dev
   ```
   O servidor estará disponível em http://localhost:3001

## Como rodar os testes

- **Testes unitários:**
  ```bash
  npm run test
  ```
- **Testes de integração (e2e):**
  ```bash
  npm run test:e2e
  ```
- **Cobertura de testes:**
  ```bash
  npm run test:cov
  ```

## Documentação da API

Acesse a documentação interativa (Swagger):
[http://localhost:3001/api](http://localhost:3001/api)

Principais rotas:

### Autenticação
- `POST /auth/register` — Registra um novo usuário
- `POST /auth/login` — Realiza login e retorna um token JWT
- `GET /auth/me` — Retorna dados do usuário autenticado (requer JWT)

### Contatos (requer autenticação)
- `POST /contacts` — Cria um novo contato
- `GET /contacts` — Lista todos os contatos do usuário
- `GET /contacts/:id` — Busca um contato pelo ID
- `PUT /contacts/:id` — Atualiza um contato
- `DELETE /contacts/:id` — Remove um contato

Veja exemplos de requisição e resposta, modelos e mais detalhes na seção de documentação da API acima.

---
Espero que tenha gostado do projeto! Qualquer coisa, é só chamar.

Email: vpbohn@gmail.com

LinkedIn: https://www.linkedin.com/in/vitorpbohn/