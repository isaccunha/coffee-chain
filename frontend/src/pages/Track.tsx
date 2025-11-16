import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Calendar, User, Package, Award } from 'lucide-react'
import Button from '../components/Button/Button'
import Card from '../components/Card/Card'
import './Track.css'

const Track = () => {
  const [trackingCode, setTrackingCode] = useState('')
  const [coffeeData, setCoffeeData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleTrack = async () => {
    if (!trackingCode) return
    
    setLoading(true)
    // Simulação de busca - integrar com API blockchain depois
    setTimeout(() => {
      setCoffeeData({
        id: trackingCode,
        origin: 'Fazenda Santa Clara',
        location: 'Sul de Minas Gerais',
        producer: 'João Silva',
        harvestDate: '15/10/2024',
        variety: 'Bourbon Amarelo',
        altitude: '1200m',
        process: 'Natural',
        certification: 'Orgânico',
        blockchainHash: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
      })
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="track">
      <section className="track-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>Rastreie seu Café</h1>
            <p>Descubra a história completa por trás da sua xícara</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Card className="track-search">
            <div className="track-search__content">
              <h2>Digite o código de rastreamento</h2>
              <p>Encontre o código na embalagem do seu café</p>
              <div className="track-search__input-group">
                <div className="track-search__input-wrapper">
                  <Search className="track-search__icon" size={20} />
                  <input
                    type="text"
                    placeholder="Ex: CFE-2024-001234"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                    className="track-search__input"
                  />
                </div>
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={handleTrack}
                  disabled={loading || !trackingCode}
                >
                  {loading ? 'Buscando...' : 'Rastrear'}
                </Button>
              </div>
            </div>
          </Card>

          {coffeeData && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="track-results"
            >
              <h2 className="track-results__title">Informações do Café</h2>
              
              <div className="track-results__grid">
                <Card>
                  <div className="info-card">
                    <div className="info-card__icon">
                      <MapPin size={24} />
                    </div>
                    <div className="info-card__content">
                      <h3>Origem</h3>
                      <p className="info-card__value">{coffeeData.origin}</p>
                      <p className="info-card__detail">{coffeeData.location}</p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="info-card">
                    <div className="info-card__icon">
                      <User size={24} />
                    </div>
                    <div className="info-card__content">
                      <h3>Produtor</h3>
                      <p className="info-card__value">{coffeeData.producer}</p>
                      <p className="info-card__detail">Produtor certificado</p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="info-card">
                    <div className="info-card__icon">
                      <Calendar size={24} />
                    </div>
                    <div className="info-card__content">
                      <h3>Colheita</h3>
                      <p className="info-card__value">{coffeeData.harvestDate}</p>
                      <p className="info-card__detail">Safra 2024</p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="info-card">
                    <div className="info-card__icon">
                      <Package size={24} />
                    </div>
                    <div className="info-card__content">
                      <h3>Variedade</h3>
                      <p className="info-card__value">{coffeeData.variety}</p>
                      <p className="info-card__detail">{coffeeData.process}</p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="info-card">
                    <div className="info-card__icon">
                      <Award size={24} />
                    </div>
                    <div className="info-card__content">
                      <h3>Certificação</h3>
                      <p className="info-card__value">{coffeeData.certification}</p>
                      <p className="info-card__detail">Altitude: {coffeeData.altitude}</p>
                    </div>
                  </div>
                </Card>

                <Card className="blockchain-card">
                  <h3>Hash Blockchain</h3>
                  <p className="blockchain-hash">{coffeeData.blockchainHash}</p>
                  <p className="blockchain-verified">✓ Verificado na blockchain</p>
                </Card>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Track
