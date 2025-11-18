import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { UserPlus, Mail, Lock, User as UserIcon, Building, AlertCircle, ShieldCheck, ShoppingBag } from 'lucide-react'
import Button from '../components/Button/Button'
import Card from '../components/Card/Card'
import { useAuth } from '../context/AuthContext'
import { UserRole } from '../types'
import './Login.css'

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: '',
  })
  const [role, setRole] = useState<UserRole>('BUYER')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setIsLoading(true)

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
        organization: formData.organization || undefined,
      })
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar conta. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="container">
        <motion.div
          className="auth-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="auth-header">
            <UserPlus size={32} className="auth-icon" />
            <h1>Criar Conta</h1>
            <p>Junte-se ao CoffeeChain e acesse safras certificadas</p>
          </div>

          {/* Role Selection */}
          <div className="role-selector">
            <button
              type="button"
              className={`role-option ${role === 'BUYER' ? 'role-option--active' : ''}`}
              onClick={() => setRole('BUYER')}
            >
              <ShoppingBag size={24} />
              <div>
                <span>Comprador</span>
                <small>Consulta de safras e lotes</small>
              </div>
            </button>
            <button
              type="button"
              className={`role-option ${role === 'INSPECTOR' ? 'role-option--active' : ''}`}
              onClick={() => setRole('INSPECTOR')}
            >
              <ShieldCheck size={24} />
              <div>
                <span>Fiscal</span>
                <small>Registro e auditoria</small>
              </div>
            </button>
          </div>

          <Card>
            <form onSubmit={handleSubmit} className="auth-form">
              {error && (
                <motion.div
                  className="error-message"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </motion.div>
              )}

              <div className="form-group">
                <label htmlFor="name">
                  <UserIcon size={18} />
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  required
                  autoComplete="name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={18} />
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  required
                  autoComplete="email"
                />
              </div>

              {role === 'INSPECTOR' && (
                <div className="form-group">
                  <label htmlFor="organization">
                    <Building size={18} />
                    Organização / Cooperativa
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Nome da organização"
                    autoComplete="organization"
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="password">
                  <Lock size={18} />
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <Lock size={18} />
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Digite a senha novamente"
                  required
                  autoComplete="new-password"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                style={{ width: '100%' }}
              >
                {isLoading ? 'Criando conta...' : 'Criar Conta'}
              </Button>

              <div className="auth-footer">
                <p>
                  Já tem uma conta?{' '}
                  <Link to="/login" className="auth-link">
                    Fazer login
                  </Link>
                </p>
              </div>
            </form>
          </Card>

          <p className="auth-note">
            <AlertCircle size={16} />
            Ao criar uma conta, você concorda com os termos de uso do CoffeeChain.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Register
