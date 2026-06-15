# Sistema de Reserva de Salas

Sistema completo para gestão de reservas de salas com backend Node.js/Express/PostgreSQL e frontend React/Vite.

## Funcionalidades

- Autenticação JWT (login/registo)
- CRUD de utilizadores (admin gerencia)
- CRUD de salas (admin cria/edita/apaga, todos visualizam)
- CRUD de reservas (qualquer utilizador autenticado)
- Deteção de conflitos de horário
- Controlo de permissões (admin vs user)
- Frontend React com dashboard em abas

## Stack

| Camada    | Tecnologia                     |
|-----------|--------------------------------|
| Backend   | Node.js, Express               |
| Base de dados | PostgreSQL                 |
| Autenticação | JWT (jsonwebtoken), bcryptjs |
| Frontend  | React 19, Vite 8               |

## Estrutura do Projeto

```
.
├── src/                    # Backend (Node.js + Express)
│   ├── server.js           # Ponto de entrada
│   ├── config/db.js        # Conexão PostgreSQL
│   ├── models/             # Queries SQL
│   ├── controllers/        # Lógica de negócio
│   ├── middleware/         # Auth e validação
│   └── routes/             # Definição de rotas
├── frontend/               # Frontend (React + Vite)
│   └── src/
│       ├── Services/api.js # Chamadas à API
│       └── components/     # Login e Dashboard
├── database/
│   └── reservas_salas.sql  # Schema + dados iniciais
└── .env.example            # Template de configuração
```

## Setup

### Pré-requisitos

- Node.js 18+
- PostgreSQL 14+

### 1. Base de Dados

```bash
# Criar a base de dados
createdb reservas_salas

# Executar o script SQL
psql -d reservas_salas -f database/reservas_salas.sql
```

### 2. Configuração

```bash
cp .env.example .env
# Editar .env com as credenciais da sua base de dados
```

### 3. Backend

```bash
# Instalar dependências
npm install

# Iniciar servidor (desenvolvimento com hot-reload)
npm run dev

# Ou em produção
npm start
```

O servidor inicia em `http://localhost:3000`.

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend inicia em `http://localhost:5173` (Vite) e faz proxy para a API em `http://localhost:3000/api`.

## API Endpoints

### Autenticação

| Método | Rota                    | Descrição        | Auth |
|--------|------------------------|------------------|:----:|
| POST   | `/api/auth/login`      | Login            | -    |
| POST   | `/api/auth/registar`   | Registar novo user | -  |

### Utilizadores (admin)

| Método | Rota                    | Descrição        | Auth |
|--------|------------------------|------------------|:----:|
| GET    | `/api/usuarios`        | Listar todos     | Admin |
| GET    | `/api/usuarios/:id`    | Buscar por ID    | Auth |
| POST   | `/api/usuarios`        | Criar            | Admin |
| PUT    | `/api/usuarios/:id`    | Atualizar        | Auth |
| DELETE | `/api/usuarios/:id`    | Apagar           | Admin |

### Salas

| Método | Rota                    | Descrição        | Auth |
|--------|------------------------|------------------|:----:|
| GET    | `/api/salas`           | Listar todas     | Auth |
| GET    | `/api/salas/:id`       | Buscar por ID    | Auth |
| POST   | `/api/salas`           | Criar            | Admin |
| PUT    | `/api/salas/:id`       | Atualizar        | Admin |
| DELETE | `/api/salas/:id`       | Apagar           | Admin |

### Reservas

| Método | Rota                    | Descrição        | Auth |
|--------|------------------------|------------------|:----:|
| GET    | `/api/reservas`        | Listar todas     | Auth |
| GET    | `/api/reservas/:id`    | Buscar por ID    | Auth |
| POST   | `/api/reservas`        | Criar            | Auth |
| PUT    | `/api/reservas/:id`    | Atualizar        | Auth |
| DELETE | `/api/reservas/:id`    | Apagar           | Auth |

> **Nota:** Apenas o criador da reserva ou admin podem alterar/apagar reservas.

## Dados de Teste

O script SQL insere dados de exemplo:

### Utilizadores
| Nome               | Email                | Password  | Role  |
|--------------------|----------------------|-----------|:-----:|
| Admin Sistema      | admin@empresa.cv     | senha123  | admin |
| Kelly Fortes       | kelly@empresa.cv     | senha123  | user  |
| Jarni Timas        | jarni@empresa.cv     | senha123  | user  |
| Leonardo Dionisio  | leonardo@empresa.cv  | senha123  | user  |
| William Pires      | william@empresa.cv   | senha123  | user  |

### Salas
| Sala                | Capacidade | Localização      |
|---------------------|:----------:|------------------|
| Sala A              | 10         | Piso 1 - Ala Norte |
| Sala B              | 20         | Piso 1 - Ala Sul |
| Sala de Conferencias | 50        | Piso 2           |
| Sala de Formacao    | 30         | Piso 3           |
| Sala Executiva      | 8          | Piso 2 - Ala Norte |

## Exemplos de Uso (API)

```bash
# Login como admin
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@empresa.cv","password":"senha123"}'

# Listar salas (usar token recebido)
curl http://localhost:3000/api/salas \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Criar reserva
curl -X POST http://localhost:3000/api/reservas \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"id_sala":1,"data_inicio":"2026-07-01 09:00:00","data_fim":"2026-07-01 10:00:00","descricao":"Reunião"}'
```

## Scripts Disponíveis

### Backend
| Comando         | Descrição                    |
|-----------------|------------------------------|
| `npm start`     | Iniciar servidor (produção)  |
| `npm run dev`   | Iniciar com nodemon (dev)    |

### Frontend
| Comando              | Descrição                    |
|----------------------|------------------------------|
| `npm run dev`        | Iniciar servidor Vite (dev)  |
| `npm run build`      | Build para produção          |
| `npm run preview`    | Preview do build             |
