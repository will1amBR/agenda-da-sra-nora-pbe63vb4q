import React, { useState, useEffect } from 'react'
import {
  Inbox,
  Check,
  Edit3,
  X,
  Clock,
  Calendar,
  MapPin,
  Phone,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  getBookings,
  getServiceById,
  approveBookingFixedPrice,
  proposeNewPrice,
  rejectBooking,
} from '@/lib/data'
import { Booking } from '@/types'
import { useToast } from '@/hooks/use-toast'

export default function AdminSolicitacoesPage() {
  const { toast } = useToast()
  const [bookings, setBookings] = useState<Booking[]>([])

  // Modal / painel de negociar preço
  const [negotiatingId, setNegotiatingId] = useState<string | null>(null)
  const [proposedPriceInput, setProposedPriceInput] = useState<number>(200)
  const [priceReasonInput, setPriceReasonInput] = useState<string>('')

  // Modal / painel de recusar
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectionReasonInput, setRejectionReasonInput] = useState<string>('')

  const loadData = () => {
    setBookings(getBookings())
  }

  useEffect(() => {
    loadData()
    const handler = () => loadData()
    window.addEventListener('nora_storage_change', handler)
    return () => window.removeEventListener('nora_storage_change', handler)
  }, [])

  // 1. Aprovar com Preço Fixo (Regra 2)
  const handleApproveFixed = (booking: Booking) => {
    const updated = approveBookingFixedPrice(booking.id)
    if (updated) {
      toast({
        title: 'Solicitação Aprovada!',
        description: `Agendamento #${booking.code} aprovado pelo preço fixo de R$ ${booking.originalPrice}. O cliente já pode efetuar o pagamento.`,
      })
      loadData()
    }
  }

  // 2. Abrir negociação
  const openNegotiate = (booking: Booking) => {
    setNegotiatingId(booking.id)
    setProposedPriceInput(booking.proposedPrice || booking.originalPrice + 50)
    setPriceReasonInput(
      booking.priceReason ||
        'Casa ampla com varanda de praia e área externa que exige mais tempo de higienização.',
    )
  }

  // 2b. Confirmar envio de nova proposta
  const handleConfirmPropose = (id: string) => {
    if (proposedPriceInput <= 0) {
      toast({
        variant: 'destructive',
        title: 'Valor inválido',
        description: 'Digite um valor maior que zero.',
      })
      return
    }

    const updated = proposeNewPrice(id, proposedPriceInput, priceReasonInput)
    if (updated) {
      toast({
        title: 'Proposta Enviada ao Cliente!',
        description: `Novo valor de R$ ${proposedPriceInput} proposto. O agendamento aguarda aceitação do cliente.`,
      })
      setNegotiatingId(null)
      loadData()
    }
  }

  // 3. Recusar pedido
  const handleConfirmReject = (id: string) => {
    const updated = rejectBooking(id, rejectionReasonInput)
    if (updated) {
      toast({
        variant: 'destructive',
        title: 'Solicitação Recusada',
        description: 'A solicitação foi recusada e o cliente notificado.',
      })
      setRejectingId(null)
      loadData()
    }
  }

  // Filtros de abas
  const [filterTab, setFilterTab] = useState<'pending' | 'negotiating' | 'all'>('pending')

  const pendingList = bookings.filter((b) => b.status === 'aguardando_aprovacao')
  const negotiatingList = bookings.filter((b) => b.status === 'negociacao_pendente')
  const displayedList =
    filterTab === 'pending' ? pendingList : filterTab === 'negotiating' ? negotiatingList : bookings

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Solicitações de Atendimento
          </h1>
          {pendingList.length > 0 && (
            <Badge className="bg-teal-700 text-white text-xs">
              {pendingList.length} aguardando sua ação
            </Badge>
          )}
        </div>
        <p className="text-xs sm:text-sm text-slate-600">
          Aqui a Sra Nora avalia cada pedido: aprova pelo valor fixo original, propõe um novo valor
          (negociação) ou recusa caso a agenda esteja cheia.
        </p>
      </div>

      {/* Abas de Filtro */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setFilterTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            filterTab === 'pending'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Aguardando Aprovação</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/30">
            {pendingList.length}
          </span>
        </button>

        <button
          onClick={() => setFilterTab('negotiating')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            filterTab === 'negotiating'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Em Negociação de Valor</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/30">
            {negotiatingList.length}
          </span>
        </button>

        <button
          onClick={() => setFilterTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            filterTab === 'all'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <span>Todos os Pedidos</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700">
            {bookings.length}
          </span>
        </button>
      </div>

      {/* LISTA DE SOLICITAÇÕES */}
      <div className="space-y-4">
        {displayedList.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <Inbox className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-900">Nenhuma solicitação nesta aba</p>
            <p className="text-xs text-slate-500">
              Tudo em dia! Novos pedidos feitos no site público aparecerão aqui para sua aprovação.
            </p>
          </div>
        ) : (
          displayedList.map((booking) => {
            const service = getServiceById(booking.serviceId)
            const isNegotiatingModal = negotiatingId === booking.id
            const isRejectingModal = rejectingId === booking.id

            return (
              <Card
                key={booking.id}
                className={`border-slate-200 bg-white rounded-2xl shadow-xs overflow-hidden transition-all ${
                  booking.status === 'aguardando_aprovacao'
                    ? 'border-l-4 border-l-amber-500'
                    : booking.status === 'negociacao_pendente'
                      ? 'border-l-4 border-l-blue-500'
                      : ''
                }`}
              >
                <CardContent className="p-6 space-y-5">
                  {/* Topo do Item */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-teal-800">
                        #{booking.code}
                      </span>
                      <span className="text-xs text-slate-500">
                        Recebido em {new Date(booking.createdAt).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(booking.createdAt).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div>
                      {booking.status === 'aguardando_aprovacao' && (
                        <Badge className="bg-amber-100 text-amber-900 border-amber-300 text-xs">
                          Aguardando sua decisão
                        </Badge>
                      )}
                      {booking.status === 'negociacao_pendente' && (
                        <Badge className="bg-blue-100 text-blue-900 border-blue-300 text-xs">
                          Aguardando resposta do cliente (R$ {booking.proposedPrice})
                        </Badge>
                      )}
                      {booking.status === 'aguardando_pagamento' && (
                        <Badge className="bg-purple-100 text-purple-900 border-purple-300 text-xs">
                          Aprovado · Aguardando pagamento do cliente
                        </Badge>
                      )}
                      {booking.status === 'confirmado' && (
                        <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 text-xs">
                          Confirmado na sua agenda
                        </Badge>
                      )}
                      {booking.status === 'recusado' && (
                        <Badge className="bg-rose-100 text-rose-900 border-rose-300 text-xs">
                          Recusado por você
                        </Badge>
                      )}
                      {booking.status === 'cancelado' && (
                        <Badge className="bg-stone-100 text-stone-700 border-stone-300 text-xs">
                          Cancelado pelo cliente
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Detalhes do Pedido */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-700">
                    {/* Cliente */}
                    <div className="space-y-1">
                      <span className="text-slate-500 uppercase font-semibold text-[10px] tracking-wider block">
                        Cliente / Família
                      </span>
                      <p className="font-bold text-sm text-slate-900">{booking.client.name}</p>
                      <p className="text-slate-600 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{booking.client.phone}</span>
                      </p>
                      <p className="text-slate-600 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span>
                          {booking.client.address} · {booking.client.neighborhood}
                        </span>
                      </p>
                    </div>

                    {/* Serviço & Data */}
                    <div className="space-y-1">
                      <span className="text-slate-500 uppercase font-semibold text-[10px] tracking-wider block">
                        Serviço &amp; Data em Paracuru
                      </span>
                      <p className="font-bold text-sm text-slate-900">
                        {service?.name || 'Serviço da Nora'}
                      </p>
                      <p className="text-slate-600 flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        <span>
                          {new Date(booking.date + 'T12:00:00').toLocaleDateString('pt-BR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'short',
                          })}{' '}
                          às {booking.time}
                        </span>
                      </p>
                      {booking.frequency && booking.frequency !== 'once' && (
                        <span className="inline-block text-[10px] font-semibold text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          Frequência: {booking.frequency}
                        </span>
                      )}
                    </div>

                    {/* Preços */}
                    <div className="space-y-1 md:text-right">
                      <span className="text-slate-500 uppercase font-semibold text-[10px] tracking-wider block">
                        Valor
                      </span>
                      <p className="font-bold text-xl text-teal-800">
                        R${' '}
                        {booking.agreedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      {booking.proposedPrice && (
                        <p className="text-[11px] text-blue-700 font-medium">
                          Proposta enviada: R$ {booking.proposedPrice}
                        </p>
                      )}
                      <p className="text-[11px] text-slate-500">
                        Valor de tabela solicitado: R$ {booking.originalPrice}
                      </p>
                    </div>
                  </div>

                  {/* Observações do Cliente / O que precisa fazer */}
                  {booking.notes && (
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-teal-800 text-[11px] uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                        <span>O que o cliente precisa que seja feito / Observações:</span>
                      </div>
                      <p className="text-slate-800 font-medium leading-relaxed whitespace-pre-line bg-white p-2.5 rounded-lg border border-slate-200">
                        {booking.notes}
                      </p>
                      <p className="text-[10px] text-slate-500 italic">
                        Utilize esses detalhes para avaliar se o valor fixo original cobre todo o
                        trabalho ou se é o caso de propor um ajuste justo.
                      </p>
                    </div>
                  )}

                  {/* FORMULÁRIO EXPANSÍVEL: PROPOR NOVO VALOR (NEGOCIAR) */}
                  {isNegotiatingModal && (
                    <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-4 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
                          <Edit3 className="w-4 h-4 text-blue-700" />
                          Propor Ajuste de Valor (Ex: R$ 200–250 até R$ 300 para casas grandes):
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setNegotiatingId(null)}
                          className="h-6 w-6 text-stone-500"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                            Novo Valor Sugerido (R$) *
                          </label>
                          <Input
                            type="number"
                            value={proposedPriceInput}
                            onChange={(e) => setProposedPriceInput(Number(e.target.value))}
                            className="bg-white text-sm"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                            Motivo / Justificativa para o cliente *
                          </label>
                          <Input
                            value={priceReasonInput}
                            onChange={(e) => setPriceReasonInput(e.target.value)}
                            placeholder="Ex: Casa duplex com 4 quartos e churrasqueira com gordura pesada."
                            className="bg-white text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setNegotiatingId(null)}
                          className="text-xs text-stone-600"
                        >
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleConfirmPropose(booking.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4"
                        >
                          Enviar Proposta ao Cliente
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* FORMULÁRIO EXPANSÍVEL: RECUSAR SOLICITAÇÃO */}
                  {isRejectingModal && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-rose-900">
                          Motivo da Recusa (opcional):
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setRejectingId(null)}
                          className="h-6 w-6 text-stone-500"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <Input
                        value={rejectionReasonInput}
                        onChange={(e) => setRejectionReasonInput(e.target.value)}
                        placeholder="Ex: Agenda cheia neste dia ou fora da área atendida."
                        className="bg-white text-xs"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setRejectingId(null)}
                          className="text-xs"
                        >
                          Voltar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleConfirmReject(booking.id)}
                          className="bg-rose-600 hover:bg-rose-700 text-white text-xs"
                        >
                          Confirmar Recusa
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* BARRA DE AÇÕES DA SRA NORA (QUANDO PENDENTE) */}
                  {booking.status === 'aguardando_aprovacao' &&
                    !isNegotiatingModal &&
                    !isRejectingModal && (
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
                        <span className="text-[11px] text-slate-500">
                          Escolha o que deseja fazer com este pedido:
                        </span>

                        <div className="flex flex-wrap items-center gap-2">
                          {/* 1. Aprovar Preço Solicitado */}
                          <Button
                            size="sm"
                            onClick={() => handleApproveFixed(booking)}
                            className="bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs flex-1"
                          >
                            <Check className="w-3.5 h-3.5 mr-1" />
                            <span>
                              Aprovar Valor Solicitado (R${' '}
                              {booking.originalPrice.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                              })}
                              )
                            </span>
                          </Button>
                          {/* 2. Negociar Preço */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openNegotiate(booking)}
                            className="border-blue-300 text-blue-700 hover:bg-blue-50 text-xs px-3.5 flex items-center gap-1.5"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Propor Outro Valor (Negociar)</span>
                          </Button>

                          {/* 3. Recusar */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setRejectingId(booking.id)}
                            className="text-rose-700 hover:bg-rose-50 text-xs px-2.5 flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Recusar</span>
                          </Button>
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
