import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow, parseISO, addHours } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  ShoppingBag, 
  ShieldCheck, 
  Search, 
  FileCheck, 
  History, 
  TrendingUp,
  Clock,
  Package
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Card from '../components/Card/Card'
import Button from '../components/Button/Button'
import './Dashboard.css'

import { useEffect, useState } from 'react'
import { getCreationLogs, getAccessLogs, getUserStats } from '../services/api'


const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [creationLogs, setCreationLogs] = useState<any[]>([])
  const [accessLogs, setAccessLogs] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    if (user?.role === 'INSPECTOR') {
        getCreationLogs(5, user.email).then(data => setCreationLogs(data.logs))
    }

    if (user?.role === 'BUYER') {
        getAccessLogs(5, user.email).then(data => setAccessLogs(data.logs))
    }

    getUserStats().then(data => setStats(data))
  }, [user])


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
                  Bem-vindo, {user.name}!
                </p>
              </div>
            </div>

          
            <div className="dashboard__stats">
              <Card>
                <div className="stat-card">
                  <Package className="stat-card__icon stat-card__icon--success" size={28} />
                  <div className="stat-card__content">
                    <span className="stat-card__value">{stats?.total_accesses ?? 0}</span>
                    <span className="stat-card__label">Total de Consultas</span>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="stat-card">
                  <Clock className="stat-card__icon stat-card__icon--info" size={28} />
                  <div className="stat-card__content">
                    <span className="stat-card__value">{stats?.accesses_today ?? 0}</span>
                    <span className="stat-card__label">Consultas hoje</span>
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

          
            <div className="dashboard__section">
              <h2>Atividade Recente</h2>
              <Card>
                <div className="activity-list">
                    {accessLogs.length > 0 ? (
                    accessLogs.map(activity => (
                    <div key={activity.id} className="activity-item">
                        <div className="activity-item__icon">
                        <TrendingUp size={18} />
                        </div>
                        <div className="activity-item__content">
                        <strong>Consulta de lote</strong>
                        <p>{activity.farm_name} - {activity.harvest_id}</p>
                        <span className="activity-item__time">
                        {activity.accessed_at
                            ? formatDistanceToNow(
                                addHours(parseISO(activity.accessed_at), -3), 
                                { addSuffix: false, locale: ptBR }
                            )
                            : ''}
                        </span>
                        </div>
                    </div>
                    ))
                ) : (
                    <div className="activity-item activity-item--empty">
                    <div className="activity-item__content">
                        Nenhuma atividade recente por enquanto.
                    </div>
                    </div>
                )}
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
                <FileCheck className="stat-card__icon stat-card__icon--primary" size={28} />
                <div className="stat-card__content">
                  <span className="stat-card__value">{stats?.total_inspections ?? 0}</span>
                  <span className="stat-card__label">Total de Inspeções</span>
                </div>
              </div>
            </Card>
            <Card>
              <div className="stat-card">
                <Clock className="stat-card__icon stat-card__icon--warning" size={28} />
                <div className="stat-card__content">
                  <span className="stat-card__value">{stats?.pending_inspections ?? 0}</span>
                  <span className="stat-card__label">Inspeções Pendentes</span>
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

      
          <div className="dashboard__section">
            <h2>Atividade Recente</h2>
                <Card>
                <div className="activity-list">
                    {creationLogs.length > 0 ? (
                    creationLogs.map(activity => (
                    <div key={activity.id} className="activity-item">
                        <div className="activity-item__icon">
                        <TrendingUp size={18} />
                        </div>
                        <div className="activity-item__content">
                        <strong>Inspeção concluída</strong>
                        <p>{activity.farm_name} - {activity.harvest_id}</p>
                        <span className="activity-item__time">
                        {activity.created_at
                            ? formatDistanceToNow(
                                addHours(parseISO(activity.created_at), -3), 
                                { addSuffix: false, locale: ptBR }
                            )
                            : ''}
                        </span>
                        </div>
                    </div>
                    ))
                ) : (
                    <div className="activity-item activity-item--empty">
                    <div className="activity-item__content">
                        Nenhuma atividade recente por enquanto.
                    </div>
                    </div>
                )}
                </div>
              </Card>
          </div> 
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
