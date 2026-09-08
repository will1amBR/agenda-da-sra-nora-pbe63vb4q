import React, { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Calendar,
  Sparkles,
  Heart,
  Menu,
  X,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  QrCode,
} from 'lucide-react'
import { NORA_PIX_CONFIG } from '@/lib/noraConfig'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getBookings } from '@/lib/data'

export default function SiteLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)
  const location = useLocation()

  const refreshCounts = () => {
    const bookings = getBookings()
    // Pendências da Nora: aguardando aprovação
    const count = bookings.filter((b) => b.status === 'aguardando_aprovacao').length
    setPendingCount(count)
  }

  useEffect(() => {
    refreshCounts()
    const handler = () => refreshCounts()
    window.addEventListener('nora_storage_change', handler)
    return () => window.removeEventListener('nora_storage_change', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8F7] text-slate-800 selection:bg-teal-600/15 selection:text-teal-800">
      {/* Top Banner Aviso de Modo Teste */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-amber-300 bg-amber-950/70 border border-amber-500/40 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Ambiente de Teste
            </span>
            <span className="hidden sm:inline text-slate-300">
              MercadoPago Simulado ativo — nenhum valor real é cobrado nas transações.
            </span>
            <span className="sm:hidden text-slate-300 text-[11px]">
              MercadoPago Simulado (sem cobrança real)
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            <span className="flex items-center gap-1 text-[11px]">
              <MapPin className="w-3 h-3 text-teal-400" />
              Paracuru, Ceará
            </span>
            <Link
              to="/painel"
              className="text-teal-300 hover:text-white underline underline-offset-2 text-[11px] font-medium"
            >
              Acessar Painel da Nora
              {pendingCount > 0 && ` (${pendingCount})`}
            </Link>
          </div>
        </div>
      </div>

      {/* Header Fixo com Efeito Glass suave */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Sra Nora */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-700 to-teal-900 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-teal-900/15 group-hover:scale-105 transition-transform">
              N
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold text-slate-900 tracking-tight">Agenda Nora</span>
                <span className="w-2 h-2 rounded-full bg-teal-600" />
              </div>
              <p className="text-xs text-slate-500 -mt-0.5 font-sans">
                Cuidado de Idosos &amp; Limpeza · Paracuru/CE
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <a
              href="/#servicos"
              className="text-slate-600 hover:text-teal-700 transition-colors py-1"
            >
              Serviços &amp; Preços
            </a>
            <a
              href="/#como-funciona"
              className="text-slate-600 hover:text-teal-700 transition-colors py-1"
            >
              Como Funciona
            </a>
            <NavLink
              to="/minhas-reservas"
              className={({ isActive }) =>
                `transition-colors py-1 ${
                  isActive ? 'text-teal-700 font-semibold' : 'text-slate-600 hover:text-teal-700'
                }`
              }
            >
              Minhas Reservas
            </NavLink>
            <NavLink
              to="/painel"
              className={({ isActive }) =>
                `relative flex items-center gap-1.5 transition-colors py-1 ${
                  isActive ? 'text-teal-700 font-semibold' : 'text-slate-600 hover:text-teal-700'
                }`
              }
            >
              <span>Painel da Nora</span>
              {pendingCount > 0 ? (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-teal-700 rounded-full animate-bounce">
                  {pendingCount}
                </span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Agenda em dia" />
              )}
            </NavLink>
          </nav>

          {/* CTA Header */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              asChild
              className="bg-teal-700 hover:bg-teal-800 text-white shadow-sm rounded-full px-5 py-2.5 font-medium transition-all hover:scale-[1.02]"
            >
              <Link to="/agendar" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Agendar Horário</span>
              </Link>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Abrir menu"
              className="text-slate-900"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile slide drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-5 py-6 space-y-4 shadow-lg animate-in slide-in-from-top-2">
            <div className="flex flex-col space-y-3 font-medium">
              <a
                href="/#servicos"
                onClick={() => setMobileOpen(false)}
                className="text-base text-slate-800 py-1 border-b border-slate-100"
              >
                Serviços &amp; Preços
              </a>
              <a
                href="/#como-funciona"
                onClick={() => setMobileOpen(false)}
                className="text-base text-slate-800 py-1 border-b border-slate-100"
              >
                Como Funciona
              </a>
              <Link
                to="/minhas-reservas"
                onClick={() => setMobileOpen(false)}
                className="text-base text-slate-800 py-1 border-b border-slate-100 flex items-center justify-between"
              >
                <span>Minhas Reservas</span>
                <span className="text-xs text-slate-500">Consultar código</span>
              </Link>
              <Link
                to="/painel"
                onClick={() => setMobileOpen(false)}
                className="text-base text-slate-800 py-1 border-b border-slate-100 flex items-center justify-between"
              >
                <span>Painel da Nora</span>
                {pendingCount > 0 && (
                  <Badge className="bg-teal-700 text-white">{pendingCount} pendente(s)</Badge>
                )}
              </Link>
            </div>

            <div className="pt-2">
              <Button
                asChild
                className="w-full bg-teal-700 hover:bg-teal-800 text-white rounded-xl py-3 shadow-sm"
              >
                <Link to="/agendar" className="flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Agendar Horário Agora</span>
                </Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer Rico Sofisticado Ardósia/Teal */}
      <footer className="bg-slate-950 text-slate-300 pt-14 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
            {/* Coluna 1: Marca & Apresentação */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xl">
                  N
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">Agenda Nora</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-md">
                Cuidado humano e carinhoso para a melhor idade, e limpeza residencial detalhista e
                confiável para casas de família e veraneio em Paracuru e litoral do Ceará.
              </p>
              <div className="flex items-center gap-2 pt-2 text-xs text-amber-200/90 bg-amber-950/40 p-2.5 rounded-lg border border-amber-800/40 max-w-md">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>
                  Ambiente de demonstração com integração simulada do MercadoPago. Nenhum valor real
                  será cobrado.
                </span>
              </div>
            </div>

            {/* Coluna 2: Navegação Rápida */}
            <div className="space-y-3">
              <h4 className="text-base font-semibold text-white">Navegação</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="/#servicos" className="hover:text-white transition-colors">
                    Serviços &amp; Preços
                  </a>
                </li>
                <li>
                  <a href="/#como-funciona" className="hover:text-white transition-colors">
                    Como funciona o fluxo
                  </a>
                </li>
                <li>
                  <Link to="/agendar" className="hover:text-white transition-colors">
                    Solicitar agendamento
                  </Link>
                </li>
                <li>
                  <Link to="/minhas-reservas" className="hover:text-white transition-colors">
                    Consultar minhas reservas
                  </Link>
                </li>
                <li>
                  <Link
                    to="/painel"
                    className="hover:text-teal-300 transition-colors font-medium text-teal-400"
                  >
                    Painel da Nora (Gestão)
                  </Link>
                </li>
              </ul>
            </div>

            {/* Coluna 3: Atendimento & Cidade */}
            <div className="space-y-3">
              <h4 className="text-base font-semibold text-white">Contato &amp; Região</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>Paracuru, Ceará (Centro, Ronco do Mar, Boca do Poço, Pedra Rachada)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>(85) 99874-5520 (WhatsApp)</span>
                </li>
                <li className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>
                    Chave PIX (celular):{' '}
                    <strong className="text-white font-mono">{NORA_PIX_CONFIG.formattedKey}</strong>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Segunda a Sábado, 07:00 – 18:00</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-emerald-300/90 text-xs">
                    Profissional de confiança indicada por famílias locais
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sub-footer com copyright e aviso de conformidade MercadoPago */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>
              © {new Date().getFullYear()} Agenda Nora — Todos os direitos reservados. Paracuru /
              CE.
            </p>
            <p className="flex items-center gap-1.5">
              <span>MercadoPago em modo teste</span>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              <span>Dados salvos localmente</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
