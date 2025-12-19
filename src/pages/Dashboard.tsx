import { useEffect, useState } from 'react'
import { Wallet, Zap, Activity, ArrowUpRight, Sparkles, Target, TrendingDown } from 'lucide-react'
import { supabase, type Transaction } from '../lib/supabase'
import Animation from '../components/Animation'
import TransactionModal from '../components/TransactionModal'

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  // These look for files in your "public" folder
  const ANIMATIONS = {
    growth: "/growth.json",
    glitch: "/glitch.json",
    cashflow: "/cashflow.json"
  }

  const fetchTransactions = async () => {
    try {
        const { data } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })
        setTransactions(data || [])
    } catch (err) {
        console.error('Error fetching:', err)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTransactions()
  }, [])

  const totalIncome = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + Number(t.amount), 0)
  const totalExpenses = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + Number(t.amount), 0)
  const balance = totalIncome - totalExpenses
  const surplus = totalIncome - totalExpenses
  const isSurplusPositive = surplus >= 0

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      
      {/* The Popup Form */}
      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchTransactions} 
      />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-stroke/30 pb-6">
        <div>
          <h1 className="text-4xl font-bold text-text-white tracking-tight">Dashboard</h1>
          <p className="mt-2 text-lg font-light">
            Welcome back, <span className="text-primary font-medium">Commander</span>
          </p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 bg-primary text-background font-bold rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(213,91,244,0.4)]"
        >
          + Add Transaction
        </button>
      </div>

      {/* BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. Total Balance + GROWTH ANIMATION */}
        <div className="group relative rounded-[24px] bg-surface border border-neutral-800 p-1 transition-all hover:border-stroke hover:shadow-[0_0_30px_rgba(213,91,244,0.15)] overflow-hidden">
           <div className="relative h-full overflow-hidden rounded-[20px] p-6">
              <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen">
                  <Animation url={ANIMATIONS.growth} className="w-full h-full object-cover" />
              </div>
              
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-2xl bg-primary-dark/30 border border-stroke text-primary">
                        <Wallet className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium uppercase tracking-wide">Total Balance</span>
                 </div>
                 <div className="text-4xl font-bold text-text-white mb-2 tracking-tight">
                    ${balance.toFixed(2)}
                 </div>
              </div>
           </div>
        </div>

        {/* 2. Income */}
        <div className="relative rounded-[24px] bg-surface border border-neutral-800 p-6 hover:border-primary/50 transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium">Monthly Income</span>
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Zap className="w-5 h-5" />
                </div>
            </div>
            <div className="text-3xl font-bold text-text-white mb-4">${totalIncome.toFixed(2)}</div>
            <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-emerald-400 w-[70%] rounded-full shadow-[0_0_10px_rgba(213,91,244,0.5)]"></div>
            </div>
        </div>

        {/* 3. Expenses */}
        <div className="relative rounded-[24px] bg-surface border border-neutral-800 p-6 hover:border-red-500/50 transition-colors group">
             <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium">Monthly Expenses</span>
                <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                    <Activity className="w-5 h-5" />
                </div>
            </div>
            <div className="text-3xl font-bold text-text-white mb-4">${totalExpenses.toFixed(2)}</div>
             <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 w-[45%] rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
            </div>
        </div>
      </div>

      {/* PROJECTIONS + GLITCH ANIMATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-[24px] bg-gradient-to-br from-primary-dark to-surface border border-stroke relative overflow-hidden group flex flex-row items-center justify-between">
             <div className="relative z-10">
                <h3 className="text-primary font-medium mb-1 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> AI Projection
                </h3>
                <p className="text-3xl font-bold text-text-white mt-2">
                    ${(balance + (isSurplusPositive ? surplus : 0)).toFixed(2)}
                </p>
                <p className="text-sm mt-1 opacity-80">Expected Month End</p>
             </div>
             <div className="w-32 h-32 opacity-80">
                <Animation url={ANIMATIONS.glitch} />
             </div>
          </div>

          <div className={`p-8 rounded-[24px] border ${isSurplusPositive ? 'bg-emerald-950/20 border-emerald-500/20' : 'bg-red-950/20 border-red-500/20'} relative overflow-hidden`}>
             <div className="relative z-10">
                <h3 className={`font-medium mb-1 flex items-center gap-2 ${isSurplusPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    <Target className="w-4 h-4" /> Net Flow
                </h3>
                <p className="text-3xl font-bold text-text-white mt-2">
                    {isSurplusPositive ? '+' : ''}${surplus.toFixed(2)}
                </p>
             </div>
          </div>
      </div>
      
      {/* RECENT TRANSACTIONS */}
      <div className="bg-surface border border-neutral-800 rounded-[24px] overflow-hidden">
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
            <h3 className="text-text-white font-semibold text-lg">Recent Transactions</h3>
            <button className="text-sm text-primary hover:text-white transition-colors">View All</button>
        </div>
        <div className="divide-y divide-neutral-800">
            {transactions.map((t) => (
                <div key={t.id} className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                             t.type === 'credit' 
                             ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                             : 'bg-red-500/10 border-red-500/20 text-red-500'
                        } group-hover:scale-110 transition-transform`}>
                            {t.type === 'credit' ? <ArrowUpRight className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                        </div>
                        <div>
                            <p className="text-text-white font-medium text-lg">{t.description}</p>
                            <p className="text-sm">{t.category} • {t.date}</p>
                        </div>
                    </div>
                    <span className={`font-mono text-lg font-bold ${
                        t.type === 'credit' ? 'text-emerald-400' : 'text-text-white'
                    }`}>
                        {t.type === 'credit' ? '+' : '-'}${Number(t.amount).toFixed(2)}
                    </span>
                </div>
            ))}
        </div>
      </div>
    </div>
  )
}