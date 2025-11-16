import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, MapPin, Calendar, Package } from 'lucide-react'
import Button from '../components/Button/Button'
import Card from '../components/Card/Card'
import './Producer.css'

const Producer = () => {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="producer">
      <section className="producer-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>Portal do Produtor</h1>
            <p>Registre suas colheitas e valorize seu café com blockchain</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="producer-header">
            <h2>Minhas Colheitas</h2>
            <Button 
              variant="primary"
              onClick={() => setShowForm(!showForm)}
            >
              <Plus size={20} />
              Nova Colheita
            </Button>
          </div>

          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card className="harvest-form">
                <h3>Registrar Nova Colheita</h3>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nome da Fazenda</label>
                      <input type="text" placeholder="Ex: Fazenda Santa Clara" />
                    </div>
                    <div className="form-group">
                      <label>Localização</label>
                      <input type="text" placeholder="Ex: Sul de Minas Gerais" />
                    </div>
                    <div className="form-group">
                      <label>Data da Colheita</label>
                      <input type="date" />
                    </div>
                    <div className="form-group">
                      <label>Variedade</label>
                      <select>
                        <option>Bourbon Amarelo</option>
                        <option>Catuaí</option>
                        <option>Mundo Novo</option>
                        <option>Acaiá</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Altitude (metros)</label>
                      <input type="number" placeholder="1200" />
                    </div>
                    <div className="form-group">
                      <label>Processo</label>
                      <select>
                        <option>Natural</option>
                        <option>Cereja Descascado</option>
                        <option>Lavado</option>
                        <option>Honey</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Quantidade (sacas)</label>
                      <input type="number" placeholder="100" />
                    </div>
                    <div className="form-group">
                      <label>Certificações</label>
                      <select multiple>
                        <option>Orgânico</option>
                        <option>Fair Trade</option>
                        <option>Rainforest Alliance</option>
                        <option>UTZ</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Notas da Colheita</label>
                    <textarea 
                      rows={4} 
                      placeholder="Informações adicionais sobre a colheita..."
                    />
                  </div>
                  <div className="form-actions">
                    <Button variant="outline" onClick={() => setShowForm(false)}>
                      Cancelar
                    </Button>
                    <Button variant="primary" type="submit">
                      Registrar na Blockchain
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}

          <div className="harvests-grid">
            {[1, 2, 3].map((item) => (
              <Card key={item}>
                <div className="harvest-card">
                  <div className="harvest-card__header">
                    <h3>Fazenda Santa Clara</h3>
                    <span className="harvest-card__status">Verificado</span>
                  </div>
                  <div className="harvest-card__info">
                    <div className="harvest-info-item">
                      <MapPin size={16} />
                      <span>Sul de Minas Gerais</span>
                    </div>
                    <div className="harvest-info-item">
                      <Calendar size={16} />
                      <span>15/10/2024</span>
                    </div>
                    <div className="harvest-info-item">
                      <Package size={16} />
                      <span>100 sacas</span>
                    </div>
                  </div>
                  <div className="harvest-card__details">
                    <span>Bourbon Amarelo • Natural • 1200m</span>
                  </div>
                  <div className="harvest-card__footer">
                    <Button variant="ghost" size="sm">Ver Detalhes</Button>
                    <Button variant="outline" size="sm">Gerar QR Code</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Producer
