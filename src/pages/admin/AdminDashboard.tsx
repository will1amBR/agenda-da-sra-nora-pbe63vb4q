import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Clock,
  Inbox,
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Users,
  MapPin,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getBookings, getPayments, getServices } from '@/lib/data'
import { Booking, PaymentTransaction } from '@/types'

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [payments, setPayments] = useState<PaymentTransaction[]>([])

  const loadData = () => {
    setBookings(getBookings())
    setPayments(getPayments())
  }

  useEffect(() => {
    loadData()
    const handler = () => loadData()
    window.addEventListener('nora_storage_change', handler)
    return () => window.removeEventListener('nora_storage_change', handler)
  }, [])

  // Métricas
  const pendingRequests = bookings.filter((b) => b.status === 'aguardando_aprovacao')
  const negotiatingBookings = bookings.filter((b) => b.status === 'negociacao_pendente')
  const waitingPayment = bookings.filter((b) => b.status === 'aguardando_pagamento')
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmado')

  // Total faturado em pagamentos aprovados
  const totalReceived = payments
    .filter((p) => p.status === 'approved')
    .reduce((acc, p) => acc + p.amount, 0)

  // Próximos agendamentos confirmados
  const upcomingConfirmed = [...confirmedBookings].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )

  return (
    <div className="space-y-8 text-left">
      {/* Header Topo do Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Visão Geral · Sra Nora</h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Acompanhamento em tempo real dos serviços de cuidado e limpeza em Paracuru (CE).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            className="bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs h-9 shadow-sm"
          >
            <Link to="/painel/solicitacoes">
              <Inbox className="w-3.5 h-3.5 mr-1.5" />
              <span>Ver Solicitações ({pendingRequests.length})</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* CARDS DE MÉTRICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pendentes de Aprovação */}
        <Card className="border-slate-200 bg-white rounded-2xl shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase text-amber-700 tracking-wider">
                Aguardando Nora
              </span>
              <p className="text-3xl font-bold text-slate-900">{pendingRequests.length}</p>
              <p className="text-[11px] text-slate-500">Para aprovar ou negociar</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <Inbox className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Em Negociação ou Aguardando Pagamento */}
        <Card className="border-slate-200 bg-white rounded-2xl shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase text-teal-700 tracking-wider">
                Em Andamento
              </span>
              <p className="text-3xl font-bold text-slate-900">
                {negotiatingBookings.length + waitingPayment.length}
              </p>
              <p className="text-[11px] text-slate-500">
                {negotiatingBookings.length} negociação · {waitingPayment.length} aguardando pagto
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Confirmados na Agenda */}
        <Card className="border-slate-200 bg-white rounded-2xl shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase text-emerald-700 tracking-wider">
                Confirmados
              </span>
              <p className="text-3xl font-bold text-slate-900">{confirmedBookings.length}</p>
              <p className="text-[11px] text-slate-500">Horários pagos e garantidos</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Faturamento Simulado */}
        <Card className="border-slate-200 bg-white rounded-2xl shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase text-sky-700 tracking-wider">
                Faturamento (MP Test)
              </span>
              <p className="text-2xl font-bold text-slate-900">
                R$ {totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
              </p>
              <p className="text-[11px] text-slate-500">{payments.length} transação(ões) pagas</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#009EE3] flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AVISO DE SOLICITAÇÕES QUE PRECISAM DE AÇÃO URGENTE */}
      {pendingRequests.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="font-bold text-sm text-slate-900">
                Você tem {pendingRequests.length} solicitação(ões) pendente(s) de aprovação!
              </h3>
              <p className="text-xs text-slate-600">
                O cliente está aguardando você aprovar o preço fixo ou sugerir outro valor conforme
                o tamanho da casa ou a rotina do idoso.
              </p>
            </div>
          </div>

          <Button
            asChild
            size="sm"
            className="bg-amber-700 hover:bg-amber-800 text-white shrink-0 rounded-xl text-xs"
          >
            <Link to="/painel/solicitacoes">
              <span>Analisar Agora</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </Button>
        </div>
      )}

      {/* SEÇÃO DUPLA: PRÓXIMOS ATENDIMENTOS & ÚLTIMAS TRANSAÇÕES MERCADOPAGO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Atendimentos Confirmados */}
        <Card className="border-slate-200 bg-white rounded-2xl shadow-xs">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Próximos Atendimentos Confirmados
              </h3>
              <p className="text-[11px] text-slate-500">Compromissos garantidos na agenda</p>
            </div>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-xs text-teal-700 hover:text-teal-900"
            >
              <Link to="/painel/agenda">Ver agenda completa →</Link>
            </Button>
          </div>

          <CardContent className="p-5 space-y-3">
            {upcomingConfirmed.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                Nenhum atendimento confirmado no momento.
              </p>
            ) : (
              upcomingConfirmed.slice(0, 4).map((b) => (
                <div
                  key={b.id}
                  className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{b.client.name}</span>
                      <span className="font-mono text-[10px] text-teal-700">#{b.code}</span>
                      {b.isRecurringFixed && (
                        <span className="text-[9.5px] bg-teal-100 text-teal-900 font-bold px-1.5 py-0.2 rounded">
                          Fixo
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-teal-600" />
                      <span>
                        {new Date(b.date + 'T12:00:00').toLocaleDateString('pt-BR')} às {b.time}
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{b.client.neighborhood || b.client.address}</span>
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-bold text-slate-900">R$ {b.agreedPrice.toFixed(0)}</span>
                    <Badge className="bg-emerald-100 text-emerald-800 text-[10px] block mt-1">
                      Confirmado
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Últimas Transações MercadoPago (Modo Teste) */}
        <Card className="border-slate-200 bg-white rounded-2xl shadow-xs">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-[#009EE3] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                MP
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Histórico de Cobrança (Modo Teste)
                </h3>
                <p className="text-[11px] text-slate-500">PIX e Cartões simulados</p>
              </div>
            </div>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-xs text-teal-700 hover:text-teal-900"
            >
              <Link to="/painel/pagamentos">Ver pagamentos →</Link>
            </Button>
          </div>

          <CardContent className="p-5 space-y-3">
            {payments.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                Nenhum pagamento registrado ainda.
              </p>
            ) : (
              payments.slice(0, 4).map((pay) => (
                <div
                  key={pay.id}
                  className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{pay.clientName}</span>
                      <span className="font-mono text-[10px] text-slate-400">#{pay.id}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Método: <strong className="uppercase">{pay.method}</strong> · Reserva #
                      {pay.bookingCode}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-slate-900 block">
                      R$ {pay.amount.toFixed(2)}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Aprovado
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
