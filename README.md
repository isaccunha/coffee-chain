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

- Docker rodando localmente. Se seu usuário não tiver permissão de acessar o socket, o script usa `sudo docker ...` automaticamente e pedirá a senha.
- Node.js 18+ e `npm` disponíveis no PATH do usuário (para que os processos de frontend/auth rodem fora do `sudo`).

### Customização rápida

Se precisar ajustar comando ou porta, você pode exportar variáveis antes de rodar:

- `AUTH_CMD` – comando do serviço de autenticação (padrão `npm run start:dev`)
- `FRONTEND_CMD` – comando do frontend (padrão `npm run dev -- --host 0.0.0.0 --port 5173`)
- `AUTH_DB_USER`, `AUTH_DB_PASSWORD`, `AUTH_DB_NAME` – credenciais do Postgres se você alterar o `docker-compose`.

Exemplo prático:

```bash
FRONTEND_CMD="npm run dev -- --port 4173" ./run-all.sh
```

## Features

- Autenticação com fluxo de login e registro para diferentes perfis.
- Cadastro de produtores e propriedades.
- Criação e acompanhamento de lotes de café ao longo da cadeia.
- Histórico de movimentações para rastrear o que aconteceu com cada lote.
- Frontend em Vite + React pensado para uso rápido em ambiente de teste.

## Autoria

[Gabriel Coelho Costa](https://github.com/gabrielzinCoelho)<br>[Isac Gonçalves Cunha](https://github.com/isaccunha)<br>[Otávio Sbampato](https://github.com/otaviosbampato)<br>[Paulo Henrique Ribeiro Alves](https://github.com/paulohenrique64)