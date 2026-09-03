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
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getBookings, resetDemoData } from '@/lib/data'
import { useToast } from '@/hooks/use-toast'

export default function AdminLayout() {
  const [pendingCount, setPendingCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { toast } = useToast()

  const refreshCounts = () => {
    const bookings = getBookings()
    const pending = bookings.filter((b) => b.status === 'aguardando_aprovacao').length
    setPendingCount(pending)
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
      to: '/painel/pagamentos',
      label: 'Histórico & MercadoPago',
      icon: CreditCard,
    },
  ]

  return (
    <div className="min-h-screen bg-[#F4EFEA] text-[#2D1F1A] flex flex-col md:flex-row">
      {/* Sidebar Desktop Fixa (Espresso) */}
      <aside className="hidden md:flex md:w-64 flex-col bg-[#2D1F1A] text-[#EADFD5] border-r border-[#402E26] shrink-0 sticky top-0 h-screen">
        {/* Topo Brand */}
        <div className="p-6 border-b border-[#402E26]">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#B8502E] text-white flex items-center justify-center font-serif text-xl font-bold shadow">
              N
            </div>
            <div>
              <span className="font-serif text-xl font-bold text-white tracking-tight">
                Agenda Nora
              </span>
              <p className="text-[11px] text-[#A8988C] uppercase tracking-wider font-semibold">
                Painel Administrativo
              </p>
            </div>
          </Link>
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
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
                      ? 'bg-[#B8502E] text-white shadow-sm'
                      : 'text-[#C8B8AC] hover:bg-[#3D2C24] hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white text-[#B8502E]">
                    {item.badge}
                  </span>
                ) : null}
              </NavLink>
            )
          })}
        </nav>

        {/* Rodapé da Sidebar */}
        <div className="p-4 border-t border-[#402E26] space-y-2">
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start text-[#C8B8AC] hover:text-white hover:bg-[#3D2C24] text-xs h-9"
          >
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Site Público
            </Link>
          </Button>

          <Button
            variant="ghost"
            onClick={handleResetData}
            className="w-full justify-start text-[#A8988C] hover:text-amber-200 hover:bg-[#3D2C24] text-[11px] h-8"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-2" />
            Restaurar Dados Demonstração
          </Button>

          <p className="text-[10px] text-[#8C7A70] text-center pt-1">
            Paracuru, CE · Cuidado &amp; Limpeza
          </p>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#2D1F1A] text-white p-4 flex items-center justify-between sticky top-0 z-40 border-b border-[#402E26]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#B8502E] text-white flex items-center justify-center font-serif font-bold text-sm">
            N
          </div>
          <div>
            <h1 className="font-serif font-bold text-base leading-tight">Painel da Nora</h1>
            <p className="text-[10px] text-amber-300 font-mono">Modo Teste</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <Badge className="bg-[#B8502E] text-white text-xs">
              {pendingCount} pendente{pendingCount > 1 ? 's' : ''}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white hover:bg-[#3D2C24]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#2D1F1A] text-[#EADFD5] border-b border-[#402E26] p-4 space-y-2 z-30">
          {navLinks.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-[#B8502E] text-white' : 'text-[#C8B8AC] hover:bg-[#3D2C24]'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white text-[#B8502E]">
                    {item.badge}
                  </span>
                ) : null}
              </NavLink>
            )
          })}
          <div className="pt-2 border-t border-[#402E26] flex justify-between">
            <Link
              to="/"
              className="text-xs text-[#C8B8AC] hover:text-white flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Site público
            </Link>
            <button
              onClick={handleResetData}
              className="text-xs text-[#A8988C] hover:text-amber-200"
            >
              Resetar demonstração
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Header Bar */}
        <header className="bg-white/90 backdrop-blur-sm border-b border-[#E8DFD5] px-6 py-4 flex flex-wrap items-center justify-between gap-3 sticky top-0 md:static z-20">
          <div>
            <span className="text-xs font-medium text-[#8C7A70] uppercase tracking-wider block">
              Gestão de Atendimentos
            </span>
            <p className="text-sm font-serif font-bold text-[#2D1F1A] capitalize">
              {todayFormatted}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>MercadoPago em Modo de Simulação</span>
            </div>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-[#D6C7BA] text-[#594437] hover:bg-[#FAF7F2] text-xs h-8"
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
        <footer className="px-6 py-3 border-t border-[#E8DFD5] bg-white/50 text-[11px] text-[#8C7A70] flex flex-wrap justify-between items-center gap-2">
          <span>Dados armazenados localmente no navegador (localStorage).</span>
          <span>Sra Nora · Paracuru (Ceará) · Limpeza &amp; Cuidado de Idosos</span>
        </footer>
      </div>
    </div>
  )
}
