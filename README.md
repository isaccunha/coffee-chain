<div align="center">
  <img src="/frontend/assets/logo.png" alt="CoffeeChain Logo" width="200"/>
</div>

# coffee-chain

Repositório para o ground-breaking, job-getter, interviewer-impresser "coffee-chain", a solução de alunos da UFLA para a rastreabilidade embutida em plantio de café no Brasil.

<div align="center">
  <img src="/frontend/assets/gif-coffee-chain.gif" alt="CoffeeChain Demo" width="500"/>
</div>

---

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

---

## Features

- **Autenticação JWT**: Login seguro com tokens
- **Gateway API**: Ponto único de entrada com validação centralizada
- **Blockchain**: Registro imutável de safras
- **IA Generativa**: Sumarização automática de dados com Ollama
- **Rastreamento Completo**: Histórico de movimentações das safras
- **Interface Moderna**: Frontend com React + TypeScript
- **Microserviços**: Arquitetura escalável e modulada

---

## Problema e Motivação

A rastreabilidade de safras é um desafio recorrente na cadeia do agronegócio. Inspetores precisam registrar certificações e informações das lavouras de forma confiável, enquanto compradores dependem desses dados para validar a qualidade e a procedência do produto.

Hoje, esse processo costuma ser fragmentado, sujeito a erros humanos, difícil de auditar e vulnerável a alterações. Isso gera insegurança, risco de fraude e perda de competitividade internacional — especialmente em mercados onde a rastreabilidade é exigência legal ou comercial.

O projeto **CoffeeChain** resolve essa dor oferecendo:

- Registro imutável das informações da safra via blockchain  
- Consulta simplificada por compradores e inspetores  
- Indicação clara se os dados ainda estão pendentes ou já minerados  
- Sumarização inteligente por IA para acelerar auditorias  
- Autenticação distribuída garantindo disponibilidade dos microsserviços  

---

## Relevância do Problema

