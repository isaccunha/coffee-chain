import { motion } from 'framer-motion'
import './Card.css'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

const Card = ({ children, className = '', hover = true }: CardProps) => {
  return (
    <motion.div
      className={`card ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={
        hover
          ? { y: -5, boxShadow: '0 35px 55px rgba(67, 40, 24, 0.18)' }
          : {}
      }
    >
      {children}
    </motion.div>
  )
}

export default Card
