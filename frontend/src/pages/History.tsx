import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, MapPin, Package, TrendingUp } from 'lucide-react'
import Card from '../components/Card/Card'
// import { validateBlockchain } from '../services/api'
import './History.css'

import { getCreationLogs } from '../services/api'
import { formatDateBR } from '../utils/date'

const History = () => {
  const [transactions, setTransactions] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalBags: 0,
    totalTransactions: 0,
    totalFarms: 0,
    verifiedPercent: 0
  })

    useEffect(() => {
    const fetchData = async () => {
        try {
        const data = await getCreationLogs(100) // buscar últimos 100 logs \
        const logsList = data?.logs || []

        setTransactions(
            logsList.map((log: any) => ({
            id: log.harvest_id,
            type: 'Registro',
            farm: log.farm_name,
            location: log.location,
            date: log.created_at,
            quantity: log.coffee_bags,
            status: log.verified_at ? 'Verificado' : 'Pendente'
            }))
        )

        // calcular estatísticas
        const totalBags = logsList.reduce((sum: number, l: any) => sum + (l.coffee_bags || 0), 0)
        const farms = new Set(logsList.map((l: any) => l.farm_name))
        const verified = logsList.filter((l: any) => l.verified_at).length

        setStats({
            totalBags,
            totalTransactions: logsList.length,
            totalFarms: farms.size,
            verifiedPercent: logsList.length > 0 ? Math.round((verified / logsList.length) * 100) : 0
        })
        } catch (err) {
            console.error(err)
        }
    }

    fetchData()
    }, [])

  return (
    <div className="history">
      <section className="history-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>Registro Histórico de Safras</h1>
            <p>Todas as inserções registradas e verificadas na blockchain</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="history-stats">
            <Card>
              <div className="stat-card">
                <Package className="stat-card__icon" size={32} />
                <div className="stat-card__content">
                  <div className="stat-card__value">{stats.totalBags}</div>
                  <div className="stat-card__label">Sacas Totais</div>
                </div>
              </div>
            </Card>
            <Card>
              <div className="stat-card">
                <Clock className="stat-card__icon" size={32} />
                <div className="stat-card__content">
                  <div className="stat-card__value">{stats.totalTransactions}</div>
                  <div className="stat-card__label">Transações</div>
                </div>
              </div>
            </Card>
            <Card>
              <div className="stat-card">
                <TrendingUp className="stat-card__icon" size={32} />
                <div className="stat-card__content">
                  <div className="stat-card__value">{stats.verifiedPercent}%</div>
                  <div className="stat-card__label">Verificadas</div>
                </div>
              </div>
            </Card>
          </div>

          <div className="history-timeline">
            <h2>Registros na Blockchain</h2>
            <div className="timeline">
              {transactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className="transaction-card">
                    <div className="transaction-card__header">
                      <div className="transaction-card__badge">{transaction.type}</div>
                      <div className={`transaction-card__status transaction-card__status--${transaction.status === 'Verificado' ? 'verified' : 'pending'}`}>
                        {transaction.status}
                      </div>
                    </div>
                    <h3 className="transaction-card__title">{transaction.farm}</h3>
                    <p className="transaction-card__harvest-id">{transaction.id}</p> 
                    
                    
                    <div className="transaction-card__info">
                      <div className="transaction-info-item">
                        <MapPin size={16} />
                        <span>{transaction.location}</span>
                      </div>
                      <div className="transaction-info-item">
                        <Clock size={16} />
                        <span>{formatDateBR(transaction.date)}</span>
                      </div>
                      <div className="transaction-info-item">
                        <Package size={16} />
                        <span>{transaction.quantity}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default History
