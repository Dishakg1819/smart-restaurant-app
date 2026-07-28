'use client'

import React, { useEffect, useState } from 'react'
import {
  Clock,
  CheckCircle2,
  ChefHat,
  Flame,
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  ShoppingBag,
  IndianRupee,
  Sparkles,
  Bot,
  Loader2,
  RefreshCw,
  AlertCircle,
  Send,
  HelpCircle,
  UtensilsCrossed
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts'
import {
  fetchAiAnalysisAction,
  type Order,
  type OrderItem,
  type OrderStatus
} from '@/app/actions/ai'

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-101',
    table_number: 'T-04',
    customer_name: 'Alex M.',
    status: 'pending',
    total_amount: 42.5,
    created_at: new Date().toISOString(),
    items: [
      { id: '1', name: 'Marigold Special Curry', quantity: 2, price: 15.0 },
      { id: '2', name: 'Garlic Naan', quantity: 3, price: 2.5 },
      { id: '3', name: 'Mango Lassi', quantity: 2, price: 2.5 }
    ]
  },
  {
    id: 'ORD-102',
    table_number: 'T-02',
    customer_name: 'Sarah K.',
    status: 'preparing',
    total_amount: 28.0,
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    items: [
      { id: '4', name: 'Paneer Tikka', quantity: 1, price: 14.0 },
      { id: '1', name: 'Marigold Special Curry', quantity: 1, price: 14.0 }
    ]
  },
  {
    id: 'ORD-103',
    table_number: 'T-08',
    customer_name: 'David L.',
    status: 'ready',
    total_amount: 18.5,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    items: [{ id: '5', name: 'Crispy Butter Chicken', quantity: 1, price: 18.5 }]
  }
]

const DAILY_REVENUE_DATA = [
  { day: 'Mon', revenue: 420 },
  { day: 'Tue', revenue: 580 },
  { day: 'Wed', revenue: 650 },
  { day: 'Thu', revenue: 890 },
  { day: 'Fri', revenue: 1250 },
  { day: 'Sat', revenue: 1680 },
  { day: 'Sun', revenue: 1420 }
]

const POPULAR_DISHES_DATA = [
  { name: 'Marigold Special Curry', value: 145, color: '#C67D3B' },
  { name: 'Garlic Naan', value: 210, color: '#E09C5A' },
  { name: 'Crispy Butter Chicken', value: 98, color: '#8C4D1E' },
  { name: 'Paneer Tikka', value: 76, color: '#DAA520' },
  { name: 'Mango Lassi', value: 180, color: '#F4C430' }
]

const STATUS_COLUMNS: { id: OrderStatus; title: string; icon: React.ReactNode; color: string }[] = [
  { id: 'pending', title: 'New Orders', icon: <Clock className="size-4 text-[#C67D3B]" />, color: 'border-[#3D2513] bg-[#1F150D]' },
  { id: 'preparing', title: 'In Kitchen', icon: <Flame className="size-4 text-[#D97706]" />, color: 'border-[#422006] bg-[#1E1103]' },
  { id: 'ready', title: 'Ready to Serve', icon: <ChefHat className="size-4 text-[#059669]" />, color: 'border-[#064E3B] bg-[#022C22]' },
  { id: 'completed', title: 'Completed', icon: <CheckCircle2 className="size-4 text-[#2563EB]" />, color: 'border-[#1E3A8A] bg-[#0F172A]' }
]

