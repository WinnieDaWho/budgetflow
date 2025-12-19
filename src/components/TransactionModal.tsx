import { useState } from 'react'
import { X, Loader2, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function TransactionModal({ isOpen, onClose, onSuccess }: TransactionModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'debit',
    category: 'General',
    date: new Date().toISOString().split('T')[0]
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from('transactions').insert([
        {
          description: formData.description,
          amount: Number(formData.amount),
          type: formData.type,
          category: formData.category,
          date: formData.date
        }
      ])

      if (error) throw error
      onSuccess()
      onClose()
      setFormData({
        description: '',
        amount: '',
        type: 'debit',
        category: 'General',
        date: new Date().toISOString().split('T')[0]
      })
    } catch (err) {
      console.error('Error adding transaction:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface border border-stroke w-full max-w-md rounded-[24px] p-6 shadow-2xl relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] pointer-events-none"></div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">New Transaction</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-text-main hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div className="grid grid-cols-2 gap-2 p-1 bg-black/20 rounded-xl">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'debit' })}
              className={`py-2 rounded-lg text-sm font-medium transition-all ${
                formData.type === 'debit' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'text-text-main hover:text-white'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'credit' })}
              className={`py-2 rounded-lg text-sm font-medium transition-all ${
                formData.type === 'credit' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'text-text-main hover:text-white'
              }`}
            >
              Income
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-main mb-1 uppercase tracking-wider">Description</label>
            <input
              required
              type="text"
              placeholder="e.g. Netflix"
              className="w-full bg-background border border-neutral-800 rounded-xl p-3 text-white focus:outline-none focus:border-primary transition-colors"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-main mb-1 uppercase tracking-wider">Amount ($)</label>
              <input
                required
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full bg-background border border-neutral-800 rounded-xl p-3 text-white focus:outline-none focus:border-primary transition-colors font-mono"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div>
                <label className="block text-xs font-medium text-text-main mb-1 uppercase tracking-wider">Date</label>
                <input
                  required
                  type="date"
                  className="w-full bg-background border border-neutral-800 rounded-xl p-3 text-white focus:outline-none focus:border-primary transition-colors"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary text-background font-bold rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(213,91,244,0.3)] mt-6 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
            {loading ? 'Saving...' : 'Save Transaction'}
          </button>
        </form>
      </div>
    </div>
  )
}