import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Track from './pages/Track'
import Fiscal from './pages/Fiscal'
import History from './pages/History'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ModeProvider } from './context/ModeContext'
import './App.css'

const HomePage = () => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Dashboard /> : <Home />
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ModeProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Register />} />
              <Route 
                path="/rastrear" 
                element={
                  <ProtectedRoute requiredRole="BUYER">
                    <Track />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/fiscal" 
                element={
                  <ProtectedRoute requiredRole="INSPECTOR">
                    <Fiscal />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/historico" 
                element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Layout>
        </ModeProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