O mercado internacional exige cada vez mais transparência, certificações e rastreabilidade do café. Segundo o [CBI](https://www.cbi.eu/market-information/coffee/certified-coffee/market-potential), cafés certificados são justamente os que apresentam maior potencial de crescimento, pois consumidores europeus e norte-americanos pagam mais por produtos com origem comprovada.

Porém, um artigo da [Perfect Daily Grind](https://perfectdailygrind.com/2025/09/how-coffee-certifications-help-producers-higher-prices) apresenta que o processo atual de certificação é caro, complexo e burocrático, excluindo grande parte dos pequenos produtores que não conseguem arcar com auditorias e documentação extensiva. Já um artigo da [TraceX](https://tracextech.com/coffee-traceability-value-chain) evidencia que a rastreabilidade digital ainda é limitada por ferramentas fragmentadas e alto custo tecnológico, dificultando que produtores atendam exigências como as da EUDR.

Ou seja: existe demanda global por café rastreável e certificado, mas faltam soluções simples, acessíveis e confiáveis para registrar e comprovar a origem da produção. Nosso projeto atua exatamente nessa lacuna.

---

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

---

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

---

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

---

# Diagramas e modelos

## Visão inicial (Pré-Modelagem)

<div align="center">
  <img src="/docs/pre-modelagem.png" alt="pre-modelagem" width="800"/>
</div>

#### Arquitetura Inicial e Suas Vulnerabilidades

Na arquitetura inicial do sistema, todos os microserviços compartilhavam uma única rede interna, com a API Gateway sendo responsável tanto pela autenticação quanto pela autorização dos usuários. A API Gateway gerava os tokens JWT, incluindo as roles no payload, e validava os tokens nas requisições subsequentes. Embora simples, essa abordagem apresentava diversas vulnerabilidades, principalmente no que diz respeito à segurança das chaves de autenticação e à centralização do processo. A API Gateway, sendo a única responsável pela autenticação, representava um ponto único de falha, e a própria transmissão do token por toda a rede interna poderia ser interceptada, caso não fosse devidamente protegida. Além disso, o fato de os microserviços compartilharem a mesma rede interna sem um isolamento adequado expunha o sistema a riscos de escalonamento lateral, caso um serviço fosse comprometido. Por fim, a falta de uma separação entre autenticação e autorização tornava difícil gerenciar de forma eficiente os acessos em uma arquitetura distribuída.

## DFD

<div align="center">
  <img src="/docs/DFD.png" alt="DFD" width="800"/>
</div>


| ID | Tipo            | Nome / Descrição | Fluxo de Dados Associado                                                                                                                                                                                                                                                                | Trust Boundary                                                                                                |
|----|-----------------|------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| E1 | External Entity | User             | Request → Browser Client; Response ← Browser Client;                                                                                                                                                                                                                                    | Localização: User’s Machine; Fluxos atravessam: nenhum;                                                       |
| P1 | Processo        | Browser Client   | Request ← User; Response → User; HTTP Access Request → API Gateway; HTTP Response ← API Gateway;                                                                                                                                                                                        | Localização: User’s Machine; Fluxos atravessam: User’s Machine → Internet;                                    |
| P2 | Processo        | API Gateway      | HTTP Access Request ← Browser; HTTP Response → Browser; Authentication Credentials → Auth MS; Authorization Response ← Auth MS; Harvest Request → Blockchain MS; Harvest Response ← Blockchain MS; Summarization Request → Summarizer AI MS; Summarization Response ← Summarizer AI MS; | Localização: Docker Network; Fluxos atravessam: Internet → Docker Network;                                    |
| P3 | Processo        | Auth MS          | Authentication Credentials ← API Gateway; Authorization Response → API Gateway; User Request → Users DB; User Response ← Users DB;                                                                                                                                                      | Localização: Docker Network; Fluxos atravessam: Docker Network → Databases;                                   |
| P4 | Processo        | Blockchain MS    | Harvest Request ← API Gateway; Harvest Response → API Gateway; Harvest Request → Blockchain DB; Harvest Response ← Blockchain DB;                                                                                                                                                       | Localização: Docker Network; Fluxos atravessam: Docker Network → Databases;                                   |
| P5 | Processo        | Summarizer AI MS | Summarization Request ← API Gateway; Summarization Response → API Gateway;                                                                                                                                                                                                              | Localização: Docker Network; Fluxos atravessam: nenhum (todos os fluxos permanecem dentro da Docker Network); |
| D1 | Data Store      | Users Database   | User Request ← Auth MS; User Response → Auth MS;                                                                                                                                                                                                                                        | Localização: Databases; Fluxos atravessam: nenhum (processo que acessa está na boundary anterior);            |
| D2 | Data Store      | Blockchain       | Harvest Request ← Blockchain MS; Harvest Response → Blockchain MS;                                                                                                                                                                                                                      | Localização: Databases; Fluxos atravessam: nenhum;                                                            |

## Modelagem de Ameaças

| ID  | Categoria STRIDE           | DFD                         | Descrição                                                                                    | Causa                                                 | Prob. | Impacto    | Risco   | Mitigação                                                                     |
|-----|----------------------------|-----------------------------|----------------------------------------------------------------------------------------------|-------------------------------------------------------|-------|------------|---------|-------------------------------------------------------------------------------|
| T1  | S – Spoofing               | E1 (User) → P1              | Atacante se passa por usuário legítimo usando credenciais roubadas ou brute force            | Falta de MFA; senhas fracas; vazamento de credenciais | Média | Alto       | Alto    | Implementar MFA; limitar tentativas; usar senha forte; salvar hash da senha;  |
| T2  | T – Tampering              | P1 ↔ P2                     | Manipulação de dados HTTP (ex.: alterar campos de requisição)                                | Falta de TLS ou má configuração de HTTPS              | Baixa | Alto       | Médio   | TLS obrigatório;                                                              |
| T3  | T – Tampering              | P2 ↔ P3 (Auth MS)           | Alteração maliciosa das requisições de autenticação                                          | Gateway sem validação adequada de payload             | Média | Alto       | Alto    | JSON schema validation;                                                       |
| T4  | R – Repudiation            | Todos os fluxos via P2      | Usuário ou serviço nega ter realizado operação (ex.: login, harvest, summary)                | Falta de logs ou logs incompletos                     | Média | Alto       | Alto    | Auditoria centralizada; logs; timestamps;                                     |
| T5  | I – Information Disclosure | P3 ↔ D1 (Users DB)          | Vazamento de dados sensíveis de usuários                                                     | Banco sem criptografia; falha de controle de acesso   | Baixa | Muito Alto | Alto    | Criptografia em repouso; acesso restrito;                                     |
| T6  | D – Denial of Service      | P1 → P2 (API Gateway)       | DDoS satura o gateway e impede usuários legítimos                                            | Ausência de rate limit                                | Alta  | Alto       | Crítico | Rate limiting; proteção DDoS;                                                 |
| T7  | D – Denial of Service      | P2 → P5 (Summarizer AI MS)  | Respostas lentas por overload das operações de IA                                            | Microsserviço sem isolamento de recursos              | Média | Médio      | Médio   | Implementar padrão de resiliência fail-fast;                                  |
| T8  | E – Elevation of Privilege | P2 ↔ P3 (Auth MS)           | Usuário comum acessa funções de admin via manipulação de token                               | Falha ou inexistência de validação do claim “role”    | Média | Alto       | Alto    | Validação de claims em cada microsserviço;                                    |
| T9  | D – Denial of Service      | P1 → P2 (Gateway)           | Se o gateway falhar, toda a plataforma fica indisponível (single point of failure)           | Gateway como único ponto de entrada                   | Média | Muito Alto | Alto    | Replicação; failover; autoscaling; health-checks                              |
| T10 | I – Information Disclosure | P4 ↔ D2 (Blockchain Ledger) | Logs podem conter dados sensíveis ou identificadores pessoais permanentes (não apagáveis)    | Audit trail imutável contendo PII                     | Média | Muito Alto | Alto    | Minimizar PII; hashing; segregação de logs                                    |
| T11 | S – Spoofing               | P2 ↔ P3/P4/P5               | Microsserviço aceita token expirado ou assinado com chave antiga                             | Clock skew; falta de sync de JWKS                     | Média | Alto       | Alto    | Cache expira rápido; sync de chaves; verificar exp/iat                        |
| T12 | E – Elevation of Privilege | P2 ↔ P3/P4/P5               | Serviços validam tokens, mas interpretam claims de forma inconsistente                       | Implementações divergentes entre MS                   | Média | Alto       | Alto    | Biblioteca padrão; contrato formal de claims                                  |
| T13 | I – Information Disclosure | P2 ↔ P3 (Auth MS)           | Vazamento da chave privada de validação permite criação de tokens falsos                     | Gestão inadequada de chaves                           | Baixa | Muito Alto | Alto    | Rotação de chaves; vault; segregação de permissões                            |
| T14 | T – Tampering              | P2                          | Manipulação do token para trocar o campo “role” se assinatura não for conferida corretamente | Verificação incompleta da assinatura JWT              | Baixa | Alto       | Médio   | Validação estrita de assinatura; bloqueio de tokens sem algoritmo             |

## Visão Final (Pós-Modelagem)

<div align="center">
  <img src="/docs/pos-modelagem.png" alt="pos-modelagem" width="800"/>
</div>

#### Arquitetura Pós-Modelagem e Solução dos Problemas

Após a modelagem de ameaças e uma análise detalhada, a arquitetura foi significativamente aprimorada. A principal mudança foi a introdução de um microserviço dedicado exclusivamente à autenticação (Auth MS), que utiliza criptografia RSA para gerar e validar tokens JWT de forma segura. Nesse novo modelo, o Auth MS é o único detentor da chave privada, enquanto os outros microserviços possuem apenas a chave pública, o que impede que qualquer outro serviço manipule ou valide os tokens diretamente. Essa mudança solucionou problemas críticos de segurança, pois a chave privada fica restrita a um único ponto, protegendo o sistema contra vazamentos e compromissos. A arquitetura agora conta com uma rede interna privada para cada microserviço, o que isola ainda mais os serviços e dificulta ataques de escalonamento lateral. A autenticação passa a ser centralizada exclusivamente no Auth MS, enquanto os demais microserviços ficam responsáveis apenas pela validação do token, de acordo com as permissões e roles definidas no payload. Esse modelo melhora a resiliência, a segurança e a escalabilidade do sistema, minimizando os riscos apontados na modelagem de ameaças.

---

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

---

## Autoria

<div align="center">
  <img src="docs/authors.png" alt="authors" usemap="#workmap" width="800" data-disable-hover-zoom data-image-zoom-disabled>
</div>

<map name="workmap">
  <area shape="rect" coords="45,75,155,105" alt="isac" href="https://github.com/isaccunha">
  <area shape="rect" coords="200,65,340,95" alt="paulo" href="https://github.com/paulohenrique64">
  <area shape="rect" coords="360,30,530,60" alt="otavio" href="https://github.com/otaviosbampato">
  <area shape="rect" coords="610,65,770,95" alt="gabriel" href="https://github.com/gabrielzinCoelho">
</map>
<br/>

>[!TIP] 
> Tente clicar nos nossos @ na imagem.