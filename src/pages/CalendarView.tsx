import { useEffect, useState } from 'react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase, type Transaction } from '../lib/supabase'

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data } = await supabase.from('transactions').select('*')
      if (data) setTransactions(data)
    }
    fetchTransactions()
  }, [])

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-stroke/30 pb-6">
        <div>
          <h1 className="text-4xl font-bold text-text-white tracking-tight">
            Financial Calendar
          </h1>
          <p className="mt-2 text-lg font-light text-text-main">
            <span className="text-primary font-medium">{format(currentDate, 'MMMM')}</span> {format(currentDate, 'yyyy')}
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={prevMonth} 
            className="p-3 rounded-full bg-surface border border-neutral-800 text-text-main hover:text-white hover:border-primary/50 hover:bg-primary/10 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={nextMonth} 
            className="p-3 rounded-full bg-surface border border-neutral-800 text-text-main hover:text-white hover:border-primary/50 hover:bg-primary/10 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* THE CALENDAR GRID CONTAINER */}
      <div className="rounded-[24px] bg-surface border border-neutral-800 overflow-hidden shadow-2xl relative">
        
        {/* Ambient Glow behind the grid */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 blur-[100px] pointer-events-none"></div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-neutral-800 bg-surface/50 backdrop-blur-sm">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-4 text-center text-sm font-semibold text-text-main tracking-wider border-r border-neutral-800/50 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* The Days */}
        <div className="grid grid-cols-7 bg-neutral-900/30">
          {days.map((day) => {
            const dayTransactions = transactions.filter((t) => isSameDay(new Date(t.date), day))
            const dailyTotal = dayTransactions.reduce(
              (sum, t) => (t.type === 'credit' ? sum + Number(t.amount) : sum - Number(t.amount)),
              0
            )
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isTodayDate = isToday(day)

            return (
              <div
                key={day.toISOString()}
                className={`
                  min-h-[140px] p-3 transition-all relative border-b border-r border-neutral-800/60
                  hover:bg-white/5 group
                  ${!isCurrentMonth ? 'bg-black/40 text-neutral-600' : 'bg-transparent text-text-white'} 
                  ${isTodayDate ? 'bg-primary/5 box-shadow-inner' : ''}
                `}
              >
                {/* Visual Indicator for Today */}
                {isTodayDate && (
                   <div className="absolute inset-0 border-2 border-primary/30 pointer-events-none"></div>
                )}

                <div className="flex justify-between items-start relative z-10">
                  <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                      isTodayDate ? 'bg-primary text-black font-bold' : ''
                  }`}>
                    {format(day, 'd')}
                  </span>
                  
                  {/* Daily Total Tag */}
                  {dayTransactions.length > 0 && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        dailyTotal >= 0 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                      {dailyTotal > 0 ? '+' : ''}{Math.abs(dailyTotal).toFixed(0)}
                    </span>
                  )}
                </div>

                {/* Transaction Dots */}
                <div className="mt-3 space-y-1.5 relative z-10">
                  {dayTransactions.map((t) => (
                    <div key={t.id} className="flex items-center gap-2 p-1 rounded hover:bg-white/10 cursor-pointer transition-colors">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${t.type === 'credit' ? 'bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.5)]' : 'bg-red-400 shadow-[0_0_5px_rgba(248,113,113,0.5)]'}`}></div>
                      <span className="truncate text-[10px] text-text-main group-hover:text-white transition-colors leading-tight">
                        {t.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}