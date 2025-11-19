# Coffee Chain Gateway API

Gateway API que integra os serviços de autenticação, blockchain e sumarização de safra.

## Endpoints

### Health Check
- `GET /health` - Status do gateway
- `GET /health/dependencies` - Status de todas as dependências

### Authentication
- `POST /auth/login` - Login com email e password
- `POST /auth/verify` - Verifica um token JWT

### Safra (Blockchain)
- `POST /safra` - Cria nova safra (requer token)
- `GET /safra/<safra_id>` - Obtém safra por ID (requer token)
- `GET /safra/<safra_id>/history` - Obtém histórico da safra (requer token)
- `GET /safra/validate` - Valida integridade da blockchain (requer token)

### Summary
- `POST /summary` - Sumariza dados da safra (requer token)
- `GET /summary/health` - Status do serviço de sumarização

## Setup Local

```bash
pip install -r requirements.txt
cp .env.example .env
python app.py
```

## Docker

```bash
docker build -t gateway:latest .
docker run -p 5002:5002 --env-file .env gateway:latest
```

## Variáveis de Ambiente

- `AUTH_API_URL` - URL da API de autenticação
- `BLOCKCHAIN_API_URL` - URL da API de blockchain
- `SUMMARY_API_URL` - URL da API de sumarização
- `API_GATEWAY_PORT` - Porta do gateway (padrão: 5002)
- `API_GATEWAY_HOST` - Host do gateway (padrão: 0.0.0.0)
