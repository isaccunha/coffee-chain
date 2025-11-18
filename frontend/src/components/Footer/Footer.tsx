import { Coffee, Github, Linkedin, Mail } from 'lucide-react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div className="footer__section">
            <div className="footer__brand">
              <Coffee size={24} />
              <span>CoffeeChain</span>
            </div>
            <p className="footer__description">
              Rastreabilidade transparente do café brasileiro usando tecnologia blockchain.
              Da fazenda até sua xícara.
            </p>
          </div>

          <div className="footer__section">
            <h4 className="footer__title">Links Rápidos</h4>
            <ul className="footer__links">
              <li><a href="/">Início</a></li>
              <li><a href="/rastrear">Rastrear Café</a></li>
              <li><a href="/produtor">Para Produtores</a></li>
              <li><a href="/historico">Histórico</a></li>
            </ul>
          </div>

          <div className="footer__section">
            <h4 className="footer__title">Sobre</h4>
            <ul className="footer__links">
              <li><a href="#about">Sobre o Projeto</a></li>
              <li><a href="#blockchain">Como Funciona</a></li>
              <li><a href="#contact">Contato</a></li>
              <li><a href="#privacy">Privacidade</a></li>
            </ul>
          </div>

          <div className="footer__section">
            <h4 className="footer__title">Conecte-se</h4>
            <div className="footer__social">
              <a href="#github" aria-label="GitHub">
                <Github size={20} />
              </a>
              <a href="#linkedin" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="mailto:contato@coffeechain.com" aria-label="Email">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} CoffeeChain. Desenvolvido na UFLA.</p>
          <p>Blockchain para rastreabilidade de café.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
