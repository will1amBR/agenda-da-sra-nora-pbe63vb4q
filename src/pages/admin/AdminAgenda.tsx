import React, { useState, useEffect } from 'react'
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getBookings, getServiceById } from '@/lib/data'
import { Booking } from '@/types'

export default function AdminAgendaPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [viewMode, setViewMode] = useState<'lista' | 'quartas'>('lista')

  const loadData = () => {
    setBookings(getBookings())
  }

  useEffect(() => {
    loadData()
    const handler = () => loadData()
    window.addEventListener('nora_storage_change', handler)
    return () => window.removeEventListener('nora_storage_change', handler)
  }, [])

  // Agrupamentos
  const confirmed = bookings.filter((b) => b.status === 'confirmado')
  const pending = bookings.filter(
    (b) => b.status === 'aguardando_aprovacao' || b.status === 'aguardando_pagamento',
  )

  // Filtro especial para Quartas-feiras (A rotina real da Nora com a senhora em Paracuru)
  const wednesdayBookings = bookings.filter((b) => {
    const d = new Date(b.date + 'T12:00:00')
    return d.getDay() === 3 // 3 = Quarta-feira
  })

  return (
    <div className="space-y-8 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Agenda da Sra Nora</h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Visualização de horários bloqueados, aprovados e compromissos fixos em Paracuru (CE).
          </p>
        </div>

        {/* Alternador de visualização */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
          <button
            onClick={() => setViewMode('lista')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'lista'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos os Atendimentos ({bookings.length})
          </button>
          <button
            onClick={() => setViewMode('quartas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              viewMode === 'quartas'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Compromisso Fixo Quartas (R$ 500)</span>
            <span className="w-2 h-2 rounded-full bg-teal-400" />
          </button>
        </div>
      </div>

      {/* BLOCO DE DESTAQUE: COMPROMISSO REAL PERMANENTE DA QUARTA-FEIRA */}
      <div className="bg-gradient-to-r from-teal-50 to-slate-50 border border-teal-200/90 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <Badge className="bg-teal-700 text-white text-[10px] font-semibold">
              Compromisso Fixo Real
            </Badge>
            <span className="font-bold text-teal-950">
              Quartas-feiras: Cuidado de Idoso (Agenda Travada)
            </span>
          </div>
          <p className="text-teal-900/90 leading-relaxed max-w-2xl">
            Compromisso real e permanente da Sra Nora toda quarta-feira em Paracuru. Plano mensal de
            R$ 500 com pagamento todo dia 03 via PIX. A agenda de quartas fica permanentemente
            indisponível para novos agendamentos externos.
          </p>
        </div>
        <div className="bg-white border border-teal-200 px-4 py-2.5 rounded-xl text-center shrink-0 shadow-xs">
          <span className="text-[10px] text-teal-800 uppercase font-bold block">
            Vencimento Mensal
          </span>
          <span className="font-bold text-sm text-teal-950 font-mono">Todo dia 03</span>
        </div>
      </div>

      {/* LISTAGEM DOS AGENDAMENTOS */}
      <div className="space-y-4">
        {((viewMode === 'quartas' ? wednesdayBookings : bookings) || []).map((booking) => {
          const service = getServiceById(booking.serviceId)
          const dateObj = new Date(booking.date + 'T12:00:00')
          const isWednesday = dateObj.getDay() === 3
          const isFixed = booking.isRecurringFixed || booking.id === 'fixo-quarta-real'

          return (
            <Card
              key={booking.id}
              className={`border-slate-200 bg-white rounded-2xl shadow-xs overflow-hidden transition-all ${
                isFixed
                  ? 'border-l-4 border-l-teal-600 bg-teal-50/20'
                  : booking.status === 'confirmado'
                    ? 'border-l-4 border-l-emerald-600'
                    : booking.status === 'aguardando_aprovacao'
                      ? 'border-l-4 border-l-amber-500'
                      : ''
              }`}
            >
              <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Data e hora em badge */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-xl border flex flex-col items-center justify-center shrink-0 ${
                      isFixed
                        ? 'bg-teal-50 border-teal-200 text-teal-900'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold text-teal-700">
                      {isFixed
                        ? 'Toda'
                        : dateObj
                            .toLocaleDateString('pt-BR', { weekday: 'short' })
                            .replace('.', '')}
                    </span>
                    <span className="text-xl font-bold text-slate-900 leading-none">
                      {isFixed ? 'Qua' : dateObj.getDate()}
                    </span>
                    <span className="text-[9px] text-slate-500">
                      {isFixed
                        ? 'Recorrente'
                        : dateObj.toLocaleDateString('pt-BR', { month: 'short' })}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {booking.client.name}
                      </span>
                      <span className="font-mono text-[10px] text-teal-700">#{booking.code}</span>
                      {isFixed && (
                        <span className="text-[10px] bg-teal-100 text-teal-900 font-bold px-2 py-0.5 rounded-full border border-teal-200">
                          Compromisso Fixo Real
                        </span>
                      )}
                    </div>

                    <p className="text-slate-700 font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      <span>
                        {booking.time} · {service?.name || 'Serviço'}
                      </span>
                    </p>

                    <p className="text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {booking.client.address} ({booking.client.neighborhood})
                      </span>
                    </p>
                  </div>
                </div>

                {/* Status e Valor */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200">
                  <div>
                    {isFixed ? (
                      <Badge className="bg-teal-100 text-teal-900 border-teal-300 text-xs font-semibold">
                        Agenda Travada (Fixa)
                      </Badge>
                    ) : booking.status === 'confirmado' ? (
                      <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 text-xs">
                        Confirmado na Agenda
                      </Badge>
                    ) : booking.status === 'aguardando_aprovacao' ? (
                      <Badge className="bg-amber-100 text-amber-900 border-amber-300 text-xs">
                        Aguardando Aprovação
                      </Badge>
                    ) : booking.status === 'aguardando_pagamento' ? (
                      <Badge className="bg-purple-100 text-purple-900 border-purple-300 text-xs">
                        Aguardando Pagamento
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-100 text-blue-900 border-blue-300 text-xs">
                        Em Negociação
                      </Badge>
                    )}
                  </div>

                  <span className="font-bold text-base text-teal-800">
                    R$ {booking.agreedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
