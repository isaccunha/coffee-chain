import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ShoppingBag, 
  ShieldCheck, 
  Search, 
  FileCheck, 
  History, 
  TrendingUp,
  Package,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Card from '../components/Card/Card'
import Button from '../components/Button/Button'
import './Dashboard.css'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Mock data - replace with real data from API
  const buyerStats = {
    activePurchases: 12,
    pendingApprovals: 3,
    completedOrders: 48,
    savedSearches: 7
  }

  const inspectorStats = {
    pendingInspections: 8,
    completedToday: 5,
    totalInspections: 156,
    flaggedItems: 2
  }

  const recentActivity = {
    buyer: [
      { id: 1, action: 'Consulta de lote', detail: 'Fazenda Santa Rita - Lote #2401', time: '2 horas atrás' },
      { id: 2, action: 'Solicitação aprovada', detail: 'Safra 2024 - Bourbon Amarelo', time: '5 horas atrás' },
      { id: 3, action: 'Nova busca salva', detail: 'Cafés de altitude > 1200m', time: '1 dia atrás' }
    ],
    inspector: [
      { id: 1, action: 'Inspeção concluída', detail: 'Fazenda Boa Vista - Lote #3201', time: '1 hora atrás' },
      { id: 2, action: 'Certificação emitida', detail: 'Safra 2024 - Catuaí Vermelho', time: '3 horas atrás' },
      { id: 3, action: 'Revisão solicitada', detail: 'Fazenda Primavera - Lote #2805', time: '6 horas atrás' }
    ]
  }

  if (user?.role === 'BUYER') {
    return (
      <div className="dashboard">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="dashboard__header">
              <div>
                <h1 className="dashboard__title">
                  <ShoppingBag size={32} />
                  Painel do Comprador
                </h1>
                <p className="dashboard__subtitle">
                  Bem-vindo, {user.name}! Aqui está um resumo das suas atividades.
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="dashboard__stats">
              <Card>
                <div className="stat-card">
                  <Package className="stat-card__icon stat-card__icon--primary" size={28} />
                  <div className="stat-card__content">
                    <span className="stat-card__value">{buyerStats.activePurchases}</span>
                    <span className="stat-card__label">Compras Ativas</span>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="stat-card">
                  <Clock className="stat-card__icon stat-card__icon--warning" size={28} />
                  <div className="stat-card__content">
                    <span className="stat-card__value">{buyerStats.pendingApprovals}</span>
                    <span className="stat-card__label">Aprovações Pendentes</span>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="stat-card">
                  <CheckCircle className="stat-card__icon stat-card__icon--success" size={28} />
                  <div className="stat-card__content">
                    <span className="stat-card__value">{buyerStats.completedOrders}</span>
                    <span className="stat-card__label">Pedidos Completos</span>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="stat-card">
                  <Search className="stat-card__icon stat-card__icon--info" size={28} />
                  <div className="stat-card__content">
                    <span className="stat-card__value">{buyerStats.savedSearches}</span>
                    <span className="stat-card__label">Buscas Salvas</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="dashboard__section">
              <h2>Ações Rápidas</h2>
              <div className="dashboard__actions">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => navigate('/rastrear')}
                >
                  <Search size={20} />
                  Consultar Safras
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/historico')}
                >
                  <History size={20} />
                  Ver Histórico
                </Button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="dashboard__section">
              <h2>Atividade Recente</h2>
              <Card>
                <div className="activity-list">
                  {recentActivity.buyer.map(activity => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-item__icon">
                        <TrendingUp size={18} />
                      </div>
                      <div className="activity-item__content">
                        <strong>{activity.action}</strong>
                        <p>{activity.detail}</p>
                        <span className="activity-item__time">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Inspector Dashboard
  return (
    <div className="dashboard">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="dashboard__header">
            <div>
              <h1 className="dashboard__title">
                <ShieldCheck size={32} />
                Painel do Fiscal
              </h1>
              <p className="dashboard__subtitle">
                Bem-vindo, {user?.name}! Aqui está um resumo das suas inspeções.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="dashboard__stats">
            <Card>
              <div className="stat-card">
                <Clock className="stat-card__icon stat-card__icon--warning" size={28} />
                <div className="stat-card__content">
                  <span className="stat-card__value">{inspectorStats.pendingInspections}</span>
                  <span className="stat-card__label">Inspeções Pendentes</span>
                </div>
              </div>
            </Card>
            <Card>
              <div className="stat-card">
                <CheckCircle className="stat-card__icon stat-card__icon--success" size={28} />
                <div className="stat-card__content">
                  <span className="stat-card__value">{inspectorStats.completedToday}</span>
                  <span className="stat-card__label">Concluídas Hoje</span>
                </div>
              </div>
            </Card>
            <Card>
              <div className="stat-card">
                <FileCheck className="stat-card__icon stat-card__icon--primary" size={28} />
                <div className="stat-card__content">
                  <span className="stat-card__value">{inspectorStats.totalInspections}</span>
                  <span className="stat-card__label">Total de Inspeções</span>
                </div>
              </div>
            </Card>
            <Card>
              <div className="stat-card">
                <AlertCircle className="stat-card__icon stat-card__icon--danger" size={28} />
                <div className="stat-card__content">
                  <span className="stat-card__value">{inspectorStats.flaggedItems}</span>
                  <span className="stat-card__label">Itens Sinalizados</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="dashboard__section">
            <h2>Ações Rápidas</h2>
            <div className="dashboard__actions">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => navigate('/fiscal')}
              >
                <FileCheck size={20} />
                Nova Inspeção
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/historico')}
              >
                <History size={20} />
                Ver Auditoria
              </Button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard__section">
            <h2>Atividade Recente</h2>
            <Card>
              <div className="activity-list">
                {recentActivity.inspector.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-item__icon">
                      <ShieldCheck size={18} />
                    </div>
                    <div className="activity-item__content">
                      <strong>{activity.action}</strong>
                      <p>{activity.detail}</p>
                      <span className="activity-item__time">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
