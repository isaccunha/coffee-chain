import { Github } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

import './Footer.css'

const Footer = () => {
  const { user } = useAuth();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div className="footer__section">
            <div className="footer__section_inside">
            <div className="footer__brand">
              <img src="/logo.png" alt="coffee-chain" className="footer__logo" />
              <span>coffee-chain</span>
            </div>
            <p className="footer__description">
              Rastreabilidade transparente do café brasileiro usando tecnologia blockchain.
              Da fazenda até sua xícara.
            </p>
            </div>
          </div>

          <div className="footer__section">
            <div className="footer__section_inside">
                <h4 className="footer__title">Links Rápidos</h4>
                <ul className="footer__links">
                <li><a href="/">Início</a></li>
                {user?.role === "BUYER" && <li><a href="/rastrear">Rastrear Café</a></li>}
                {user?.role === "INSPECTOR" && <li><a href="/rastrear">Registrar Café</a></li>}
                {(user?.role === "INSPECTOR" || user?.role === "BUYER") && <li><a href="/historico">Histórico</a></li>}
                </ul>
                </div>
          </div>

          {/* <div className="footer__section">
            <h4 className="footer__title">Sobre</h4>
            <ul className="footer__links">
              <li><a href="#about">Sobre o Projeto</a></li>
              <li><a href="#blockchain">Como Funciona</a></li>
              <li><a href="#contact">Contato</a></li>
              <li><a href="#privacy">Privacidade</a></li>
            </ul>
          </div> */}

          <div className="footer__section">
            <div className="footer__section_inside_1">
            <h4 className="footer__title">Conecte-se</h4>
            <div className="footer__social">
              <a href="https://github.com/isaccunha/coffee-chain" aria-label="GitHub">
                <Github size={20} />
              </a>
              {/* <a href="#linkedin" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="mailto:contato@coffee-chain.com" aria-label="Email">
                <Mail size={20} />
              </a> */}
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} coffee-chain.</p>
          <p>Blockchain para rastreabilidade de café.</p>
          <p>Desenvolvido por estudantes da UFLA.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
