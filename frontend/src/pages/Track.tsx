import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Calendar, User, Package, Award, AlertCircle, Sparkles, X } from 'lucide-react'
import ReactMarkdown from "react-markdown";
import Button from '../components/Button/Button'
import Card from '../components/Card/Card'
import { trackCoffee, generateSummary } from '../services/api'
import './Track.css'

const Track = () => {
  const [trackingCode, setTrackingCode] = useState('')
  const [coffeeData, setCoffeeData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const [showSummary, setShowSummary] = useState(false)

  const handleTrack = async () => {
    if (!trackingCode.trim()) return
    
    setLoading(true)
    setError(null)
    setCoffeeData(null)
    setSummary(null)
    setShowSummary(false)
    
    try {
      const data = await trackCoffee(trackingCode.trim())
      setCoffeeData(data)
    } catch (err: any) {
      setError(err?.message || 'Safra não encontrada. Verifique o código e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateSummary = async () => {
    if (!coffeeData) return
    setSummaryLoading(true)
    try {
    const response = await generateSummary({
        farm_name: coffeeData.farm_name,
        location: coffeeData.location,
        harvest_date: coffeeData.harvest_date,
        coffee_variety: coffeeData.coffee_variety,
        altitude: coffeeData.altitude,
        coffee_bags: coffeeData.coffee_bags || 0,
        processing_method: coffeeData.processing_method,
        certifications: coffeeData.certifications || [],
        notes: coffeeData.notes || ''
    })
        setSummary(response)
        setShowSummary(true)
    } catch (err: any) {
        setError(err?.message || 'Erro ao gerar resumo')
    } finally {
        setSummaryLoading(false)
    }
  }

  function formatDate(dateString: string) {
    if (!dateString || dateString === "Desconhecido") return "Data não informada";

    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
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
              {error && (
                <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#fee2e2', borderRadius: '8px', color: '#dc2626', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </Card>

          {coffeeData && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="track-results"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className="track-results__title">Informações do Café</h2>
                <Button 
                  variant="primary"
                  onClick={handleGenerateSummary}
                  disabled={summaryLoading}
                >
                  <Sparkles size={18} />
                  {summaryLoading ? 'Gerando Resumo...' : 'Gerar Resumo IA'}
                </Button>
              </div>

              <div className="track-results__grid">
                  {showSummary && summary && (
                    <Card className="summary-card">
                        <div className="summary-card__header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Sparkles size={24} style={{ color: '#8b4513' }} />
                            <h3>Resumo IA da Safra</h3>
                        </div>
                        <button
                            onClick={() => setShowSummary(false)}
                            className="summary-card__close"
                        >
                            <X size={20} />
                        </button>
                        </div>
                        <div className="summary-card__content">
                        <ReactMarkdown>{summary}</ReactMarkdown>
                        </div>
                    </Card>
                )}

                    <Card>
                    <div className="info-card">
                        <div className="info-card__icon">
                        <MapPin size={24} />
                        </div>
                        <div className="info-card__content">
                        <h3>Origem do Café</h3>
                        <p className="info-card__value">{coffeeData.farm_name}</p>
                        <p className="info-card__detail">
                            Localizada em {coffeeData.location}
                        </p>
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
                        <p className="info-card__value">{coffeeData.owner}</p>
                        <p className="info-card__detail">Responsável pela produção e manejo</p>
                        </div>
                    </div>
                    </Card>


                    <Card>
                    <div className="info-card">
                        <div className="info-card__icon">
                        <Calendar size={24} />
                        </div>
                        <div className="info-card__content">
                        <h3>Data da Colheita</h3>
                        <p className="info-card__value">
                            {formatDate(coffeeData.harvest_date)}
                        </p>
                        <p className="info-card__detail">
                            Dados registrados em {formatDate(coffeeData.inserted_at)}
                        </p>
                        </div>
                    </div>
                    </Card>



                    <Card>
                    <div className="info-card">
                        <div className="info-card__icon">
                        <Package size={24} />
                        </div>
                        <div className="info-card__content">
                        <h3>Variedade & Processamento</h3>
                        <p className="info-card__value">{coffeeData.coffee_variety}</p>
                        <p className="info-card__detail">
                            Método de processamento: {coffeeData.processing_method}
                        </p>
                        </div>
                    </div>
                    </Card>


                    <Card>
                    <div className="info-card">
                        <div className="info-card__icon">
                        <Award size={24} />
                        </div>
                        <div className="info-card__content">
                        <h3>Certificações</h3>
                        <p className="info-card__value">
                            {coffeeData.certifications.length > 0
                            ? coffeeData.certifications.map((c: any) => c.name).join(", ")
                            : "Nenhuma certificação registrada"}
                        </p>

                        <p className="info-card__detail">
                            Cultivado a {coffeeData.altitude} metros de altitude
                        </p>
                        </div>
                    </div>
                    </Card>


                    <Card>
                    <div className="info-card">
                        <div className="info-card__icon">
                        <Award size={24} />
                        </div>
                        <div className="info-card__content">
                        <h3>Altitude</h3>
                        <p className="info-card__value">{coffeeData.altitude} metros</p>
                        <p className="info-card__detail">
                            Altitude aproximada onde o café foi cultivado
                        </p>
                        </div>
                    </div>
                    </Card>



                <Card className="blockchain-card">
                  <h3>Hash Blockchain</h3>
                  <p className="blockchain-hash">{coffeeData.id}</p>
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
