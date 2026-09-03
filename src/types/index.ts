export type ServiceCategory = 'idosos' | 'limpeza' | 'recorrente'

export interface Service {
  id: string
  name: string
  category: ServiceCategory
  description: string
  durationMinutes: number
  priceType: 'fixed' | 'monthly_fixed' | 'range'
  basePrice: number // Preço base ou fixo em Reais
  priceRange?: {
    min: number
    max: number
    note?: string
  }
  badge?: string
  highlights: string[]
  icon: 'heart' | 'sparkles' | 'home' | 'calendar' | 'sun'
}

export type BookingStatus =
  | 'aguardando_aprovacao' // 1. Enviado pelo cliente, horário bloqueado temporariamente
  | 'negociacao_pendente' // 2. Nora propôs outro valor; cliente precisa aceitar ou recusar
  | 'aguardando_pagamento' // 3. Aprovado pelo valor fixo OU aceito pelo cliente com novo valor -> pronto para pagar
  | 'confirmado' // 4. Pago com sucesso (via MercadoPago teste) -> confirmado na agenda
  | 'recusado' // Nora recusou o agendamento
  | 'cancelado' // Cliente recusou proposta de valor ou cancelou

export interface BookingClient {
  name: string
  phone: string
  email: string
  address: string
  neighborhood?: string // ex: Centro, Ronco do Mar, Boca do Poço (Paracuru)
}

export interface Booking {
  id: string
  code: string // ex: NORA-2025-042
  serviceId: string
  client: BookingClient
  date: string // YYYY-MM-DD
  time: string // HH:mm ex: "08:00"
  notes?: string
  frequency?: 'once' | 'weekly' | 'biweekly' | 'monthly'
  createdAt: string
  updatedAt: string

  // Financeiro e Negociação
  status: BookingStatus
  originalPrice: number
  agreedPrice: number
  proposedPrice?: number
  priceReason?: string // Justificativa da Nora (ex: casa com quintal grande ou mais cômodos)
  rejectionReason?: string

  // Pagamento
  paymentId?: string
  paymentMethod?: 'pix' | 'credit_card'
  paidAt?: string
}

export interface PaymentTransaction {
  id: string
  bookingId: string
  bookingCode: string
  clientName: string
  amount: number
  method: 'pix' | 'credit_card'
  status: 'approved' | 'in_process' | 'rejected'
  createdAt: string
  testMode: true
  // Dados de cartão simulado
  cardLastFour?: string
  cardHolder?: string
  installments?: number
  // Dados de PIX simulado
  pixQrCode?: string
  pixCopyPaste?: string
  pixExpiresAt?: string
}
