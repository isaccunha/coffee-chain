import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Coffee, Search, User, History, Menu, X, LogOut, ShieldCheck, ShoppingBag, LogIn } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    navigate('/')
  }

  const menuItems = [
    { path: '/', label: 'Safras', icon: Coffee, public: true },
    { path: '/rastrear', label: 'Consultar', icon: Search, role: 'comprador' },
    { path: '/fiscal', label: 'Fiscal', icon: User, role: 'fiscal' },
    { path: '/historico', label: 'Auditoria', icon: History, auth: true },
  ]

  const visibleMenuItems = menuItems.filter(item => {
    if (item.public) return true
    if (item.role) return user?.role === item.role
    if (item.auth) return isAuthenticated
    return true
  })

  return (
    <motion.nav 
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <div className="navbar__content">
          <Link to="/" className="navbar__brand">
            <Coffee size={28} />
            <span>CoffeeChain</span>
          </Link>

          {/* Desktop Menu */}
          <ul className="navbar__menu">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={`navbar__link ${isActive ? 'navbar__link--active' : ''}`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div 
                        className="navbar__indicator"
                        layoutId="navbar-indicator"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* User Menu */}
          <div className="navbar__actions">
            {isAuthenticated ? (
              <div className="navbar__user">
                <button 
                  className="navbar__user-button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-label="User menu"
                >
                  {user?.role === 'fiscal' ? <ShieldCheck size={20} /> : <ShoppingBag size={20} />}
                  <span>{user?.name}</span>
                </button>
                
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      className="navbar__user-menu"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="navbar__user-info">
                        <strong>{user?.name}</strong>
                        <span>{user?.email}</span>
                        <span className="navbar__user-role">
                          {user?.role === 'fiscal' ? (
                            <>
                              <ShieldCheck size={14} /> Fiscal
                            </>
                          ) : (
                            <>
                              <ShoppingBag size={14} /> Comprador
                            </>
                          )}
                        </span>
                      </div>
                      <button onClick={handleLogout} className="navbar__user-logout">
                        <LogOut size={18} />
                        <span>Sair</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="navbar__login">
                <LogIn size={18} />
                <span>Entrar</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="navbar__toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div 
          className="navbar__mobile"
          initial={false}
          animate={{ 
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          {visibleMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link 
                key={item.path}
                to={item.path} 
                className={`navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
          
          {/* Mobile Auth */}
          <div className="navbar__mobile-auth">
            {isAuthenticated ? (
              <>
                <div className="navbar__mobile-user">
                  {user?.role === 'fiscal' ? <ShieldCheck size={18} /> : <ShoppingBag size={18} />}
                  <div>
                    <strong>{user?.name}</strong>
                    <span>{user?.role === 'fiscal' ? 'Fiscal' : 'Comprador'}</span>
                  </div>
                </div>
                <button onClick={handleLogout} className="navbar__mobile-logout">
                  <LogOut size={18} />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="navbar__mobile-link" onClick={() => setIsOpen(false)}>
                <LogIn size={20} />
                <span>Entrar</span>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}

export default Navbar
