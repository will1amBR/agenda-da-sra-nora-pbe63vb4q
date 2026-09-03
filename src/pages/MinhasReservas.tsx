import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle,
  CreditCard,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Phone,
  HelpCircle,
  Check,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  getBookings,
  getBookingByCode,
  getBookingsByPhone,
  clientAcceptNegotiatedPrice,
  clientDeclineNegotiatedPrice,
  getServiceById,
} from '@/lib/data'
import { Booking } from '@/types'
import MercadoPagoCheckoutModal from '@/components/MercadoPagoCheckoutModal'
import { useToast } from '@/hooks/use-toast'

export default function MinhasReservasPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { toast } = useToast()

  const [query, setQuery] = useState(searchParams.get('code') || '')
  const [results, setResults] = useState<Booking[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedBookingForCheckout, setSelectedBookingForCheckout] = useState<Booking | null>(null)

  const handleSearch = (searchTerm?: string) => {
    const term = (searchTerm !== undefined ? searchTerm : query).trim()
    if (!term) {
      setResults([])
      setHasSearched(false)
      return
    }

    setHasSearched(true)
    const all = getBookings()

    // 1. Tentar busca por código exato ou parcial
    const byCode = getBookingByCode(term)
    if (byCode) {
      setResults([byCode])
      return
    }

    // 2. Tentar busca por telefone
    const byPhone = getBookingsByPhone(term)
    if (byPhone.length > 0) {
      setResults(byPhone)
      return
    }

    // 3. Busca genérica por nome ou código parcial
    const termLower = term.toLowerCase()
    const filtered = all.filter(
      (b) =>
        b.code.toLowerCase().includes(termLower) ||
        b.client.name.toLowerCase().includes(termLower) ||
        b.client.phone.includes(term),
    )
    setResults(filtered)
  }

  useEffect(() => {
    const codeParam = searchParams.get('code')
    if (codeParam) {
      setQuery(codeParam)
      handleSearch(codeParam)
    } else {
      // Carrega os agendamentos recentes salvos por padrão para facilitar o teste do usuário
      const all = getBookings()
      setResults(all.slice(0, 4))
    }
  }, [searchParams])

  const refreshBookingList = () => {
    handleSearch()
  }

  // Aceitar contraproposta de valor da Nora
  const handleAcceptProposal = (booking: Booking) => {
    const updated = clientAcceptNegotiatedPrice(booking.id)
    if (updated) {
      toast({
        title: 'Proposta Aceita!',
        description: `O valor de R$ ${updated.agreedPrice} foi aceito. Você já pode efetuar o pagamento.`,
      })
      refreshBookingList()
    }
  }

  // Recusar contraproposta
  const handleDeclineProposal = (booking: Booking) => {
    if (confirm('Deseja realmente recusar o valor proposto e cancelar esta solicitação?')) {
      const updated = clientDeclineNegotiatedPrice(booking.id)
      if (updated) {
        toast({
          title: 'Solicitação Cancelada',
          description: 'A proposta foi recusada por você.',
        })
        refreshBookingList()
      }
    }
  }

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'aguardando_aprovacao':
        return (
          <Badge className="bg-amber-100 text-amber-900 border-amber-300 font-medium text-xs flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" /> Aguardando aprovação da Nora
          </Badge>
        )
      case 'negociacao_pendente':
        return (
          <Badge className="bg-blue-100 text-blue-900 border-blue-300 font-medium text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-blue-600" /> Proposta de valor recebida!
          </Badge>
        )
      case 'aguardando_pagamento':
        return (
          <Badge className="bg-purple-100 text-purple-900 border-purple-300 font-medium text-xs flex items-center gap-1">
            <CreditCard className="w-3 h-3 text-purple-600" /> Aprovado · Aguardando pagamento
          </Badge>
        )
      case 'confirmado':
        return (
          <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 font-medium text-xs flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Confirmado na Agenda
          </Badge>
        )
      case 'recusado':
        return (
          <Badge className="bg-rose-100 text-rose-900 border-rose-300 font-medium text-xs flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-600" /> Recusado pela profissional
          </Badge>
        )
      case 'cancelado':
        return (
          <Badge className="bg-stone-100 text-stone-700 border-stone-300 font-medium text-xs flex items-center gap-1">
            <XCircle className="w-3 h-3 text-stone-500" /> Cancelado
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10 text-left">
      {/* Top Header */}
      <div className="space-y-3">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D1F1A]">
          Minhas Reservas &amp; Pagamentos
        </h1>
        <p className="text-sm text-[#6B5345]">
          Consulte o status do seu agendamento em Paracuru pelo código (ex:{' '}
          <code className="bg-[#EADFD5] px-1 py-0.5 rounded text-xs font-mono font-bold text-[#8C3A1D]">
            NORA-2025-019
          </code>
          ) ou pelo seu telefone.
        </p>
      </div>

      {/* Caixa de Busca */}
      <div className="bg-white p-5 rounded-2xl border border-[#EADFD5] shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSearch()
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <Input
              type="text"
              placeholder="Digite o código da reserva ou seu telefone..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-11 py-3 text-sm"
            />
          </div>
          <Button
            type="submit"
            className="bg-[#B8502E] hover:bg-[#A04223] text-white px-6 font-medium"
          >
            Buscar Reserva
          </Button>
        </form>
      </div>

      {/* MODAL DE CHECKOUT MERCADOPAGO QUANDO CLICADO */}
      {selectedBookingForCheckout && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl my-8">
            <MercadoPagoCheckoutModal
              booking={selectedBookingForCheckout}
              onClose={() => setSelectedBookingForCheckout(null)}
              onSuccess={() => {
                setSelectedBookingForCheckout(null)
                refreshBookingList()
              }}
            />
          </div>
        </div>
      )}

      {/* LISTA DE RESULTADOS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-[#2D1F1A]">
            {hasSearched
              ? `Resultados da busca (${results.length})`
              : 'Reservas Recentes no Navegador'}
          </h2>
          <span className="text-xs text-[#7B6153]">
            Clique em "Pagar com MercadoPago" quando seu pedido for aprovado.
          </span>
        </div>

        {results.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#EADFD5] space-y-3">
            <AlertCircle className="w-10 h-10 text-stone-400 mx-auto" />
            <p className="text-sm font-semibold text-[#2D1F1A]">Nenhuma reserva encontrada</p>
            <p className="text-xs text-[#7B6153] max-w-sm mx-auto">
              Verifique se digitou o código corretamente (ex: NORA-2025-018) ou faça um novo
              agendamento.
            </p>
            <Button
              asChild
              className="bg-[#B8502E] hover:bg-[#A04223] text-white rounded-full text-xs mt-2"
            >
              <Link to="/agendar">Fazer Novo Agendamento</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((booking) => {
              const service = getServiceById(booking.serviceId)

              return (
                <Card
                  key={booking.id}
                  className="border-[#EADFD5] bg-white rounded-2xl shadow-xs overflow-hidden"
                >
                  <CardContent className="p-6 space-y-5">
                    {/* Header do Card */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EADFD5] pb-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-base text-[#B8502E]">
                          #{booking.code}
                        </span>
                        <span className="text-xs text-stone-500">
                          Criado em {new Date(booking.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div>{getStatusBadge(booking.status)}</div>
                    </div>

                    {/* Corpo: Dados do Agendamento */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#372A24]">
                      {/* Coluna 1: Serviço & Cliente */}
                      <div className="space-y-1">
                        <span className="text-[#8C7A70] uppercase font-semibold text-[10px] tracking-wider block">
                          Serviço Solicitado
                        </span>
                        <p className="font-serif font-bold text-sm text-[#2D1F1A]">
                          {service?.name || 'Serviço da Nora'}
                        </p>
                        <p className="text-[#6B5345]">
                          Cliente: <strong>{booking.client.name}</strong>
                        </p>
                        <p className="text-[#6B5345]">Tel: {booking.client.phone}</p>
                      </div>

                      {/* Coluna 2: Data e Endereço */}
                      <div className="space-y-1">
                        <span className="text-[#8C7A70] uppercase font-semibold text-[10px] tracking-wider block">
                          Data &amp; Local
                        </span>
                        <p className="font-semibold flex items-center gap-1.5 text-[#2D1F1A]">
                          <Calendar className="w-3.5 h-3.5 text-[#B8502E]" />
                          {new Date(booking.date + 'T12:00:00').toLocaleDateString('pt-BR', {
                            weekday: 'short',
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}{' '}
                          às {booking.time}
                        </p>
                        <p className="flex items-start gap-1 text-[#6B5345]">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                          <span>
                            {booking.client.address} ({booking.client.neighborhood})
                          </span>
                        </p>
                      </div>

                      {/* Coluna 3: Valores */}
                      <div className="space-y-1 md:text-right">
                        <span className="text-[#8C7A70] uppercase font-semibold text-[10px] tracking-wider block">
                          Valores
                        </span>
                        <div className="flex md:justify-end items-baseline gap-1">
                          <span className="text-xs text-[#7B6153]">Valor atual:</span>
                          <span className="font-serif font-bold text-lg text-[#B8502E]">
                            R${' '}
                            {booking.agreedPrice.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        {booking.originalPrice !== booking.agreedPrice && (
                          <p className="text-[11px] text-stone-500">
                            Preço original de tabela: R$ {booking.originalPrice}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* CAIXA DE NEGOCIAÇÃO DE VALOR PELA NORA (QUANDO HOUVER) */}
                    {booking.status === 'negociacao_pendente' && (
                      <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                          <div className="space-y-1 text-xs">
                            <h4 className="font-bold text-amber-900 text-sm">
                              A Sra Nora propôs um ajuste de valor para este atendimento:
                            </h4>
                            <p className="text-amber-950 font-medium">
                              Novo valor proposto:{' '}
                              <strong className="text-base text-[#8C3A1D]">
                                R${' '}
                                {booking.proposedPrice?.toLocaleString('pt-BR', {
                                  minimumFractionDigits: 2,
                                })}
                              </strong>{' '}
                              (valor anterior: R$ {booking.originalPrice})
                            </p>
                            {booking.priceReason && (
                              <p className="text-amber-800 italic bg-white/70 p-2 rounded border border-amber-200">
                                "<strong>Motivo da Nora:</strong> {booking.priceReason}"
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Botões do cliente aceitar ou recusar */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-200">
                          <Button
                            size="sm"
                            onClick={() => handleAcceptProposal(booking)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Aceitar Novo Valor (R$ {booking.proposedPrice})</span>
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeclineProposal(booking)}
                            className="border-rose-300 text-rose-700 hover:bg-rose-50 font-medium text-xs flex items-center gap-1.5"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Recusar e Cancelar Solicitação</span>
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* CAIXA DE AGUARDANDO APROVAÇÃO */}
                    {booking.status === 'aguardando_aprovacao' && (
                      <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EADFD5] text-xs text-[#7B6153] flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                          Horário reservado temporariamente. A Sra Nora está avaliando o pedido.
                        </span>
                        <Link
                          to="/painel/solicitacoes"
                          className="text-[#B8502E] font-medium hover:underline text-[11px] shrink-0"
                        >
                          Simular como Nora →
                        </Link>
                      </div>
                    )}

                    {/* CAIXA DE BOTÃO DE PAGAMENTO (QUANDO APROVADO) */}
                    {booking.status === 'aguardando_pagamento' && (
                      <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="space-y-1 text-xs text-purple-950 text-left">
                          <span className="font-bold flex items-center gap-1.5 text-purple-900">
                            <CheckCircle2 className="w-4 h-4 text-purple-700" />
                            Pedido Aprovado! Pronto para pagamento via MercadoPago.
                          </span>
                          <p className="text-purple-800">
                            Pague com PIX ou Cartão de Crédito para ter o horário confirmado na
                            agenda.
                          </p>
                        </div>

                        <Button
                          onClick={() => setSelectedBookingForCheckout(booking)}
                          className="w-full sm:w-auto bg-[#009EE3] hover:bg-[#0081BA] text-white font-medium text-xs px-6 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Pagar R$ {booking.agreedPrice} (Modo Teste)</span>
                        </Button>
                      </div>
                    )}

                    {/* CAIXA DE HORÁRIO CONFIRMADO COM RECIBO */}
                    {booking.status === 'confirmado' && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="space-y-1 text-left">
                          <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Agendamento 100% Confirmado na Agenda da Nora!
                          </span>
                          <p className="text-emerald-800">
                            Pagamento recebido via{' '}
                            <strong className="uppercase">
                              {booking.paymentMethod || 'PIX'}
                            </strong>{' '}
                            (Transação #{booking.paymentId || 'mp-confirmado'}).
                          </p>
                        </div>

                        <Badge className="bg-emerald-600 text-white text-xs px-3 py-1 shrink-0">
                          Presença Garantida
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
