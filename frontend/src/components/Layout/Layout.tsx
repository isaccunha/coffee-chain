import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import './Layout.css'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout__main">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
