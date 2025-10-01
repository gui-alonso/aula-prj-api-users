## API de Usuários — Guia Rápido

### Requisitos
- **Node.js** 18+ e **npm**
- **MySQL** 8+

### Instalação
```bash
npm install
```

### Configurar ambiente (.env)
Crie um arquivo `.env` na raiz com:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=prj_api_users
```

### Criar banco e tabela
Execute no MySQL:
```sql
CREATE DATABASE IF NOT EXISTS prj_api_users CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE prj_api_users;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  passwordHash VARCHAR(255) NOT NULL,
  role VARCHAR(30) DEFAULT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Scripts
- Iniciar em produção: `npm start`
- Iniciar em desenvolvimento (auto-reload): `npm run dev`

O servidor sobe em `http://localhost:3000`.

### Endpoints
- POST `/api/users` — cria usuário
  - Body JSON: `{ "nome": "...", "email": "...", "senha": "..." }`
- GET `/api/users` — lista usuários
- GET `/api/users/:id` — busca por ID
- PUT `/api/users/:id` — atualiza (pode enviar qualquer um dos campos `nome`, `email`, `senha`)
- DELETE `/api/users/:id` — remove usuário

### Stack e libs principais
- `express`, `cors`, `mysql2/promise`, `bcrypt`, `dotenv`, `express-rate-limit`, `express-validator`, `helmet`, `morgan`, `uuid`, `nodemon`

Instalar (dependências de produção):
```bash
npm i express cors mysql2 mysql2-promise bcrypt dotenv express-rate-limit express-validator helmet morgan uuid
```

Instalar (dependências de desenvolvimento):
```bash
npm i -D nodemon
```

### Observações
- As senhas são armazenadas com `bcrypt` (SALT_ROUNDS=10).
- Habilitado CORS e `express.json()` por padrão.
