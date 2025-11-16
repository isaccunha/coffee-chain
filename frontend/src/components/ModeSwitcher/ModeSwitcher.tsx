import { ShieldCheck, ShoppingBag } from 'lucide-react'
import { useMode } from '../../context/ModeContext'
import './ModeSwitcher.css'

const modes = [
  {
    id: 'comprador' as const,
    label: 'Modo Comprador',
    description: 'Consulta de safras, laudos, pontuação e lote disponível',
    icon: ShoppingBag,
  },
  {
    id: 'fiscal' as const,
    label: 'Modo Fiscal',
    description: 'Registro de safra, auditoria e envio para blockchain',
    icon: ShieldCheck,
  },
]

const ModeSwitcher = () => {
  const { mode, setMode } = useMode()

  return (
    <div className="mode-switcher" role="group" aria-label="Alternar modo de uso">
      {modes.map(({ id, label, description, icon: Icon }) => {
        const isActive = mode === id
        return (
          <button
            key={id}
            type="button"
            className={`mode-switcher__pill ${isActive ? 'mode-switcher__pill--active' : ''}`}
            onClick={() => setMode(id)}
            aria-pressed={isActive}
          >
            <div className="mode-switcher__icon">
              <Icon size={18} />
            </div>
            <div>
              <span>{label}</span>
              <p>{description}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default ModeSwitcher
