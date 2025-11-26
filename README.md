<div align="center">
  <img src="/frontend/assets/logo.png" alt="CoffeeChain Logo" width="200"/>
</div>

# coffee-chain

Repositório para o ground-breaking, job-getter, interviewer-impresser "coffee-chain", a solução de alunos da UFLA para a rastreabilidade embutida em plantio de café no Brasil.

<div align="center">
  <img src="/frontend/assets/gif-coffee-chain.gif" alt="CoffeeChain Demo" width="500"/>
</div>

## Como rodar

A aplicação pode ser executada inteiramente via Docker Compose, que sobe todos os microsserviços, banco de dados, frontend e o modelo de IA.

#### Linux / Windows 10+
Na raiz do projeto, execute:

```bash
docker compose build --no-cache
docker compose up
```

Isso irá:
- Construir todas as imagens dos microsserviços,
- Baixar dependências necessárias (incluindo o modelo da IA),
- Iniciar os containers necessários para a execução.

### Pré-requisitos

- Docker e Docker Compose instalados
- Mínimo 4GB de RAM disponível (para Ollama)
- Conexão com internet para download do modelo LLM (~2GB)


## Features

- **Autenticação JWT**: Login seguro com tokens
- **Gateway API**: Ponto único de entrada com validação centralizada
- **Blockchain**: Registro imutável de safras
- **IA Generativa**: Sumarização automática de dados com Ollama
- **Rastreamento Completo**: Histórico de movimentações das safras
- **Interface Moderna**: Frontend com React + TypeScript
- **Microserviços**: Arquitetura escalável e modulada

## Problema e Motivação

A rastreabilidade de safras é um desafio recorrente na cadeia do agronegócio. Inspetores precisam registrar certificações e informações das lavouras de forma confiável, enquanto compradores dependem desses dados para validar a qualidade e a procedência do produto.

Hoje, esse processo costuma ser fragmentado, sujeito a erros humanos, difícil de auditar e vulnerável a alterações. Isso gera insegurança, risco de fraude e perda de competitividade internacional — especialmente em mercados onde a rastreabilidade é exigência legal ou comercial.

O projeto **CoffeeChain** resolve essa dor oferecendo:

- Registro imutável das informações da safra via blockchain  
- Consulta simplificada por compradores e inspetores  
- Indicação clara se os dados ainda estão pendentes ou já minerados  
- Sumarização inteligente por IA para acelerar auditorias  
- Autenticação distribuída garantindo disponibilidade dos microsserviços  

## Relevância do Problema

O mercado internacional exige cada vez mais transparência, certificações e rastreabilidade do café. Segundo o [CBI](https://www.cbi.eu/market-information/coffee/certified-coffee/market-potential), cafés certificados são justamente os que apresentam maior potencial de crescimento, pois consumidores europeus e norte-americanos pagam mais por produtos com origem comprovada.

Porém, um artigo da [Perfect Daily Grind](https://perfectdailygrind.com/2025/09/how-coffee-certifications-help-producers-higher-prices) apresenta que o processo atual de certificação é caro, complexo e burocrático, excluindo grande parte dos pequenos produtores que não conseguem arcar com auditorias e documentação extensiva. Já um artigo da [TraceX](https://tracextech.com/coffee-traceability-value-chain) evidencia que a rastreabilidade digital ainda é limitada por ferramentas fragmentadas e alto custo tecnológico, dificultando que produtores atendam exigências como as da EUDR.

Ou seja: existe demanda global por café rastreável e certificado, mas faltam soluções simples, acessíveis e confiáveis para registrar e comprovar a origem da produção. Nosso projeto atua exatamente nessa lacuna.


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

## Arquitetura e Agentes 

O sistema envolve três agentes principais:

### • Usuário
Representado pelos papéis:
- **Inspector**: registra safras, certificações e dados técnicos.
- **Buyer**: consulta safras e valida informações.

Ambos acessam o sistema via frontend e gateway.

### • Blockchain (agente autônomo)
Responsável por:
- armazenar dados de forma imutável,
- minerar blocos automaticamente quando há dados pendentes suficientes,
- fornecer histórico completo da safra.

### • IA de Sumarização (agente assistente)
O serviço **summary-ai** atua como um agente que interpreta dados da safra e:
- gera resumos automáticos com base nas informações registradas,
- auxilia compradores e inspetores na compreensão rápida da safra,
- opera de maneira independente, processando consultas via gateway.

A interação entre componentes ocorre por meio dos microsserviços:
- **gateway** — entrada única e roteamento  
- **auth-ms** — autenticação e geração de tokens  
- **blockchain** — registro das safras e mineração  
- **summary-ai** — geração de resumos via IA  
- **frontend** — interface do usuário


## Mitigações e Medidas de Segurança

O CoffeeChain implementa diversas estratégias para garantir segurança, disponibilidade e confiabilidade:

- **Gateway centralizado**  
  Controla entrada de requests, valida tipos de dados e protege os microsserviços através de rede privada e proxy reverso.

- **Auditoria completa do blockchain**  
  Cada operação é registrada, permitindo rastreamento de quem fez o quê, quando e com quais dados.

- **Autenticação distribuída**  
  Cada microsserviço possui capacidade de validar tokens JWT sem depender exclusivamente do auth-ms, protegendo o sistema mesmo em caso de falha do serviço de auth.

- **Validação de papéis (roles)**  
  Cada microsserviço realiza validações independentes:  
  - *buyer* só consulta  
  - *inspector* cria safras  
  - *ambos* podem gerar resumos por IA

Essas medidas reduzem riscos de uso inadequado, falhas de autenticação e alterações indevidas nos dados.


## Autoria

[Gabriel Coelho Costa](https://github.com/gabrielzinCoelho)<br>[Isac Gonçalves Cunha](https://github.com/isaccunha)<br>[Otávio Sbampato](https://github.com/otaviosbampato)<br>[Paulo Henrique Ribeiro Alves](https://github.com/paulohenrique64)