import { motion } from 'framer-motion'
import { ArrowRight, Shield, Leaf, CircuitBoard, Sparkles } from 'lucide-react'
import Button from '../components/Button/Button'
import Card from '../components/Card/Card'
import './Home.css'

const Home = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'Consulta de Safras em Tempo Real',
      description: 'Dados oficiais de safra, lotes certificados, pontuação e disponibilidade em um clique.'
    },
    {
      icon: Shield,
      title: 'Auditoria Imediata',
      description: 'Registro imutável no blockchain com trilha completa para fiscais e cooperativas.'
    },
    {
      icon: CircuitBoard,
      title: 'Integração Direta com o Gateway',
      description: 'API segura conecta compradores e fiscais ao mesmo fluxo de dados de safra.'
    },
    {
      icon: Leaf,
      title: 'Origem e Sustentabilidade',
      description: 'Laudos ambientais, práticas regenerativas e certificações ficam anexadas à safra.'
    }
  ]

  const stats = [
    { value: '2.4K', label: 'Safras indexadas' },
    { value: '18K', label: 'Lotes disponíveis' },
    { value: '98%', label: 'Consultas atendidas em <1s' },
    { value: '12', label: 'Cooperativas integradas' }
  ]
  
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <motion.div 
            className="hero__content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="hero__title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Rastreabilidade de Safras de Café
              <br />
              <span className="hero__title-highlight">com inteligência em blockchain</span>
            </motion.h1>
            <motion.p 
              className="hero__subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Consulta premium de safra para compradores e fiscais. Veja disponibilidade, qualidade, laudos
              e status blockchain do lote sem depender de planilhas ou e-mails.
            </motion.p>
            <motion.div 
              className="hero__actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Button variant="primary" size="lg" onClick={() => window.location.href = '/login'}>
                Acessar sistema
                <ArrowRight size={20} />
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.location.href = '/cadastro'}>
                Criar conta
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats__grid">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stats__item"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="stats__value">{stat.value}</div>
                <div className="stats__label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section features">
        <div className="container">
          <motion.div
            className="features__header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Por que coffee-chain?</h2>
            <p>Safras auditadas, backend integrado e experiência de luxo para o café brasileiro</p>
          </motion.div>
          <div className="features__grid">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index}>
                  <div className="feature__icon">
                    <Icon size={28} />
                  </div>
                  <h3 className="feature__title">{feature.title}</h3>
                  <p className="feature__description">{feature.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Modes Section */}
      {/* <section className="section modes">
        <div className="container">
          <motion.div
            className="modes__header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Dois modos. O mesmo backend.</h2>
            <p>Compradores e fiscais compartilham os dados oficiais da safra, cada um com sua experiência.</p>
          </motion.div>
          <div className="modes__grid">
            <Card>
              <h3>Modo Comprador</h3>
              <p>Consulta instantânea de safra, lote, pontuação, disponibilidade e preço FOB.</p>
              <ul>
                <li>Acesso ao gateway coffee-chain</li>
                <li>Alertas de disponibilidade e safra especial</li>
                <li>Integração com ERPs e marketplace</li>
              </ul>
            </Card>
            <Card>
              <h3>Modo Fiscal</h3>
              <p>Registro oficial da safra, assinatura digital e disparo para a blockchain.</p>
              <ul>
                <li>Checklist de conformidade e laudos</li>
                <li>Envio de hash para rede blockchain</li>
                <li>Fluxo de aprovação em três etapas</li>
              </ul>
            </Card>
          </div>
        </div>
      </section> */}

      {/* How it Works */}
      <section className="section how-it-works">
        <div className="container">
          <motion.div
            className="how-it-works__header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Pipeline de Safra</h2>
            <p>Do levantamento de campo ao contrato assinado, tudo registrado na mesma linha do tempo.</p>
          </motion.div>
          <div className="how-it-works__steps">
            {[
              { step: '01', title: 'Pré-Safra', description: 'Fiscais coletam dados de campo, laudos e certificações direto no app.' },
              { step: '02', title: 'Validação Gateway', description: 'API coffee-chain consolida e assina os dados, gerando o hash blockchain.' },
              { step: '03', title: 'Consulta Premium', description: 'Compradores acessam o mesmo registro, com disponibilidade e histórico.' }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="step"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <div className="step__number">{item.step}</div>
                <div className="step__content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <motion.div
            className="cta__content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Chega de PDF e WhatsApp</h2>
            <p>Sincronize o gateway coffee-chain com sua cooperativa e ofereça consulta premium de safra.</p>
            <Button variant="secondary" size="lg" onClick={() => window.location.href = '/cadastro'}>
              Começar agora
              <ArrowRight size={20} />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
