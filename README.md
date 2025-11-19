<div align="center">
  <img src="/frontend/assets/logo.png" alt="CoffeeChain Logo" width="200"/>
</div>

# coffee-chain

Repositório para o ground-breaking, job-getter, interviewer-impresser "coffee-chain", a solução de alunos da UFLA para a rastreabilidade embutida em plantio de café no Brasil.

<div align="center">
  <img src="/frontend/assets/gif-coffee-chain.gif" alt="CoffeeChain Demo" width="500"/>
</div>

## Como rodar

#### Linux
Execute `./run-all.sh` na raíz do projeto para subir Postgres, o auth service (NestJS) e o frontend (Vite) de uma vez só, abrindo 3 terminais gnome separados.

#### Windows 10+
Execute o arquivo run-all.bat como administrador.

> [!TIP]
> É possível rodar direto em ambas as plataformas pelo vscode. 
> Ctrl+Shift+P, e então execute *Tasks: Run Task*.

### Pré-requisitos

- Docker e Docker Compose instalados
- Mínimo 4GB de RAM disponível (para Ollama)
- Conexão com internet para download do modelo LLM (~2GB)

### Desenvolvimento Local

Se preferir rodar serviços localmente:

```bash
# Terminal 1: Gateway API (Python)
cd gateway
pip install -r requirements.txt
python app.py

# Terminal 2: Auth Service (NestJS)
cd auth-ms
npm install
npm run start:dev

# Terminal 3: Blockchain (Python)
cd blockchain
pip install -r requirements.txt
python run.py

# Terminal 4: Frontend (React)
cd frontend
npm install
npm run dev

# Terminal 5: Dependências (Docker)
docker-compose -f docker-compose.dev.yaml up
```

## Features

- **Autenticação JWT**: Login seguro com tokens
- **Gateway API**: Ponto único de entrada com validação centralizada
- **Blockchain**: Registro imutável de safras
- **IA Generativa**: Sumarização automática de dados com Ollama
- **Rastreamento Completo**: Histórico de movimentações das safras
- **Interface Moderna**: Frontend com React + TypeScript
- **Microserviços**: Arquitetura escalável e modulada

## API Gateway

O Gateway API em Python Flask integra todos os serviços:

- Validação rigorosa de entrada com Pydantic
- Middleware de autenticação JWT
- Tratamento centralizado de erros
- Mensagens de erro claras e descritivas

### Endpoints Principais

```bash
# Health Check
GET /health
GET /health/dependencies

# Autenticação
POST /auth/login
POST /auth/verify

# Safra (Blockchain)
POST /safra
GET /safra/<id>
GET /safra/<id>/history
GET /safra/validate

# Sumarização
POST /summary
GET /summary/health
```

Veja `DEPLOYMENT.md` para documentação completa dos endpoints.

## Stack Tecnológico

### Frontend
- React 18 + TypeScript
- Vite + TailwindCSS
- Context API para estado

### Backend
- **Gateway**: Flask + Pydantic + Gunicorn
- **Auth**: NestJS + Prisma + PostgreSQL
- **Blockchain**: Python Flask (blockchain customizado)
- **Summary**: Python Flask + Ollama (llama3.2:1b)

## Testes

```bash
chmod +x test-gateway.sh
./test-gateway.sh
```

Script automatizado que testa:
- Health checks
- Login e verificação de token
- Fluxo completo de safra
- Sumarização com IA

## Autoria

[Gabriel Coelho Costa](https://github.com/gabrielzinCoelho)<br>[Isac Gonçalves Cunha](https://github.com/isaccunha)<br>[Otávio Sbampato](https://github.com/otaviosbampato)<br>[Paulo Henrique Ribeiro Alves](https://github.com/paulohenrique64)