import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import CalendarView from './pages/CalendarView'
import Layout from './components/Layout'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'calendar':
        return <CalendarView />
      case 'analytics':
        return (
          <div className="p-8 text-center border border-dashed border-slate-700 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Analytics</h2>
            <p className="text-muted-foreground">Coming Soon: Charts and Net Worth Projections.</p>
          </div>
        )
      default:
        return <Dashboard />
    }
  }

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderContent()}
    </Layout>
  )
}

export default App