function FormattedTime({ isoString }: { isoString: string }) {
  const [timeStr, setTimeStr] = useState<string>('')

  useEffect(() => {
    try {
      setTimeStr(new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    } catch {
      setTimeStr('--:--')
    }
  }, [isoString])

  return <span>{timeStr || '--:--'}</span>
}

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n')

  const parseInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-semibold text-[#D88D43]">{part.slice(2, -2)}</strong>
      }
      return part
    })
  }

  return (
    <div className="space-y-3">
      {lines.map((line, idx) => {
        const trimmed = line.trim()
        if (!trimmed) return null

        if (trimmed.startsWith('>')) {
          return (
            <div key={idx} className="rounded-xl border border-[#C67D3B]/30 bg-[#C67D3B]/10 p-3 text-xs text-[#E0A872]">
              {parseInline(trimmed.replace(/^>\s*/, ''))}
            </div>
          )
        }

        if (trimmed.startsWith('###')) {
          return (
            <h3 key={idx} className="mt-4 text-base font-bold text-[#E6E1DC] flex items-center gap-2">
              {parseInline(trimmed.replace(/^###\s*/, ''))}
            </h3>
          )
        }

        if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-3 text-xs text-[#B5A89E]">
              <span className="mt-1.5 size-1.5 rounded-full bg-[#C67D3B] shrink-0" />
              <span>{parseInline(trimmed.replace(/^[*\-]\s*/, ''))}</span>
            </div>
          )
        }

        return (
          <p key={idx} className="text-xs leading-relaxed text-[#B5A89E]">
            {parseInline(trimmed)}
          </p>
        )
      })}
    </div>
  )
}

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState<'kds' | 'analytics' | 'ai'>('kds')
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS)

  const [aiInsight, setAiInsight] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [userQuery, setUserQuery] = useState('')
  const [cooldown, setCooldown] = useState(0)

  // Countdown timer for rate limit protection
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((c) => c - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const handleFetchAiInsights = async (promptQuery?: string) => {
    if (cooldown > 0) return

    setAiLoading(true)
    setAiError(null)

    try {
      const res = await fetchAiAnalysisAction(orders, promptQuery || userQuery)
      if (res.error) {
        setAiError(res.error)
        // If rate limit error occurs, trigger a 5-second cooldown button lock
        if (res.error.includes('Rate limit')) {
          setCooldown(5)
        }
      } else if (res.insight) {
        setAiInsight(res.insight)
      }
    } catch (err: any) {
      setAiError(err.message || 'Error executing AI analysis action.')
    } finally {
      setAiLoading(false)
    }
  }

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userQuery.trim() || aiLoading || cooldown > 0) return
    handleFetchAiInsights(userQuery)
  }

  useEffect(() => {
    if (activeTab === 'ai' && !aiInsight && !aiLoading) {
      handleFetchAiInsights()
    }
  }, [activeTab])

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    )
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0)
  const pendingCount = orders.filter((o) => o.status === 'pending').length

  return (
    <div className="min-h-screen bg-[#0C0B0A] text-[#E6E1DC] font-sans antialiased">
      {/* Top Header matching Marigold Brand Bar */}
      <header className="sticky top-0 z-30 border-b border-[#241E1A] bg-[#0C0B0A]/95 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full border border-[#3D2C1E] bg-[#1A140E] text-[#C67D3B]">
              <UtensilsCrossed className="size-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-[#E6E1DC]">Marigold</h1>
              <p className="text-xs text-[#8C7B70]">Kitchen & Operational Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-[#241E1A] bg-[#141210] p-1">
            <button
              type="button"
              onClick={() => setActiveTab('kds')}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-medium transition-all ${
                activeTab === 'kds'
                  ? 'bg-[#C67D3B] text-[#0C0B0A] font-semibold shadow-sm'
                  : 'text-[#9E8E82] hover:text-[#E6E1DC]'
              }`}
            >
              <LayoutDashboard className="size-3.5" />
              Kitchen Board
              {pendingCount > 0 && (
                <span className="ml-1 rounded-full bg-[#E5484D] px-1.5 py-0.2 text-[10px] font-bold text-white">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-[#C67D3B] text-[#0C0B0A] font-semibold shadow-sm'
                  : 'text-[#9E8E82] hover:text-[#E6E1DC]'
              }`}
            >
              <BarChart3 className="size-3.5" />
              Analytics
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-medium transition-all ${
                activeTab === 'ai'
                  ? 'bg-[#C67D3B] text-[#0C0B0A] font-semibold shadow-sm'
                  : 'text-[#9E8E82] hover:text-[#E6E1DC]'
              }`}
            >
              <Sparkles className="size-3.5" />
              AI Assistant
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">
        {/* Welcome Section Header */}
        <div className="mb-6">
          <p className="text-[11px] font-bold tracking-widest text-[#9E6534] uppercase mb-1">
            OPERATIONAL OVERVIEW
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-[#E6E1DC]">
            Live Orders & Analytics
          </h2>
          <p className="text-xs text-[#8C7B70] mt-1">
            Manage incoming orders, monitor metrics, or query AI for operational insights.
          </p>
        </div>

        {activeTab === 'kds' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STATUS_COLUMNS.map((column) => {
              const columnOrders = orders.filter((o) => o.status === column.id)
              return (
                <div key={column.id} className="flex flex-col rounded-2xl border border-[#241E1A] bg-[#12100E] p-4">
                  <div className={`mb-4 flex items-center justify-between rounded-xl border p-3 ${column.color}`}>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#E6E1DC]">
                      {column.icon}
                      <span>{column.title}</span>
                    </div>
                    <span className="rounded-full bg-[#0C0B0A] px-2.5 py-0.5 text-xs font-bold text-[#C67D3B] border border-[#241E1A]">
                      {columnOrders.length}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
                    {columnOrders.length === 0 ? (
                      <div className="flex flex-1 items-center justify-center py-12 text-center text-xs text-[#6B5E55]">
                        No orders in this stage
                      </div>
                    ) : (
                      columnOrders.map((order) => (
                        <div
                          key={order.id}
                          className="flex flex-col justify-between rounded-2xl border border-[#241E1A] bg-[#171412] p-4 transition hover:border-[#3D2C1E]"
                        >
                          <div>
                            <div className="flex items-start justify-between border-b border-[#241E1A] pb-2">
                              <div>
                                <span className="font-mono text-[11px] font-semibold text-[#C67D3B]">{order.id}</span>
                                <h3 className="font-bold text-base text-[#E6E1DC]">Table {order.table_number}</h3>
                              </div>
                              <span className="text-[10px] text-[#8C7B70]">
                                <FormattedTime isoString={order.created_at} />
                              </span>
                            </div>

                            <ul className="my-3 flex flex-col gap-1.5 text-xs">
                              {order.items?.map((item: OrderItem) => (
                                <li key={item.id} className="flex items-center justify-between text-[#B5A89E]">
                                  <span>
                                    <span className="font-bold text-[#C67D3B] mr-1.5">{item.quantity}x</span>
                                    {item.name}
                                  </span>
                                  <span className="text-[#8C7B70]">₹{(item.price * item.quantity).toFixed(2)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mt-3 pt-2 border-t border-[#241E1A] flex items-center justify-between">
                            <span className="font-semibold text-xs text-[#C67D3B]">₹{order.total_amount.toFixed(2)}</span>
                            <div className="flex gap-1">
                              {column.id === 'pending' && (
                                <button
                                  type="button"
                                  onClick={() => updateOrderStatus(order.id, 'preparing')}
                                  className="rounded-full bg-[#C67D3B] px-3 py-1 text-xs font-medium text-[#0C0B0A] hover:bg-[#D88D43] transition"
                                >
                                  Start Preparing →
                                </button>
                              )}
                              {column.id === 'preparing' && (
                                <button
                                  type="button"
                                  onClick={() => updateOrderStatus(order.id, 'ready')}
                                  className="rounded-full bg-[#D97706]/20 px-3 py-1 text-xs font-medium text-[#D97706] hover:bg-[#D97706]/30 transition border border-[#D97706]/30"
                                >
                                  Mark Ready →
                                </button>
                              )}
                              {column.id === 'ready' && (
                                <button
                                  type="button"
                                  onClick={() => updateOrderStatus(order.id, 'completed')}
                                  className="rounded-full bg-[#059669]/20 px-3 py-1 text-xs font-medium text-[#10B981] hover:bg-[#059669]/30 transition border border-[#059669]/30"
                                >
                                  Complete ✓
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-4 rounded-2xl border border-[#241E1A] bg-[#12100E] p-5">
                <div className="flex size-12 items-center justify-center rounded-xl bg-[#C67D3B]/10 text-[#C67D3B] border border-[#C67D3B]/20">
                  <IndianRupee className="size-6" />
                </div>
                <div>
                  <p className="text-xs text-[#8C7B70] font-medium">Shift Revenue</p>
                  <p className="text-2xl font-bold text-[#E6E1DC]">₹{totalRevenue.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl border border-[#241E1A] bg-[#12100E] p-5">
                <div className="flex size-12 items-center justify-center rounded-xl bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/20">
                  <ShoppingBag className="size-6" />
                </div>
                <div>
                  <p className="text-xs text-[#8C7B70] font-medium">Total Orders</p>
                  <p className="text-2xl font-bold text-[#E6E1DC]">{orders.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl border border-[#241E1A] bg-[#12100E] p-5">
                <div className="flex size-12 items-center justify-center rounded-xl bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                  <TrendingUp className="size-6" />
                </div>
                <div>
                  <p className="text-xs text-[#8C7B70] font-medium">Avg. Order Value</p>
                  <p className="text-2xl font-bold text-[#E6E1DC]">
                    ₹{orders.length ? (totalRevenue / orders.length).toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-[#241E1A] bg-[#12100E] p-6 shadow-sm">
                <h3 className="mb-4 text-base font-semibold text-[#E6E1DC]">Daily Revenue Overview</h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={DAILY_REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.05} />
                      <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="#8C7B70" className="text-xs" />
                      <YAxis tickLine={false} axisLine={false} stroke="#8C7B70" className="text-xs" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#171412', borderRadius: '12px', borderColor: '#241E1A', color: '#E6E1DC' }}
                        formatter={(value: any) => [`₹${value}`, 'Revenue']}
                      />
                      <Bar dataKey="revenue" fill="#C67D3B" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl border border-[#241E1A] bg-[#12100E] p-6 shadow-sm">
                <h3 className="mb-4 text-base font-semibold text-[#E6E1DC]">Popular Dish Distribution</h3>
                <div className="h-72 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={POPULAR_DISHES_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                        {POPULAR_DISHES_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#171412', borderRadius: '12px', borderColor: '#241E1A', color: '#E6E1DC' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col gap-4 rounded-2xl border border-[#3D2C1E] bg-[#171412] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[#C67D3B]/20 text-[#C67D3B] border border-[#C67D3B]/30">
                    <Bot className="size-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#E6E1DC] flex items-center gap-2">
                      Marigold AI Assistant
                      <span className="rounded-full bg-[#C67D3B]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#C67D3B] border border-[#C67D3B]/30">
                        Gemini Powered
                      </span>
                    </h2>
                    <p className="text-xs text-[#8C7B70]">
                      Ask operational questions or generate a full shift summary
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setUserQuery('')
                    handleFetchAiInsights('')
                  }}
                  disabled={aiLoading || cooldown > 0}
                  className="flex items-center gap-2 rounded-full bg-[#C67D3B] px-4 py-2 text-xs font-semibold text-[#0C0B0A] shadow-sm transition hover:bg-[#D88D43] disabled:opacity-50"
                >
                  {aiLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : cooldown > 0 ? (
                    `Wait ${cooldown}s`
                  ) : (
                    <RefreshCw className="size-4" />
                  )}
                  {cooldown > 0 ? '' : 'Full Shift Analysis'}
                </button>
              </div>

              {/* Admin Custom Question Bar */}
              <form onSubmit={handleCustomSubmit} className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="Ask a custom question (e.g., 'How long will Table 4 take?')"
                  className="flex-1 rounded-full border border-[#241E1A] bg-[#0C0B0A] px-4 py-2.5 text-xs text-[#E6E1DC] placeholder-[#6B5E55] focus:border-[#C67D3B] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={aiLoading || !userQuery.trim() || cooldown > 0}
                  className="flex items-center gap-2 rounded-full bg-[#C67D3B]/20 px-5 py-2.5 text-xs font-semibold text-[#C67D3B] border border-[#C67D3B]/30 transition hover:bg-[#C67D3B]/30 disabled:opacity-40 shrink-0"
                >
                  {cooldown > 0 ? `Wait ${cooldown}s` : <><Send className="size-3.5" /> Ask AI</>}
                </button>
              </form>

              {/* Quick Prompt Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                <span className="text-[#8C7B70] flex items-center gap-1 font-medium">
                  <HelpCircle className="size-3" /> Quick Prompts:
                </span>
                {[
                  'How long will Table T-04 take?',
                  'Which dish is taking longest to prep?',
                  'Summarize total orders for the kitchen chef'
                ].map((promptText, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={cooldown > 0 || aiLoading}
                    onClick={() => {
                      setUserQuery(promptText)
                      handleFetchAiInsights(promptText)
                    }}
                    className="rounded-full border border-[#241E1A] bg-[#0C0B0A] px-3 py-1 text-[#B5A89E] transition hover:border-[#C67D3B]/50 hover:text-[#C67D3B] disabled:opacity-50"
                  >
                    "{promptText}"
                  </button>
                ))}
              </div>
            </div>

            {aiLoading ? (
              <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-[#241E1A] bg-[#12100E]">
                <Loader2 className="size-8 animate-spin text-[#C67D3B] mb-3" />
                <p className="text-sm font-medium text-[#E6E1DC]">Processing question with Gemini...</p>
                <p className="text-xs text-[#8C7B70] mt-1">Analyzing active kitchen orders</p>
              </div>
            ) : aiError ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 flex items-start gap-3 text-red-300 text-xs leading-relaxed">
                <AlertCircle className="size-5 shrink-0 mt-0.5 text-red-400" />
                <div className="flex-1">
                  <p className="font-semibold text-red-400 mb-1">AI Request Throttle Active</p>
                  <p>{aiError}</p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-[#241E1A] bg-[#12100E] p-8 shadow-sm">
                {aiInsight ? (
                  <MarkdownRenderer content={aiInsight} />
                ) : (
                  <p className="text-xs text-[#6B5E55] text-center py-6">
                    Type a question above or click "Full Shift Analysis" to get operational insights.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}