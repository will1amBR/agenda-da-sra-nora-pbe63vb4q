import React, { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Inbox,
  Calendar,
  CreditCard,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Heart,
  CheckCircle2,
  Clock,
  Layers,
  Menu,
  X,
  MessageSquare,
  BellRing,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getBookings, resetDemoData } from '@/lib/data'
import { computeRemindersList } from '@/lib/reminders'
import { useToast } from '@/hooks/use-toast'

export default function AdminLayout() {
  const [pendingCount, setPendingCount] = useState(0)
  const [pendingRemindersCount, setPendingRemindersCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { toast } = useToast()

  const refreshCounts = () => {
    const bookings = getBookings()
    const pending = bookings.filter((b) => b.status === 'aguardando_aprovacao').length
    setPendingCount(pending)

    // Lembretes pendentes de envio
    const reminders = computeRemindersList()
    const unsent = reminders.filter((r) => !r.alreadySent).length
    setPendingRemindersCount(unsent)
  }

  useEffect(() => {
    refreshCounts()
    const handler = () => refreshCounts()
    window.addEventListener('nora_storage_change', handler)
    return () => window.removeEventListener('nora_storage_change', handler)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const handleResetData = () => {
    if (confirm('Deseja restaurar os dados de demonstração originais?')) {
      resetDemoData()
      refreshCounts()
      toast({
        title: 'Dados restaurados',
        description: 'Os serviços e agendamentos de exemplo foram reiniciados.',
      })
    }
  }

  // Data atual formatada em português brasileiro
  const todayFormatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  const navLinks = [
    {
      to: '/painel',
      label: 'Visão Geral',
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: '/painel/solicitacoes',
      label: 'Solicitações',
      icon: Inbox,
      badge: pendingCount > 0 ? pendingCount : null,
    },
    {
      to: '/painel/agenda',
      label: 'Agenda de Serviços',
      icon: Calendar,
    },
    {
      to: '/painel/lembretes',
      label: 'Lembretes WhatsApp',
      icon: MessageSquare,
      badge: pendingRemindersCount > 0 ? pendingRemindersCount : null,
    },
    {
      to: '/painel/pagamentos',
      label: 'Histórico & MercadoPago',
      icon: CreditCard,
    },
  ]

  return (
    <div className="min-h-screen bg-[#F6F8F7] text-slate-800 flex flex-col md:flex-row">
      {/* Sidebar Desktop Fixa (Ardósia/Teal Profundo Moderno) */}
      <aside className="hidden md:flex md:w-64 flex-col bg-[#122026] text-slate-200 border-r border-[#1B2F38] shrink-0 sticky top-0 h-screen">
        {/* Topo Brand */}
        <div className="p-6 border-b border-[#1B2F38]">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              N
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">Agenda Nora</span>
              <p className="text-[11px] text-teal-300 uppercase tracking-wider font-semibold">
                Painel Administrativo
              </p>
            </div>
          </Link>
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>MercadoPago MODO TESTE</span>
          </div>
        </div>

        {/* Links de navegação */}
        <nav className="flex-1 px-3 py-6 space-y-1.5">
          {navLinks.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-[#1A2E37] hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white text-teal-800">
                    {item.badge}
                  </span>
                ) : null}
              </NavLink>
            )
          })}
        </nav>

        {/* Rodapé da Sidebar */}
        <div className="p-4 border-t border-[#1B2F38] space-y-2">
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-[#1A2E37] text-xs h-9"
          >
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Site Público
            </Link>
          </Button>

          <Button
            variant="ghost"
            onClick={handleResetData}
            className="w-full justify-start text-slate-400 hover:text-amber-200 hover:bg-[#1A2E37] text-[11px] h-8"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-2" />
            Restaurar Demonstração
          </Button>

          <p className="text-[10px] text-slate-500 text-center pt-1">
            Paracuru, CE · Cuidado &amp; Limpeza
          </p>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#122026] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-[#1B2F38]">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
            N
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight">Painel da Nora</h1>
            <p className="text-[10px] text-teal-300 font-mono">Modo Teste · Paracuru</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <Badge className="bg-teal-700 text-white text-[11px] px-2 py-0.5">{pendingCount}</Badge>
          )}
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-slate-300 hover:text-white text-xs px-2.5 h-8 hover:bg-[#1A2E37]"
          >
            <Link to="/" className="flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ver Site</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Barra de Abas Horizontal Mobile (Sidebar vira navegação horizontal por abas no mobile) */}
      <div className="md:hidden bg-[#16272E] border-b border-[#1B2F38] px-2 py-1.5 overflow-x-auto flex items-center gap-1.5 sticky top-[53px] z-30">
        {navLinks.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 min-h-[40px] ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-[#1A2E37]'
                }`
              }
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{item.label}</span>
              {item.badge ? (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-white text-teal-900 leading-none">
                  {item.badge}
                </span>
              ) : null}
            </NavLink>
          )
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Header Bar */}
        <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200/80 px-6 py-4 flex flex-wrap items-center justify-between gap-3 sticky top-0 md:static z-20">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
              Gestão de Atendimentos
            </span>
            <p className="text-sm font-bold text-slate-900 capitalize">{todayFormatted}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-900 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              <span>MercadoPago em Modo de Simulação</span>
            </div>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs h-8"
            >
              <Link to="/">Ver Site</Link>
            </Button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>

        {/* Admin Footer */}
        <footer className="px-6 py-3 border-t border-slate-200 bg-white/60 text-[11px] text-slate-500 flex flex-wrap justify-between items-center gap-2">
          <span>Dados armazenados localmente no navegador (localStorage).</span>
          <span>Sra Nora · Paracuru (Ceará) · Limpeza &amp; Cuidado de Idosos</span>
        </footer>
      </div>
    </div>
  )
}
