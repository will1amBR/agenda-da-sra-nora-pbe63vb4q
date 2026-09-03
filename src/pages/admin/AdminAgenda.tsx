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
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1F1A]">
            Agenda da Sra Nora
          </h1>
          <p className="text-xs sm:text-sm text-[#7B6153]">
            Visualização de horários bloqueados, aprovados e confirmados em Paracuru (CE).
          </p>
        </div>

        {/* Alternador de visualização */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-[#EADFD5]">
          <button
            onClick={() => setViewMode('lista')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'lista'
                ? 'bg-[#B8502E] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Todos os Atendimentos ({bookings.length})
          </button>
          <button
            onClick={() => setViewMode('quartas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              viewMode === 'quartas'
                ? 'bg-[#B8502E] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>Quartas-feiras Fixas (R$ 500)</span>
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          </button>
        </div>
      </div>

      {/* BLOCO DE DESTAQUE: ROTINA REAL DA QUARTA-FEIRA */}
      <div className="bg-[#FAF0E6] border border-[#E5C9B7] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <Badge className="bg-[#8C3A1D] text-white text-[10px]">Rotina Mensal Fixa</Badge>
            <span className="font-bold text-[#2D1F1A]">Quartas-feiras: Cuidado de Idoso</span>
          </div>
          <p className="text-[#6B5345]">
            "Toda quarta-feira a Sra Nora cuida da senhora em Paracuru e recebe R$ 500 por mês,
            pagos todo dia 3."
          </p>
        </div>
        <div className="bg-white/80 border border-[#E5C9B7] px-3.5 py-2 rounded-xl text-center shrink-0">
          <span className="text-[10px] text-[#8C7A70] uppercase font-bold block">
            Próximo Pagamento Mensal
          </span>
          <span className="font-serif font-bold text-sm text-[#8C3A1D]">Dia 03 do mês</span>
        </div>
      </div>

      {/* LISTAGEM DOS AGENDAMENTOS */}
      <div className="space-y-4">
        {((viewMode === 'quartas' ? wednesdayBookings : bookings) || []).map((booking) => {
          const service = getServiceById(booking.serviceId)
          const dateObj = new Date(booking.date + 'T12:00:00')
          const isWednesday = dateObj.getDay() === 3

          return (
            <Card
              key={booking.id}
              className={`border-[#EADFD5] bg-white rounded-2xl shadow-xs overflow-hidden ${
                booking.status === 'confirmado'
                  ? 'border-l-4 border-l-emerald-600'
                  : booking.status === 'aguardando_aprovacao'
                    ? 'border-l-4 border-l-amber-500'
                    : ''
              }`}
            >
              <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Data e hora em badge */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] uppercase font-bold text-[#8C3A1D]">
                      {dateObj.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}
                    </span>
                    <span className="font-serif text-xl font-bold text-[#2D1F1A]">
                      {dateObj.getDate()}
                    </span>
                    <span className="text-[9px] text-[#7B6153]">
                      {dateObj.toLocaleDateString('pt-BR', { month: 'short' })}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#2D1F1A]">
                        {booking.client.name}
                      </span>
                      <span className="font-mono text-[10px] text-[#B8502E]">#{booking.code}</span>
                      {isWednesday && (
                        <span className="text-[10px] bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded">
                          Quarta Fixa
                        </span>
                      )}
                    </div>

                    <p className="text-[#6B5345] font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#B8502E]" />
                      <span>
                        {booking.time} · {service?.name || 'Serviço'}
                      </span>
                    </p>

                    <p className="text-[#8C7A70] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>
                        {booking.client.address} ({booking.client.neighborhood})
                      </span>
                    </p>
                  </div>
                </div>

                {/* Status e Valor */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#EADFD5]">
                  <div>
                    {booking.status === 'confirmado' && (
                      <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 text-xs">
                        Confirmado na Agenda
                      </Badge>
                    )}
                    {booking.status === 'aguardando_aprovacao' && (
                      <Badge className="bg-amber-100 text-amber-900 border-amber-300 text-xs">
                        Horário Bloqueado (Aguardando Nora)
                      </Badge>
                    )}
                    {booking.status === 'aguardando_pagamento' && (
                      <Badge className="bg-purple-100 text-purple-900 border-purple-300 text-xs">
                        Aguardando Pagamento
                      </Badge>
                    )}
                    {booking.status === 'negociacao_pendente' && (
                      <Badge className="bg-blue-100 text-blue-900 border-blue-300 text-xs">
                        Em Negociação
                      </Badge>
                    )}
                  </div>

                  <span className="font-serif font-bold text-base text-[#B8502E]">
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
