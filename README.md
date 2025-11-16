# ☕ CoffeeChain

> Rastreabilidade de café com blockchain - Do grão à xícara, com transparência total

Repositório para o **ground-breaking, job-getter, interviewer-impresser** coffee-chain, a solução de alunos da UFLA para a rastreabilidade embutida em plantio de café no Brasil.

## 🚀 Tecnologias

### Frontend
- **React 18** + TypeScript
- **Vite** - Build ultrarrápido
- **Framer Motion** - Animações suaves
- **Design** - Inspirado em Apple, minimalista e moderno

### Backend
- **Gateway** - API Gateway (TODO)
- **Blockchain** - Rastreabilidade imutável (TODO)
- **Auth** - Sistema de autenticação (TODO)
- **Summary AI** - Ollama + LLaMA 3.2:1b

## 📦 Estrutura

```
coffee-chain/
├── frontend/          # React + TypeScript
├── gateway/           # API Gateway (TODO)
├── blockchain/        # Smart Contracts (TODO)
├── auth/              # Authentication (TODO)
├── summary-ai/        # AI Summarizer (✅)
└── docs/              # Documentação
```

## 🎨 Paleta de Cores

```css
--dark-moss-green: #606c38    /* Primary */
--pakistan-green: #283618     /* Primary Dark */
--bone: #dfd8cd               /* Background */
--tigers-eye: #a86a24         /* Secondary */
--caf-noir: #44270d           /* Accent */
```

## 🚀 Quick Start

### Opção 1: Docker Compose (Recomendado)

```bash
# Iniciar todos os serviços
docker-compose up

# Frontend estará em: http://localhost:3000
# AI Summary em: http://localhost:5000
```

### Opção 2: Desenvolvimento Local

```bash
# Frontend
cd frontend
npm install
npm run dev

# AI Summary Service
cd summary-ai
pip install -r requirements.txt
python app.py
```

## 📱 Frontend

O frontend está **completo e funcional** com:

✅ 4 páginas principais (Home, Track, Producer, History)
✅ Design responsivo e acessível
✅ Animações suaves em todos os elementos
✅ Sistema de design completo
✅ TypeScript + ESLint configurado
✅ Docker ready
✅ Production ready

[Ver documentação completa →](frontend/DEVELOPMENT.md)

## 🎯 Features

- ✅ **Rastreamento de Café**: Busque por código de rastreamento
- ✅ **Portal do Produtor**: Registre colheitas na blockchain
- ✅ **Histórico**: Visualize todas as transações
- ✅ **AI Summary**: Resuma informações de colheita
- 🚧 **Blockchain**: Integração em desenvolvimento
- 🚧 **Auth**: Sistema de autenticação
- 🚧 **Gateway**: API centralizada

## 🤝 Contribuindo

Desenvolvido por estudantes da UFLA com ❤️ e ☕

## 📄 Licença

MIT License - Veja [LICENSE](LICENSE) para mais detalhes.

---

**Status do Projeto**: 🚧 Em desenvolvimento ativo
**Última atualização**: Novembro 2024