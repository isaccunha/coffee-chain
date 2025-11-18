import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { LogIn, Mail, Lock, AlertCircle, ShieldCheck, ShoppingBag } from 'lucide-react'
import Button from '../components/Button/Button'
import Card from '../components/Card/Card'
import { useAuth } from '../context/AuthContext'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login({ email, password })
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.')
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
            <LogIn size={32} className="auth-icon" />
            <h1>Entrar no coffee-chain</h1>
            <p>Acesse sua conta e consulte safras certificadas</p>
          </div>

          {/* Role info - login doesn't require role selection, just informative */}
          <div className="role-selector">
            <div className="role-option role-option--info">
              <ShoppingBag size={24} />
              <div>
                <span>Comprador (BUYER)</span>
                <small>Consulta de safras e lotes</small>
              </div>
            </div>
            <div className="role-option role-option--info">
              <ShieldCheck size={24} />
              <div>
                <span>Fiscal (INSPECTOR)</span>
                <small>Registro e auditoria</small>
              </div>
            </div>
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
                <label htmlFor="email">
                  <Mail size={18} />
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <Lock size={18} />
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                style={{ width: '100%' }}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>

              <div className="auth-footer">
                <p>
                  Não tem uma conta?{' '}
                  <Link to="/cadastro" className="auth-link">
                    Cadastre-se
                  </Link>
                </p>
              </div>
            </form>
          </Card>

          <p className="auth-note">
            <AlertCircle size={16} />
            Seu perfil (comprador ou fiscal) foi definido no cadastro. Entre com suas credenciais para acessar.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
