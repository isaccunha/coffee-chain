import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, MapPin, Package, TrendingUp } from 'lucide-react'
import Card from '../components/Card/Card'
import { validateBlockchain } from '../services/api'
import './History.css'

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
        const token = localStorage.getItem('token')
        if (!token) {
          return
        }

        // Fetch transactions from blockchain validation
        const validationData = await validateBlockchain()
        const transactionsList = validationData?.data?.transactions || []
        
        setTransactions(transactionsList)

        // Calculate stats
        if (transactionsList.length > 0) {
          const totalBags = transactionsList.reduce((sum: number, t: any) => {
            const bags = parseInt(t.quantity || '0') || 0
            return sum + bags
          }, 0)

          const farms = new Set(transactionsList.map((t: any) => t.farm))
          
          const verified = transactionsList.filter((t: any) => 
            t.status === 'Verificado' || t.status === 'verified'
          ).length

          setStats({
            totalBags,
            totalTransactions: transactionsList.length,
            totalFarms: farms.size,
            verifiedPercent: transactionsList.length > 0 ? 
              Math.round((verified / transactionsList.length) * 100) : 0
          })
        }
      } catch (err: any) {
        // Fallback to mock data if API fails
        setTransactions([
          {
            id: 1,
            type: 'Registro',
            farm: 'Fazenda Santa Clara',
            location: 'Sul de Minas Gerais',
            date: '15/10/2024',
            quantity: '100',
            status: 'Verificado'
          },
          {
            id: 2,
            type: 'Processamento',
            farm: 'Fazenda Boa Vista',
            location: 'Cerrado Mineiro',
            date: '12/10/2024',
            quantity: '80',
            status: 'Em andamento'
          },
          {
            id: 3,
            type: 'Registro',
            farm: 'Sítio Verde',
            location: 'Mogiana',
            date: '10/10/2024',
            quantity: '50',
            status: 'Verificado'
          },
          {
            id: 4,
            type: 'Colheita',
            farm: 'Fazenda Esperança',
            location: 'Sul de Minas',
            date: '08/10/2024',
            quantity: '120',
            status: 'Verificado'
          }
        ])
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
            <h1>Histórico Blockchain</h1>
            <p>Todas as transações registradas e verificadas</p>
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
                <MapPin className="stat-card__icon" size={32} />
                <div className="stat-card__content">
                  <div className="stat-card__value">{stats.totalFarms}</div>
                  <div className="stat-card__label">Fazendas</div>
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
            <h2>Transações Recentes</h2>
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
                    <div className="transaction-card__info">
                      <div className="transaction-info-item">
                        <MapPin size={16} />
                        <span>{transaction.location}</span>
                      </div>
                      <div className="transaction-info-item">
                        <Clock size={16} />
                        <span>{transaction.date}</span>
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
