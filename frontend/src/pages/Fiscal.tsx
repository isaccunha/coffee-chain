import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  ClipboardList,
  FileSignature,
  Hash,
  UploadCloud,
  CheckCircle2,
  Building2,
  Layers
} from 'lucide-react'
import Button from '../components/Button/Button'
import Card from '../components/Card/Card'
import './Fiscal.css'

const queue = [
  {
    id: 'LOT-9823',
    farm: 'Serra Azul',
    region: 'Mantiqueira, MG',
    harvest: 'Safra 24/25',
    score: 88.5,
    volume: '42 sacas',
    stage: 1,
    hash: '0x92af...1b3c'
  },
  {
    id: 'LOT-9730',
    farm: 'Vale Dourado',
    region: 'Chapada Diamantina, BA',
    harvest: 'Safra 23/24',
    score: 86.0,
    volume: '60 sacas',
    stage: 2,
    hash: '0xa17c...ff20'
  },
  {
    id: 'LOT-9688',
    farm: 'Dois Irmãos',
    region: 'Cerrado Mineiro, MG',
    harvest: 'Safra 24/25',
    score: 90.2,
    volume: '28 sacas',
    stage: 0,
    hash: '0xf01d...222a'
  }
]

const baseChecklist = [
  {
    title: 'Boletim de campo',
    description: 'Altitude, variedade, processo e umidade',
    status: 'aprovado'
  },
  {
    title: 'Laudos laboratoriais',
    description: 'Micotoxinas, análise sensorial e físico-química',
    status: 'pendente'
  },
  {
    title: 'Certificações anexas',
    description: 'Orgânico, Fair Trade, UTZ, Rainforest',
    status: 'pendente'
  },
  {
    title: 'Assinatura digital',
    description: 'Responsável técnico + cooperativa',
    status: 'bloqueado'
  }
]

const timelineStages = [
  {
    title: 'Captura de campo',
    description: 'App offline coleta dados e gera pacote imutável',
    icon: Layers
  },
  {
    title: 'Conferência fiscal',
    description: 'Fiscais validam laudos, checklist e fotos críticas',
    icon: ClipboardList
  },
  {
    title: 'Hash + Blockchain',
    description: 'Gateway coffee-chain assina e transmite para a rede',
    icon: Hash
  }
]

const attachments = [
  {
    name: 'Laudo físico',
    size: '1.2 MB',
    type: 'PDF'
  },
  {
    name: 'Relatório sensorial',
    size: '860 KB',
    type: 'PDF'
  },
  {
    name: 'Registro fotográfico',
    size: '12 imagens',
    type: 'JPEG'
  }
]

const Fiscal = () => {
  const [selectedLot, setSelectedLot] = useState(queue[0])

  return (
    <div className="fiscal">
      <section className="fiscal-hero">
        <div className="container">
          <motion.div
            className="fiscal-hero__content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="hero-badge">Modo Fiscal</p>
            <h1>Audite e libere safras em minutos</h1>
            <p className="fiscal-hero__subtitle">
              Conectado ao gateway CoffeeChain, o modo fiscal reúne checklist inteligente,
              anexos oficiais e disparo de hash blockchain na mesma tela.
            </p>
            <div className="fiscal-hero__cta">
              <Button variant="secondary" size="lg">Importar lote do gateway</Button>
              <Button variant="outline" size="lg">Configurar fluxo</Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container fiscal-grid">
          <Card className="queue-card" hover={false}>
            <div className="card__header">
              <p className="queue-label">Fila de Safra</p>
              <h3>Lotes aguardando validação</h3>
            </div>
            <div className="queue-list">
              {queue.map((lot) => (
                <button
                  key={lot.id}
                  className={`queue-item ${selectedLot.id === lot.id ? 'active' : ''}`}
                  onClick={() => setSelectedLot(lot)}
                >
                  <div className="queue-item__top">
                    <span className="queue-item__id">{lot.id}</span>
                    <span className="queue-item__score">{lot.score} pts</span>
                  </div>
                  <div className="queue-item__meta">
                    <Building2 size={16} />
                    <span>{lot.farm} • {lot.region}</span>
                  </div>
                  <div className="queue-item__bottom">
                    <span>{lot.harvest}</span>
                    <span>{lot.volume}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="timeline-card" hover={false}>
            <div className="card__header">
              <h3>Fluxo de aprovação</h3>
              <p className="timeline-hash">Hash atual: {selectedLot.hash}</p>
            </div>
            <div className="timeline">
              {timelineStages.map((stage, index) => {
                const Icon = stage.icon
                const state = index < selectedLot.stage
                  ? 'done'
                  : index === selectedLot.stage
                    ? 'active'
                    : 'next'

                return (
                  <div key={stage.title} className={`timeline-step timeline-step--${state}`}>
                    <div className="timeline-step__icon">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="timeline-step__title">{stage.title}</p>
                      <p className="timeline-step__description">{stage.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="dispatch">
              <Button size="lg">Despachar para blockchain</Button>
              <Button variant="outline" size="lg">Salvar progresso</Button>
            </div>
          </Card>
        </div>

        <div className="container checklist-grid">
          <Card className="checklist-card" hover={false}>
            <div className="card__header">
              <h3>Checklist inteligente</h3>
              <p>Atualiza em tempo real conforme os fiscais da cooperativa validam cada item.</p>
            </div>
            <ul className="checklist">
              {baseChecklist.map((item) => (
                <li key={item.title} className={`checklist-item checklist-item--${item.status}`}>
                  <div className="checklist-item__icon">
                    {item.status === 'aprovado' ? <CheckCircle2 size={18} /> : <ClipboardList size={18} />}
                  </div>
                  <div>
                    <p className="checklist-item__title">{item.title}</p>
                    <p className="checklist-item__description">{item.description}</p>
                  </div>
                  <span className="checklist-item__status">{item.status}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="attachments-card" hover={false}>
            <div className="card__header">
              <h3>Anexos oficiais</h3>
              <p>Todos os arquivos ficam vinculados ao mesmo hash e podem ser reenviados ao gateway.</p>
            </div>
            <div className="attachments-list">
              {attachments.map((file) => (
                <div key={file.name} className="attachment">
                  <div>
                    <p className="attachment__name">{file.name}</p>
                    <span className="attachment__meta">{file.type} • {file.size}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="attachment__action">
                    <UploadCloud size={16} />
                    Reenviar
                  </Button>
                </div>
              ))}
            </div>
            <div className="attachments-actions">
              <Button variant="secondary" size="lg">
                <FileSignature size={18} />
                Assinar lote
              </Button>
              <Button variant="outline" size="lg">
                <ShieldCheck size={18} />
                Solicitar revisão
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default Fiscal
