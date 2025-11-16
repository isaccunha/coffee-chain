# 🚀 Deployment Guide - CoffeeChain

## Opções de Deploy

### 1. 🐳 Docker (Recomendado)

#### Build da Imagem
```bash
cd frontend
docker build -t coffeechain-frontend:latest .
```

#### Run Container
```bash
docker run -d \
  --name coffeechain-frontend \
  -p 80:80 \
  coffeechain-frontend:latest
```

#### Docker Compose
```bash
# Na raiz do projeto
docker-compose up -d frontend
```

### 2. ☁️ Vercel (Fastest)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Production deploy
vercel --prod
```

**Configurações Vercel**:
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

### 3. 📦 Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd frontend
netlify deploy

# Production
netlify deploy --prod
```

**netlify.toml**:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 4. 🔥 Firebase Hosting

```bash
# Install Firebase CLI
npm i -g firebase-tools

# Login
firebase login

# Init
firebase init hosting

# Deploy
firebase deploy --only hosting
```

**firebase.json**:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 5. 🌊 DigitalOcean App Platform

1. Connect GitHub repo
2. Select `frontend` folder
3. Configure:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy

### 6. 🚀 AWS S3 + CloudFront

```bash
# Build
npm run build

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"
```

### 7. 📊 GitHub Pages

```bash
# Install gh-pages
npm i -D gh-pages

# Add to package.json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}

# Deploy
npm run deploy
```

**vite.config.ts**:
```typescript
export default defineConfig({
  base: '/coffee-chain/',
  // ...
})
```

## 🔧 Configurações de Produção

### Variáveis de Ambiente

Crie `.env.production`:

```bash
VITE_API_URL=https://api.coffeechain.com
VITE_BLOCKCHAIN_NETWORK=mainnet
VITE_APP_NAME=CoffeeChain
```

### Build Otimizado

```bash
# Build with optimizations
npm run build

# Analyze bundle size
npx vite-bundle-visualizer
```

### Performance Checklist

- ✅ Minificação de JS/CSS
- ✅ Tree shaking
- ✅ Code splitting
- ✅ Image optimization
- ✅ Gzip/Brotli compression
- ✅ CDN para assets estáticos
- ✅ Cache headers configurados

## 🔒 Segurança

### Headers de Segurança (nginx.conf)

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" always;
```

### HTTPS

Use **sempre** HTTPS em produção:
- Let's Encrypt (gratuito)
- Cloudflare (gratuito)
- AWS Certificate Manager
- Certificado tradicional

## 📊 Monitoramento

### Analytics

```typescript
// Google Analytics
import { gtag } from 'ga-gtag'

gtag('config', 'GA_MEASUREMENT_ID')
```

### Error Tracking

```bash
# Sentry
npm i @sentry/react

# Configure
Sentry.init({
  dsn: "YOUR_DSN",
  environment: "production"
})
```

### Performance Monitoring

- Google Lighthouse
- WebPageTest
- GTmetrix
- Sentry Performance

## 🔄 CI/CD

### GitHub Actions

**.github/workflows/deploy.yml**:

```yaml
name: Deploy Frontend

on:
  push:
    branches: [ main ]
    paths:
      - 'frontend/**'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node
      uses: actions/setup-node@v3
      with:
        node-version: 18
        cache: 'npm'
        cache-dependency-path: frontend/package-lock.json
    
    - name: Install dependencies
      working-directory: ./frontend
      run: npm ci
    
    - name: Build
      working-directory: ./frontend
      run: npm run build
      env:
        VITE_API_URL: ${{ secrets.API_URL }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        working-directory: ./frontend
```

## 🎯 Checklist de Deploy

### Pré-Deploy
- [ ] Build local testado
- [ ] Testes passando
- [ ] Variáveis de ambiente configuradas
- [ ] SEO meta tags verificadas
- [ ] Links externos funcionando
- [ ] Imagens otimizadas
- [ ] Lighthouse score > 90

### Deploy
- [ ] Branch correta selecionada
- [ ] Build de produção criado
- [ ] Deploy realizado
- [ ] DNS configurado
- [ ] SSL ativo

### Pós-Deploy
- [ ] Site carregando corretamente
- [ ] Todas as páginas acessíveis
- [ ] Formulários funcionando
- [ ] API conectada
- [ ] Analytics configurado
- [ ] Monitoramento ativo

## 🆘 Troubleshooting

### Build Falha

```bash
# Limpar cache
rm -rf node_modules package-lock.json
npm install

# Limpar cache do Vite
rm -rf dist node_modules/.vite
npm run build
```

### Rotas 404

Certifique-se de configurar rewrites para SPA:

**Vercel**: `vercel.json`
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Nginx**: 
```nginx
try_files $uri $uri/ /index.html;
```

### Assets não carregam

Verifique o `base` no `vite.config.ts`:

```typescript
export default defineConfig({
  base: './', // Para paths relativos
})
```

## 📞 Suporte

Para problemas de deploy, abra uma issue no GitHub ou contate a equipe.

---

**Happy Deploying! ☕🚀**
