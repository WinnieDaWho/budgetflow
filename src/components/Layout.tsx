import { useState, type ReactNode } from 'react'
import { Menu, X, Home, Calendar, PieChart, TrendingUp, ShieldCheck } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
  currentPage: string
  onNavigate: (page: string) => void
}

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { name: 'Dashboard', id: 'dashboard', icon: Home },
    { name: 'Calendar', id: 'calendar', icon: Calendar },
    { name: 'Analytics', id: 'analytics', icon: PieChart },
    { name: 'Net Worth', id: 'networth', icon: TrendingUp },
  ]

  return (
    <div className="h-screen bg-background text-text-main flex overflow-hidden font-sans">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-72 flex-col border-r border-stroke bg-surface/50 backdrop-blur-xl relative z-20">
        <div className="p-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-primary bg-clip-text text-transparent tracking-tighter">
            BudgetFlow
          </h1>
          <p className="text-xs text-text-main/50 tracking-widest uppercase mt-1 ml-1">Pro Edition</p>
        </div>
        
        <nav className="flex-1 px-6 space-y-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center w-full px-5 py-4 rounded-[18px] transition-all duration-300 group ${
                currentPage === item.id 
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(213,91,244,0.15)]' 
                  : 'hover:bg-white/5 text-text-main hover:text-white border border-transparent'
              }`}
            >
              <item.icon className={`w-5 h-5 mr-4 transition-colors ${
                currentPage === item.id ? 'text-primary' : 'group-hover:text-white text-text-main/70'
              }`} />
              <span className="font-medium tracking-wide">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* TRUST BADGE (Updated to MoneyWises Style) */}
        <div className="p-6 m-6 rounded-[24px] bg-gradient-to-br from-primary-dark/30 to-surface border border-stroke relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 blur-xl group-hover:bg-primary/10 transition-all"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 text-primary">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Encrypted</span>
            </div>
            <p className="text-[10px] text-text-main/80 leading-relaxed">
                256-bit SSL Protection. <br/>
                Your data is read-only & secure.
            </p>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-stroke bg-background/80 backdrop-blur-md flex items-center justify-between px-4 z-50">
        <span className="font-bold text-xl text-white">BudgetFlow</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-background z-40 p-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id)
                setIsMobileMenuOpen(false)
              }}
              className={`flex items-center w-full px-4 py-4 border-b border-stroke text-lg ${
                currentPage === item.id ? 'text-primary font-bold' : 'text-text-main'
              }`}
            >
              <item.icon className="w-5 h-5 mr-4" />
              {item.name}
            </button>
          ))}
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 pt-20 md:pt-0 md:p-8 overflow-y-auto relative h-full bg-background scrollbar-hide">
        {/* Ambient Background Light */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/5 blur-[120px] pointer-events-none rounded-full -translate-y-1/2"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-0 pb-20">
          {children}
        </div>
      </main>
    </div>
  )
}