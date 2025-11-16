# 🚀 Guia de Desenvolvimento - CoffeeChain Frontend

## ✨ O que foi criado

Um frontend React **completo e moderno** com design inspirado na Apple, usando a paleta de cores terrosa do café.

### 📋 Estrutura do Projeto

```
frontend/
├── public/
│   └── coffee-icon.svg          # Ícone do app
├── src/
│   ├── components/              # Componentes reutilizáveis
│   │   ├── Button/             # Botão com animações
│   │   ├── Card/               # Card com hover effects
│   │   ├── Footer/             # Rodapé completo
│   │   ├── Layout/             # Layout base
│   │   └── Navbar/             # Navegação com animações
│   ├── pages/                  # Páginas da aplicação
│   │   ├── Home.tsx           # Landing page
│   │   ├── Track.tsx          # Rastreamento de café
│   │   ├── Producer.tsx       # Portal do produtor
│   │   └── History.tsx        # Histórico blockchain
│   ├── services/              # APIs e serviços
│   │   └── api.ts            # Cliente API
│   ├── types/                # TypeScript types
│   │   └── index.ts
│   ├── App.tsx               # App principal
│   ├── index.css             # Estilos globais
│   └── main.tsx              # Entry point
├── Dockerfile                 # Container production
├── nginx.conf                # Config nginx
└── package.json              # Dependencies
```

## 🎨 Design System

### Paleta de Cores

```css
--dark-moss-green: #606c38    /* Primary */
--pakistan-green: #283618     /* Primary Dark */
--bone: #dfd8cd               /* Background */
--tigers-eye: #a86a24         /* Secondary */
--caf-noir: #44270d           /* Accent */
```

### Tipografia

- Fonte: SF Pro Display (estilo Apple)
- Escala modular de tamanhos
- Line-heights otimizados
- Antialiasing suave

### Componentes

#### Button
```tsx
<Button variant="primary" size="lg" onClick={handler}>
  Texto do Botão
</Button>
```

Variantes: `primary`, `secondary`, `outline`, `ghost`
Tamanhos: `sm`, `md`, `lg`

#### Card
```tsx
<Card hover={true}>
  <h3>Título</h3>
  <p>Conteúdo</p>
</Card>
```

## 🚀 Comandos

### Desenvolvimento
```bash
npm run dev
# Acesse: http://localhost:3000
```

### Build Produção
```bash
npm run build
npm run preview
```

### Docker
```bash
# Build
docker build -t coffeechain-frontend .

# Run
docker run -p 80:80 coffeechain-frontend

# Docker Compose
cd ..
docker-compose up frontend
```

## 📱 Páginas

### 1. Home (`/`)
- Hero section animada
- Estatísticas dinâmicas
- Features cards com ícones
- Como funciona (timeline)
- CTA section

### 2. Rastrear (`/rastrear`)
- Input de busca com validação
- Resultados animados
- Cards de informação
- Hash blockchain
- Design responsivo

### 3. Produtor (`/produtor`)
- Dashboard do produtor
- Formulário de nova colheita
- Lista de colheitas
- Status de verificação
- Geração de QR code

### 4. Histórico (`/historico`)
- Estatísticas agregadas
- Timeline de transações
- Filtros e busca
- Status blockchain
- Cards informativos

## 🎭 Animações

Todas as páginas têm animações usando Framer Motion:

- **Page transitions**: Fade in + slide up
- **Hover effects**: Scale, shadow
- **Scroll animations**: Reveal on scroll
- **Button interactions**: Scale on click
- **Loading states**: Skeletons

## 🔌 Integração API

O arquivo `src/services/api.ts` está pronto para integração:

```typescript
// Rastrear café
const data = await trackCoffee('CFE-2024-001234')

// Criar colheita
const harvest = await createHarvest({
  farm: 'Fazenda Santa Clara',
  location: 'Sul de Minas',
  // ...
})

// Buscar transações
const transactions = await getTransactions()
```

## 🌐 Variáveis de Ambiente

Crie um arquivo `.env`:

```bash
VITE_API_URL=http://localhost:8000
VITE_BLOCKCHAIN_NETWORK=localhost
VITE_APP_NAME=CoffeeChain
```

## 📦 Próximos Passos

1. **Integração Backend**
   - Conectar com API Gateway
   - Implementar auth real
   - WebSocket para updates

2. **Blockchain Real**
   - Web3 integration
   - Metamask connection
   - Smart contracts

3. **Features Adicionais**
   - QR Code scanner
   - Mapa de fazendas
   - Gráficos e analytics
   - PDF reports
   - Multi-idioma

4. **Performance**
   - Code splitting
   - Lazy loading
   - Image optimization
   - Service worker

5. **Testes**
   - Unit tests (Jest)
   - E2E tests (Playwright)
   - Component tests (Testing Library)

## 🎯 Características

✅ TypeScript completo
✅ ESLint configurado
✅ Design responsivo
✅ Animações suaves
✅ Dark/Light mode ready
✅ Acessibilidade (a11y)
✅ SEO friendly
✅ Performance otimizada
✅ Docker ready
✅ Production ready

## 📚 Recursos Úteis

- [React Docs](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Framer Motion](https://www.framer.com/motion)
- [Lucide Icons](https://lucide.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

Desenvolvido com ❤️ e ☕ por estudantes da UFLA
