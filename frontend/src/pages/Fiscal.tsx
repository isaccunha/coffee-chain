import React, { useState } from 'react'
import { motion } from 'framer-motion'
import jsPDF from "jspdf"
import { Plus, Trash2, Download, CheckCircle, Shield, Copy } from 'lucide-react'
import Button from '../components/Button/Button'
import Card from '../components/Card/Card'
import { createSafra, validateBlockchain } from '../services/api'
import './Fiscal.css'

interface SafraFormData {
  farm_name: string
  location: string
  harvest_date: string
  coffee_variety: string
  altitude: string
  coffee_bags: number | string
  processing_method: string
  certifications: Array<{ name: string }>
  notes: string
}

interface Message {
  type: 'success' | 'error' | 'info'
  text: string
}

interface SuccessResult {
  id: string
  formData: SafraFormData
  timestamp: string
}

interface ValidationModalData {
  valid: boolean
  timestamp: string
}

const initialFormData: SafraFormData = {
  farm_name: '',
  location: '',
  harvest_date: '',
  coffee_variety: '',
  altitude: '',
  coffee_bags: '',
  processing_method: '',
  certifications: [],
  notes: '',
}

export default function Fiscal() {
  const [formData, setFormData] = useState<SafraFormData>(initialFormData)
  const [certificationInput, setCertificationInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<Message | null>(null)
  const [successResult, setSuccessResult] = useState<SuccessResult | null>(null)
  const [lastSuccessResult, setLastSuccessResult] = useState<SuccessResult | null>(null)
  const [validationModal, setValidationModal] = useState<ValidationModalData | null>(null)
  const [showMiniSuccess, setShowMiniSuccess] = useState(false)

  const showMessage = (type: Message['type'], text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

    const downloadSafraPDF = () => {
      const result = successResult ?? lastSuccessResult
      if (!result) return

      const doc = new jsPDF()

      doc.setFontSize(18)
      doc.text("Relatório da safra", 10, 15)

      doc.setFontSize(12)
      doc.text(`ID: ${result.id}`, 10, 30)
      doc.text(`Registrado em: ${result.timestamp}`, 10, 40)

      const d = result.formData

    doc.text("• Fazenda: " + d.farm_name, 10, 60)
    doc.text("• Localização: " + d.location, 10, 70)
    doc.text("• Data da Colheita: " + d.harvest_date, 10, 80)
    doc.text("• Variedade: " + d.coffee_variety, 10, 90)
    doc.text("• Altitude: " + d.altitude + "m", 10, 100)
    doc.text("• Sacas: " + d.coffee_bags, 10, 110)
    doc.text("• Método de Processamento: " + d.processing_method, 10, 120)

    // Certificações, se houver
    if (d.certifications.length > 0) {
        doc.text("Certificações:", 10, 140)
        d.certifications.forEach((c, index) => {
        doc.text(`- ${c.name}`, 15, 150 + index * 10)
        })
    }

    // Notas
    if (d.notes) {
        doc.text("Notas:", 10, 180)
        doc.text(d.notes, 15, 190)
    }

  doc.save(`safra_${result.id}.pdf`)
    }
    

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'coffee_bags' ? (value === '' ? '' : Number(value)) : value
    }))
  }

  const handleAddCertification = () => {
    if (certificationInput.trim()) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, { name: certificationInput.trim() }]
      }))
      setCertificationInput('')
    }
  }

  const handleRemoveCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }))
  }

  const validateForm = (): boolean => {
    if (!formData.farm_name.trim()) {
      showMessage('error', 'Farm name é obrigatório')
      return false
    }
    if (!formData.location.trim()) {
      showMessage('error', 'Location é obrigatório')
      return false
    }
    if (!formData.harvest_date) {
      showMessage('error', 'Harvest date é obrigatório')
      return false
    }
    if (!formData.coffee_variety.trim()) {
      showMessage('error', 'Coffee variety é obrigatório')
      return false
    }
    if (!formData.altitude.trim()) {
      showMessage('error', 'Altitude é obrigatório')
      return false
    }
    if (!formData.coffee_bags || Number(formData.coffee_bags) <= 0) {
      showMessage('error', 'Coffee bags deve ser maior que 0')
      return false
    }
    if (!formData.processing_method.trim()) {
      showMessage('error', 'Processing method é obrigatório')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...formData,
        coffee_bags: Number(formData.coffee_bags)
      }

      const response = await createSafra(payload)
      showMessage('success', `✓ Safra salva com sucesso na blockchain! ID: ${response.id}`)
      
      // Armazenar dados de sucesso para exibir no card
      setSuccessResult({
        id: response.id,
        formData: formData,
        timestamp: new Date().toLocaleString('pt-BR')
      })
      
      // Bloquear scroll da página quando modal abrir
      document.body.style.overflow = 'hidden'
      
      setFormData(initialFormData)
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || error.message || 'Erro ao salvar safra'
      showMessage('error', `✗ ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  const handleValidateBlockchain = async () => {
    setLoading(true)
    try {
      const result = await validateBlockchain()
      setValidationModal({
        valid: result.data?.valid || false,
        timestamp: new Date().toLocaleString('pt-BR')
      })
      document.body.style.overflow = 'hidden'
      showMessage('success', '✓ Blockchain validada com sucesso')
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || error.message || 'Erro ao validar blockchain'
      showMessage('error', `✗ ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fiscal-container">
        {showMiniSuccess && lastSuccessResult && (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mini-success-box"
        >
            <div className="mini-success-content">
            <h4>Safra registrada!</h4>
            <p className="mini-success-id">ID: <strong>{lastSuccessResult.id}</strong>
              <button
                type="button"
                className="mini-copy-btn"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(lastSuccessResult.id)
                    showMessage('success', 'ID copiado para a área de transferência')
                  } catch (e) {
                    // fallback
                    const ta = document.createElement('textarea')
                    ta.value = lastSuccessResult.id
                    document.body.appendChild(ta)
                    ta.select()
                    try { document.execCommand('copy') } catch {}
                    document.body.removeChild(ta)
                    showMessage('success', 'ID copiado para a área de transferência')
                  }
                }}
                aria-label="Copiar ID"
              >
                <Copy size={14} />
              </button>
            </p>

            <Button
                onClick={downloadSafraPDF}
                variant="primary"
            >
                <Download size={16} />
                Baixar PDF
            </Button>
            </div>
        </motion.div>
    )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <div className="fiscal-header">
            <h1>Safra - Controle de Produção</h1>
            <p>Registre e valide safras de café na blockchain</p>
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`fiscal-message fiscal-message-${message.type}`}
            >
              {message.text}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="fiscal-form">
            <div className="form-section">
              <h2>Informações da Safra</h2>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="farm_name">Nome da fazenda *</label>
                  <input
                    type="text"
                    id="farm_name"
                    name="farm_name"
                    value={formData.farm_name}
                    onChange={handleInputChange}
                    placeholder="Nome da fazenda"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location">Localização *</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Localização"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="harvest_date">Data da colheita *</label>
                  <input
                    type="date"
                    id="harvest_date"
                    name="harvest_date"
                    value={formData.harvest_date}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="coffee_variety">Variedade do café *</label>
                  <input
                    type="text"
                    id="coffee_variety"
                    name="coffee_variety"
                    value={formData.coffee_variety}
                    onChange={handleInputChange}
                    placeholder="Ex: Arábica, Robusta"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="altitude">Altitude *</label>
                  <input
                    type="text"
                    id="altitude"
                    name="altitude"
                    value={formData.altitude}
                    onChange={handleInputChange}
                    placeholder="Em metros"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="coffee_bags">Quantidade de sacas *</label>
                  <input
                    type="number"
                    id="coffee_bags"
                    name="coffee_bags"
                    value={formData.coffee_bags}
                    onChange={handleInputChange}
                    placeholder="Quantidade de sacas"
                    min="1"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="processing_method">Método de processamento *</label>
                  <select
                    id="processing_method"
                    name="processing_method"
                    value={formData.processing_method}
                    onChange={handleInputChange}
                    disabled={loading}
                  >
                    <option value="">Selecione um método</option>
                    <option value="natural">Natural</option>
                    <option value="lavado">Lavado</option>
                    <option value="semi-lavado">Semi-lavado</option>
                    <option value="fermentado">Fermentado</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="notes">Notas adicionais (Opcional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Informações adicionais sobre a safra"
                  rows={4}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Certificações (Opcional)</h2>
              <div className="certifications-input">
                <input
                  type="text"
                  value={certificationInput}
                  onChange={(e) => setCertificationInput(e.target.value)}
                  placeholder="Digite o link da certificação. Ex: https://www.ibd.com.br"
                  disabled={loading}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddCertification()
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddCertification}
                  disabled={loading || !certificationInput.trim()}
                  variant="secondary"
                >
                  <Plus size={18} />
                  Adicionar
                </Button>
              </div>

              {formData.certifications.length > 0 && (
                <div className="certifications-list">
                  {formData.certifications.map((cert, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="certification-tag"
                    >
                      <span>{cert.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCertification(index)}
                        disabled={loading}
                        className="remove-cert"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-actions">
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Safra'}
              </Button>
              <Button
                type="button"
                onClick={handleValidateBlockchain}
                disabled={loading}
                variant="secondary"
              >
                {loading ? 'Validando...' : 'Validar Blockchain'}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>

      {/* @ts-ignore */}
      {successResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="success-overlay"
      onClick={() => {
        // move the current success result to lastSuccessResult so the mini card can show after closing
        setLastSuccessResult(successResult)
        setSuccessResult(null)
        document.body.style.overflow = 'auto'
        setShowMiniSuccess(true)
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -30 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
            className="success-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div className="success-modal__header-sticky">
              <button
                className="success-modal__close-btn"
                onClick={() => {
                  setLastSuccessResult(successResult)
                  setSuccessResult(null)
                  document.body.style.overflow = 'auto'
                  setShowMiniSuccess(true)
                }}
                aria-label="Fechar modal"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <div className="success-modal__header">
                <motion.div
                  className="success-modal__icon"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <CheckCircle size={48} strokeWidth={1.5} />
                </motion.div>
                <h2 className="success-modal__title">Safra Registrada com Sucesso!</h2>
                <div className="success-modal__id-box">
                  <p className="success-modal__id-label">ID da Safra</p>
                  <p className="success-modal__id-value">
                    {successResult.id}
                    <button
                      type="button"
                      className="success-copy-btn"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(successResult.id)
                          showMessage('success', 'ID copiado para a área de transferência')
                        } catch (e) {
                          const ta = document.createElement('textarea')
                          ta.value = successResult.id
                          document.body.appendChild(ta)
                          ta.select()
                          try { document.execCommand('copy') } catch {}
                          document.body.removeChild(ta)
                          showMessage('success', 'ID copiado para a área de transferência')
                        }
                      }}
                      aria-label="Copiar ID"
                    >
                      <Copy size={16} />
                    </button>
                  </p>
                </div>
              </div>

              <div className="success-modal__divider"></div>
            </motion.div>

            <div className="success-modal__content">
              <div className="success-details">
                <h3 className="success-details__title">Resumo da Safra</h3>
                <div className="details-grid">
                  <motion.div className="detail-item" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                    <label>Fazenda</label>
                    <p>{successResult.formData.farm_name}</p>
                  </motion.div>
                  <motion.div className="detail-item" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                    <label>Localização</label>
                    <p>{successResult.formData.location}</p>
                  </motion.div>
                  <motion.div className="detail-item" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <label>Data da Colheita</label>
                    <p>{successResult.formData.harvest_date}</p>
                  </motion.div>
                  <motion.div className="detail-item" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                    <label>Variedade</label>
                    <p>{successResult.formData.coffee_variety}</p>
                  </motion.div>
                  <motion.div className="detail-item" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                    <label>Altitude</label>
                    <p>{successResult.formData.altitude}m</p>
                  </motion.div>
                  <motion.div className="detail-item" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
                    <label>Sacas</label>
                    <p>{successResult.formData.coffee_bags}</p>
                  </motion.div>
                </div>

                <div className="details-row">
                  <motion.div className="detail-item-large" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                    <label>Método de Processamento</label>
                    <p>{successResult.formData.processing_method}</p>
                  </motion.div>
                  <motion.div className="detail-item-large" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}>
                    <label>Data/Hora</label>
                    <p>{successResult.timestamp}</p>
                  </motion.div>
                </div>

                {successResult.formData.certifications.length > 0 && (
                  <motion.div className="certifications-section" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <label className="certifications-label">🏆 Certificações</label>
                    <div className="certifications-badges">
                      {successResult.formData.certifications.map((cert, index) => (
                        <motion.span 
                          key={index} 
                          className="cert-badge"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + (index * 0.1) }}
                        >
                          {cert.name}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {successResult.formData.notes && (
                  <motion.div className="notes-section" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
                    <label className="notes-label">Notas Adicionais</label>
                    <p>{successResult.formData.notes}</p>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="success-modal__actions">
              <Button
                onClick={downloadSafraPDF}
                variant="primary"
              >
                <Download size={18} />
                Baixar em formato PDF
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {validationModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="success-overlay"
          onClick={() => {
            setValidationModal(null)
            document.body.style.overflow = 'auto'
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -30 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
            className="success-modal validation-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div className="success-modal__header-sticky">
              <button
                className="success-modal__close-btn"
                onClick={() => {
                  setValidationModal(null)
                  document.body.style.overflow = 'auto'
                }}
                aria-label="Fechar modal"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <div className="success-modal__header validation-modal__header">
                <motion.div
                  className="success-modal__icon validation-modal__icon"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Shield size={48} strokeWidth={1.5} />
                </motion.div>
                <h2 className="success-modal__title validation-modal__title">
                  {validationModal.valid ? '✓ Blockchain Validada!' : '✗ Validação Falhou'}
                </h2>
                <div className="validation-modal__status">
                  <p className={`validation-status ${validationModal.valid ? 'valid' : 'invalid'}`}>
                    {validationModal.valid ? 'Blockchain está válida e confiável' : 'Blockchain apresenta inconsistências'}
                  </p>
                </div>
              </div>

              <div className="success-modal__divider"></div>
            </motion.div>

            <div className="success-modal__content validation-modal__content">
              <div className="validation-details">
                <h3 className="success-details__title">Resultado da Validação</h3>
                
                <motion.div 
                  className="validation-status-box"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="validation-status-item">
                    <span className="validation-status-label">Status da Validação:</span>
                    <span className={`validation-status-value ${validationModal.valid ? 'valid' : 'invalid'}`}>
                      {validationModal.valid ? 'VÁLIDA' : 'INVÁLIDA'}
                    </span>
                  </div>
                  
                  <div className="validation-status-item">
                    <span className="validation-status-label">Data/Hora da Validação:</span>
                    <span className="validation-status-value">{validationModal.timestamp}</span>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="success-modal__actions">
              <Button
                onClick={() => {
                  setValidationModal(null)
                  document.body.style.overflow = 'auto'
                }}
                variant="secondary"
              >
                Fechar
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
